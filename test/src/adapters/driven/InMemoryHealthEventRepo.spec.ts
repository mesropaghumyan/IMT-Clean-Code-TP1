import { InMemoryHealthEventRepo } from "../../../../src/adapters/driven/InMemoryHealthEventRepo";
import { HealthEvent } from "../../../../src/domain/healthEvent/HealthEvent";
import { HealthEventSeverity } from "../../../../src/domain/healthEvent/enum/HealthEventSeverity";
import { NotFoundError } from "../../../../src/errors/NotFoundError";
import { TestUtils } from "../../../../src/utils/TestUtils";
import { randomUUID } from "node:crypto";

describe('InMemoryHealthEventRepo', () => {
    let repo: InMemoryHealthEventRepo;
    let store: HealthEvent[] = [];

    beforeEach(async () => {
        store = [];
        repo = new InMemoryHealthEventRepo(store);
    });

    describe('findAll', () => {
        it('should return an empty array when store is empty', async () => {
            const results = await repo.findAll();
            expect(results).toEqual([]);
        });

        it('should return all health events and not a direct reference to the store', async () => {
            await repo.save({
                startDate: new Date(),
                endDate: new Date(),
                severity: TestUtils.randomEnum(HealthEventSeverity)
            });
            await repo.save({
                startDate: new Date(),
                endDate: new Date(),
                severity: TestUtils.randomEnum(HealthEventSeverity)
            });

            const results = await repo.findAll();

            expect(results).toHaveLength(2);
            expect(results).not.toBe(store);
        });
    });

    describe('update', () => {
        it('should update successfully when health event exists', async () => {
            const saved = await repo.save({
                startDate: new Date("2024-01-01"),
                endDate: new Date("2024-01-02"),
                severity: HealthEventSeverity.LOW
            });
            const updatedData = {
                startDate: saved.startDate,
                endDate: new Date("2024-01-05"),
                severity: HealthEventSeverity.HIGH
            };

            const result = await repo.update(saved.id, updatedData);

            expect(result.severity).toBe(HealthEventSeverity.HIGH);
            expect(store[0].severity).toBe(HealthEventSeverity.HIGH);
            expect(result.id).toBe(saved.id);
        });

        it('should throw NotFoundError when trying to update a non-existent id', async () => {
            const fakeId = randomUUID();
            const updateData = {
                startDate: new Date(),
                endDate: new Date(),
                severity: HealthEventSeverity.MEDIUM
            };

            await expect(repo.update(fakeId, updateData))
                .rejects
                .toThrow(NotFoundError);
            await expect(repo.update(fakeId, updateData))
                .rejects
                .toThrow(`L'evénement de santé avec l'id '${fakeId}' est introuvable`);
        });
    });

    describe('findById', () => {
        it('should return the health event when it exists in the store', async () => {
            const eventData = {
                startDate: new Date(),
                endDate: new Date(),
                severity: TestUtils.randomEnum(HealthEventSeverity)
            };
            const saved = await repo.save(eventData);

            const found = await repo.findById(saved.id);

            expect(found).toEqual(saved);
        });
    });

    describe('delete', () => {
        it('should remove the health event from the store if it exists', async () => {
            const saved = await repo.save({
                startDate: new Date(),
                endDate: new Date(),
                severity: HealthEventSeverity.LOW
            });
            expect(store).toHaveLength(1);

            await repo.delete(saved.id);

            expect(store).toHaveLength(0);
        });

        it('should not throw and change nothing if the id does not exist', async () => {
            await repo.save({
                startDate: new Date(),
                endDate: new Date(),
                severity: HealthEventSeverity.LOW
            });

            await expect(repo.delete(randomUUID()))
                .rejects
                .toThrow(NotFoundError);
        });
    });
});