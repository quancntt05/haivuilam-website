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

app.use(helmet());
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  })
);
const morganFormat = env.NODE_ENV === 'production' ? 'combined' : 'dev';
app.use(morgan(morganFormat));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads/photos', express.static(path.join(process.cwd(), UPLOAD_CONSTANTS.UPLOAD_DIR)));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

app.use(`/api/${env.API_VERSION}/auth`, authRoutes);
app.use(`/api/${env.API_VERSION}/photos`, photoRoutes);
app.use(`/api/${env.API_VERSION}/comments`, commentRoutes);

app.use(errorHandler);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

app.listen(env.PORT, () => {
  console.log(`Server is running on port ${env.PORT}`);
});

export default app;
