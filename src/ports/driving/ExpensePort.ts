import { Expense } from "../../domain/expense/Expense";

export interface ExpensePort {
    listExpenses(): Promise<Expense[]>;
    createExpense(expense: Expense): Promise<Expense>;
    getExpense(expenseId: string): Promise<Expense | null>;
    updateExpense(expenseId: string, expense: Expense): Promise<Expense>;
    deleteExpense(expenseId: string): Promise<void>;
}