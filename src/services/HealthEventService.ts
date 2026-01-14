import { CrudPort } from "../ports/driving/CrudPort";
import { RepositoryPort } from "../ports/driven/RepositoryPort";
import {HealthEvent} from "../domain/healthEvent/HealthEvent";
import {UpdateHealthEventDTO} from "../domain/healthEvent/dto/UpdateHealthEventDTO";
import {CreateHealthEventDTO} from "../domain/healthEvent/dto/CreateHealthEventDTO";

export class HealthEventService implements CrudPort<HealthEvent> {
    constructor(private repo: RepositoryPort<HealthEvent>) {}

    create(event: CreateHealthEventDTO): Promise<HealthEvent> {
        return this.repo.save(event);
    }

    delete(eventId: string): Promise<void> {
        return this.repo.delete(eventId);
    }

    getById(eventId: string): Promise<HealthEvent | null> {
        return this.repo.findById(eventId);
    }

    listAll(): Promise<HealthEvent[]> {
        return this.repo.findAll();
    }

    update(eventId: string, event: UpdateHealthEventDTO): Promise<HealthEvent> {
        return this.repo.update(eventId, event);
    }
}