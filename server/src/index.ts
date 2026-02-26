import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import express, { type Request, type Response, type NextFunction } from 'express';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Dev: server/src -> ../../.env = repo root. Prod: server/dist/server/src -> ../../../../.env = repo root
const envPath = path.resolve(__dirname, __dirname.includes('dist') ? '../../../../.env' : '../../.env');
dotenv.config({ path: envPath});
import cors from 'cors'
import { env } from './env.js';
import routes from './routes/index.js';
import { or } from "drizzle-orm";

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.use('/api', routes);

app.get('/health', (_req: Request, res: Response): void => {
    res.json({ ok:true });
});

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction): void => {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error'})
});

app.listen(env.PORT, () => {
  console.log(`Server listening on http://localhost:${env.PORT}`);
});