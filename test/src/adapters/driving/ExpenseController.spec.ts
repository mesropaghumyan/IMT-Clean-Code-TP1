import { ExpenseService } from "../../../../src/services/ExpenseService";
import { Request, Response, NextFunction } from 'express';
import { ExpenseTag } from "../../../../src/domain/expense/enum/ExpenseTag";
import {ExpenseController} from "../../../../src/adapters/driving/ExpenseController";

describe('ExpenseController', () => {
    let controller: ExpenseController;
    let mockService: jest.Mocked<ExpenseService>;
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;
    let mockNext: NextFunction;

    beforeEach(() => {
        mockService = {
            listAll: jest.fn(),
            getById: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        } as unknown as jest.Mocked<ExpenseService>;

        controller = new ExpenseController(mockService);

        mockReq = {
            params: {},
            body: {}
        };

        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            send: jest.fn()
        };

        mockNext = jest.fn();
    });

    describe('getAllExpenses', () => {
        it('should return 200 and a list of expenses', async () => {
            const expenses = [{ id: '1', amount: 50 }, { id: '2', amount: 100 }];
            mockService.listAll.mockResolvedValue(expenses as any);

            await controller.getAllExpenses(mockReq as Request, mockRes as Response, mockNext);

            expect(mockService.listAll).toHaveBeenCalled();
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith(expenses);
        });

        it('should call next with error if service fails', async () => {
            const error = new Error('Database error');
            mockService.listAll.mockRejectedValue(error);

            await controller.getAllExpenses(mockReq as Request, mockRes as Response, mockNext);

            expect(mockNext).toHaveBeenCalledWith(error);
        });
    });

    describe('getExpenseById', () => {
        it('should return 200 and the expense if found', async () => {
            mockReq.params = { id: '123' };
            const expense = { id: '123', amount: 50 };
            mockService.getById.mockResolvedValue(expense as any);

            await controller.getExpenseById(mockReq as Request, mockRes as Response, mockNext);

            expect(mockService.getById).toHaveBeenCalledWith('123');
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith(expense);
        });

        it('should call next with error if service throws', async () => {
            mockReq.params = { id: '123' };
            const error = new Error('Not Found');
            mockService.getById.mockRejectedValue(error);

            await controller.getExpenseById(mockReq as Request, mockRes as Response, mockNext);

            expect(mockNext).toHaveBeenCalledWith(error);
        });
    });

    describe('createExpense', () => {
        it('should return 201 and the created expense', async () => {
            const dto = { amount: 100, tag: ExpenseTag.DINING, isCredit: false, date: new Date() };
            mockReq.body = dto;
            const createdExpense = { id: 'abc', ...dto };
            mockService.create.mockResolvedValue(createdExpense as any);

            await controller.createExpense(mockReq as Request, mockRes as Response, mockNext);

            expect(mockService.create).toHaveBeenCalledWith(expect.objectContaining({
                amount: 100,
                tag: ExpenseTag.DINING
            }));
            expect(mockRes.status).toHaveBeenCalledWith(201);
            expect(mockRes.json).toHaveBeenCalledWith(createdExpense);
        });

        it('should call next on error', async () => {
            mockService.create.mockRejectedValue(new Error('Validation Error'));

            await controller.createExpense(mockReq as Request, mockRes as Response, mockNext);

            expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
        });
    });

    describe('updateExpense', () => {
        it('should return 200 and the updated expense', async () => {
            mockReq.params = { id: '123' };
            mockReq.body = { amount: 999 };

            const updatedExpense = { id: '123', amount: 999 };
            mockService.update.mockResolvedValue(updatedExpense as any);

            await controller.updateExpense(mockReq as Request, mockRes as Response, mockNext);

            expect(mockService.update).toHaveBeenCalledWith('123', expect.objectContaining({ amount: 999 }));
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith(updatedExpense);
        });

        it('should call next on error', async () => {
            mockReq.params = { id: '123' };
            mockService.update.mockRejectedValue(new Error('Update failed'));

            await controller.updateExpense(mockReq as Request, mockRes as Response, mockNext);

            expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
        });
    });

    describe('deleteExpense', () => {
        it('should return 204 and empty body', async () => {
            mockReq.params = { id: '123' };
            mockService.delete.mockResolvedValue(undefined);

            await controller.deleteExpense(mockReq as Request, mockRes as Response, mockNext);

            expect(mockService.delete).toHaveBeenCalledWith('123');
            expect(mockRes.status).toHaveBeenCalledWith(204);
            expect(mockRes.send).toHaveBeenCalled();
        });

        it('should call next on error', async () => {
            mockReq.params = { id: '123' };
            mockService.delete.mockRejectedValue(new Error('Delete failed'));

            await controller.deleteExpense(mockReq as Request, mockRes as Response, mockNext);

            expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
        });
    });
});