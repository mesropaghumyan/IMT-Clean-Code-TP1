import { Expense } from "../Expense";
import {ExpenseTag} from "../enum/ExpenseTag";
import {Validator} from "../../../utils/Validator";

export class ExpenseBuilder {
    private _id?: string;
    private _tag?: ExpenseTag;
    private _isCredit?: boolean;
    private _date?: Date | string;
    private _amount?: number;

    private constructor() {}

    static create(): ExpenseBuilder {
        return new ExpenseBuilder();
    }

    id(id: string): ExpenseBuilder {
        this._id = id;
        return this;
    }

    tag(tag: ExpenseTag): ExpenseBuilder {
        this._tag = tag;
        return this;
    }

    isCredit(isCredit: boolean): ExpenseBuilder {
        this._isCredit = isCredit;
        return this;
    }

    date(date: Date | string): ExpenseBuilder {
        this._date = date;
        return this;
    }

    amount(amount: number): ExpenseBuilder {
        this._amount = amount;
        return this;
    }

    build(): Expense {
        return new Expense(
            Validator.required(this._id, 'id'),
            Validator.required(this._tag, 'tag'),
            Validator.required(this._isCredit, 'isCredit'),
            Validator.required(this._date, 'date'),
            Validator.required(this._amount, 'amount')
        );
    }
}