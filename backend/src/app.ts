import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import tenantRouter from './routes/tenant-route';
import employeeRouter from './routes/employee-route';
import projectRouter from './routes/project-route';
import notificationRouter from './routes/notification-route';
import taskRouter from './routes/task-route';
import commentRouter from './routes/comment-route';
import AWS from 'aws-sdk';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const FRONTEND_URL = process.env.FRONTEND_URL;
const app = express();

app.use(morgan('dev'));
app.use(cookieParser());
const corsOption = {
  origin: FRONTEND_URL,
  credentials: true,
};
// app.use(
//   cors({
//   origin: FRONTEND_URL,
//     methods: ["GET", "POST", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//     credentials: true,
//   })
// );
app.use(express.json());
app.use(cors(corsOption));
const ACCESS_KEY_ID = process.env.ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = process.env.SECRET_ACCESS_KEY;
const ENDPOINT_URL = process.env.ENDPOINT_URL;

export const BUCKET_NAME = process.env.BUCKET_NAME;

export const spacesEndpoint = new AWS.Endpoint(ENDPOINT_URL!);

export const s3 = new AWS.S3({
  endpoint: spacesEndpoint,
  accessKeyId: ACCESS_KEY_ID,
  secretAccessKey: SECRET_ACCESS_KEY,
});

app.use('/api/v1/tenant', tenantRouter);
app.use('/api/v1', employeeRouter);
app.use('/api/v1', projectRouter);
app.use('/api/v1/notification', notificationRouter);
app.use('/api/v1', taskRouter);
app.use('/api/v1', commentRouter);

// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "http://localhost:5173");
//   res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
//   res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   next();
// });

export default app;
