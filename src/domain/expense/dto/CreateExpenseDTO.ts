import {ExpenseTag} from "../enum/ExpenseTag";

export interface CreateExpenseDTO {
    tag: ExpenseTag;
    isCredit: boolean;
    amount: number;
    date: Date;
}