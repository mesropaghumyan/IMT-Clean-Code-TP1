export interface CrudPort<T, ID = string> {
    listAll(): Promise<T[]>;
    getById(id: ID): Promise<T | null>;
    create(item: T): Promise<T>;
    update(id: ID, item: T): Promise<T>;
    delete(id: ID): Promise<void>;
}