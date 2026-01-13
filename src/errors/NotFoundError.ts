import {AppError} from "./AppError";

export class NotFoundError extends AppError {
    constructor(message: string = "Ressource non trouvée") {
        super(message, 404);
    }
}