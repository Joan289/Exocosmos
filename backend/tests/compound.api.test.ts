import request from 'supertest';
import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import app from '../src/app.js';
import { logIfFailed } from './helpers/log-if-failed.js';
import { registerAndLogin } from './helpers/auth.js';
import { createTestCompound, createTestPlanetarySystem, createTestPlanet } from './helpers/resources.js';

const testCID = 962; // Water
const pubchemCID = 54681378; // Example compound CID

let cookie: string[];

beforeAll(async () => {
  cookie = await registerAndLogin();
  await createTestCompound(cookie, testCID);
});

describe('🧪 Compound API', () => {
  describe('✅ Core Operations', () => {
    it('should create a compound by fetching from PubChem', async () => {
      const cid = 12345 + Math.floor(Math.random() * 1000);
      const res = await request(app)
        .post('/compounds')
        .set('Cookie', cookie)
        .send({ CID: cid });

      if (res.status === 404) return; // CID aleatorio puede fallar en test real

      logIfFailed(res, 201, 'Create Compound');
      expect(res.status).toBe(201);
      expect(res.body.data).toHaveProperty('CID');
    });

    it('should get compound by ID', async () => {
      const res = await request(app)
        .get(`/compounds/${testCID}`)
        .set('Cookie', cookie);

      logIfFailed(res, 200, 'Get Compound by ID');
      expect(res.status).toBe(200);
      expect(res.body.data.CID).toBe(testCID);
    });

    it('should list all compounds', async () => {
      const res = await request(app)
        .get('/compounds')
        .set('Cookie', cookie);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('should allow creating multiple planets using the same compound CID', async () => {
      const compoundCID = 23987;
      const { planetary_system_id } = await createTestPlanetarySystem(cookie);

      const planet1 = await createTestPlanet(cookie, {
        compoundCID,
        planetary_system_id
      });

      const planet2 = await createTestPlanet(cookie, {
        compoundCID,
        planetary_system_id
      });

      expect(typeof planet1.planetId).toBe('number');
      expect(typeof planet2.planetId).toBe('number');
      expect(planet1.planetId).not.toBe(planet2.planetId);
    });
  });

  describe('🔎 Filtering', () => {
    it('should filter compounds by name', async () => {
      const res = await request(app)
        .get('/compounds?name=water')
        .set('Cookie', cookie);

      expect(res.status).toBe(200);
      expect(res.body.data.some((c: any) => c.name.toLowerCase() === 'water')).toBe(true);
    });

    it('should filter compounds by formula', async () => {
      const res = await request(app)
        .get('/compounds?formula=H2O')
        .set('Cookie', cookie);

      expect(res.status).toBe(200);
      expect(res.body.data.some((c: any) => c.formula === 'H2O')).toBe(true);
    });

    it('should return 405 on PUT /compounds/:id', async () => {
      const res = await request(app)
        .put(`/compounds/${testCID}`)
        .set('Cookie', cookie)
        .send({
          CID: testCID,
          name: 'Updatedium',
          formula: 'Upd'
        });

      expect(res.status).toBe(405);
    });

    it('should return 405 on PATCH /compounds/:id', async () => {
      const res = await request(app)
        .patch(`/compounds/${testCID}`)
        .set('Cookie', cookie)
        .send({ name: 'Patchedium' });

      expect(res.status).toBe(405);
    });

    it('should return 405 on DELETE /compounds/:id', async () => {
      const cidToDelete = 100000 + Math.floor(Math.random() * 1000);
      await createTestCompound(cookie, cidToDelete);

      const res = await request(app)
        .delete(`/compounds/${cidToDelete}`)
        .set('Cookie', cookie);

      expect(res.status).toBe(405);
    });
  });

  describe('🌐 PubChem Integration (via Planet)', () => {
    it('should fetch and insert a compound from PubChem when creating a planet', async () => {
      const { planetary_system_id } = await createTestPlanetarySystem(cookie);

      const planetPayload = {
        name: `Planet-${Date.now()}`,
        description: 'PubChem integration test',
        mass_earth: 1,
        radius_earth: 1,
        inclination_deg: 1,
        rotation_speed_kms: 1,
        albedo: 0.5,
        star_distance_au: 1,
        has_rings: false,
        moon_count: 1,
        surface_texture_url: 'https://example.com/surface.png',
        height_texture_url: 'https://example.com/height.png',
        thumbnail_url: 'https://example.com/thumb.png',
        planetary_system_id,
        planet_type_id: 1,
        compounds: [{ CID: pubchemCID, percentage: 25 }]
      };

      const res = await request(app)
        .post('/planets')
        .set('Cookie', cookie)
        .send(planetPayload);

      logIfFailed(res, 201, 'Fetch and Insert Compound via Planet');
      expect(res.status).toBe(201);

      const planetId = res.body.data?.planet_id;
      expect(typeof planetId).toBe('number');

      const planetRes = await request(app)
        .get(`/planets/${planetId}`)
        .set('Cookie', cookie);

      logIfFailed(planetRes, 200, 'Check planet contains compound');
      expect(planetRes.status).toBe(200);
      expect(planetRes.body.data.name).toBe(planetPayload.name);

      const compounds = planetRes.body.data.compounds;
      expect(Array.isArray(compounds)).toBe(true);
      const insertedCompound = compounds.find((c: any) => c.CID === pubchemCID);
      expect(insertedCompound).toBeDefined();
      expect(parseFloat(insertedCompound.percentage)).toBeCloseTo(25.0, 1);

      const compoundRes = await request(app)
        .get(`/compounds/${pubchemCID}`)
        .set('Cookie', cookie);

      logIfFailed(compoundRes, 200, 'Check compound exists after planet insert');
      expect(compoundRes.status).toBe(200);
      expect(compoundRes.body.data).toMatchObject({
        CID: pubchemCID,
        name: expect.any(String),
        formula: expect.any(String)
      });
    });
  });

  describe('❌ Error Cases', () => {
    it('should return 404 for non-existent compound', async () => {
      const res = await request(app)
        .get('/compounds/999999999')
        .set('Cookie', cookie);

      expect(res.status).toBe(404);
    });

    it('should fail to create without CID', async () => {
      const res = await request(app)
        .post('/compounds')
        .set('Cookie', cookie)
        .send({});

      expect(res.status).toBe(400);
    });

    it('should fail with invalid CID type', async () => {
      const res = await request(app)
        .post('/compounds')
        .set('Cookie', cookie)
        .send({ CID: 'abc' });

      expect(res.status).toBe(400);
    });

    it('should fail with CID that doesn’t exist in PubChem', async () => {
      const res = await request(app)
        .post('/compounds')
        .set('Cookie', cookie)
        .send({ CID: 999999999 });

      expect(res.status).toBe(404);
    });

    it('should fail with invalid CID param', async () => {
      const res = await request(app)
        .get('/compounds/not-a-cid')
        .set('Cookie', cookie);

      expect(res.status).toBe(400);
    });

    it('should fail gracefully if the CID does not exist in PubChem (via planet)', async () => {
      const fakeCID = 999999999;
      const { planetary_system_id } = await createTestPlanetarySystem(cookie);

      const res = await request(app)
        .post('/planets')
        .set('Cookie', cookie)
        .send({
          name: `Planet-${Date.now()}`,
          description: null,
          mass_earth: 1,
          radius_earth: 1,
          inclination_deg: 1,
          rotation_speed_kms: 1,
          albedo: 0.5,
          star_distance_au: 1,
          has_rings: false,
          moon_count: 1,
          surface_texture_url: 'https://example.com/surf.png',
          height_texture_url: 'https://example.com/height.png',
          thumbnail_url: 'https://example.com/thumb.png',
          planetary_system_id,
          planet_type_id: 1,
          compounds: [{ CID: fakeCID, percentage: 20 }]
        });

      logIfFailed(res, 404, 'Invalid CID in PubChem via planet');
      expect(res.status).toBe(404);
    });
  });
});