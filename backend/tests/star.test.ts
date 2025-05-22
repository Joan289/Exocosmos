import request from 'supertest';
import { describe, it, expect, beforeEach } from 'vitest';
import app from '../src/app.js';
import { logIfFailed } from './helpers/log-if-failed.js';
import { registerAndLogin } from './helpers/auth.js';
import { createTestStar, createTestPlanetarySystem } from './helpers/resources.js';

let cookie: string[];

describe('🌟 Star API', () => {
  beforeEach(async () => {
    cookie = await registerAndLogin();
  });

  describe('🔎 Read Operations (GET)', () => {
    it('should list existing stars', async () => {
      await createTestPlanetarySystem(cookie);

      const res = await request(app)
        .get('/stars')
        .set('Cookie', cookie);

      logIfFailed(res, 200, 'GET /stars - List stars');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('should get a specific star by ID', async () => {
      const testStarName = `Test-${Date.now()}`;
      const { star_id } = await createTestPlanetarySystem(cookie, {
        name: testStarName
      });

      const res = await request(app)
        .get(`/stars/${star_id}`)
        .set('Cookie', cookie);

      logIfFailed(res, 200, `GET /stars/${star_id} - Get by ID`);
      expect(res.status).toBe(200);
      expect(res.body.data).toEqual(
        expect.objectContaining({ star_id, name: testStarName })
      );
    });

    it('should allow selecting specific fields for a star', async () => {
      const { star_id } = await createTestPlanetarySystem(cookie);

      const res = await request(app)
        .get(`/stars/${star_id}?fields=name,mass_solar`)
        .set('Cookie', cookie);

      logIfFailed(res, 200, `GET /stars/${star_id} with fields`);
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty('name');
      expect(res.body.data).toHaveProperty('mass_solar');
      expect(res.body.data).not.toHaveProperty('star_id');
      expect(res.body.data).not.toHaveProperty('description');
      expect(res.body.data).not.toHaveProperty('radius_solar');
    });

    it('should filter stars by name', async () => {
      const uniqueName = `Filter-${Date.now()}`;
      await createTestPlanetarySystem(cookie, { name: uniqueName });

      const res = await request(app)
        .get(`/stars?name=${encodeURIComponent(uniqueName)}`)
        .set('Cookie', cookie);

      logIfFailed(res, 200, 'GET /stars?name=... - Filter by name');
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body.data.every((s: any) => s.name === uniqueName)).toBe(true);
    });

    it('should filter stars by mass_solar', async () => {
      await createTestPlanetarySystem(cookie);

      const res = await request(app)
        .get('/stars?mass_solar=1.0')
        .set('Cookie', cookie);

      logIfFailed(res, 200, 'GET /stars?mass_solar=1.0');
      expect(res.status).toBe(200);
      expect(res.body.data.some((s: any) => parseFloat(s.mass_solar) === 1.0)).toBe(true);
    });

    it('should filter stars by radius_solar', async () => {
      await createTestPlanetarySystem(cookie);

      const res = await request(app)
        .get('/stars?radius_solar=1.0')
        .set('Cookie', cookie);

      logIfFailed(res, 200, 'GET /stars?radius_solar=1.0');
      expect(res.status).toBe(200);
      expect(res.body.data.some((s: any) => parseFloat(s.radius_solar) === 1.0)).toBe(true);
    });
  });

  describe('🛠 Update Operations (PUT / PATCH)', () => {
    it('should fully update a star via PUT and verify the update', async () => {
      const starId = await createTestStar(cookie);

      const updatePayload = {
        name: 'Updated Star PUT',
        description: 'A fully updated star via PUT',
        mass_solar: 3.5,
        radius_solar: 2.1,
        thumbnail_url: 'https://example.com/updated-star-put.jpg'
      };

      const putRes = await request(app)
        .put(`/stars/${starId}`)
        .set('Cookie', cookie)
        .send(updatePayload);

      logIfFailed(putRes, 200, `PUT /stars/${starId} - Full update`);
      expect(putRes.status).toBe(200);

      const getRes = await request(app)
        .get(`/stars/${starId}`)
        .set('Cookie', cookie);

      expect(getRes.body.data).toMatchObject({
        ...updatePayload,
        mass_solar: updatePayload.mass_solar.toFixed(2),
        radius_solar: updatePayload.radius_solar.toFixed(2)
      });
    });

    it('should partially update a star via PATCH and verify the update', async () => {
      const starId = await createTestStar(cookie);
      const patchPayload = { mass_solar: 2.2 };

      const patchRes = await request(app)
        .patch(`/stars/${starId}`)
        .set('Cookie', cookie)
        .send(patchPayload);

      logIfFailed(patchRes, 200, `PATCH /stars/${starId} - Partial update`);
      expect(patchRes.body.updatedFields).toContain('mass_solar');

      const getRes = await request(app)
        .get(`/stars/${starId}`)
        .set('Cookie', cookie);

      expect(parseFloat(getRes.body.data.mass_solar)).toBe(patchPayload.mass_solar);
    });
  });

  describe('🚫 Disallowed Operations', () => {
    it('should return 405 on POST /stars', async () => {
      const res = await request(app)
        .post('/stars')
        .set('Cookie', cookie)
        .send({});

      logIfFailed(res, 405, 'POST /stars should be disallowed');
      expect(res.status).toBe(405);
    });

    it('should return 405 on DELETE /stars/:id', async () => {
      const starId = await createTestStar(cookie);

      const res = await request(app)
        .delete(`/stars/${starId}`)
        .set('Cookie', cookie);

      logIfFailed(res, 405, `DELETE /stars/${starId} should be disallowed`);
      expect(res.status).toBe(405);
    });
  });

  describe('❌ Validation and Error Handling', () => {
    it('should return 400 on PATCH with empty body', async () => {
      const starId = await createTestStar(cookie);

      const res = await request(app)
        .patch(`/stars/${starId}`)
        .set('Cookie', cookie)
        .send({});

      logIfFailed(res, 400, `PATCH /stars/${starId} with empty body`);
      expect(res.status).toBe(400);
    });

    it('should return 400 on PUT with invalid data types', async () => {
      const starId = await createTestStar(cookie);

      const res = await request(app)
        .put(`/stars/${starId}`)
        .set('Cookie', cookie)
        .send({
          name: 'Valid Name',
          description: 'Valid Description',
          mass_solar: 'not-a-number',
          radius_solar: 1.0,
          thumbnail_url: 'https://example.com/valid.jpg'
        });

      logIfFailed(res, 400, `PUT /stars/${starId} with invalid data type`);
      expect(res.status).toBe(400);
      expect(res.body.details.some((d: any) => d.path.includes('mass_solar'))).toBe(true);
    });

    it('should return 400 on GET /stars/:id with non-numeric ID', async () => {
      const res = await request(app)
        .get('/stars/not-a-number')
        .set('Cookie', cookie);

      logIfFailed(res, 400, 'GET /stars/not-a-number - Bad ID format');
      expect(res.status).toBe(400);
    });

    it('should return 404 on GET /stars/:id for non-existent star', async () => {
      const nonExistentId = 9999999;

      const res = await request(app)
        .get(`/stars/${nonExistentId}`)
        .set('Cookie', cookie);

      logIfFailed(res, 404, `GET /stars/${nonExistentId} - Not found`);
      expect(res.status).toBe(404);
    });
  });

  describe('🧪 Full View /stars/:id/full', () => {
    it('should return a full star with system and user info', async () => {
      const testSystem = await createTestPlanetarySystem(cookie, {
        name: `Full-${Date.now()}`
      });

      const { star_id } = testSystem;

      const res = await request(app)
        .get(`/stars/${star_id}/full`)
        .set('Cookie', cookie);

      logIfFailed(res, 200, `GET /stars/${star_id}/full - Full view`);
      expect(res.status).toBe(200);

      const star = res.body.data;

      expect(star).toHaveProperty('star_id', star_id);
      expect(star).toHaveProperty('system');
      expect(star.system).toHaveProperty('planetary_system_id', testSystem.planetary_system_id);
      expect(star.system).toHaveProperty('user');
      expect(star.system.user).toHaveProperty('user_id');
      expect(star.system.user).toHaveProperty('username');
      expect(star.system.user).not.toHaveProperty('email');
    });

    it('should return 404 for full view of non-existent star', async () => {
      const res = await request(app)
        .get('/stars/999999/full')
        .set('Cookie', cookie);

      logIfFailed(res, 404, 'GET /stars/999999/full - Not found');
      expect(res.status).toBe(404);
    });
  });
});
