import { Request, Response, NextFunction } from 'express';
import {AppError} from "../../../../errors/AppError";

export const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
    if (error instanceof AppError) {
        return res.status(error.statusCode).json({
            status: 'error',
            statusCode: error.statusCode,
            message: error.message
        });
    }

    return res.status(500).json({
        status: 'error',
        statusCode: 500,
        message: "Erreur interne du serveur"
    });
};