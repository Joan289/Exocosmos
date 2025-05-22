import request from 'supertest';
import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import path from 'path';
import fs from 'fs-extra';
import app from '../src/app.js';
import { getUniqueTestEmail, registerAndLogin } from './helpers/auth.js';
import { logIfFailed } from './helpers/log-if-failed.js';
import { createTestPlanetarySystem, createTestPlanet, createTestStar } from './helpers/resources.js';

const uploadDir = path.join('tests', '__files__', 'uploads');

afterAll(() => {
  fs.removeSync(uploadDir);
});

describe('🖼 Upload API', () => {
  let cookie: string[];
  let userId: number;

  beforeEach(async () => {
    const email = getUniqueTestEmail();
    cookie = await registerAndLogin({ email });
    const res = await request(app).get('/auth/me').set('Cookie', cookie);
    userId = res.body.data.user_id;
  });

  const resources = [
    {
      name: 'planetary_systems',
      endpoint: 'planetary-systems',
      type: 'thumbnail',
      folder: 'thumbnail',
      field: 'thumbnail_url'
    },
    {
      name: 'stars',
      endpoint: 'stars',
      type: 'thumbnail',
      folder: 'thumbnail',
      field: 'thumbnail_url'
    },
    {
      name: 'planets',
      endpoint: 'planets',
      type: 'thumbnail',
      folder: 'thumbnail',
      field: 'thumbnail_url'
    },
    {
      name: 'users',
      endpoint: 'users',
      type: 'profile_picture',
      folder: 'profile_picture',
      field: 'profile_picture_url'
    }
  ];

  for (const resource of resources) {
    describe(`${resource.name} image upload`, () => {
      let id: number;

      beforeEach(async () => {
        if (resource.name === 'users') {
          id = userId;
        } else if (resource.name === 'planetary_systems') {
          const { planetary_system_id } = await createTestPlanetarySystem(cookie);
          id = planetary_system_id;
        } else if (resource.name === 'stars') {
          id = await createTestStar(cookie);
        } else if (resource.name === 'planets') {
          const { planetId } = await createTestPlanet(cookie);
          id = planetId;
        }
      });

      it(`should upload image correctly for ${resource.name}`, async () => {
        const imagePath = path.join(__dirname, 'fixtures', 'test-image.jpg');
        const res = await request(app)
          .post(`/upload/${resource.name}/${id}/${resource.type}`)
          .set('Cookie', cookie)
          .attach('file', imagePath);

        logIfFailed(res, 200, `Upload ${resource.type} for ${resource.name}`);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('url');

        const expectedFilePath = path.join(
          uploadDir,
          resource.name,
          resource.folder,
          `${id}.jpg`
        );
        expect(fs.existsSync(expectedFilePath)).toBe(true);

        const getRes = await request(app)
          .get(`/${resource.endpoint}/${id}`)
          .set('Cookie', cookie);

        logIfFailed(getRes, 200, `Get ${resource.name} after upload`);
        expect(getRes.status).toBe(200);
        expect(getRes.body.data[resource.field]).toContain(
          `/uploads/${resource.name}/${resource.folder}/${id}.jpg`
        );
      });
    });
  }

  describe('❌ Invalid upload combinations', () => {
    const invalidCases = [
      { entity: 'stars', type: 'surface' },
      { entity: 'stars', type: 'height' },
      { entity: 'planetary_systems', type: 'atmosphere' },
      { entity: 'users', type: 'thumbnail' },
      { entity: 'planets', type: 'profile_picture' },
    ];

    for (const { entity, type } of invalidCases) {
      it(`should reject invalid upload type '${type}' for entity '${entity}'`, async () => {
        const res = await request(app)
          .post(`/upload/${entity}/999/${type}`)
          .set('Cookie', cookie);

        logIfFailed(res, 400, `Reject invalid upload path /upload/${entity}/999/${type}`);
        expect(res.status).toBe(400);
      });
    }
  });

  describe('🖼 Static image access from /uploads', () => {
    const publicDir = path.join('public', 'uploads');
    const entities = [
      { entity: 'users', folder: 'profile_picture' },
      { entity: 'planets', folder: 'thumbnail' },
      { entity: 'stars', folder: 'thumbnail' },
      { entity: 'planetary_systems', folder: 'thumbnail' }
    ];

    for (const { entity, folder } of entities) {
      it(`should serve at least one image for ${entity}`, async () => {
        const folderPath = path.join(publicDir, entity, folder);

        if (!fs.existsSync(folderPath)) throw new Error(`Missing folder: ${folderPath}`);

        const files = fs.readdirSync(folderPath).filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));
        if (files.length === 0) throw new Error(`No images found in ${folderPath}`);

        const filename = files[0];
        const url = `/uploads/${entity}/${folder}/${filename}`;

        const res = await request(app).get(url);
        expect(res.status).toBe(200);
        expect(res.headers['content-type']).toMatch(/^image\//);
      });
    }
  });

  describe('planets extra image types (surface, height)', () => {
    let id: number;

    beforeEach(async () => {
      const { planetId } = await createTestPlanet(cookie, {}, "Aguacate");
      id = planetId;
    });

    const types = ['surface', 'height'];

    for (const type of types) {
      it(`should upload ${type} image for planets`, async () => {
        const imagePath = path.join(__dirname, 'fixtures', 'test-image.jpg');
        const res = await request(app)
          .post(`/upload/planets/${id}/${type}`)
          .set('Cookie', cookie)
          .attach('file', imagePath);

        logIfFailed(res, 200, `Upload ${type} for planet`);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('url');

        const expectedFilePath = path.join(uploadDir, 'planets', type, `${id}.jpg`);
        expect(fs.existsSync(expectedFilePath)).toBe(true);
      });
    }
  });
});