import { ExpenseTag } from "./enum/ExpenseTag";
import {Validator} from "../../utils/Validator";

export class Expense {
    readonly id: string;
    readonly tag: ExpenseTag;
    readonly isCredit: boolean;
    readonly date: Date;
    readonly amount: number;

    constructor(
        id: string,
        tag: ExpenseTag,
        isCredit: boolean,
        date: Date,
        amount: number
    ) {
        this.id = Validator.string(id, 'id');
        this.tag = Validator.enumValue(tag, ExpenseTag, 'tag');
        this.isCredit = Validator.boolean(isCredit, 'isCredit');
        this.date = Validator.date(date, 'date');
        this.amount = Validator.number(amount, 'amount');
    }
}