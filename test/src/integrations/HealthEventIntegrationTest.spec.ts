import { randomUUID } from "node:crypto";
import { HealthEventService } from "../../../src/services/HealthEventService";
import { MemoryHealthEventRepo } from "../../../src/adapters/driven/MemoryHealthEventRepo";
import { HealthEventSeverity } from "../../../src/domain/healthEvent/enum/HealthEventSeverity";
import { CreateHealthEventDTO } from "../../../src/domain/healthEvent/dto/CreateHealthEventDTO";
import { UpdateHealthEventDTO } from "../../../src/domain/healthEvent/dto/UpdateHealthEventDTO";
import { NotFoundError } from "../../../src/errors/NotFoundError";

describe('HealthEvent Integration (Service + Repo)', () => {
    let service: HealthEventService;
    let repo: MemoryHealthEventRepo;

    beforeEach(() => {
        repo = new MemoryHealthEventRepo();
        service = new HealthEventService(repo);
    });

    it('should create and then retrieve a health event (Create & GetById)', async () => {
        // 1. Préparation du DTO
        const eventDto: CreateHealthEventDTO = {
            startDate: new Date("2024-01-01"),
            endDate: new Date("2024-01-05"),
            severity: HealthEventSeverity.MEDIUM
        };

        // 2. Création et récupération de l'objet avec son ID généré
        const createdEvent = await service.create(eventDto);

        expect(createdEvent.id).toBeDefined();

        // 3. Vérification via getById
        const result = await service.getById(createdEvent.id);

        expect(result).toBeDefined();
        expect(result?.id).toBe(createdEvent.id);
        expect(result?.severity).toBe(HealthEventSeverity.MEDIUM);
        expect(result?.startDate).toEqual(eventDto.startDate);
    });

    it('should list all saved health events (GetAll)', async () => {
        await service.create({
            startDate: new Date(),
            endDate: new Date(),
            severity: HealthEventSeverity.LOW
        });
        await service.create({
            startDate: new Date(),
            endDate: new Date(),
            severity: HealthEventSeverity.HIGH
        });

        const list = await service.listAll();

        expect(list).toHaveLength(2);
    });

    it('should update an existing health event (Update)', async () => {
        // 1. Création initiale
        const created = await service.create({
            startDate: new Date("2024-01-01"),
            endDate: new Date("2024-01-02"),
            severity: HealthEventSeverity.LOW
        });

        // 2. DTO de mise à jour
        const updateDto: UpdateHealthEventDTO = {
            startDate: new Date("2024-02-01"),
            endDate: new Date("2024-02-05"),
            severity: HealthEventSeverity.CRITICAL
        };

        // 3. Update
        await service.update(created.id, updateDto);

        // 4. Vérification
        const result = await service.getById(created.id);

        expect(result?.severity).toBe(HealthEventSeverity.CRITICAL);
        // On vérifie que les dates ont bien changé
        expect(result?.startDate).toEqual(new Date("2024-02-01"));
    });

    it('should delete a health event and no longer find it (Delete)', async () => {
        const created = await service.create({
            startDate: new Date(),
            endDate: new Date(),
            severity: HealthEventSeverity.LOW
        });

        await service.delete(created.id);

        const result = await service.getById(created.id);

        // Cela nécessite que findById retourne null et ne lance pas d'erreur
        expect(result).toBeNull();
    });

    it('should throw NotFoundError on update if id does not exist', async () => {
        const fakeId = randomUUID();
        const updateDto: UpdateHealthEventDTO = {
            startDate: new Date(),
            endDate: new Date(),
            severity: HealthEventSeverity.LOW
        };

        await expect(service.update(fakeId, updateDto))
            .rejects
            .toThrow(NotFoundError);
    });
});