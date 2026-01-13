import { HealthEventService } from "./HealthEventService";
import { RepositoryPort } from "../ports/driven/RepositoryPort";
import { HealthEvent } from "../domain/healthEvent/HealthEvent";
import { HealthEventSeverity } from "../domain/healthEvent/enum/HealthEventSeverity";
import { TestUtils } from "../utils/TestUtils";
import { randomUUID } from "node:crypto";

describe('HealthEventService', () => {
    let service: HealthEventService;
    let mockRepo: jest.Mocked<RepositoryPort<HealthEvent, string>>;

    beforeEach(() => {
        mockRepo = {
            save: jest.fn(),
            delete: jest.fn(),
            findById: jest.fn(),
            findAll: jest.fn(),
            update: jest.fn(),
        } as any;

        service = new HealthEventService(mockRepo);
    });

    it('should call repository.save when creating a health event', async () => {
        const event = new HealthEvent(
            randomUUID(),
            new Date(),
            new Date(),
            TestUtils.randomEnum(HealthEventSeverity)
        );
        mockRepo.save.mockResolvedValue(event);

        const result = await service.create(event);

        expect(mockRepo.save).toHaveBeenCalledWith(event);
        expect(result).toBe(event);
    });

    it('should call repository.findById with correct id', async () => {
        const id = randomUUID();
        const event = new HealthEvent(
            id,
            new Date(),
            new Date(),
            HealthEventSeverity.HIGH
        );
        mockRepo.findById.mockResolvedValue(event);

        const result = await service.getById(id);

        expect(mockRepo.findById).toHaveBeenCalledWith(id);
        expect(result).toBe(event);
    });

    it('should return null if health event is not found', async () => {
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
        const events = [
            new HealthEvent(randomUUID(), new Date(), new Date(), HealthEventSeverity.LOW),
            new HealthEvent(randomUUID(), new Date(), new Date(), HealthEventSeverity.MEDIUM)
        ];
        mockRepo.findAll.mockResolvedValue(events);

        const result = await service.listAll();

        expect(mockRepo.findAll).toHaveBeenCalled();
        expect(result).toHaveLength(2);
        expect(result).toBe(events);
    });

    it('should call repository.update with correct id and health event object', async () => {
        const id = randomUUID();
        const updatedEvent = new HealthEvent(
            id,
            new Date(),
            new Date(),
            HealthEventSeverity.HIGH
        );
        mockRepo.update.mockResolvedValue(updatedEvent);

        const result = await service.update(id, updatedEvent);

        expect(mockRepo.update).toHaveBeenCalledWith(id, updatedEvent);
        expect(result).toBe(updatedEvent);
    });
});