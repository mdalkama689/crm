import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import cors from 'cors';
import userRoutes from './routes/user-route';
import employeeRoutes from './routes/employee-route';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

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
app.use('/api/v1/admin', userRoutes);
app.use('/api/v1', employeeRoutes);
app.use(morgan('tiny'));

export default app;
