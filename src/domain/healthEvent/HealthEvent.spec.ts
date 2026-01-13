import { ValidationError } from "../../errors/ValidatorError";
import { HealthEvent } from "./HealthEvent";
import { HealthEventSeverity } from "./enum/HealthEventSeverity";
import { TestUtils } from "../../utils/TestUtils";
import { randomUUID } from "node:crypto";

describe('HealthEvent Entity', () => {

    describe('Happy Path (Valid Data)', () => {
        it('should create a valid health event instance with random data', () => {
            const randomId = randomUUID();
            const randomSeverity = TestUtils.randomEnum(HealthEventSeverity);
            const randomStartDate = new Date("2024-01-01");
            const randomEndDate = new Date("2024-01-05");

            const event = new HealthEvent(
                randomId,
                randomStartDate,
                randomEndDate,
                randomSeverity
            );

            expect(event.id).toBe(randomId);
            expect(event.severity).toBe(randomSeverity);
            expect(event.startDate).toEqual(randomStartDate);
            expect(event.endDate).toEqual(randomEndDate);
        });
    });

    describe('Validation Constraints (Sad Paths)', () => {

        it('should throw ValidationError if id is an empty string', () => {
            expect(() => {
                new HealthEvent('', new Date(), new Date(), HealthEventSeverity.LOW);
            }).toThrow(ValidationError);
        });

        it('should throw ValidationError if id is null', () => {
            expect(() => {
                new HealthEvent(null as any, new Date(), new Date(), HealthEventSeverity.LOW);
            }).toThrow(ValidationError);
        });

        it('should throw ValidationError if startDate is invalid', () => {
            expect(() => {
                new HealthEvent(
                    randomUUID(),
                    "invalid-date" as unknown as Date,
                    new Date(),
                    HealthEventSeverity.MEDIUM
                );
            }).toThrow(ValidationError);
        });

        it('should throw ValidationError if endDate is invalid', () => {
            expect(() => {
                new HealthEvent(
                    randomUUID(),
                    new Date(),
                    new Date("invalid-date"),
                    HealthEventSeverity.HIGH
                );
            }).toThrow(ValidationError);
        });

        it('should throw ValidationError if severity is not a valid enum value', () => {
            expect(() => {
                new HealthEvent(
                    randomUUID(),
                    new Date(),
                    new Date(),
                    "ULTRA_HIGH" as any
                );
            }).toThrow(ValidationError);
        });

        it('should throw ValidationError if severity is null', () => {
            expect(() => {
                new HealthEvent(
                    randomUUID(),
                    new Date(),
                    new Date(),
                    null as any
                );
            }).toThrow(ValidationError);
        });

        it('should throw error if endDate is before startDate', () => {
            const start = new Date("2024-02-01");
            const end = new Date("2024-01-01");

            expect(() => {
                new HealthEvent(randomUUID(), start, end, HealthEventSeverity.LOW);
            }).toThrow();
        });
    });
});