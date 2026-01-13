import { Express, Request, Response, NextFunction } from 'express';
import { NotFoundError } from "../../errors/NotFoundError";
import { BadRequestError } from "../../errors/BadRequestError";
import { randomUUID } from "node:crypto";
import {HealthEventBuilder} from "../../domain/healthEvent/builder/HealthEventBuilder";
import {HealthEventService} from "../../services/HealthEventService";

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

            if (!event) {
                return next(new NotFoundError("Événement de santé non trouvé"));
            }

            res.status(200).json(event);
        } catch (error) {
            next(error);
        }
    }

    async createHealthEvent(req: Request, res: Response, next: NextFunction) {
        try {
            const { startDate, endDate, severity } = req.body;

            const newEventDomain = HealthEventBuilder.create()
                .id(randomUUID())
                .startDate(startDate)
                .endDate(endDate)
                .severity(severity)
                .build();

            const createdEvent = await this.healthEventService.create(newEventDomain);
            res.status(201).json(createdEvent);

        } catch (error) {
            if (error instanceof Error && error.message.includes('[Validator]')) {
                return next(new BadRequestError(error.message));
            }
            next(error);
        }
    }

    async updateHealthEvent(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id as string;

            const existing = await this.healthEventService.getById(id);
            if (!existing) {
                return next(new NotFoundError("Événement de santé non trouvé"));
            }

            const { startDate, endDate, severity } = req.body;
            const eventToUpdate = HealthEventBuilder.create()
                .id(id)
                .startDate(startDate)
                .endDate(endDate)
                .severity(severity)
                .build();

            const updated = await this.healthEventService.update(id, eventToUpdate);
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

            const existing = await this.healthEventService.getById(id);
            if (!existing) {
                return next(new NotFoundError("Événement de santé non trouvé"));
            }

            await this.healthEventService.delete(id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}