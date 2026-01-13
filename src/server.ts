import express from 'express';
import * as YAML from 'yaml';
import swaggerUi from 'swagger-ui-express';
import path from 'path';
import fs from 'fs';
import { errorHandler } from "./adapters/primary/express/middlewares/errorHandler";
import { ExpenseService } from "./services/ExpenseService";
import {InMemoryExpenseRepo} from "./adapters/driven/inMemoryExpenseRepo";
import {ExpenseController} from "./adapters/driving/ExpenseController";

const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;
const swaggerPath = path.resolve(__dirname, '..', 'open-api.yaml');
const file = fs.readFileSync(swaggerPath, 'utf8');
const swaggerDoc = YAML.parse(file);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

const expenseRepo = new InMemoryExpenseRepo();
const expenseService = new ExpenseService(expenseRepo);
const expenseController = new ExpenseController(expenseService);
expenseController.registerRoutes(app);

app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
    console.log(`Swagger docs at http://localhost:${port}/docs`);
});