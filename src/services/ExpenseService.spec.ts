import { ExpenseService } from "./ExpenseService";
import { RepositoryPort } from "../ports/driven/RepositoryPort";
import { Expense } from "../domain/expense/Expense";
import { ExpenseTag } from "../domain/expense/enum/ExpenseTag";
import { TestUtils } from "../utils/TestUtils";
import {randomInt, randomUUID} from "node:crypto";

describe('ExpenseService', () => {
    let service: ExpenseService;
    let mockRepo: jest.Mocked<RepositoryPort<Expense, string>>;

    beforeEach(() => {
        mockRepo = {
            save: jest.fn(),
            delete: jest.fn(),
            findById: jest.fn(),
            findAll: jest.fn(),
            update: jest.fn(),
        } as any;

        service = new ExpenseService(mockRepo);
    });

    it('should call repository.save when creating an expense', async () => {
        const expense = new Expense(
            randomUUID(),
            TestUtils.randomEnum(ExpenseTag),
            TestUtils.randomBoolean(),
            new Date(),
            randomInt(1, 9999)
        );
        mockRepo.save.mockResolvedValue(expense);

        const result = await service.create(expense);

        expect(mockRepo.save).toHaveBeenCalledWith(expense);
        expect(result).toBe(expense);
    });

    it('should call repository.findById with correct id', async () => {
        const id = randomUUID();
        const expense = new Expense(
            id,
            TestUtils.randomEnum(ExpenseTag),
            TestUtils.randomBoolean(),
            new Date(),
            randomInt(1, 9999)
        );
        mockRepo.findById.mockResolvedValue(expense);

        const result = await service.getById(id);

        expect(mockRepo.findById).toHaveBeenCalledWith(id);
        expect(result).toBe(expense);
    });

    it('should return null if expense is not found', async () => {
        const unknownId = randomUUID();
        mockRepo.findById.mockResolvedValue(null);

        const result = await service.getById(unknownId);

        expect(result).toBeNull();
    });

    it('should call repository.delete when deleting', async () => {
        const id = randomUUID();
        mockRepo.delete.mockResolvedValue(undefined);

        await service.delete(id);

        expect(mockRepo.delete).toHaveBeenCalledWith(id);
    });

    it('should call repository.findAll and return a list', async () => {
        const expenses = [
            new Expense(randomUUID(), TestUtils.randomEnum(ExpenseTag), TestUtils.randomBoolean(), new Date(), randomInt(1, 9999)),
            new Expense(randomUUID(), TestUtils.randomEnum(ExpenseTag), TestUtils.randomBoolean(), new Date(), randomInt(1, 9999))
        ];
        mockRepo.findAll.mockResolvedValue(expenses);

        const result = await service.listAll();

        expect(mockRepo.findAll).toHaveBeenCalled();
        expect(result).toHaveLength(2);
        expect(result).toBe(expenses);
    });

    it('should call repository.update with correct id and expense object', async () => {
        const id = randomUUID();
        const updatedExpense = new Expense(
            id,
            TestUtils.randomEnum(ExpenseTag),
            TestUtils.randomBoolean(),
            new Date(),
            randomInt(1, 9999)
        );
        mockRepo.update.mockResolvedValue(updatedExpense);

        const result = await service.update(id, updatedExpense);

        expect(mockRepo.update).toHaveBeenCalledWith(id, updatedExpense);
        expect(result).toBe(updatedExpense);
    });
});