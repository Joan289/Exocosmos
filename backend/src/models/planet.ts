import { connection } from '../database/mysql.js';
import { Planet, PlanetFull, PlanetInput, PlanetPartialInput } from '../schemas/planet.js';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { buildQueryClauses, buildSetClause } from '../utils/query-builder.js';
import { parseFilters, formatSQLColumns } from '../utils/parse.js';
import { QueryConfig, QueryOptions } from '../interfaces/query.js';
import { CompoundModel } from './compound.js';
import { updatePlanetAtmosphere, updatePlanetCompounds } from '../utils/planet-sync.js';

/**
 * Model for interacting with the 'planets' table.
 * 
 * Supports full CRUD, relational loading and sync with compounds and atmospheres.
 */
export class PlanetModel {
  // Fields used for insertion and updates
  static readonly planetFields = [
    'name', 'description', 'mass_earth', 'radius_earth', 'inclination_deg', 'rotation_speed_kms',
    'albedo', 'star_distance_au', 'has_rings', 'moon_count',
    'surface_texture_url', 'height_texture_url', 'thumbnail_url',
    'planetary_system_id', 'planet_type_id'
  ];

  // Full list of selected fields
  static readonly selectFields = ['planet_id', ...PlanetModel.planetFields];

  // Query config for filtering, sorting and searching
  static readonly queryConfig: QueryConfig = {
    searchable: ['name', 'description'],
    filterable: [
      'name', 'description', 'mass_earth', 'radius_earth', 'inclination_deg',
      'rotation_speed_kms', 'albedo', 'star_distance_au', 'has_rings', 'moon_count',
      'planetary_system_id', 'planet_type_id'
    ],
    sortable: [
      'planet_id', 'name', 'mass_earth', 'radius_earth',
      'inclination_deg', 'rotation_speed_kms',
      'albedo', 'star_distance_au', 'moon_count'
    ],
    defaultSort: 'planet_id'
  };

  // Filter value parsers
  static readonly filterParsers: Record<string, (value: unknown) => any> = {
    name: String,
    description: String,
    mass_earth: Number,
    radius_earth: Number,
    inclination_deg: Number,
    rotation_speed_kms: Number,
    albedo: Number,
    star_distance_au: Number,
    has_rings: v => v === 'true' || v === true || v === '1',
    moon_count: Number,
    planetary_system_id: Number,
    planet_type_id: Number
  };

  /**
   * Retrieve list of planets with filters, pagination and relations.
   */
  static async getAll(options: QueryOptions): Promise<Planet[]> {
    const parsedFilters = parseFilters(options.filters || {}, this.filterParsers);
    const columns = formatSQLColumns(this.selectFields);
    const { whereSQL, sortSQL, pageSQL, values } = buildQueryClauses(
      { ...options, filters: parsedFilters },
      this.queryConfig
    );

    const planetQuery = `SELECT ${columns} FROM planets ${whereSQL} ${sortSQL} ${pageSQL}`;
    const [planetRows] = await connection.query<RowDataPacket[]>(planetQuery, values);
    const planets = planetRows as Planet[];

    if (planets.length === 0) return [];

    const planetIds = planets.map(p => p.planet_id);

    // Load planet-compound associations
    const [compoundRows] = await connection.query<RowDataPacket[]>(
      `SELECT pc.planet_id, pc.CID, pc.percentage, c.name, c.formula
       FROM planets_compounds pc
       JOIN compounds c ON pc.CID = c.CID
       WHERE pc.planet_id IN (?)`,
      [planetIds]
    );

    // Load atmospheres and atmosphere-compounds
    const [atmosphereRows] = await connection.query<RowDataPacket[]>(
      `SELECT a.planet_id, a.pressure_atm, a.greenhouse_factor, a.texture_url
       FROM atmospheres a
       WHERE a.planet_id IN (?)`,
      [planetIds]
    );

    const [atmCompoundRows] = await connection.query<RowDataPacket[]>(
      `SELECT ac.planet_id, ac.CID, ac.percentage, c.name, c.formula
       FROM atmospheres_compounds ac
       JOIN compounds c ON ac.CID = c.CID
       WHERE ac.planet_id IN (?)`,
      [planetIds]
    );

    // Map data by planet ID
    const compoundMap = new Map<number, any[]>();
    for (const row of compoundRows) {
      if (!compoundMap.has(row.planet_id)) compoundMap.set(row.planet_id, []);
      compoundMap.get(row.planet_id)!.push({
        CID: row.CID,
        percentage: row.percentage,
        name: row.name,
        formula: row.formula
      });
    }

    const atmMap = new Map<number, any>();
    for (const row of atmosphereRows) {
      atmMap.set(row.planet_id, {
        pressure_atm: row.pressure_atm,
        greenhouse_factor: row.greenhouse_factor,
        texture_url: row.texture_url,
        compounds: []
      });
    }

    for (const row of atmCompoundRows) {
      const atm = atmMap.get(row.planet_id);
      if (atm) {
        atm.compounds.push({
          CID: row.CID,
          percentage: row.percentage,
          name: row.name,
          formula: row.formula
        });
      }
    }

    // Attach compounds and atmospheres to planets
    for (const planet of planets) {
      planet.compounds = compoundMap.get(planet.planet_id) || [];
      planet.atmosphere = atmMap.get(planet.planet_id);
    }

    return planets;
  }

  /**
   * Get a planet by ID, with optional fields and full compound/atmosphere info.
   */
  static async getById(id: number, fields?: string[]): Promise<Planet | undefined> {
    const columns = fields?.length ? formatSQLColumns(fields) : formatSQLColumns(this.selectFields);

    const [rows] = await connection.query<RowDataPacket[]>(
      `SELECT ${columns} FROM planets WHERE planet_id = ?`,
      [id]
    );
    const planet = (rows as Planet[])[0];
    if (!planet) return;

    const [compounds] = await connection.query<RowDataPacket[]>(
      `SELECT pc.CID, pc.percentage, c.name, c.formula
       FROM planets_compounds pc
       JOIN compounds c ON pc.CID = c.CID
       WHERE pc.planet_id = ?`,
      [id]
    );

    planet.compounds = compounds;

    const [atm] = await connection.query<RowDataPacket[]>(
      `SELECT pressure_atm, greenhouse_factor, texture_url FROM atmospheres WHERE planet_id = ?`,
      [id]
    );

    if (atm[0]) {
      const [atmCompounds] = await connection.query<RowDataPacket[]>(
        `SELECT ac.CID, ac.percentage, c.name, c.formula
         FROM atmospheres_compounds ac
         JOIN compounds c ON ac.CID = c.CID
         WHERE ac.planet_id = ?`,
        [id]
      );
      atm[0].compounds = atmCompounds;
      planet.atmosphere = atm[0];
    }

    return planet;
  }

  /**
   * Get a planet with full system, star and user data.
   */
  static async getFull(id: number): Promise<PlanetFull | undefined> {
    const planet = await this.getById(id);
    if (!planet) return;

    const [rows] = await connection.query<RowDataPacket[]>(
      `SELECT 
        ps.planetary_system_id, ps.name AS system_name, ps.description AS system_description,
        ps.distance_ly, ps.thumbnail_url AS system_thumbnail, ps.user_id, ps.star_id,
        s.name AS star_name, s.description AS star_description,
        s.mass_solar, s.radius_solar, s.thumbnail_url AS star_thumbnail,
        u.username, u.profile_picture_url, u.created_at
       FROM planetary_systems ps
       JOIN stars s ON ps.star_id = s.star_id
       JOIN users u ON ps.user_id = u.user_id
       WHERE ps.planetary_system_id = ?`,
      [planet.planetary_system_id]
    );

    if (!rows.length) return;

    const row = rows[0];

    return {
      ...planet,
      system: {
        planetary_system_id: planet.planetary_system_id,
        name: row.system_name,
        description: row.system_description,
        distance_ly: row.distance_ly,
        thumbnail_url: row.system_thumbnail,
        user_id: row.user_id,
        star_id: row.star_id,
        user: {
          user_id: row.user_id,
          username: row.username,
          profile_picture_url: row.profile_picture_url,
          created_at: row.created_at
        },
        star: {
          star_id: row.star_id,
          name: row.star_name,
          description: row.star_description,
          mass_solar: row.mass_solar,
          radius_solar: row.radius_solar,
          thumbnail_url: row.star_thumbnail
        }
      }
    };
  }

  /**
   * Create a planet with related compounds and atmosphere data.
   */
  static async create(data: PlanetInput): Promise<Planet> {
    const conn = await connection.getConnection();
    try {
      await conn.beginTransaction();

      const placeholders = this.planetFields.map(() => '?').join(', ');
      const values = this.planetFields.map(f => (data as any)[f]);
      const insertSQL = `INSERT INTO planets (${this.planetFields.join(', ')}) VALUES (${placeholders})`;

      const [result] = await conn.query<ResultSetHeader>(insertSQL, values);
      const planet_id = result.insertId;

      for (const { CID, percentage } of data.compounds ?? []) {
        await CompoundModel.create({ CID });
        await conn.query(
          `INSERT INTO planets_compounds (planet_id, CID, percentage) VALUES (?, ?, ?)`,
          [planet_id, CID, percentage]
        );
      }

      if (data.atmosphere) {
        const { pressure_atm, greenhouse_factor, texture_url, compounds: atmCompounds = [] } = data.atmosphere;

        await conn.query(
          `INSERT INTO atmospheres (planet_id, pressure_atm, greenhouse_factor, texture_url)
           VALUES (?, ?, ?, ?)`,
          [planet_id, pressure_atm, greenhouse_factor, texture_url]
        );

        for (const { CID, percentage } of atmCompounds) {
          await CompoundModel.create({ CID });
          await conn.query(
            `INSERT INTO atmospheres_compounds (planet_id, CID, percentage) VALUES (?, ?, ?)`,
            [planet_id, CID, percentage]
          );
        }
      }

      await conn.commit();
      return await this.getById(planet_id) as Planet;
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  }

  /**
   * Full update of a planet including compounds and atmosphere.
   */
  static async update(id: number, data: PlanetInput): Promise<boolean> {
    const conn = await connection.getConnection();
    try {
      await conn.beginTransaction();

      const updateSQL = `UPDATE planets SET ${this.planetFields.map(f => `${f}=?`).join(', ')} WHERE planet_id = ?`;
      const values = [...this.planetFields.map(f => (data as any)[f]), id];

      const [result] = await conn.query<ResultSetHeader>(updateSQL, values);
      if (result.affectedRows === 0) {
        await conn.rollback();
        return false;
      }

      await updatePlanetCompounds(id, data.compounds, conn);
      await updatePlanetAtmosphere(id, data.atmosphere, conn);

      await conn.commit();
      return true;
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  }

  /**
   * Partial update of a planet, including selective compound/atmosphere updates.
   */
  static async patch(id: number, updates: PlanetPartialInput): Promise<boolean> {
    const conn = await connection.getConnection();
    try {
      await conn.beginTransaction();

      const { compounds, atmosphere, ...planetUpdates } = updates;

      let result;
      if (Object.keys(planetUpdates).length > 0) {
        const { sql: setClause, values } = buildSetClause(planetUpdates);
        [result] = await conn.query<ResultSetHeader>(
          `UPDATE planets SET ${setClause} WHERE planet_id = ?`,
          [...values, id]
        );
      }

      await updatePlanetCompounds(id, compounds, conn);
      await updatePlanetAtmosphere(id, atmosphere, conn);

      await conn.commit();
      return true;
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  }

  /**
   * Delete a planet by ID.
   */
  static async delete(id: number): Promise<boolean> {
    const [result] = await connection.query<ResultSetHeader>(
      `DELETE FROM planets WHERE planet_id = ?`,
      [id]
    );
    return result.affectedRows > 0;
  }
}
