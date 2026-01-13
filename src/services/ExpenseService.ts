import {CrudPort} from "../ports/driving/CrudPort";
import {RepositoryPort} from "../ports/driven/RepositoryPort";
import {Expense} from "../domain/expense/Expense";

export class ExpenseService implements CrudPort<Expense> {
    constructor(private repo: RepositoryPort<Expense>) {}

    create(expense: Expense): Promise<Expense> {
        return this.repo.save(expense);
    }

    delete(expenseId: string): Promise<void> {
        return this.repo.delete(expenseId);
    }

    getById(expenseId: string): Promise<Expense | null> {
        return this.repo.findById(expenseId);
    }

    listAll(): Promise<Expense[]> {
        return this.repo.findAll();
    }

    update(expenseId: string, expense: Expense): Promise<Expense> {
        return this.repo.update(expenseId, expense);
    }


}