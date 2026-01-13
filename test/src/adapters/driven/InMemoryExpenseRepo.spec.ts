import { InMemoryExpenseRepo } from "../../../../src/adapters/driven/InMemoryExpenseRepo";
import { Expense } from "../../../../src/domain/expense/Expense";
import { ExpenseTag } from "../../../../src/domain/expense/enum/ExpenseTag";
import { NotFoundError } from "../../../../src/errors/NotFoundError";
import {TestUtils} from "../../../../src/utils/TestUtils";
import {randomInt, randomUUID} from "node:crypto";

describe('InMemoryExpenseRepo', () => {
    let repo: InMemoryExpenseRepo;
    let store: Expense[] = [];

    beforeEach(async () => {
        store = [];
        repo = new InMemoryExpenseRepo(store);
    });

    describe('findAll', () => {
        it('should return an empty array when store is empty', async () => {
            const results = await repo.findAll();
            expect(results).toEqual([]);
        });

        it('should return all expenses and not a direct reference to the store', async () => {
            await repo.save({ tag: TestUtils.randomEnum(ExpenseTag), isCredit: TestUtils.randomBoolean(), date: new Date(), amount: randomInt(1, 9999) });
            await repo.save({ tag: TestUtils.randomEnum(ExpenseTag), isCredit: TestUtils.randomBoolean(), date: new Date(), amount: randomInt(1, 9999) });

            const results = await repo.findAll();

            expect(results).toHaveLength(2);
            expect(results).not.toBe(store);
        });
    });

    describe('update', () => {
        it('should update successfully when expense exists', async () => {
            const saved = await repo.save({
                tag: ExpenseTag.DINING,
                isCredit: false,
                date: new Date(),
                amount: 100
            });
            const updatedData = {
                tag: ExpenseTag.DINING,
                isCredit: true,
                date: saved.date,
                amount: 150
            };

            const result = await repo.update(saved.id, updatedData);

            expect(result.amount).toBe(150);
            expect(result.isCredit).toBe(true);
            expect(store[0].amount).toBe(150);
        });

        it('should throw NotFoundError when trying to update a non-existent id', async () => {
            const fakeId = randomUUID();
            const updateData = {
                tag: ExpenseTag.DINING,
                isCredit: false,
                date: new Date(),
                amount: 50
            };

            await expect(repo.update(fakeId, updateData))
                .rejects
                .toThrow(NotFoundError);
            await expect(repo.update(fakeId, updateData))
                .rejects
                .toThrow(`Expense with id ${fakeId} not found`);
        });
    });

    describe('findById', () => {
        it('should return the expense when it exists in the store', async () => {
            // Arrange
            const expenseData = {
                tag: TestUtils.randomEnum(ExpenseTag),
                isCredit: TestUtils.randomBoolean(),
                date: new Date(),
                amount: randomInt(1, 1000)
            };
            const saved = await repo.save(expenseData);

            // Act
            const found = await repo.findById(saved.id);

            // Assert
            expect(found).toEqual(saved);
            expect(found?.id).toBe(saved.id);
        });

        it('should return null when the expense does not exist', async () => {
            // Act
            const found = await repo.findById(randomUUID());

            // Assert
            expect(found).toBeNull();
        });
    });

    describe('delete', () => {
        it('should remove the expense from the store if it exists', async () => {
            const saved = await repo.save({
                tag: ExpenseTag.DINING,
                isCredit: false,
                date: new Date(),
                amount: 100
            });
            expect(store).toHaveLength(1);

            await repo.delete(saved.id);

            expect(store).toHaveLength(0);
            const check = await repo.findById(saved.id);
            expect(check).toBeNull();
        });

        it('should not throw and change nothing if the expense id does not exist', async () => {
            await repo.save({ tag: ExpenseTag.DINING, isCredit: false, date: new Date(), amount: 10 });
            expect(store).toHaveLength(1);

            await repo.delete(randomUUID());

            expect(store).toHaveLength(1);
        });
    });
});