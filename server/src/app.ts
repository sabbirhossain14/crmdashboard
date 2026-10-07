import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import * as helmetModule from 'helmet';
import cookieParser from 'cookie-parser';
import * as rateLimitModule from 'express-rate-limit';
import morgan from 'morgan';
import { connectDB } from './config/db.js';
import routes from './routes/index.js';
import { errors, notFound } from './middleware/errors.js';

// Interop-safe loaders: work whether the build treats these packages as ESM or CJS.
type Middleware = (options?: Record<string, unknown>) => express.RequestHandler;
const helmet = ((helmetModule as unknown as { default?: Middleware }).default ?? helmetModule) as unknown as Middleware;
const rateLimit = ((rateLimitModule as unknown as { rateLimit?: Middleware }).rateLimit ??
  (rateLimitModule as unknown as { default?: Middleware }).default) as Middleware;

const app = express();

// Required behind Vercel's proxy so rate limiting and secure cookies work.
app.set('trust proxy', 1);

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());
app.use(morgan('dev'));
app.use(async (_req, _res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    next(err);
  }
});
app.use('/api/auth', rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false,
}));
app.get('/api/health', (_req, res) => res.json({ success: true, data: { status: 'ok' } }));
app.use('/api', routes);
app.use(notFound);
app.use(errors);

export default app;
