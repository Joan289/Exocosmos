import request from 'supertest';
import { describe, it, expect } from 'vitest';
import app from '../src/app.js';
import { logIfFailed } from './helpers/log-if-failed.js';
import {
  registerAndLogin,
  getUniqueTestEmail,
  getUniqueTestUsername,
  testPassword
} from './helpers/auth.js';

const updatedPassword = 'NewTest1234!@#$';

describe('Auth API', () => {
  describe('Register', () => {
    it('should register a new user successfully', async () => {
      const email = getUniqueTestEmail();
      const username = getUniqueTestUsername();

      const res = await request(app).post('/auth/register').send({
        username,
        email,
        password: testPassword,
        profile_picture_url: 'https://example.com/profile.jpg'
      });

      logIfFailed(res, 201, 'Register User');
      expect(res.status).toBe(201);
      expect(res.body.data).toMatchObject({
        user_id: expect.any(Number),
        username,
        email,
        profile_picture_url: 'https://example.com/profile.jpg',
        created_at: expect.any(String)
      });

    });

    it('should fail to register a user with duplicate email', async () => {
      const email = getUniqueTestEmail();

      await request(app).post('/auth/register').send({
        username: getUniqueTestUsername(),
        email,
        password: testPassword,
        profile_picture_url: 'https://example.com/profile.jpg'
      });

      const res = await request(app).post('/auth/register').send({
        username: getUniqueTestUsername(),
        email,
        password: testPassword,
        profile_picture_url: 'https://example.com/another.jpg'
      });

      logIfFailed(res, 409, 'Duplicate Email');
      expect(res.status).toBe(409);
    });

    it('should fail to register a user with invalid data', async () => {
      const res = await request(app).post('/auth/register').send({
        username: '',
        email: 'not-an-email',
        password: '123',
        profile_picture_url: 'not-a-url'
      });

      logIfFailed(res, 400, 'Invalid Register Input');
      expect(res.status).toBe(400);
    });
  });

  describe('Login', () => {
    it('should login with valid credentials', async () => {
      const email = getUniqueTestEmail();
      const username = getUniqueTestUsername();

      await request(app).post('/auth/register').send({
        username,
        email,
        password: testPassword,
        profile_picture_url: 'https://example.com/profile.jpg'
      });

      const res = await request(app)
        .post('/auth/login')
        .send({ email, password: testPassword });

      logIfFailed(res, 200, 'Login User');
      expect(res.status).toBe(200);
      expect(res.headers['set-cookie']).toBeDefined();
      expect(res.body.data).toEqual(
        expect.objectContaining({
          user_id: expect.any(Number),
          username,
          email
        })
      );
    });

    it('should fail to login with wrong password', async () => {
      const email = getUniqueTestEmail();
      const username = getUniqueTestUsername();

      await request(app).post('/auth/register').send({
        username,
        email,
        password: testPassword,
        profile_picture_url: 'https://example.com/profile.jpg'
      });

      const res = await request(app)
        .post('/auth/login')
        .send({ email, password: 'wrongpassword' });

      logIfFailed(res, 401, 'Wrong password');
      expect(res.status).toBe(401);
    });

    it('should fail to login with non-existent email', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({ email: 'idontexist@example.com', password: 'whatever' });

      logIfFailed(res, 401, 'Non-existent email');
      expect(res.status).toBe(401);
    });
  });

  describe('Me endpoint', () => {
    it('should return the logged-in user with /auth/me', async () => {
      const email = getUniqueTestEmail();
      const cookie = await registerAndLogin({ email });

      const res = await request(app)
        .get('/auth/me')
        .set('Cookie', cookie);

      logIfFailed(res, 200, 'Get /auth/me');
      expect(res.status).toBe(200);
      expect(res.body.data.email).toBe(email);
    });

    it('should fail to access /auth/me without token', async () => {
      const res = await request(app).get('/auth/me');

      logIfFailed(res, 401, 'No token provided');
      expect(res.status).toBe(401);
      expect(res.body.message).toBe('No token provided');
    });
  });

  describe('Update /auth/me', () => {
    it('should allow user to update their password with valid input', async () => {
      const email = getUniqueTestEmail();
      const cookie = await registerAndLogin({ email });

      const res = await request(app)
        .patch('/auth/me')
        .set('Cookie', cookie)
        .send({ password: updatedPassword });

      logIfFailed(res, 200, 'Update Password');
      expect(res.status).toBe(200);
      expect(res.body.updatedFields).toContain('password');

      const loginWithNew = await request(app)
        .post('/auth/login')
        .send({ email, password: updatedPassword });

      expect(loginWithNew.status).toBe(200);
    });

    it('should allow the user to update their profile via /auth/me', async () => {
      const email = getUniqueTestEmail();
      const cookie = await registerAndLogin({ email });

      const res = await request(app)
        .patch('/auth/me')
        .set('Cookie', cookie)
        .send({
          username: 'updateduser',
          profile_picture_url: 'https://example.com/new-pic.jpg'
        });

      logIfFailed(res, 200, 'Patch /auth/me');
      expect(res.status).toBe(200);
      expect(res.body.updatedFields).toEqual(
        expect.arrayContaining(['username', 'profile_picture_url'])
      );
    });
  });

  describe('Logout', () => {
    it('should logout and clear the token cookie', async () => {
      const email = getUniqueTestEmail();
      const cookie = await registerAndLogin({ email });

      const res = await request(app)
        .post('/auth/logout')
        .set('Cookie', cookie);

      logIfFailed(res, 200, 'Logout User');
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Logged out successfully');
    });
  });

  describe('Delete account', () => {
    it('should allow the user to delete their account via /auth/me', async () => {
      const email = getUniqueTestEmail();
      const cookie = await registerAndLogin({ email });

      const res = await request(app)
        .delete('/auth/me')
        .set('Cookie', cookie);

      logIfFailed(res, 200, 'Delete /auth/me');
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Account deleted');
    });
  });
});
