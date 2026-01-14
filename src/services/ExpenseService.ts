import {CrudPort} from "../ports/driving/CrudPort";
import {RepositoryPort} from "../ports/driven/RepositoryPort";
import {Expense} from "../domain/expense/Expense";
import {CreateExpenseDTO} from "../domain/expense/dto/CreateExpenseDTO";
import {UpdateExpenseDTO} from "../domain/expense/dto/UpdateExpenseDTO";

export class ExpenseService implements CrudPort<Expense> {
    constructor(private repo: RepositoryPort<Expense>) {}

    create(createExpenseDTO: CreateExpenseDTO): Promise<Expense> {
        // set automatically date
        createExpenseDTO.date = new Date();
        return this.repo.save(createExpenseDTO);
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

    update(expenseId: string, updateExpenseDTO: UpdateExpenseDTO): Promise<Expense> {
        // set automatically date
        updateExpenseDTO.date = new Date();
        return this.repo.update(expenseId, updateExpenseDTO);
    }
}