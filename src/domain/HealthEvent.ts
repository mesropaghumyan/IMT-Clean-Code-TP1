import { HealthEventSeverity } from "./enum/HealthEventSeverity";

export class HealthEvent {
    id: string;
    startDate: Date;
    endDate: Date;
    severity: HealthEventSeverity;
    userId: string;
    
    constructor(
        id: string,
        startDate: Date,
        endDate: Date,
        severity: HealthEventSeverity,
        userId: string
    ) {
        this.id = id;
        this.startDate = startDate;
        this.endDate = endDate;
        this.severity = severity;
        this.userId = userId;
    }
}