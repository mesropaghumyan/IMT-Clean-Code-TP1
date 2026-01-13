import {ExpensePort} from "../ports/driving/ExpensePort";
import {RepositoryPort} from "../ports/driven/RepositoryPort";
import {Expense} from "../domain/expense/Expense";

export class ExpenseService implements ExpensePort {
    constructor(private repo: RepositoryPort<Expense>) {}

    createExpense(expense: Expense): Promise<Expense> {
        return this.repo.save(expense);
    }

    deleteExpense(expenseId: string): Promise<void> {
        return this.repo.delete(expenseId);
    }

    getExpense(expenseId: string): Promise<Expense | null> {
        return this.repo.findById(expenseId);
    }

    listExpenses(): Promise<Expense[]> {
        return this.repo.findAll();
    }

    updateExpense(expenseId: string, expense: Expense): Promise<Expense> {
        return this.repo.update(expenseId, expense);
    }


}