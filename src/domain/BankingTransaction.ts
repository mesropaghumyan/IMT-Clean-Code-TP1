import { TransactionTag } from "./enum/TransactionTag";

export class BankingTransaction {
    id: string;
    tag: TransactionTag;
    isCredit: boolean;
    date: Date;
    amount: number;
    userId: string;

    constructor(
        id: string,
        tag: TransactionTag,
        isCredit: boolean,
        date: Date,
        amount: number,
        userId: string
    ) {
        this.id = id;
        this.amount = amount;
        this.tag = tag;
        this.isCredit = isCredit;
        this.date = date;
        this.userId = userId;
    }
}