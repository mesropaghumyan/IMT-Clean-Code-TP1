import { Express, Request, Response, NextFunction } from 'express';
import { ExpenseService } from "../../services/ExpenseService";
import { ExpenseBuilder } from "../../domain/expense/builder/ExpenseBuilder";
import { NotFoundError } from "../../errors/NotFoundError";
import { BadRequestError } from "../../errors/BadRequestError";
import {randomUUID} from "node:crypto";

export class ExpenseController {
    constructor(private readonly expenseService: ExpenseService) {}

    registerRoutes(app: Express) {
        app.get('/expenses', (req, res, next) => this.getAllExpenses(req, res, next));
        app.get('/expenses/:id', (req, res, next) => this.getExpenseById(req, res, next));
        app.put('/expenses/:id', (req, res, next) => this.updateExpense(req, res, next));
        app.post('/expenses', (req, res, next) => this.createExpense(req, res, next));
        app.delete('/expenses/:id', (req, res, next) => this.deleteExpense(req, res, next));
    }

    async getAllExpenses(req: Request, res: Response, next: NextFunction) {
        try {
            const expenses = await this.expenseService.listExpenses();
            res.status(200).json(expenses);
        } catch (error) {
            next(error);
        }
    }

    async getExpenseById(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id as string;
            const expense = await this.expenseService.getExpense(id);

            if (!expense) {
                return next(new NotFoundError("Dépense non trouvée"));
            }

            res.status(200).json(expense);
        } catch (error) {
            next(error);
        }
    }

    async createExpense(req: Request, res: Response, next: NextFunction) {
        try {
            const { tag, isCredit, date, amount } = req.body;

            const newExpenseDomain = ExpenseBuilder.create()
                .id(randomUUID())
                .tag(tag)
                .isCredit(isCredit)
                .date(date)
                .amount(amount)
                .build();

            const createdExpense = await this.expenseService.createExpense(newExpenseDomain);
            res.status(201).json(createdExpense);

        } catch (error) {
            if (error instanceof Error && error.message.includes('[Validator]')) {
                return next(new BadRequestError(error.message));
            }
            next(error);
        }
    }

    async updateExpense(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id as string;

            const existing = await this.expenseService.getExpense(id);
            if (!existing) {
                return next(new NotFoundError("Dépense non trouvée"));
            }

            const { tag, isCredit, date, amount } = req.body;
            const expenseToUpdate = ExpenseBuilder.create()
                .id(id)
                .tag(tag)
                .isCredit(isCredit)
                .date(date)
                .amount(amount)
                .build();

            const updated = await this.expenseService.updateExpense(id, expenseToUpdate);
            res.status(200).json(updated);

        } catch (error) {
            if (error instanceof Error && error.message.includes('[Validator]')) {
                return next(new BadRequestError(error.message));
            }
            next(error);
        }
    }

    async deleteExpense(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id as string;

            const existing = await this.expenseService.getExpense(id);
            if (!existing) {
                return next(new NotFoundError("Dépense non trouvée"));
            }

            await this.expenseService.deleteExpense(id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}