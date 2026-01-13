export class Validator {

    // Vérifie qu'une valeur n'est pas null/undefined (pour le build final)
    static required<T>(value: T | undefined | null, fieldName: string): T {
        if (value === undefined || value === null) {
            throw new Error(`[Validator] Champ manquant : '${fieldName}'`);
        }
        return value;
    }

    // Vérifie qu'une chaîne est valide
    static string(value: any, fieldName: string): string {
        if (!value || typeof value !== 'string' || value.trim() === '') {
            throw new Error(`[Validator] '${fieldName}' est invalide ou vide. Reçu: ${value}`);
        }
        return value;
    }

    // Vérifie qu'un nombre est valide
    static number(value: any, fieldName: string): number {
        if (value === null || value === undefined || typeof value !== 'number' || isNaN(value)) {
            throw new Error(`[Validator] '${fieldName}' est invalide (NaN ou null). Reçu: ${value}`);
        }
        return value;
    }

    // Vérifie un booléen
    static boolean(value: any, fieldName: string): boolean {
        if (typeof value !== 'boolean') {
            throw new Error(`[Validator] '${fieldName}' doit être un booléen. Reçu: ${value}`);
        }
        return value;
    }

    // Valide et convertit une Date
    static date(value: Date | string, fieldName: string): Date {
        let parsedDate: Date = typeof value === 'string' ? new Date(value) : value;

        if (!(parsedDate instanceof Date) || isNaN(parsedDate.getTime())) {
            throw new Error(`[Validator] '${fieldName}' est une date invalide. Reçu: ${value}`);
        }
        return parsedDate;
    }

    // Vérifie l'appartenance à une Enum
    static enumValue<T>(value: any, enumObj: object, fieldName: string): T {
        const validValues = Object.values(enumObj);
        if (!value || !validValues.includes(value)) {
            throw new Error(`[Validator] '${fieldName}' est invalide. Reçu: ${value}`);
        }
        return value as T;
    }
}