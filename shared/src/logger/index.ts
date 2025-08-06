
import { createLogger } from "winston";
import { logFormat } from "./format";
import { transportList } from "./transports";
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

export const log = createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: logFormat,
    transports: transportList
})


log.error("hii")
