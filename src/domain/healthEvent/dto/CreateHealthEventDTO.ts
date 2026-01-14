import {HealthEventSeverity} from "../enum/HealthEventSeverity";

export interface CreateHealthEventDTO {
    startDate: Date;
    endDate: Date;
    severity: HealthEventSeverity;
}