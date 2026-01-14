import { Express, Request, Response, NextFunction } from 'express';
import { BadRequestError } from "../../errors/BadRequestError";
import {HealthEventService} from "../../services/HealthEventService";
import {CreateHealthEventDTO} from "../../domain/healthEvent/dto/CreateHealthEventDTO";
import {UpdateHealthEventDTO} from "../../domain/healthEvent/dto/UpdateHealthEventDTO";

export class HealthEventController {
    constructor(private readonly healthEventService: HealthEventService) {}

    registerRoutes(app: Express) {
        app.get('/health-events', (req, res, next) => this.getAllHealthEvents(req, res, next));
        app.get('/health-events/:id', (req, res, next) => this.getHealthEventById(req, res, next));
        app.put('/health-events/:id', (req, res, next) => this.updateHealthEvent(req, res, next));
        app.post('/health-events', (req, res, next) => this.createHealthEvent(req, res, next));
        app.delete('/health-events/:id', (req, res, next) => this.deleteHealthEvent(req, res, next));
    }

    async getAllHealthEvents(req: Request, res: Response, next: NextFunction) {
        try {
            const events = await this.healthEventService.listAll();

            res.status(200).json(events);

        } catch (error) {
            next(error);
        }
    }

    async getHealthEventById(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id as string;

            const event = await this.healthEventService.getById(id);

            res.status(200).json(event);

        } catch (error) {
            next(error);
        }
    }

    async createHealthEvent(req: Request, res: Response, next: NextFunction) {
        try {
            const createHealthEventDTO: CreateHealthEventDTO = {
                ...req.body,
            }

            const createdEvent = await this.healthEventService.create(createHealthEventDTO);

            res.status(201).json(createdEvent);

        } catch (error) {
            next(error);
        }
    }

    async updateHealthEvent(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id as string;
            const newValues: UpdateHealthEventDTO = {
                ...req.body
            }

            const updated = await this.healthEventService.update(id, newValues);

            res.status(200).json(updated);

        } catch (error) {
            if (error instanceof Error && error.message.includes('[Validator]')) {
                return next(new BadRequestError(error.message));
            }
            next(error);
        }
    }

    async deleteHealthEvent(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id as string;

            await this.healthEventService.delete(id);

            res.status(204).send();

        } catch (error) {
            next(error);
        }
    }
}