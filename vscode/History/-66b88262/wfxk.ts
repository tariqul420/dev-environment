import dotenv from 'dotenv';
import { IConfig } from '../types';

dotenv.config();

const config: IConfig = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
  },
  cookie: {
    tokenSecret: process.env.ACCESS_TOKEN_SECRET as string,
    tokenName: process.env.TOKEN_NAME as string,
  },
  db: {
    provider: '',
    url: '',
  },
};

export default config;
