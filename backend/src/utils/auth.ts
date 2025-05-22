import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrivateUser } from '../schemas/user.js';

const { sign, verify } = jwt;
const SECRET = process.env.JWT_SECRET || 'supersecret'; // fallback only for dev/testing

/**
 * Hashes a plain-text password using bcrypt.
 */
export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

/**
 * Compares a plain-text password with its hashed version.
 */
export function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Generates a signed JWT with a 1-day expiration.
 * Used for login sessions.
 */
export function generateToken(payload: Partial<PrivateUser>): string {
  return sign(payload, SECRET, { expiresIn: '1d' });
}

/**
 * Verifies a JWT and returns the decoded user payload.
 * Throws if the token is invalid or expired.
 */
export function verifyToken(token: string): PrivateUser {
  return verify(token, SECRET) as PrivateUser;
}
