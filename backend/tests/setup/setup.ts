import { beforeEach, afterEach, afterAll } from 'vitest';
import { connection } from '../../src/database/mysql.js';

beforeEach(async () => {
  await connection.query('START TRANSACTION');
});

afterEach(async () => {
  await connection.query('ROLLBACK');
});

afterAll(async () => {
  await connection.end();
});
