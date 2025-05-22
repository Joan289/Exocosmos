import request from 'supertest';
import { describe, it, expect, beforeEach } from 'vitest';
import app from '../src/app.js';
import { logIfFailed } from './helpers/log-if-failed.js';
import { registerAndLogin } from './helpers/auth.js';

let cookie: string[];

beforeEach(async () => {
  cookie = await registerAndLogin();
});

describe('Planet Type API', () => {
  describe('✅ Valid cases - Read', () => {
    it('should get a planet type by ID', async () => {
      const res = await request(app)
        .get('/planet-types/1')
        .set('Cookie', cookie);

      logIfFailed(res, 200, 'Get Planet Type by ID');
      expect(res.status).toBe(200);
      expect(res.body.data).toEqual(expect.objectContaining({
        planet_type_id: 1,
        name: expect.any(String),
        min_mass: expect.any(Number),
        max_mass: expect.any(Number),
        min_radius: expect.any(Number),
        max_radius: expect.any(Number),
        has_rings: expect.any(Number),
        has_surface: expect.any(Number),
        max_moons: expect.any(Number)
      }));
    });

    it('should list all planet types', async () => {
      const res = await request(app)
        .get('/planet-types')
        .set('Cookie', cookie);

      logIfFailed(res, 200, 'List all Planet Types');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body.data[0]).toEqual(expect.objectContaining({
        planet_type_id: expect.any(Number),
        name: expect.any(String)
      }));
    });
  });

  describe('❌ Invalid cases - Read', () => {
    it('should return 404 for non-existent planet type ID', async () => {
      const res = await request(app)
        .get('/planet-types/999999')
        .set('Cookie', cookie);

      logIfFailed(res, 404, 'Non-existent Planet Type ID');
      expect(res.status).toBe(404);
    });

    it('should return 400 for invalid ID format', async () => {
      const res = await request(app)
        .get('/planet-types/abc')
        .set('Cookie', cookie);

      logIfFailed(res, 400, 'Invalid ID format');
      expect(res.status).toBe(400);
    });
  });

  describe('❌ Invalid cases - Write', () => {
    it('should return 405 when trying to POST a planet type', async () => {
      const res = await request(app)
        .post('/planet-types')
        .set('Cookie', cookie)
        .send({
          name: 'New Type',
          min_mass: 0,
          max_mass: 10,
          min_radius: 0,
          max_radius: 10,
          has_rings: false,
          has_surface: true,
          max_moons: 5
        });

      logIfFailed(res, 405, 'POST /planet-types');
      expect(res.status).toBe(405);
    });

    it('should return 405 when trying to PUT a planet type', async () => {
      const res = await request(app)
        .put('/planet-types/1')
        .set('Cookie', cookie)
        .send({ name: 'Updated Type' });

      logIfFailed(res, 405, 'PUT /planet-types/:id');
      expect(res.status).toBe(405);
    });

    it('should return 405 when trying to DELETE a planet type', async () => {
      const res = await request(app)
        .delete('/planet-types/1')
        .set('Cookie', cookie);

      logIfFailed(res, 405, 'DELETE /planet-types/:id');
      expect(res.status).toBe(405);
    });
  });
});
