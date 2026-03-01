import express from 'express';
import type { Application, Request, Response } from 'express'
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

const app: Application = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Health Check Route
app.get('/', (req: Request, res: Response) => {
  res.send('🥗 Indian Restaurant API is cooking...');
});

export default app;