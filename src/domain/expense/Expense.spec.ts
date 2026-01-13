import { ValidationError } from "../../errors/ValidatorError";
import { Expense } from "./Expense";
import { ExpenseTag } from "./enum/ExpenseTag";
import {TestUtils} from "../../utils/TestUtils";
import {randomInt} from "node:crypto";

describe('Expense Entity', () => {

    describe('Happy Path (Valid Data)', () => {
        it('should create a valid expense instance with random data', () => {
            const randomId = `id-${TestUtils.randomString()}`;
            const randomAmount = randomInt(1, 9999);
            const randomTag = TestUtils.randomEnum(ExpenseTag);
            const randomIsCredit = Math.random() > 0.5;
            const randomDate = new Date();

            const expense = new Expense(
                randomId,
                randomTag,
                randomIsCredit,
                randomDate,
                randomAmount
            );

            expect(expense.id).toBe(randomId);
            expect(expense.amount).toBe(randomAmount);
            expect(expense.tag).toBe(randomTag);
            expect(expense.isCredit).toBe(randomIsCredit);
            expect(expense.date).toEqual(randomDate);
        });
    });

    describe('Validation Constraints (Sad Paths)', () => {

        it('should throw ValidationError if id is an empty string', () => {
            expect(() => {
                new Expense('', ExpenseTag.DINING, false, new Date(), 100);
            }).toThrow(ValidationError);
        });

        it('should throw ValidationError if amount is negative', () => {
            const negativeAmount = -(randomInt(1, 9999));
            expect(() => {
                new Expense(TestUtils.randomString(), ExpenseTag.DINING, false, new Date(), negativeAmount);
            }).toThrow(ValidationError);
        });

        it('should throw ValidationError if amount is NaN', () => {
            expect(() => {
                new Expense(TestUtils.randomString(), ExpenseTag.DINING, false, new Date(), "not a number" as any);
            }).toThrow(ValidationError);
        });

        it('should throw ValidationError if date is invalid', () => {
            expect(() => {
                new Expense(TestUtils.randomString(), ExpenseTag.DINING, false, ("invalid-date" as unknown as Date), 100);
            }).toThrow(ValidationError);
        });

        it('should throw ValidationError if a required field is null', () => {
            expect(() => {
                new Expense(null as any, ExpenseTag.DINING, false, new Date(), 100);
            }).toThrow(ValidationError);
        });
    });
});