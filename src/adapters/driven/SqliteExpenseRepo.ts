import {NotFoundError} from "../../errors/NotFoundError";
import {Expense} from "../../domain/expense/Expense";
import {RepositoryPort} from "../../ports/driven/RepositoryPort";
import {ExpenseTag} from "../../domain/expense/enum/ExpenseTag";
import {SQLiteDatabase} from "../../infrastructure/database/Database";
import { Database } from 'better-sqlite3';

export class SqliteExpenseRepo implements RepositoryPort<Expense> {
    private db: Database;

    constructor() {
        this.db = SQLiteDatabase.getInstance();
    }

    async save(expense: Expense): Promise<Expense> {
        const stmt = this.db.prepare(`
            INSERT INTO expenses (id, tag, is_credit, amount, date)
            VALUES (?, ?, ?, ?, ?)
        `);

        stmt.run(
            expense.id,
            expense.tag,
            expense.isCredit ? 1 : 0,
            expense.amount,
            expense.date.toISOString()
        );

        return Promise.resolve(expense);
    }

    async findById(id: string): Promise<Expense | null> {
        const stmt = this.db.prepare('SELECT * FROM expenses WHERE id = ?');
        const row = stmt.get(id) as any;

        if (!row) return Promise.resolve(null);

        return Promise.resolve(this.mapToDomain(row));
    }

    async findAll(): Promise<Expense[]> {
        const stmt = this.db.prepare('SELECT * FROM expenses');
        const rows = stmt.all() as any[];

        return Promise.resolve(rows.map(row => this.mapToDomain(row)));
    }

    async update(id: string, expense: Expense): Promise<Expense> {
        const checkStmt = this.db.prepare('SELECT id FROM expenses WHERE id = ?');
        if (!checkStmt.get(id)) {
            throw new NotFoundError(`Expense with id ${id} not found`);
        }

        const stmt = this.db.prepare(`
            UPDATE expenses 
            SET tag = ?, is_credit = ?, amount = ?, date = ?
            WHERE id = ?
        `);

        stmt.run(
            expense.tag,
            expense.isCredit ? 1 : 0,
            expense.amount,
            expense.date.toISOString(),
            id
        );

        return Promise.resolve(expense);
    }

    async delete(id: string): Promise<void> {
        const stmt = this.db.prepare('DELETE FROM expenses WHERE id = ?');
        stmt.run(id);
        return Promise.resolve();
    }

    private mapToDomain(row: any): Expense {
        return new Expense(
            row.id,
            row.tag as ExpenseTag,
            row.is_credit === 1,
            new Date(row.date),
            row.amount
        );
    }
}