import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import cors from 'cors';
import userRoutes from './routes/user-route';
import morgan from 'morgan';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const FRONTEND_URL = process.env.FRONTEND_URL;
const app = express();

const corsOption = {
  origin: FRONTEND_URL,
  credentials: true,
};
app.use(express.json());
app.use(cors(corsOption));
app.use('/api/v1', userRoutes);
app.use(morgan('tiny'));

export default app;
