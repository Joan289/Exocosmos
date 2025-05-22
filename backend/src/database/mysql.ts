import 'dotenv/config';
import mysql from 'mysql2/promise';
import { AppError } from '../middlewares/error.js';

// Determine current environment (development, test, etc.)
const env = process.env.NODE_ENV;

// Select appropriate database URL based on environment
const url = env === 'test' ? process.env.TEST_DATABASE_URL : process.env.DATABASE_URL;

if (!url) {
  throw new AppError(500, 'Database URL is not defined for current environment');
}

// Create and export a MySQL connection pool
export const connection = await mysql.createPool(url);
