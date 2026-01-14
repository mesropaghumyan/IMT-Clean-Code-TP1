import {HealthEventSeverity} from "../enum/HealthEventSeverity";

export interface UpdateHealthEventDTO {
    startDate: Date;
    endDate: Date;
    severity: HealthEventSeverity;
}