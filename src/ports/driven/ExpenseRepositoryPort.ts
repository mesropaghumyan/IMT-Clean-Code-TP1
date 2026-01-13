import { Expense } from "../../domain/expense/Expense";

export interface ExpenseRepositoryPort {
    findAll(): Promise<Expense[]>;
    findById(expenseId: string): Promise<Expense | null>;
    save(newExpense: Omit<Expense, "id">): Promise<Expense>;
    update(updatedExpenseId: string, updatedExpense: Omit<Expense, "id">): Promise<Expense>;
    delete(expenseId: string): Promise<void>;
}