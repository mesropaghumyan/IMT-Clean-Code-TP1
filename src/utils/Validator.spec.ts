import { Validator } from "./Validator";
import { ValidationError } from "../errors/ValidatorError";
import { TestUtils } from "./TestUtils";
import {randomInt} from "node:crypto";

describe('Validator Utility', () => {

    describe('string validation', () => {
        it('should return the string if it is valid', () => {
            const validStr = TestUtils.randomString();
            expect(Validator.string(validStr, 'testField')).toBe(validStr);
        });

        it('should throw ValidationError for non-string, empty or null values', () => {
            const field = 'testField';
            expect(() => Validator.string('', field)).toThrow(ValidationError);
            expect(() => Validator.string('   ', field)).toThrow(ValidationError);
            expect(() => Validator.string(null, field)).toThrow(ValidationError);
            expect(() => Validator.string(undefined, field)).toThrow(ValidationError);
            expect(() => Validator.string(123, field)).toThrow(ValidationError);
        });
    });

    describe('number validation', () => {
        it('should return the number if it is positive', () => {
            const validNum = randomInt(1, 9999);
            expect(Validator.number(validNum, 'amount')).toBe(validNum);
        });

        it('should throw ValidationError if number is negative', () => {
            const negativeNum = -randomInt(1, 9999);
            expect(() => Validator.number(negativeNum, 'amount')).toThrow(`Le champ 'amount' ne peut pas être négatif.`);
        });

        it('should throw ValidationError for NaN or non-number types', () => {
            expect(() => Validator.number(NaN, 'amount')).toThrow(ValidationError);
            expect(() => Validator.number("10", 'amount')).toThrow(ValidationError);
            expect(() => Validator.number(null, 'amount')).toThrow(ValidationError);
        });
    });

    describe('boolean validation', () => {
        it('should return the boolean value', () => {
            expect(Validator.boolean(true, 'isCredit')).toBe(true);
            expect(Validator.boolean(false, 'isCredit')).toBe(false);
        });

        it('should throw if value is not a boolean', () => {
            expect(() => Validator.boolean(null, 'isCredit')).toThrow(ValidationError);
            expect(() => Validator.boolean("true", 'isCredit')).toThrow(ValidationError);
        });
    });

    describe('date validation', () => {
        it('should return a Date object if a valid Date is provided', () => {
            const now = new Date();
            expect(Validator.date(now, 'date')).toEqual(now);
        });

        it('should parse and return a Date object if a valid ISO string is provided', () => {
            const dateStr = "2026-01-13T10:00:00.000Z";
            const result = Validator.date(dateStr, 'date');
            expect(result).toBeInstanceOf(Date);
            expect(result.toISOString()).toBe(dateStr);
        });

        it('should throw if date is invalid or null', () => {
            expect(() => Validator.date("not-a-date", 'date')).toThrow(ValidationError);
            expect(() => Validator.date(null, 'date')).toThrow(ValidationError);
        });
    });

    describe('enumValue validation', () => {
        enum TestEnum {
            A = "VALUE_A",
            B = "VALUE_B"
        }

        it('should return the value if it exists in enum', () => {
            expect(Validator.enumValue(TestEnum.A, TestEnum, 'enumField')).toBe(TestEnum.A);
        });

        it('should throw if value is not in enum', () => {
            expect(() => Validator.enumValue("VALUE_C", TestEnum, 'enumField')).toThrow(ValidationError);
            expect(() => Validator.enumValue(null, TestEnum, 'enumField')).toThrow(ValidationError);
        });
    });
});