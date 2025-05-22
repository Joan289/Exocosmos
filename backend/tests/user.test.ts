import request from 'supertest';
import { describe, it, expect, beforeEach } from 'vitest';
import app from '../src/app.js';
import { logIfFailed } from './helpers/log-if-failed.js';
import { registerAndLogin } from './helpers/auth.js';
import { createTestPlanetarySystem } from './helpers/resources.js';

let cookie: string[];
let userId: number;

describe('👤 User API', () => {
  beforeEach(async () => {
    cookie = await registerAndLogin();
    const res = await request(app).get('/auth/me').set('Cookie', cookie);
    userId = res.body.data.user_id;
  });

  describe('🔎 Read Operations (GET)', () => {
    it('should list existing users', async () => {
      const res = await request(app).get('/users').set('Cookie', cookie);
      logIfFailed(res, 200, 'GET /users - List users');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);

      for (const user of res.body.data) {
        expect(user).not.toHaveProperty('email');
      }
    });

    it('should get a specific user by ID', async () => {
      const res = await request(app).get(`/users/${userId}`).set('Cookie', cookie);
      logIfFailed(res, 200, `GET /users/${userId} - Get by ID`);
      expect(res.status).toBe(200);
      expect(res.body.data.user_id).toBe(userId);

      expect(res.body.data).not.toHaveProperty('email');
    });

    it('should allow selecting specific fields for a user (email ignored)', async () => {
      const res = await request(app)
        .get(`/users/${userId}?fields=username,email`)
        .set('Cookie', cookie);
      logIfFailed(res, 200, `GET /users/${userId} with fields`);
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty('username');
      expect(res.body.data).not.toHaveProperty('email');
    });

    it('should return full user info with planetary systems', async () => {
      await createTestPlanetarySystem(cookie);

      const res = await request(app).get(`/users/${userId}/full`).set('Cookie', cookie);
      logIfFailed(res, 200, `GET /users/${userId}/full`);
      expect(res.status).toBe(200);

      const user = res.body.data;
      expect(user).toHaveProperty('user_id', userId);
      expect(user).toHaveProperty('username');
      expect(user).not.toHaveProperty('email');
      expect(user).toHaveProperty('planetary_systems');
      expect(Array.isArray(user.planetary_systems)).toBe(true);
    });
  });

  describe('🚫 Disallowed Operations', () => {
    it('should return 405 on POST /users', async () => {
      const res = await request(app).post('/users').set('Cookie', cookie).send({});
      logIfFailed(res, 405, 'POST /users - Disallowed');
      expect(res.status).toBe(405);
    });

    it('should return 405 on PUT /users/:id', async () => {
      const res = await request(app).put(`/users/${userId}`).set('Cookie', cookie).send({
        username: 'updated_user_put',
        email: `updated_put_${Date.now()}@test.com`,
        password: 'NewValidPass123!',
        profile_picture_url: 'https://example.com/new-profile.jpg'
      });
      logIfFailed(res, 405, 'PUT /users/:id - Disallowed');
      expect(res.status).toBe(405);
    });

    it('should return 405 on PATCH /users/:id', async () => {
      const res = await request(app).patch(`/users/${userId}`).set('Cookie', cookie).send({ username: 'patched' });
      logIfFailed(res, 405, 'PATCH /users/:id - Disallowed');
      expect(res.status).toBe(405);
    });

    it('should return 405 on DELETE /users/:id', async () => {
      const res = await request(app).delete(`/users/${userId}`).set('Cookie', cookie);
      logIfFailed(res, 405, `DELETE /users/${userId} - Disallowed`);
      expect(res.status).toBe(405);
    });
  });

  describe('❌ Validation and Error Handling', () => {
    it('should return 400 on GET /users/:id with non-numeric ID', async () => {
      const res = await request(app).get('/users/not-a-number').set('Cookie', cookie);
      logIfFailed(res, 400, 'GET /users/not-a-number');
      expect(res.status).toBe(400);
    });

    it('should return 404 on GET /users/:id for non-existent user', async () => {
      const res = await request(app).get('/users/9999999').set('Cookie', cookie);
      logIfFailed(res, 404, 'GET /users/9999999 - Not Found');
      expect(res.status).toBe(404);
    });

    it('should return 404 on GET /users/:id/full for non-existent user', async () => {
      const res = await request(app).get('/users/9999999/full').set('Cookie', cookie);
      logIfFailed(res, 404, 'GET /users/9999999/full - Not Found');
      expect(res.status).toBe(404);
    });
  });
});
