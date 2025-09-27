import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import config from './config/config';
import { errorHandler } from './middlewares/error.middleware';

import { userRoute } from './routes/user-route';

// Express app initialization
const app = express();
app.use(express.json());

app.use(cors(config.cors));
app.use(cookieParser());
app.use(morgan('dev'));

// Routes
app.use('/api/user', userRoute);

// Global error handler (should be after routes)
app.use(errorHandler);

export default app;
