import { Express, Request, Response, NextFunction } from 'express';
import { ExpenseService } from "../../services/ExpenseService";
import {CreateExpenseDTO} from "../../domain/expense/dto/CreateExpenseDTO";
import {UpdateExpenseDTO} from "../../domain/expense/dto/UpdateExpenseDTO";

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
            const expenses = await this.expenseService.listAll();

            res.status(200).json(expenses);

        } catch (error) {
            next(error);
        }
    }

    async getExpenseById(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id as string;

            const expense = await this.expenseService.getById(id);

            res.status(200).json(expense);

        } catch (error) {
            next(error);
        }
    }

    async createExpense(req: Request, res: Response, next: NextFunction) {
        try {
            const createExpenseDTO: CreateExpenseDTO = {
                ...req.body,
            }

            const createdExpense = await this.expenseService.create(createExpenseDTO);

            res.status(201).json(createdExpense);

        } catch (error) {
            next(error);
        }
    }

    async updateExpense(req: Request, res: Response, next: NextFunction) {
        try {
            const expenseId = req.params.id as string;
            const newValues: UpdateExpenseDTO = {
                ...req.body
            }

            const updatedExpense = await this.expenseService.update(expenseId, newValues);

            res.status(200).json(updatedExpense);

        } catch (error) {
            next(error);
        }
    }

    async deleteExpense(req: Request, res: Response, next: NextFunction) {
        try {
            const expenseId = req.params.id as string;

            await this.expenseService.delete(expenseId);

            res.status(204).send();

        } catch (error) {
            next(error);
        }
    }
}