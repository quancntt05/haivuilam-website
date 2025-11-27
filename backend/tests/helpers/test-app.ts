import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from '../../src/config/env';
import authRoutes from '../../src/routes/auth.routes';
import photoRoutes from '../../src/routes/photo.routes';
import commentRoutes from '../../src/routes/comment.routes';
import { errorHandler } from '../../src/middleware/error.middleware';

export const createTestApp = () => {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(`/api/${env.API_VERSION}/auth`, authRoutes);
  app.use(`/api/${env.API_VERSION}/photos`, photoRoutes);
  app.use(`/api/${env.API_VERSION}/comments`, commentRoutes);

  app.use(errorHandler);

  return app;
};

