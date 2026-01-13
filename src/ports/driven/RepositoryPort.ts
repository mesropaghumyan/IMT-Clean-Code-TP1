export interface RepositoryPort<T, ID = string> {
    findAll(): Promise<T[]>;
    findById(id: ID): Promise<T | null>;
    save(entity: Omit<T, "id">): Promise<T>;
    update(id: ID, entity: Omit<T, "id">): Promise<T>;
    delete(id: ID): Promise<void>;
}