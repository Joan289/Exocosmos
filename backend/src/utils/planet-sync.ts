import { PoolConnection, RowDataPacket } from 'mysql2/promise';
import { AppError } from '../middlewares/error.js';
import { CompoundModel } from '../models/compound.js';
import { AtmospherePatchInput } from '../schemas/planet.js';

/**
 * Update, insert or delete the atmosphere of a planet.
 * 
 * - If atmosphere is `undefined`, no change is made.
 * - If atmosphere is `null`, it's deleted entirely.
 * - If atmosphere is a partial object:
 *   - it updates fields if it already exists
 *   - it inserts a new atmosphere if required fields are present
 *   - it replaces compounds if provided
 */
export async function updatePlanetAtmosphere(
  planet_id: number,
  atmosphere: AtmospherePatchInput | null | undefined,
  conn: PoolConnection
): Promise<void> {
  if (atmosphere === undefined) return; // no update

  if (atmosphere === null) {
    // delete atmosphere and compounds
    await conn.query(`DELETE FROM atmospheres_compounds WHERE planet_id = ?`, [planet_id]);
    await conn.query(`DELETE FROM atmospheres WHERE planet_id = ?`, [planet_id]);
    return;
  }

  // check if the atmosphere already exists
  const [rows] = await conn.query<RowDataPacket[]>(
    `SELECT COUNT(*) AS count FROM atmospheres WHERE planet_id = ?`,
    [planet_id]
  );
  const exists = rows[0].count > 0;

  // creating a new atmosphere requires all fields
  const hasAllRequiredFields =
    atmosphere.pressure_atm !== undefined &&
    atmosphere.greenhouse_factor !== undefined &&
    atmosphere.texture_url !== undefined;

  if (!exists && !hasAllRequiredFields) {
    throw new AppError(400, 'Cannot create partial atmosphere; all fields are required');
  }

  const fieldsToUpdate: string[] = [];
  const values: any[] = [];

  // build update field list
  if (atmosphere.pressure_atm !== undefined) {
    fieldsToUpdate.push('pressure_atm');
    values.push(atmosphere.pressure_atm);
  }
  if (atmosphere.greenhouse_factor !== undefined) {
    fieldsToUpdate.push('greenhouse_factor');
    values.push(atmosphere.greenhouse_factor);
  }
  if (atmosphere.texture_url !== undefined) {
    fieldsToUpdate.push('texture_url');
    values.push(atmosphere.texture_url);
  }

  // update or insert the atmosphere record
  if (exists && fieldsToUpdate.length > 0) {
    const updateSQL = `
      UPDATE atmospheres
      SET ${fieldsToUpdate.map(f => `${f} = ?`).join(', ')}
      WHERE planet_id = ?
    `;
    await conn.query(updateSQL, [...values, planet_id]);
  }

  if (!exists) {
    const insertSQL = `
      INSERT INTO atmospheres (planet_id, pressure_atm, greenhouse_factor, texture_url)
      VALUES (?, ?, ?, ?)
    `;
    await conn.query(insertSQL, [
      planet_id,
      atmosphere.pressure_atm,
      atmosphere.greenhouse_factor,
      atmosphere.texture_url
    ]);
  }

  // replace compounds if present
  if (Array.isArray(atmosphere.compounds)) {
    await conn.query(`DELETE FROM atmospheres_compounds WHERE planet_id = ?`, [planet_id]);
    for (const { CID, percentage } of atmosphere.compounds) {
      await CompoundModel.create({ CID }); // ensure CID exists
      await conn.query(
        `INSERT INTO atmospheres_compounds (planet_id, CID, percentage) VALUES (?, ?, ?)`,
        [planet_id, CID, percentage]
      );
    }
  }
}

/**
 * Update or replace the list of compounds associated with a planet.
 * 
 * Deletes existing compounds and re-inserts the provided ones.
 * If `compounds` is `undefined`, no change is made.
 */
export async function updatePlanetCompounds(
  planet_id: number,
  compounds: { CID: number; percentage: number; }[] | undefined,
  conn: PoolConnection
): Promise<void> {
  if (compounds === undefined) return;

  // remove existing compounds
  await conn.query(`DELETE FROM planets_compounds WHERE planet_id = ?`, [planet_id]);

  // insert new compounds
  for (const { CID, percentage } of compounds) {
    await CompoundModel.create({ CID }); // ensure CID exists
    await conn.query(
      `INSERT INTO planets_compounds (planet_id, CID, percentage) VALUES (?, ?, ?)`,
      [planet_id, CID, percentage]
    );
  }
}
