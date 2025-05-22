import express from "express";
import { starRouter } from "./routes/star.js";
import { planetTypeRouter } from "./routes/planet-type.js";
import { errorHandler } from "./middlewares/error.js";
import { planetRouter } from './routes/planet.js';
import { compoundRouter } from './routes/compound.js';
import { authRouter } from "./routes/auth.js";
import cookieParser from 'cookie-parser';
import { planetarySystemRouter } from "./routes/planetary-system.js";
import { uploadRouter } from "./routes/upload.js";
import { userRouter } from "./routes/user.js";
import cors from 'cors';

const app = express();

// CORS
app.use(cors({
  origin: true,
  credentials: true,
}));

// Parsers middlewares
app.use(express.json());
app.use(cookieParser());

// Serve static uploaded files
app.use('/uploads', express.static('public/uploads'));

// Endpoints
app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/planetary-systems', planetarySystemRouter);
app.use('/stars', starRouter);
app.use('/planet-types', planetTypeRouter);
app.use('/compounds', compoundRouter);
app.use('/planets', planetRouter);
app.use('/upload', uploadRouter);

// Error handling middleware
app.use(errorHandler);

export default app;
