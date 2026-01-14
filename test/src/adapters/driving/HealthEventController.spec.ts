import { Request, Response, NextFunction } from 'express';
import {HealthEventController} from "../../../../src/adapters/driving/HealthEventController";
import {HealthEventService} from "../../../../src/services/HealthEventService";
import {HealthEventSeverity} from "../../../../src/domain/healthEvent/enum/HealthEventSeverity";
import {BadRequestError} from "../../../../src/errors/BadRequestError";

describe('HealthEventController', () => {
    let controller: HealthEventController;
    let mockService: jest.Mocked<HealthEventService>;
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
        } as unknown as jest.Mocked<HealthEventService>;

        controller = new HealthEventController(mockService);

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

    describe('getAllHealthEvents', () => {
        it('should return 200 and a list of events', async () => {
            const events = [{ id: '1', severity: 'LOW' }, { id: '2', severity: 'HIGH' }];
            mockService.listAll.mockResolvedValue(events as any);

            await controller.getAllHealthEvents(mockReq as Request, mockRes as Response, mockNext);

            expect(mockService.listAll).toHaveBeenCalled();
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith(events);
        });

        it('should call next with error if service fails', async () => {
            const error = new Error('Service error');
            mockService.listAll.mockRejectedValue(error);

            await controller.getAllHealthEvents(mockReq as Request, mockRes as Response, mockNext);

            expect(mockNext).toHaveBeenCalledWith(error);
        });
    });

    describe('getHealthEventById', () => {
        it('should return 200 and the event if found', async () => {
            mockReq.params = { id: 'evt-123' };
            const event = { id: 'evt-123', severity: 'MEDIUM' };
            mockService.getById.mockResolvedValue(event as any);

            await controller.getHealthEventById(mockReq as Request, mockRes as Response, mockNext);

            expect(mockService.getById).toHaveBeenCalledWith('evt-123');
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith(event);
        });

        it('should call next with error if service throws', async () => {
            const error = new Error('Not Found');
            mockService.getById.mockRejectedValue(error);

            await controller.getHealthEventById(mockReq as Request, mockRes as Response, mockNext);

            expect(mockNext).toHaveBeenCalledWith(error);
        });
    });

    describe('createHealthEvent', () => {
        it('should return 201 and the created event', async () => {
            const dto = {
                startDate: new Date(),
                endDate: new Date(),
                severity: HealthEventSeverity.HIGH
            };
            mockReq.body = dto;

            const createdEvent = { id: 'new-id', ...dto };
            mockService.create.mockResolvedValue(createdEvent as any);

            await controller.createHealthEvent(mockReq as Request, mockRes as Response, mockNext);

            expect(mockService.create).toHaveBeenCalledWith(expect.objectContaining({
                severity: HealthEventSeverity.HIGH
            }));
            expect(mockRes.status).toHaveBeenCalledWith(201);
            expect(mockRes.json).toHaveBeenCalledWith(createdEvent);
        });

        it('should call next on error', async () => {
            mockService.create.mockRejectedValue(new Error('Creation failed'));

            await controller.createHealthEvent(mockReq as Request, mockRes as Response, mockNext);

            expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
        });
    });

    describe('updateHealthEvent', () => {
        it('should return 200 and the updated event', async () => {
            mockReq.params = { id: 'evt-123' };
            mockReq.body = { severity: HealthEventSeverity.CRITICAL };

            const updatedEvent = { id: 'evt-123', severity: HealthEventSeverity.CRITICAL };
            mockService.update.mockResolvedValue(updatedEvent as any);

            await controller.updateHealthEvent(mockReq as Request, mockRes as Response, mockNext);

            expect(mockService.update).toHaveBeenCalledWith('evt-123', expect.objectContaining({
                severity: HealthEventSeverity.CRITICAL
            }));
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith(updatedEvent);
        });

        it('should convert validator error to BadRequestError', async () => {
            mockReq.params = { id: 'evt-123' };
            const validationError = new Error('[Validator] Date invalid');
            mockService.update.mockRejectedValue(validationError);

            await controller.updateHealthEvent(mockReq as Request, mockRes as Response, mockNext);

            expect(mockNext).toHaveBeenCalledWith(expect.any(BadRequestError));
        });

        it('should call next with original error if not a validation error', async () => {
            mockReq.params = { id: 'evt-123' };
            const genericError = new Error('Database disconnected');
            mockService.update.mockRejectedValue(genericError);

            await controller.updateHealthEvent(mockReq as Request, mockRes as Response, mockNext);

            expect(mockNext).toHaveBeenCalledWith(genericError);
            expect(mockNext).not.toHaveBeenCalledWith(expect.any(BadRequestError));
        });
    });

    describe('deleteHealthEvent', () => {
        it('should return 204 and empty body', async () => {
            mockReq.params = { id: 'evt-123' };
            mockService.delete.mockResolvedValue(undefined);

            await controller.deleteHealthEvent(mockReq as Request, mockRes as Response, mockNext);

            expect(mockService.delete).toHaveBeenCalledWith('evt-123');
            expect(mockRes.status).toHaveBeenCalledWith(204);
            expect(mockRes.send).toHaveBeenCalled();
        });

        it('should call next on error', async () => {
            mockService.delete.mockRejectedValue(new Error('Delete failed'));

            await controller.deleteHealthEvent(mockReq as Request, mockRes as Response, mockNext);

            expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
        });
    });
});