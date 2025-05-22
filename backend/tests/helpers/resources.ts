import request from 'supertest';
import app from '../../src/app.js';
import { randomUUID } from 'crypto';
import { AppError } from '../../src/middlewares/error.js';
import { logIfFailed } from '../helpers/log-if-failed.js';

function shortId(prefix: string): string {
  return `${prefix}-${randomUUID().slice(0, 12)}`;
}

/**
 * Create a planetary system and return its ID and the associated star ID.
 * @param cookie Auth cookie from the logged-in user
 * @param customData Optional overrides for the default payload
 */
export async function createTestPlanetarySystem(
  cookie: string[],
  customData: Partial<{
    name: string;
    description: string;
    distance_ly: number;
    thumbnail_url: string;
  }> = {}
): Promise<{ planetary_system_id: number; star_id: number; }> {
  const data = {
    name: customData.name || shortId('SYS'),
    description: customData.description || 'Test planetary system',
    distance_ly: customData.distance_ly ?? Math.floor(Math.random() * 100 + 1),
    thumbnail_url: customData.thumbnail_url || 'https://example.com/thumbnail.jpg'
  };

  const res = await request(app)
    .post('/planetary-systems')
    .set('Cookie', cookie)
    .send(data);

  logIfFailed(res, 201, 'Create planetary system');
  if (!res.body.data?.planetary_system_id || !res.body.data?.star_id) {
    throw new AppError(500, 'Test setup failed: Could not create planetary system', res.body);
  }

  return {
    planetary_system_id: res.body.data.planetary_system_id,
    star_id: res.body.data.star_id
  };
}

/**
 * Create a test star by creating a planetary system and returning its star_id.
 * @param cookie Auth cookie from the logged-in user
 * @param customData Optional overrides for the planetary system creation
 */
export async function createTestStar(
  cookie: string[],
  customData: Parameters<typeof createTestPlanetarySystem>[1] = {}
): Promise<number> {
  const { star_id } = await createTestPlanetarySystem(cookie, customData);
  return star_id;
}

/**
 * Create a compound in the local cache using its PubChem CID.
 * If already exists, it's okay (idempotent).
 * @param cookie Auth cookie
 * @param CID PubChem Compound ID
 */
export async function createTestCompound(cookie: string[], CID: number): Promise<void> {
  const res = await request(app)
    .post('/compounds')
    .set('Cookie', cookie)
    .send({ CID });

  logIfFailed(res, 201, 'Create compound');
  if (![200, 201].includes(res.status)) {
    throw new AppError(500, `Test setup failed: compound CID ${CID}`, res.body);
  }
}

/**
 * Create a planet with all required relations (compound, system, type, atmosphere)
 * @param cookie Auth cookie
 * @param overrides Optional overrides for planet data
 */
export async function createTestPlanet(
  cookie: string[],
  overrides: Partial<{
    name: string;
    compoundCID: number;
    planet_type_id: number;
    planetary_system_id: number;
    includeAtmosphere: boolean;
    moon_count: number;
  }> = {}
): Promise<{ planetId: number; name: string; planetary_system_id: number; }> {
  const compoundCID = overrides.compoundCID ?? 23987;
  const planet_type_id = overrides.planet_type_id ?? 1;

  const { planetary_system_id } = overrides.planetary_system_id
    ? { planetary_system_id: overrides.planetary_system_id }
    : await createTestPlanetarySystem(cookie);

  const name = overrides.name ?? shortId('PLT');

  const payload: any = {
    name,
    description: 'Test planet',
    mass_earth: 1.0,
    radius_earth: 1.0,
    inclination_deg: 0.5,
    rotation_speed_kms: 1.2,
    albedo: 0.3,
    star_distance_au: 1,
    has_rings: false,
    moon_count: overrides.moon_count ?? 1,
    surface_texture_url: 'https://example.com/surface.png',
    height_texture_url: 'https://example.com/height.png',
    thumbnail_url: 'https://example.com/thumb.png',
    planetary_system_id,
    planet_type_id,
    compounds: [{ CID: compoundCID, percentage: 42 }]
  };

  if (overrides.includeAtmosphere !== false) {
    payload.atmosphere = {
      pressure_atm: 1.0,
      greenhouse_factor: 0.95,
      texture_url: 'https://example.com/atm.png',
      compounds: [{ CID: compoundCID, percentage: 80 }]
    };
  }

  const res = await request(app)
    .post('/planets')
    .set('Cookie', cookie)
    .send(payload);

  logIfFailed(res, 201, 'Create planet');
  if (res.status !== 201) {
    throw new AppError(500, 'Test setup failed: planet', res.body);
  }

  return {
    planetId: res.body.data.planet_id,
    name,
    planetary_system_id
  };
}
