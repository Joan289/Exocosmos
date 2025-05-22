import { connection } from '../database/mysql.js';
import { PlanetarySystem, PlanetarySystemInput, PlanetarySystemPatch } from '../schemas/planetary-system.js';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { StarModel } from './star.js';
import { QueryConfig, QueryOptions } from '../interfaces/query.js';
import { parseFilters, formatSQLColumns } from '../utils/parse.js';
import { buildQueryClauses, buildSetClause } from '../utils/query-builder.js';
import { PlanetarySystemFull } from '../schemas/planetary-system.full.js';

/**
 * Model for interacting with the 'planetary_systems' table.
 * 
 * Provides CRUD operations and full retrieval with joins.
 */
export class PlanetarySystemModel {
  // Fields used in SELECT queries
  static readonly selectFields = [
    'planetary_system_id',
    'name',
    'description',
    'distance_ly',
    'thumbnail_url',
    'user_id',
    'star_id'
  ];

  // Configuration for filtering, searching, sorting
  static readonly queryConfig: QueryConfig = {
    searchable: ['name', 'description'],
    filterable: ['name', 'distance_ly', 'user_id', 'star_id'],
    sortable: ['planetary_system_id', 'name', 'distance_ly'],
    defaultSort: 'planetary_system_id'
  };

  // Type parsers for query filters
  static readonly filterParsers: Record<string, (value: unknown) => any> = {
    name: String,
    distance_ly: Number,
    user_id: Number,
    star_id: Number
  };

  /**
   * Create a new planetary system and assign a default star.
   */
  static async create(data: PlanetarySystemInput, userId: number): Promise<PlanetarySystem> {
    const defaultStar = await StarModel.create({
      name: data.name,
      description: null,
      mass_solar: 1.0,
      radius_solar: 1.0,
      thumbnail_url: 'https://example.com/default-star.jpg'
    });

    const [result] = await connection.query<ResultSetHeader>(
      `INSERT INTO planetary_systems (name, description, distance_ly, thumbnail_url, user_id, star_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        data.name,
        data.description ?? null,
        data.distance_ly,
        data.thumbnail_url,
        userId,
        defaultStar.star_id
      ]
    );

    return {
      planetary_system_id: result.insertId,
      ...data,
      user_id: userId,
      star_id: defaultStar.star_id
    };
  }

  /**
   * Get a list of planetary systems with filters, sorting and pagination.
   */
  static async getAll({ page, limit, sort, search, filters = {} }: QueryOptions): Promise<PlanetarySystem[]> {
    const parsedFilters = parseFilters(filters, this.filterParsers);
    const columns = formatSQLColumns(this.selectFields);

    const { whereSQL, sortSQL, pageSQL, values } = buildQueryClauses(
      { page, limit, sort, search, filters: parsedFilters },
      this.queryConfig
    );

    const query = `SELECT ${columns} FROM planetary_systems ${whereSQL} ${sortSQL} ${pageSQL}`;
    const [rows] = await connection.query<RowDataPacket[]>(query, values);
    return rows as PlanetarySystem[];
  }

  /**
   * Get full details of a planetary system including its star, user and planets.
   */
  static async getFull(systemId: number): Promise<PlanetarySystemFull | null> {
    const [rows] = await connection.query<RowDataPacket[]>(`
      SELECT 
        ps.planetary_system_id, ps.name AS system_name, ps.description AS system_description,
        ps.distance_ly, ps.thumbnail_url AS system_thumbnail, ps.user_id,
        u.username AS user_username, u.created_at AS user_created_at, u.profile_picture_url AS user_profile_picture_url,
        s.star_id, s.name AS star_name, s.description AS star_description,
        s.mass_solar, s.radius_solar, s.thumbnail_url AS star_thumbnail,
        p.planet_id, p.name AS planet_name, p.description AS planet_description,
        p.mass_earth, p.radius_earth, p.inclination_deg, p.rotation_speed_kms, p.albedo,
        p.star_distance_au, p.has_rings, p.moon_count,
        p.surface_texture_url, p.height_texture_url, p.thumbnail_url AS planet_thumbnail, p.planet_type_id
      FROM planetary_systems ps
      JOIN users u ON ps.user_id = u.user_id
      JOIN stars s ON ps.star_id = s.star_id
      LEFT JOIN planets p ON ps.planetary_system_id = p.planetary_system_id
      WHERE ps.planetary_system_id = ?
      ORDER BY ps.planetary_system_id, p.planet_id
    `, [systemId]);

    if (!rows.length) return null;

    const base = rows[0];
    const system: PlanetarySystemFull = {
      planetary_system_id: base.planetary_system_id,
      name: base.system_name,
      description: base.system_description,
      distance_ly: base.distance_ly,
      thumbnail_url: base.system_thumbnail,
      user_id: base.user_id,
      star_id: base.star_id,
      user: {
        user_id: base.user_id,
        username: base.user_username,
        profile_picture_url: base.user_profile_picture_url,
        created_at: new Date(base.user_created_at)
      },
      star: {
        star_id: base.star_id,
        name: base.star_name,
        description: base.star_description,
        mass_solar: base.mass_solar,
        radius_solar: base.radius_solar,
        thumbnail_url: base.star_thumbnail
      },
      planets: []
    };

    for (const row of rows) {
      if (!row.planet_id) continue;

      system.planets.push({
        planet_id: row.planet_id,
        name: row.planet_name,
        description: row.planet_description,
        mass_earth: row.mass_earth,
        radius_earth: row.radius_earth,
        inclination_deg: row.inclination_deg,
        rotation_speed_kms: row.rotation_speed_kms,
        albedo: row.albedo,
        star_distance_au: row.star_distance_au,
        has_rings: row.has_rings,
        moon_count: row.moon_count,
        surface_texture_url: row.surface_texture_url,
        height_texture_url: row.height_texture_url,
        thumbnail_url: row.planet_thumbnail,
        planet_type_id: row.planet_type_id
      });
    }

    return system;
  }

  /**
   * Get a planetary system by ID, optionally with specific fields.
   */
  static async getById(id: number, fields?: string[]): Promise<PlanetarySystem | undefined> {
    const columns = fields?.length
      ? formatSQLColumns(fields)
      : formatSQLColumns(this.selectFields);

    const query = `SELECT ${columns} FROM planetary_systems WHERE planetary_system_id = ?`;
    const [rows] = await connection.query<RowDataPacket[]>(query, [id]);
    return rows[0] as PlanetarySystem | undefined;
  }

  /**
   * Full update of a planetary system.
   */
  static async update(id: number, data: PlanetarySystemInput): Promise<boolean> {
    const [result] = await connection.query<ResultSetHeader>(
      `UPDATE planetary_systems
       SET name = ?, description = ?, distance_ly = ?, thumbnail_url = ?
       WHERE planetary_system_id = ?`,
      [
        data.name,
        data.description ?? null,
        data.distance_ly,
        data.thumbnail_url,
        id
      ]
    );

    return result.affectedRows > 0;
  }

  /**
   * Partial update of a planetary system.
   */
  static async patch(id: number, updates: PlanetarySystemPatch): Promise<boolean> {
    if (Object.keys(updates).length === 0) return false;

    const { sql: setClause, values } = buildSetClause(updates);
    if (!setClause) return false;

    const [result] = await connection.query<ResultSetHeader>(
      `UPDATE planetary_systems SET ${setClause} WHERE planetary_system_id = ?`,
      [...values, id]
    );

    return result.affectedRows > 0;
  }

  /**
   * Delete a planetary system and its associated star in a transaction.
   */
  static async delete(id: number): Promise<boolean> {
    const system = await this.getById(id, ['planetary_system_id', 'star_id', 'user_id']);
    if (!system) return false;

    const conn = await connection.getConnection();
    try {
      await conn.beginTransaction();

      const [result] = await conn.query<ResultSetHeader>(
        `DELETE FROM planetary_systems WHERE planetary_system_id = ?`,
        [id]
      );

      if (result.affectedRows > 0) {
        await StarModel.delete(system.star_id, conn);
      } else {
        await conn.rollback();
        return false;
      }

      await conn.commit();
      return true;
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  }
}
