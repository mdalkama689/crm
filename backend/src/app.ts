import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import tenantRouter from './routes/tenant-route';
import employeeRouter from './routes/employee-route'; 
import projectRouter from './routes/project-route'


dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const FRONTEND_URL = process.env.FRONTEND_URL;
const app = express();

app.use(cookieParser());
const corsOption = {
  origin: FRONTEND_URL,
  credentials: true,
};

app.use(express.json());
app.use(cors(corsOption));
app.use(morgan('tiny'));
app.use('/api/v1/tenant', tenantRouter);
app.use('/api/v1', employeeRouter);
app.use('/api/v1', projectRouter);

export default app;
