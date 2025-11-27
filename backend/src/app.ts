import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { env } from './config/env';
import authRoutes from './routes/auth.routes';
import photoRoutes from './routes/photo.routes';
import commentRoutes from './routes/comment.routes';
import { errorHandler } from './middleware/error.middleware';
import { UPLOAD_CONSTANTS } from './utils/constants/upload.constants';

const app = express();

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:', 'http://localhost:3001'],
      },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

const morganFormat = env.NODE_ENV === 'production' ? 'combined' : 'dev';
app.use(morgan(morganFormat));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(
  '/uploads/photos',
  (_req, res, next) => {
    res.header('Access-Control-Allow-Origin', env.CORS_ORIGIN);
    res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
  },
  express.static(path.join(process.cwd(), UPLOAD_CONSTANTS.UPLOAD_DIR))
);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

app.use(`/api/${env.API_VERSION}/auth`, authRoutes);
app.use(`/api/${env.API_VERSION}/photos`, photoRoutes);
app.use(`/api/${env.API_VERSION}/comments`, commentRoutes);

app.use(errorHandler);

app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

app.listen(env.PORT, () => {
  console.log(`Server is running on port ${env.PORT}`);
});

export default app;
