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
import routes form './'