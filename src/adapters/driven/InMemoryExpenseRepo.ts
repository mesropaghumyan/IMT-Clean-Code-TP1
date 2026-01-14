import {ExpenseBuilder} from "../../domain/expense/builder/ExpenseBuilder";
import {NotFoundError} from "../../errors/NotFoundError";
import {Expense} from "../../domain/expense/Expense";
import {randomUUID} from "node:crypto";
import {RepositoryPort} from "../../ports/driven/RepositoryPort";

export class InMemoryExpenseRepo implements RepositoryPort<Expense> {
    constructor(private store: Expense[] = []) {}

    async delete(id: string): Promise<void> {
        const index = this.store.findIndex(exp => exp.id === id);

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
        const expense = ExpenseBuilder.create()
            .id(randomUUID())
            .tag(newExpense.tag)
            .isCredit(newExpense.isCredit)
            .amount(newExpense.amount)
            .date(newExpense.date)
            .build();

        this.store.push(expense);
        return Promise.resolve(expense);
    }

    async update(id: string, updatedFields: Omit<Expense, "id">): Promise<Expense> {
        const index = this.store.findIndex(exp => exp.id === id);

        if (index === -1) {
            throw new NotFoundError(`La dépense avec l'id '${id}' est introuvable`);
        }

        const updatedExpense = ExpenseBuilder.create()
            .id(id)
            .tag(updatedFields.tag)
            .isCredit(updatedFields.isCredit)
            .amount(updatedFields.amount)
            .date(updatedFields.date)
            .build();

        this.store[index] = updatedExpense;
        return Promise.resolve(updatedExpense);
    }
}