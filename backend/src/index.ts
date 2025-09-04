import app from './app';
import dotenv from 'dotenv';
import path from 'path';
import { log } from 'shared/src/logger/index'; 

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const PORT = process.env.PORT;



app.listen(PORT, () => {
  log.info(`server is runnig at ${PORT}`);
});
