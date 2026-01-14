import Database from 'better-sqlite3';

export class SQLiteDatabase {
    private static instance: Database.Database;

    private constructor() { }

    public static getInstance(): Database.Database {
        if (!SQLiteDatabase.instance) {
            SQLiteDatabase.instance = new Database('clean-arch-app.db');
            SQLiteDatabase.instance.pragma('foreign_keys = ON');
            SQLiteDatabase.initializeTables();
        }
        return SQLiteDatabase.instance;
    }

    private static initializeTables(): void {
        const db = SQLiteDatabase.instance;

        db.prepare(`
            CREATE TABLE IF NOT EXISTS expenses (
                id TEXT PRIMARY KEY,
                tag TEXT NOT NULL,
                is_credit INTEGER NOT NULL,
                amount REAL NOT NULL,
                date TEXT NOT NULL
            )
        `).run();

        db.prepare(`
            CREATE TABLE IF NOT EXISTS health_events (
                id TEXT PRIMARY KEY,
                start_date TEXT NOT NULL,
                end_date TEXT NOT NULL,
                severity TEXT NOT NULL
            )
        `).run();

        console.log("Database initialized and tables ready.");
    }
}