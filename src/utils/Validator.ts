import {ValidationError} from "../errors/ValidatorError";

export class Validator {

    // Vérifie que c'est une string, qu'elle existe et qu'elle n'est pas vide
    static string(value: any, fieldName: string): string {
        if (value === undefined || value === null || typeof value !== 'string' || value.trim() === '') {
            throw new ValidationError(`Le champ '${fieldName}' est requis et doit être une chaîne non vide.`);
        }
        return value;
    }

    // Vérifie que c'est un nombre valide
    static number(value: any, fieldName: string): number {
        if (value === undefined || value === null || typeof value !== 'number' || isNaN(value)) {
            throw new ValidationError(`Le champ '${fieldName}' est requis et doit être un nombre valide.`);
        }
        return value;
    }

    // Vérifie un booléen
    static boolean(value: any, fieldName: string): boolean {
        if (value === undefined || value === null || typeof value !== 'boolean') {
            throw new ValidationError(`Le champ '${fieldName}' est requis et doit être un booléen.`);
        }
        return value;
    }

    // Valide et convertit une Date
    static date(value: any, fieldName: string): Date {
        if (value === undefined || value === null) {
            throw new ValidationError(`Le champ '${fieldName}' est requis.`);
        }

        const parsedDate = typeof value === 'string' ? new Date(value) : value;

        if (!(parsedDate instanceof Date) || isNaN(parsedDate.getTime())) {
            throw new ValidationError(`Le champ '${fieldName}' doit être une date valide.`);
        }
        return parsedDate;
    }

    // Vérifie l'Enum
    static enumValue<T>(value: any, enumObj: object, fieldName: string): T {
        const validValues = Object.values(enumObj);
        if (!value || !validValues.includes(value)) {
            throw new ValidationError(`Le champ '${fieldName}' a une valeur invalide : ${value}.`);
        }
        return value as T;
    }
}