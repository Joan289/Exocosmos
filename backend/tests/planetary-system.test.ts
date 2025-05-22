import request from 'supertest';
import { describe, it, expect, beforeEach } from 'vitest';
import app from '../src/app.js';
import { logIfFailed } from './helpers/log-if-failed.js';
import { registerAndLogin } from './helpers/auth.js';
import { createTestPlanet, createTestPlanetarySystem } from './helpers/resources.js';
import { randomUUID } from 'crypto';
import * as StarModel from '../src/models/star.js';
import { C } from 'vitest/dist/chunks/reporters.d.CfRkRKN2.js';

let cookie: string[];

beforeEach(async () => {
  cookie = await registerAndLogin();
});

describe('Planetary System API', () => {
  describe('🌌 Lifecycle', () => {
    it('should create, retrieve and delete a planetary system and its star', async () => {
      const name = `Sys-${randomUUID().slice(0, 15)}`;

      const { planetary_system_id, star_id } = await createTestPlanetarySystem(cookie, {
        name,
        description: 'System near Gliese 581',
        distance_ly: 20,
        thumbnail_url: 'https://example.com/system.jpg'
      });

      const getRes = await request(app)
        .get(`/planetary-systems/${planetary_system_id}`)
        .set('Cookie', cookie);

      logIfFailed(getRes, 200, 'Get planetary system');
      expect(getRes.status).toBe(200);
      expect(getRes.body.data).toMatchObject({
        planetary_system_id,
        name
      });

      const deleteRes = await request(app)
        .delete(`/planetary-systems/${planetary_system_id}`)
        .set('Cookie', cookie);

      logIfFailed(deleteRes, 200, 'Delete planetary system');
      expect(deleteRes.status).toBe(200);

      const getDeletedSystemRes = await request(app)
        .get(`/planetary-systems/${planetary_system_id}`)
        .set('Cookie', cookie);
      expect(getDeletedSystemRes.status).toBe(404);

      const getDeletedStarRes = await request(app)
        .get(`/stars/${star_id}`)
        .set('Cookie', cookie);
      expect(getDeletedStarRes.status).toBe(404);
    });

    it('should rollback if deleting star fails', async () => {
      const { planetary_system_id } = await createTestPlanetarySystem(cookie, {
        name: `Rollback-${randomUUID().slice(0, 10)}`,
        description: 'Rollback test',
        distance_ly: 50,
        thumbnail_url: 'https://example.com/rollback.jpg'
      });

      const originalDelete = StarModel.StarModel.delete;
      StarModel.StarModel.delete = async () => {
        throw new Error('Simulated delete failure');
      };

      const res = await request(app)
        .delete(`/planetary-systems/${planetary_system_id}`)
        .set('Cookie', cookie);

      logIfFailed(res, 500, 'Rollback deletion');
      expect(res.status).toBe(500);
      expect(res.body.message).toMatch(/simulated/i);

      StarModel.StarModel.delete = originalDelete;

      const stillThere = await request(app)
        .get(`/planetary-systems/${planetary_system_id}`)
        .set('Cookie', cookie);
      expect(stillThere.status).toBe(200);
    });
  });

  describe('✏️ Update & Access Control', () => {
    let systemId: number;
    let starId: number;

    beforeEach(async () => {
      const res = await createTestPlanetarySystem(cookie, {
        name: 'Updatable System',
        description: 'To be updated',
        distance_ly: 45,
        thumbnail_url: 'https://example.com/update.jpg'
      });

      systemId = res.planetary_system_id;
      starId = res.star_id;
    });

    it('should update a planetary system fully (PUT)', async () => {
      const res = await request(app)
        .put(`/planetary-systems/${systemId}`)
        .set('Cookie', cookie)
        .send({
          name: 'Updated Name',
          description: 'Updated desc',
          distance_ly: 88,
          thumbnail_url: 'https://example.com/updated.jpg'
        });

      logIfFailed(res, 200, 'Full update');
      expect(res.status).toBe(200);

      const check = await request(app)
        .get(`/planetary-systems/${systemId}`)
        .set('Cookie', cookie);

      expect(check.body.data).toMatchObject({
        name: 'Updated Name',
        description: 'Updated desc',
        distance_ly: 88
      });
    });

    it('should patch a planetary system (PATCH)', async () => {
      const res = await request(app)
        .patch(`/planetary-systems/${systemId}`)
        .set('Cookie', cookie)
        .send({ distance_ly: 99 });

      logIfFailed(res, 200, 'Patch update');
      expect(res.status).toBe(200);

      const check = await request(app)
        .get(`/planetary-systems/${systemId}`)
        .set('Cookie', cookie);

      expect(check.body.data.distance_ly).toBe(99);
    });

    it('should forbid deleting a system from another user', async () => {
      const otherCookie = await registerAndLogin();

      const res = await request(app)
        .delete(`/planetary-systems/${systemId}`)
        .set('Cookie', otherCookie);

      logIfFailed(res, 403, 'Forbidden delete by other user');
      expect(res.status).toBe(403);
    });
  });

  describe('🔎 Query – By User ID', () => {
    it('should return only the planetary systems of the specified user', async () => {
      const user1Cookie = await registerAndLogin();
      const user2Cookie = await registerAndLogin();

      const { planetary_system_id: system1Id } = await createTestPlanetarySystem(user1Cookie, { name: 'User1-System' });
      const { planetary_system_id: system2Id } = await createTestPlanetarySystem(user2Cookie, { name: 'User2-System' });

      const meRes = await request(app).get('/auth/me').set('Cookie', user1Cookie);
      const user1Id = meRes.body.data.user_id;

      const res = await request(app)
        .get(`/planetary-systems?user_id=${user1Id}`)
        .set('Cookie', user2Cookie);

      logIfFailed(res, 200, 'Get systems by user_id');
      expect(res.status).toBe(200);

      const ids = res.body.data.map((sys: any) => sys.planetary_system_id);

      expect(res.body.data.some((sys: any) => sys.planetary_system_id === system1Id)).toBe(true);
      expect(res.body.data.some((sys: any) => sys.planetary_system_id === system2Id)).toBe(false);
    });
  });

  describe('🔐 Security – Ownership', () => {
    it('should not allow updating a planetary system of another user (PUT)', async () => {
      const otherCookie = await registerAndLogin();
      const { planetary_system_id } = await createTestPlanetarySystem(otherCookie);

      const res = await request(app)
        .put(`/planetary-systems/${planetary_system_id}`)
        .set('Cookie', cookie)
        .send({
          name: 'Intruder Update',
          description: 'Trying to update',
          distance_ly: 123,
          thumbnail_url: 'https://example.com/hack.jpg'
        });

      logIfFailed(res, 403, 'PUT foreign system');
      expect(res.status).toBe(403);
    });

    it('should not allow patching a planetary system of another user', async () => {
      const otherCookie = await registerAndLogin();
      const { planetary_system_id } = await createTestPlanetarySystem(otherCookie);

      const res = await request(app)
        .patch(`/planetary-systems/${planetary_system_id}`)
        .set('Cookie', cookie)
        .send({ name: 'HackedPatch' });

      logIfFailed(res, 403, 'PATCH foreign system');
      expect(res.status).toBe(403);
    });

    it('should return 404 if system does not exist (PUT)', async () => {
      const res = await request(app)
        .put('/planetary-systems/9999999')
        .set('Cookie', cookie)
        .send({
          name: 'Ghost System',
          description: null,
          distance_ly: 100,
          thumbnail_url: 'https://example.com/ghost.png'
        });

      logIfFailed(res, 404, 'PUT non-existent system');
      expect(res.status).toBe(404);
    });

    it('should return 404 if system does not exist (PATCH)', async () => {
      const res = await request(app)
        .patch('/planetary-systems/9999999')
        .set('Cookie', cookie)
        .send({ distance_ly: 999 });

      logIfFailed(res, 404, 'PATCH non-existent system');
      expect(res.status).toBe(404);
    });

    it('should return 404 if system does not exist (DELETE)', async () => {
      const res = await request(app)
        .delete('/planetary-systems/9999999')
        .set('Cookie', cookie);

      logIfFailed(res, 404, 'DELETE non-existent system');
      expect(res.status).toBe(404);
    });
  });

  describe('🧪 Planetary System Full View', () => {
    it('should return a full planetary system by ID with user, star and planets', async () => {
      const userCookie = await registerAndLogin();

      const meRes = await request(app).get('/auth/me').set('Cookie', userCookie);
      const userData = meRes.body.data;

      const { planetary_system_id } = await createTestPlanetarySystem(userCookie);
      await createTestPlanet(userCookie, { planetary_system_id });

      const fullRes = await request(app)
        .get(`/planetary-systems/${planetary_system_id}/full`)
        .set('Cookie', userCookie);

      logIfFailed(fullRes, 200, 'Get full planetary system');
      expect(fullRes.status).toBe(200);

      const system = fullRes.body.data;

      expect(system).toBeDefined();
      expect(system).toHaveProperty('planetary_system_id', planetary_system_id);
      expect(system).toHaveProperty('star');
      expect(system).toHaveProperty('planets');
      expect(system).toHaveProperty('user');
      expect(system).toHaveProperty('user_id', userData.user_id);

      expect(system.user).toMatchObject({
        user_id: userData.user_id,
        username: userData.username,
      });

      expect(Array.isArray(system.planets)).toBe(true);
      expect(system.planets.length).toBeGreaterThanOrEqual(1);
    });
  });


});