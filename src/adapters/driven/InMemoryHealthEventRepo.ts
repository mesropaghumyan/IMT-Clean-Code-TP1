import { RepositoryPort } from '../../ports/driven/RepositoryPort';
import { randomUUID } from "node:crypto";
import { NotFoundError } from "../../errors/NotFoundError";
import {HealthEvent} from "../../domain/healthEvent/HealthEvent";

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
        const eventWithId: HealthEvent = {
            ...newEvent,
            id: randomUUID()
        } as HealthEvent;

        this.store.push(eventWithId);
        return Promise.resolve(eventWithId);
    }

    async update(id: string, updatedFields: Omit<HealthEvent, "id">): Promise<HealthEvent> {
        const index = this.store.findIndex(event => event.id === id);

        if (index === -1) {
            throw new NotFoundError(`HealthEvent with id ${id} not found`);
        }

        const updatedEvent: HealthEvent = {
            ...this.store[index],
            ...updatedFields,
            id: id
        };

        this.store[index] = updatedEvent;
        return Promise.resolve(updatedEvent);
    }
}