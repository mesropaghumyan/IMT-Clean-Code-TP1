import {ExpenseTag} from "../enum/ExpenseTag";

export interface UpdateExpenseDTO {
    tag: ExpenseTag;
    isCredit: boolean;
    amount: number;
    date: Date;
}