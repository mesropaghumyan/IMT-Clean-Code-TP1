import { v4 as uuidv4 } from 'uuid';
import { Expense } from '../../domain/expense/Expense';
import { ExpenseRepositoryPort } from '../../ports/driven/ExpenseRepositoryPort';

const store: Expense[] = [];

export class InMemoryExpenseRepo implements ExpenseRepositoryPort {

    async delete(expenseId: string): Promise<void> {
        const index = store.findIndex(exp => exp.id === expenseId);

        if (index !== -1) {
            store.splice(index, 1);
        }

        return Promise.resolve();
    }

    async findAll(): Promise<Expense[]> {
        return Promise.resolve([...store]);
    }

    async findById(expenseId: string): Promise<Expense | null> {
        const expense = store.find(exp => exp.id === expenseId);

        return Promise.resolve(expense || null);
    }

    async save(newExpense: Omit<Expense, "id">): Promise<Expense> {
        const expenseWithId: Expense = {
            ...newExpense,
            id: uuidv4()
        };

        store.push(expenseWithId);

        return Promise.resolve(expenseWithId);
    }

    async update(updatedExpenseId: string, updatedFields: Omit<Expense, "id">): Promise<Expense> {
        const index = store.findIndex(exp => exp.id === updatedExpenseId);

        if (index === -1) {
            throw new Error(`Expense with id ${updatedExpenseId} not found`);
        }

        const updatedExpense: Expense = {
            ...store[index],
            ...updatedFields,
            id: updatedExpenseId
        };

        store[index] = updatedExpense;
        return Promise.resolve(updatedExpense);
    }
}