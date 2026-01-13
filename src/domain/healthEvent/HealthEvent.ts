import {HealthEventSeverity} from "./enum/HealthEventSeverity";
import {Validator} from "../../utils/Validator";
import {ValidationError} from "../../errors/ValidatorError";

export class HealthEvent {
        readonly id: string;
        readonly startDate: Date;
        readonly endDate: Date;
        readonly severity: HealthEventSeverity;

        constructor(id: string, startDate: Date, endDate: Date, severity: HealthEventSeverity) {
            this.id = Validator.string(id, 'id');
            this.startDate = Validator.date(startDate, 'startDate');
            this.endDate = Validator.date(endDate, 'endDate');
            this.severity = Validator.enumValue(severity, HealthEventSeverity, "severity");
            Validator.dateRange(this.startDate, this.endDate, 'HealthEvent');
        }
    }