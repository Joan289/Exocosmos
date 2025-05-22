import request from 'supertest';
import app from '../../src/app.js';
import { randomUUID } from 'crypto';
import { AppError } from '../../src/middlewares/error.js';

export const testPassword = 'SuperTest123!';

/**
 * Generates a unique username for testing purposes.
 */
export function getUniqueTestUsername(): string {
  return `user-${randomUUID().replace(/-/g, '').slice(0, 15)}`;
}

/**
 * Generates a unique email for testing purposes.
 */
export function getUniqueTestEmail(): string {
  return `user-${randomUUID()}@example.com`;
}

/**
 * Registers and logs in a test user.
 * 
 * Returns the cookie array needed to perform authenticated requests.
 * Throws AppError if any step fails.
 */
export async function registerAndLogin({
  email = getUniqueTestEmail(),
  username = getUniqueTestUsername(),
  password = testPassword
}: {
  email: string;
  username?: string;
  password?: string;
} = {}): Promise<string[]> {
  // Register user
  const register = await request(app)
    .post('/auth/register')
    .send({
      username,
      email,
      password,
      profile_picture_url: 'https://example.com/image.jpg'
    });

  if (register.status !== 201) {
    console.error('❌ Register failed', register.status, register.body);
    throw new AppError(500, 'Register failed during test', register.body);
  }

  // Log in user
  const login = await request(app)
    .post('/auth/login')
    .send({ email, password });

  if (login.status !== 200) {
    console.error('❌ Login failed', login.status, login.body);
    throw new AppError(500, 'Login failed during test', login.body);
  }

  // Return authentication cookie header
  return login.headers['set-cookie'];
}
