import { HealthEvent } from "../HealthEvent";
import { HealthEventSeverity } from "../enum/HealthEventSeverity";

export class HealthEventBuilder {
    private _id?: string;
    private _startDate?: Date;
    private _endDate?: Date;
    private _severity?: HealthEventSeverity;

    private constructor() {}

    static create(): HealthEventBuilder {
        return new HealthEventBuilder();
    }

    id(id: string): HealthEventBuilder {
        this._id = id;
        return this;
    }

    startDate(startDate: Date): HealthEventBuilder {
        this._startDate = startDate;
        return this;
    }

    endDate(endDate: Date): HealthEventBuilder {
        this._endDate = endDate;
        return this;
    }

    severity(severity: HealthEventSeverity): HealthEventBuilder {
        this._severity = severity;
        return this;
    }

    build(): HealthEvent {
        return new HealthEvent(
            this._id!,
            this._startDate!,
            this._endDate!,
            this._severity!
        );
    }
}