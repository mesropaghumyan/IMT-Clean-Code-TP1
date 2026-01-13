import { Expense } from '../../domain/expense/Expense';
import { ExpenseRepositoryPort } from '../../ports/driven/ExpenseRepositoryPort';
import {randomUUID} from "node:crypto";
import {NotFoundError} from "../../errors/NotFoundError";

export class InMemoryExpenseRepo implements ExpenseRepositoryPort {
    constructor(private store: Expense[] = []) {}

    async delete(expenseId: string): Promise<void> {
        const index = this.store.findIndex(exp => exp.id === expenseId);
        if (index !== -1) {
            this.store.splice(index, 1);
        }
        return Promise.resolve();
    }

    async findAll(): Promise<Expense[]> {
        return Promise.resolve([...this.store]);
    }

    async findById(expenseId: string): Promise<Expense | null> {
        const expense = this.store.find(exp => exp.id === expenseId);
        return Promise.resolve(expense || null);
    }

    async save(newExpense: Omit<Expense, "id">): Promise<Expense> {
        const expenseWithId: Expense = {
            ...newExpense,
            id: randomUUID()
        } as Expense;

        this.store.push(expenseWithId);
        return Promise.resolve(expenseWithId);
    }

    async update(updatedExpenseId: string, updatedFields: Omit<Expense, "id">): Promise<Expense> {
        const index = this.store.findIndex(exp => exp.id === updatedExpenseId);

        if (index === -1) {
            throw new NotFoundError(`Expense with id ${updatedExpenseId} not found`);
        }

        const updatedExpense: Expense = {
            ...this.store[index],
            ...updatedFields,
            id: updatedExpenseId
        };

        this.store[index] = updatedExpense;
        return Promise.resolve(updatedExpense);
    }
}