import { randomUUID } from "node:crypto";
import { ExpenseService } from "../../../src/services/ExpenseService";
import { InMemoryExpenseRepo } from "../../../src/adapters/driven/InMemoryExpenseRepo";
import { ExpenseTag } from "../../../src/domain/expense/enum/ExpenseTag";
import { NotFoundError } from "../../../src/errors/NotFoundError";
import { CreateExpenseDTO } from "../../../src/domain/expense/dto/CreateExpenseDTO";
import { UpdateExpenseDTO } from "../../../src/domain/expense/dto/UpdateExpenseDTO";

describe('Expense Integration (Service + Repo)', () => {
    let service: ExpenseService;
    let repo: InMemoryExpenseRepo;

    beforeEach(() => {
        repo = new InMemoryExpenseRepo();
        service = new ExpenseService(repo);
    });

    it('should create and then retrieve an expense (Create & GetById)', async () => {
        const expenseDto: CreateExpenseDTO = {
            tag: ExpenseTag.DINING,
            isCredit: false,
            date: new Date(),
            amount: 50
        };

        const createdExpense = await service.create(expenseDto);

        expect(createdExpense.id).toBeDefined();

        const result = await service.getById(createdExpense.id);

        expect(result).toBeDefined();
        expect(result?.id).toBe(createdExpense.id);
        expect(result?.amount).toBe(50);
    });

    it('should list all saved expenses (GetAll)', async () => {
        await service.create({
            tag: ExpenseTag.DINING,
            isCredit: false,
            date: new Date(),
            amount: 10
        });
        await service.create({
            tag: ExpenseTag.TRANSPORTATION,
            isCredit: false,
            date: new Date(),
            amount: 20
        });

        const list = await service.listAll();

        expect(list).toHaveLength(2);
    });

    it('should update an existing expense (Update)', async () => {
        const created = await service.create({
            tag: ExpenseTag.DINING,
            isCredit: false,
            date: new Date(),
            amount: 10
        });
        const updateDto: UpdateExpenseDTO = {
            tag: ExpenseTag.TRANSPORTATION,
            isCredit: true,
            date: new Date(),
            amount: 100
        };
        await service.update(created.id, updateDto);

        const result = await service.getById(created.id);

        expect(result?.amount).toBe(100);
        expect(result?.tag).toBe(ExpenseTag.TRANSPORTATION);
        expect(result?.isCredit).toBe(true);
    });

    it('should delete an expense and no longer find it (Delete)', async () => {
        const created = await service.create({
            tag: ExpenseTag.DINING,
            isCredit: false,
            date: new Date(),
            amount: 10
        });
        await service.delete(created.id);

        const result = await service.getById(created.id);

        expect(result).toBeNull();
    });

    it('should throw NotFoundError on update if id does not exist', async () => {
        const fakeId = randomUUID();
        const updateDto: UpdateExpenseDTO = {
            tag: ExpenseTag.DINING,
            isCredit: false,
            date: new Date(),
            amount: 10
        };

        await expect(service.update(fakeId, updateDto))
            .rejects
            .toThrow(NotFoundError);
    });
});