import request from 'supertest';
import { describe, it, expect, beforeEach } from 'vitest';
import { randomUUID } from 'crypto';
import app from '../src/app.js';
import { logIfFailed } from './helpers/log-if-failed.js';
import { registerAndLogin, getUniqueTestEmail, getUniqueTestUsername } from './helpers/auth.js';
import { createTestPlanet, createTestPlanetarySystem } from './helpers/resources.js';

let cookie: string[];

beforeEach(async () => {
  const email = getUniqueTestEmail();
  cookie = await registerAndLogin({ email });
});

describe('🪐 Planet API', () => {
  describe('🛠️ Creation and Retrieval', () => {
    it('should create a planet', async () => {
      const { planetId } = await createTestPlanet(cookie);
      expect(planetId).toBeTypeOf('number');
    });

    it('should get that planet and include compound and atmosphere info', async () => {
      const { planetId, name } = await createTestPlanet(cookie);

      const res = await request(app)
        .get(`/planets/${planetId}`)
        .set('Cookie', cookie);

      logIfFailed(res, 200, 'Get Planet');
      expect(res.status).toBe(200);
      expect(res.body.data.name).toBe(name);
      expect(Array.isArray(res.body.data.compounds)).toBe(true);
      expect(res.body.data.atmosphere).toHaveProperty('pressure_atm');
    });

    it('should return compounds and atmosphere when fetching all planets', async () => {
      const { name } = await createTestPlanet(cookie);
      const res = await request(app)
        .get('/planets')
        .set('Cookie', cookie);

      logIfFailed(res, 200, 'Get All Planets');

      expect(res.status).toBe(200);
      const planets = res.body.data;
      expect(Array.isArray(planets)).toBe(true);
      const target = planets.find((p: any) => p.name === name);
      expect(target).toBeDefined();
      expect(Array.isArray(target.compounds)).toBe(true);
      expect(target.atmosphere).toHaveProperty('pressure_atm');
      expect(Array.isArray(target.atmosphere.compounds)).toBe(true);
    });
  });

  describe('🔁 Update and Patch', () => {
    it('should update planet compounds and atmosphere', async () => {
      const { planetId, planetary_system_id } = await createTestPlanet(cookie);
      const name = `UpdPl-${randomUUID().slice(0, 13)}`;

      const res = await request(app)
        .put(`/planets/${planetId}`)
        .set('Cookie', cookie)
        .send({
          name,
          description: 'Updated',
          mass_earth: 2,
          radius_earth: 2,
          inclination_deg: 1,
          rotation_speed_kms: 1,
          albedo: 0.5,
          star_distance_au: 2,
          has_rings: false,
          moon_count: 1,
          surface_texture_url: 'https://example.com/surf2.png',
          height_texture_url: 'https://example.com/height2.png',
          thumbnail_url: 'https://example.com/thumb2.png',
          planetary_system_id,
          planet_type_id: 1,
          compounds: [{ CID: 23987, percentage: 30 }],
          atmosphere: {
            pressure_atm: 2,
            greenhouse_factor: 2,
            texture_url: 'https://example.com/atm2.png',
            compounds: [{ CID: 23987, percentage: 60 }]
          }
        });

      logIfFailed(res, 200, 'Update Planet');
      expect(res.status).toBe(200);
    });

    it('should return 404 on PUT to non-existent planet', async () => {
      const res = await request(app)
        .put('/planets/9999999')
        .set('Cookie', cookie)
        .send({
          name: 'Ghost Planet',
          description: null,
          mass_earth: 1,
          radius_earth: 1,
          inclination_deg: 0,
          rotation_speed_kms: 1,
          albedo: 0.3,
          star_distance_au: 1,
          has_rings: false,
          moon_count: 0,
          surface_texture_url: 'https://example.com/surf.png',
          height_texture_url: 'https://example.com/height.png',
          thumbnail_url: 'https://example.com/thumb.png',
          planetary_system_id: 1,
          planet_type_id: 1,
          compounds: [],
          atmosphere: null
        });

      logIfFailed(res, 404, 'PUT non-existent planet');
      expect(res.status).toBe(404);
    });

    it('should patch planet with partial updates including relations', async () => {
      const { planetId } = await createTestPlanet(cookie);
      const name = `PatPl-${randomUUID().slice(0, 13)}`;

      const res = await request(app)
        .patch(`/planets/${planetId}`)
        .set('Cookie', cookie)
        .send({
          name,
          compounds: [{ CID: 23987, percentage: 99 }],
          atmosphere: {
            pressure_atm: 5,
            greenhouse_factor: 5,
            texture_url: 'https://example.com/patched.png',
            compounds: [{ CID: 23987, percentage: 10 }]
          }
        });

      logIfFailed(res, 200, 'Patch Planet');
      expect(res.status).toBe(200);
    });

    it('should return 400 on PATCH with empty body', async () => {
      const { planetId } = await createTestPlanet(cookie);

      const res = await request(app)
        .patch(`/planets/${planetId}`)
        .set('Cookie', cookie)
        .send({});

      logIfFailed(res, 400, 'PATCH with empty body');
      expect(res.status).toBe(400);
    });

    it('should patch only pressure_atm without overwriting other atmosphere fields', async () => {
      const { planetId } = await createTestPlanet(cookie);

      await request(app)
        .patch(`/planets/${planetId}`)
        .set('Cookie', cookie)
        .send({
          atmosphere: {
            pressure_atm: 1.0,
            greenhouse_factor: 1.0,
            texture_url: 'https://example.com/atm.png',
            compounds: [{ CID: 23987, percentage: 20 }]
          }
        });

      const patchRes = await request(app)
        .patch(`/planets/${planetId}`)
        .set('Cookie', cookie)
        .send({
          atmosphere: { pressure_atm: 9.9 }
        });

      logIfFailed(patchRes, 200, 'Patch Only Pressure');
    });

    it('should remove atmosphere when patched with null', async () => {
      const { planetId } = await createTestPlanet(cookie);

      await request(app)
        .patch(`/planets/${planetId}`)
        .set('Cookie', cookie)
        .send({
          atmosphere: {
            pressure_atm: 1.5,
            greenhouse_factor: 1.1,
            texture_url: 'https://example.com/a.png',
            compounds: [{ CID: 23987, percentage: 50 }]
          }
        });

      const res = await request(app)
        .patch(`/planets/${planetId}`)
        .set('Cookie', cookie)
        .send({ atmosphere: null });

      logIfFailed(res, 200, 'Patch Remove Atmosphere');
      expect(res.status).toBe(200);
    });
  });

  describe('📥 Deletion and Rollback', () => {
    it('should rollback if compound insertion fails during planet creation', async () => {
      const badCID = -9999;
      const name = `FailPl-${randomUUID().slice(0, 13)}`;

      const res = await request(app)
        .post('/planets')
        .set('Cookie', cookie)
        .send({
          name,
          description: 'Planet with invalid compound',
          mass_earth: 1,
          radius_earth: 1,
          inclination_deg: 0,
          rotation_speed_kms: 1,
          albedo: 0.3,
          star_distance_au: 1,
          has_rings: false,
          moon_count: 0,
          surface_texture_url: 'https://example.com/surf.png',
          height_texture_url: 'https://example.com/height.png',
          thumbnail_url: 'https://example.com/thumb.png',
          planetary_system_id: 1,
          planet_type_id: 1,
          compounds: [{ CID: badCID, percentage: 50 }]
        });

      expect(res.status).toBeGreaterThanOrEqual(400);
    });

    it('should delete that planet', async () => {
      const { planetId } = await createTestPlanet(cookie);

      const res = await request(app)
        .delete(`/planets/${planetId}`)
        .set('Cookie', cookie);

      logIfFailed(res, 200, 'Delete Planet');
      expect(res.status).toBe(200);
    });

    it('should remove all compounds when patched with empty array', async () => {
      const { planetId } = await createTestPlanet(cookie);

      const res = await request(app)
        .patch(`/planets/${planetId}`)
        .set('Cookie', cookie)
        .send({
          compounds: []
        });

      logIfFailed(res, 200, 'Patch Remove All Compounds');
      expect(res.status).toBe(200);
    });
  });

  describe('🔍 Filters, Sorting and Pagination', () => {
    it('should filter planets using multiple query parameters', async () => {
      const { name, planetary_system_id } = await createTestPlanet(cookie);

      const res = await request(app)
        .get(`/planets?name=${encodeURIComponent(name)}&mass_earth=1&radius_earth=1&planetary_system_id=${planetary_system_id}&planet_type_id=1`)
        .set('Cookie', cookie);

      logIfFailed(res, 200, 'Filter Planets');
      expect(res.status).toBe(200);
    });

    it('should return 400 on invalid filter value (mass_earth)', async () => {
      const res = await request(app)
        .get('/planets?mass_earth=invalid')
        .set('Cookie', cookie);

      logIfFailed(res, 400, 'Invalid Filter');
      expect(res.status).toBe(400);
    });

    it('should sort planets by radius_earth descending', async () => {
      await createTestPlanet(cookie);

      const res = await request(app)
        .get('/planets?sort=-radius_earth')
        .set('Cookie', cookie);

      logIfFailed(res, 200, 'Sort Planets');
      expect(res.status).toBe(200);
    });

    it('should paginate planets using page and limit', async () => {
      await createTestPlanet(cookie);

      const res = await request(app)
        .get('/planets?page=1&limit=1')
        .set('Cookie', cookie);

      logIfFailed(res, 200, 'Paginate Planets');
      expect(res.status).toBe(200);
    });
  });

  describe('❌ Error Cases', () => {
    it('should not allow patching atmosphere partially if it did not exist before', async () => {
      const { planetId } = await createTestPlanet(cookie, { includeAtmosphere: false });

      const res = await request(app)
        .patch(`/planets/${planetId}`)
        .set('Cookie', cookie)
        .send({
          atmosphere: {
            pressure_atm: 5.5
          }
        });

      logIfFailed(res, 400, 'Patch Partial Atmosphere Without Existing');
      expect(res.status).toBe(400);
    });

    it('should reject atmosphere compound percentage sum > 100', async () => {
      const { planetary_system_id } = await createTestPlanetarySystem(cookie);

      const res = await request(app)
        .post('/planets')
        .set('Cookie', cookie)
        .send({
          name: 'OverAtmosphere',
          description: 'Too many atmosphere compounds',
          mass_earth: 1,
          radius_earth: 1,
          inclination_deg: 1,
          rotation_speed_kms: 1,
          albedo: 0.3,
          star_distance_au: 1,
          has_rings: false,
          moon_count: 1,
          surface_texture_url: 'https://example.com/surf.png',
          height_texture_url: 'https://example.com/height.png',
          thumbnail_url: 'https://example.com/thumb.png',
          planetary_system_id,
          planet_type_id: 1,
          atmosphere: {
            pressure_atm: 1.0,
            greenhouse_factor: 0.9,
            texture_url: 'https://example.com/atm.png',
            compounds: [
              { CID: 23987, percentage: 60 },
              { CID: 23988, percentage: 50 }
            ]
          }
        });

      logIfFailed(res, 400, 'Atmosphere compound percentage > 100');
      expect(res.status).toBe(400);
    });
  });

  describe('🔐 Security – Ownership', () => {
    it('should not allow creating a planet in another user’s planetary system', async () => {
      const otherUserCookie = await registerAndLogin({ email: getUniqueTestEmail() });

      const { planetary_system_id: foreignSystemId } = await createTestPlanetarySystem(otherUserCookie, {
        name: 'OtherSystem',
        description: 'Owned by someone else',
        distance_ly: 100,
        thumbnail_url: 'https://example.com/thumb.png'
      });

      const res = await request(app)
        .post('/planets')
        .set('Cookie', cookie)
        .send({
          name: 'IntruderPlanet',
          description: null,
          mass_earth: 1,
          radius_earth: 1,
          inclination_deg: 0,
          rotation_speed_kms: 1,
          albedo: 0.3,
          star_distance_au: 1,
          has_rings: false,
          moon_count: 0,
          surface_texture_url: 'https://example.com/surf.png',
          height_texture_url: 'https://example.com/height.png',
          thumbnail_url: 'https://example.com/thumb.png',
          planetary_system_id: foreignSystemId,
          planet_type_id: 1
        });

      logIfFailed(res, 403, 'Create on foreign system');
      expect(res.status).toBe(403);
    });

    it('should not allow updating a planet that belongs to another user', async () => {
      const otherUserCookie = await registerAndLogin({ email: getUniqueTestEmail() });
      const { planetId } = await createTestPlanet(otherUserCookie);

      const res = await request(app)
        .put(`/planets/${planetId}`)
        .set('Cookie', cookie)
        .send({
          name: 'Hacked',
          description: null,
          mass_earth: 1,
          radius_earth: 1,
          inclination_deg: 0,
          rotation_speed_kms: 1,
          albedo: 0.3,
          star_distance_au: 1,
          has_rings: false,
          moon_count: 0,
          surface_texture_url: 'https://example.com/surf.png',
          height_texture_url: 'https://example.com/height.png',
          thumbnail_url: 'https://example.com/thumb.png',
          planetary_system_id: 1,
          planet_type_id: 1,
          compounds: [],
          atmosphere: null
        });

      logIfFailed(res, 403, 'PUT on foreign planet');
      expect(res.status).toBe(403);
    });

    it('should not allow patching a planet that belongs to another user', async () => {
      const otherUserCookie = await registerAndLogin({ email: getUniqueTestEmail() });
      const { planetId } = await createTestPlanet(otherUserCookie);

      const res = await request(app)
        .patch(`/planets/${planetId}`)
        .set('Cookie', cookie)
        .send({ name: 'IntruderPatch' });

      logIfFailed(res, 403, 'PATCH on foreign planet');
      expect(res.status).toBe(403);
    });

    it('should not allow deleting a planet that belongs to another user', async () => {
      const otherUserCookie = await registerAndLogin({ email: getUniqueTestEmail() });
      const { planetId } = await createTestPlanet(otherUserCookie);

      const res = await request(app)
        .delete(`/planets/${planetId}`)
        .set('Cookie', cookie);

      logIfFailed(res, 403, 'DELETE on foreign planet');
      expect(res.status).toBe(403);
    });
  });

  describe('🧪 Planet Validation by Type', () => {
    describe('🚫 Should reject invalid configurations', () => {
      it('should reject planet with mass above max_mass', async () => {
        const { planetary_system_id } = await createTestPlanetarySystem(cookie);
        const res = await request(app)
          .post('/planets')
          .set('Cookie', cookie)
          .send({
            name: 'TooHeavy',
            description: 'Exceeds max_mass',
            mass_earth: 99,
            radius_earth: 1,
            inclination_deg: 0.1,
            rotation_speed_kms: 1,
            albedo: 0.3,
            star_distance_au: 1,
            has_rings: false,
            moon_count: 1,
            surface_texture_url: 'https://example.com/surf.png',
            height_texture_url: 'https://example.com/height.png',
            thumbnail_url: 'https://example.com/thumb.png',
            planetary_system_id,
            planet_type_id: 5
          });
        logIfFailed(res, 400, 'Mass exceeds limit');
        expect(res.status).toBe(400);
      });

      it('should reject planet with radius below min_radius', async () => {
        const { planetary_system_id } = await createTestPlanetarySystem(cookie);
        const res = await request(app)
          .post('/planets')
          .set('Cookie', cookie)
          .send({
            name: 'TooSmall',
            description: 'Below min_radius',
            mass_earth: 1,
            radius_earth: 0,
            inclination_deg: 0.1,
            rotation_speed_kms: 1,
            albedo: 0.3,
            star_distance_au: 1,
            has_rings: false,
            moon_count: 1,
            surface_texture_url: 'https://example.com/surf.png',
            height_texture_url: 'https://example.com/height.png',
            thumbnail_url: 'https://example.com/thumb.png',
            planetary_system_id,
            planet_type_id: 5
          });
        logIfFailed(res, 400, 'Radius below limit');
        expect(res.status).toBe(400);
      });

      it('should reject rings if planet type forbids them', async () => {
        const { planetary_system_id } = await createTestPlanetarySystem(cookie);
        const res = await request(app)
          .post('/planets')
          .set('Cookie', cookie)
          .send({
            name: 'RingForbidden',
            description: 'Has rings',
            mass_earth: 1,
            radius_earth: 1,
            inclination_deg: 0.1,
            rotation_speed_kms: 1,
            albedo: 0.3,
            star_distance_au: 1,
            has_rings: true,
            moon_count: 0,
            surface_texture_url: 'https://example.com/surf.png',
            height_texture_url: 'https://example.com/height.png',
            thumbnail_url: 'https://example.com/thumb.png',
            planetary_system_id,
            planet_type_id: 3
          });
        logIfFailed(res, 400, 'Rings forbidden by type');
        expect(res.status).toBe(400);
      });

      it('should reject too many moons if type has low limit', async () => {
        const { planetary_system_id } = await createTestPlanetarySystem(cookie);
        const res = await request(app)
          .post('/planets')
          .set('Cookie', cookie)
          .send({
            name: 'TooManyMoons',
            description: null,
            mass_earth: 1,
            radius_earth: 1,
            inclination_deg: 0.1,
            rotation_speed_kms: 1,
            albedo: 0.3,
            star_distance_au: 1,
            has_rings: false,
            moon_count: 10,
            surface_texture_url: 'https://example.com/surf.png',
            height_texture_url: 'https://example.com/height.png',
            thumbnail_url: 'https://example.com/thumb.png',
            planetary_system_id,
            planet_type_id: 4
          });
        logIfFailed(res, 400, 'Moon count too high');
        expect(res.status).toBe(400);
      });

      it('should reject PATCH that violates moon limit for the type', async () => {
        const { planetId } = await createTestPlanet(cookie, {
          planet_type_id: 4,
          moon_count: 0
        });

        const res = await request(app)
          .patch(`/planets/${planetId}`)
          .set('Cookie', cookie)
          .send({ moon_count: 3 });

        logIfFailed(res, 400, 'PATCH moon violation');
        expect(res.status).toBe(400);
      });
    });

    describe('✅ Should allow valid configurations', () => {
      it('should allow valid planet respecting type constraints', async () => {
        const { planetary_system_id } = await createTestPlanetarySystem(cookie);
        const name = getUniqueTestUsername();
        const res = await request(app)
          .post('/planets')
          .set('Cookie', cookie)
          .send({
            name,
            description: 'All constraints OK',
            mass_earth: 2,
            radius_earth: 2,
            inclination_deg: 1,
            rotation_speed_kms: 1,
            albedo: 0.3,
            star_distance_au: 1,
            has_rings: false,
            moon_count: 1,
            surface_texture_url: 'https://example.com/surf.png',
            height_texture_url: 'https://example.com/height.png',
            thumbnail_url: 'https://example.com/thumb.png',
            planetary_system_id,
            planet_type_id: 1,
            compounds: [{ CID: 23987, percentage: 25 }],
            atmosphere: {
              pressure_atm: 1.1,
              greenhouse_factor: 0.9,
              texture_url: 'https://example.com/atm.png',
              compounds: [{ CID: 23987, percentage: 40 }]
            }
          });
        logIfFailed(res, 201, 'Valid planet');
        expect(res.status).toBe(201);
      });
    });
  });

  describe('🌐 Full View – GET /planets/:id/full', () => {
    it('should return full planet info including system, star and user', async () => {
      const { planetId, planetary_system_id } = await createTestPlanet(cookie);

      const res = await request(app)
        .get(`/planets/${planetId}/full`)
        .set('Cookie', cookie);

      logIfFailed(res, 200, 'GET /planets/:id/full');
      expect(res.status).toBe(200);

      const planet = res.body.data;

      expect(planet).toHaveProperty('planet_id', planetId);
      expect(planet).toHaveProperty('system');
      expect(planet.system).toHaveProperty('planetary_system_id', planetary_system_id);

      expect(planet.system).toHaveProperty('user');
      expect(planet.system.user).toHaveProperty('user_id');
      expect(planet.system.user).toHaveProperty('username');
      expect(planet.system.user).not.toHaveProperty('email');

      expect(planet.system).toHaveProperty('star');
      expect(planet.system.star).toHaveProperty('star_id');
      expect(planet.system.star).toHaveProperty('name');
    });

    it('should return 404 for non-existent planet full view', async () => {
      const res = await request(app)
        .get('/planets/9999999/full')
        .set('Cookie', cookie);

      logIfFailed(res, 404, 'GET /planets/9999999/full - Not found');
      expect(res.status).toBe(404);
    });
  });
});