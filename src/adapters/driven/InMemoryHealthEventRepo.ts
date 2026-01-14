import { RepositoryPort } from '../../ports/driven/RepositoryPort';
import { randomUUID } from "node:crypto";
import { NotFoundError } from "../../errors/NotFoundError";
import { HealthEvent } from "../../domain/healthEvent/HealthEvent";
import { HealthEventBuilder } from "../../domain/healthEvent/builder/HealthEventBuilder";

export class InMemoryHealthEventRepo implements RepositoryPort<HealthEvent> {
    constructor(private store: HealthEvent[] = []) {}

    async delete(id: string): Promise<void> {
        const index = this.store.findIndex(event => event.id === id);

        if (index !== -1) {
            this.store.splice(index, 1);
        }

        return Promise.resolve();
    }

    async findAll(): Promise<HealthEvent[]> {
        return Promise.resolve([...this.store]);
    }

    async findById(id: string): Promise<HealthEvent | null> {
        const event = this.store.find(event => event.id === id);

        return Promise.resolve(event || null);
    }

    async save(newEvent: Omit<HealthEvent, "id">): Promise<HealthEvent> {
        const event = HealthEventBuilder.create()
            .id(randomUUID())
            .startDate(newEvent.startDate)
            .endDate(newEvent.endDate)
            .severity(newEvent.severity)
            .build();

        this.store.push(event);
        return Promise.resolve(event);
    }

    async update(id: string, updatedFields: Omit<HealthEvent, "id">): Promise<HealthEvent> {
        const index = this.store.findIndex(event => event.id === id);

        if (index === -1) {
            throw new NotFoundError(`L'evénement de santé avec l'id '${id}' est introuvable`);
        }

        const updatedEvent = HealthEventBuilder.create()
            .id(id)
            .startDate(updatedFields.startDate)
            .endDate(updatedFields.endDate)
            .severity(updatedFields.severity)
            .build();

        this.store[index] = updatedEvent;
        return Promise.resolve(updatedEvent);
    }
}