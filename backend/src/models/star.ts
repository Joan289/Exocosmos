import { connection } from "../database/mysql.js";
import { Star, StarInput, StarPartialInput } from '../schemas/star.js';
import { StarFull } from "../schemas/star.full.js";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { buildQueryClauses, buildSetClause } from "../utils/query-builder.js";
import { QueryConfig, QueryOptions } from "../interfaces/query.js";
import { parseFilters, formatSQLColumns } from "../utils/parse.js";
import { PoolConnection } from 'mysql2/promise';

/**
 * Model for interacting with the 'stars' table.
 * 
 * Provides CRUD operations, dynamic queries and full joins.
 */
export class StarModel {
  // Fields included in basic SELECT queries
  static readonly selectFields = [
    'star_id',
    'name',
    'description',
    'mass_solar',
    'radius_solar',
    'thumbnail_url'
  ];

  // Query configuration for search, filtering and sorting
  static readonly queryConfig: QueryConfig = {
    searchable: ['name', 'description'],
    filterable: ['name', 'mass_solar', 'radius_solar'],
    sortable: ['star_id', 'name', 'mass_solar', 'radius_solar'],
    defaultSort: 'star_id'
  };

  // Parsers for processing query string filters
  static readonly filterParsers: Record<string, (value: unknown) => any> = {
    name: String,
    mass_solar: Number,
    radius_solar: Number
  };

  /**
   * Retrieve all stars with support for pagination, filtering and sorting.
   */
  static async getAll({ page, limit, sort, search, filters = {} }: QueryOptions): Promise<Star[]> {
    const parsedFilters = parseFilters(filters, this.filterParsers);
    const columns = formatSQLColumns(this.selectFields);

    const { whereSQL, sortSQL, pageSQL, values } = buildQueryClauses(
      { page, limit, sort, search, filters: parsedFilters },
      this.queryConfig
    );

    const query = `SELECT ${columns} FROM stars ${whereSQL} ${sortSQL} ${pageSQL}`;
    const [rows] = await connection.query<RowDataPacket[]>(query, values);
    return rows as Star[];
  }

  /**
   * Retrieve a single star by ID, optionally selecting specific fields.
   */
  static async getById(id: number, fields?: string[]): Promise<Star | undefined> {
    const columns = fields?.length
      ? formatSQLColumns(fields)
      : formatSQLColumns(this.selectFields);

    const query = `SELECT ${columns} FROM stars WHERE star_id = ?`;
    const [rows] = await connection.query<RowDataPacket[]>(query, [id]);
    return (rows as Star[])[0];
  }

  /**
   * Retrieve a star along with its planetary system and owning user.
   */
  static async getFull(id: number): Promise<StarFull | undefined> {
    const [rows] = await connection.query<RowDataPacket[]>(
      `
      SELECT
        s.star_id, s.name AS star_name, s.description AS star_description,
        s.mass_solar, s.radius_solar, s.thumbnail_url AS star_thumbnail,

        ps.planetary_system_id,
        ps.name AS system_name,
        ps.description AS system_description,
        ps.distance_ly,
        ps.thumbnail_url AS system_thumbnail,
        ps.user_id,

        u.username AS user_username,
        u.profile_picture_url AS user_profile_picture_url,
        u.created_at AS user_created_at

      FROM stars s
      JOIN planetary_systems ps ON ps.star_id = s.star_id
      JOIN users u ON ps.user_id = u.user_id
      WHERE s.star_id = ?
      `,
      [id]
    );

    if (!rows.length) return undefined;

    const row = rows[0];

    return {
      star_id: row.star_id,
      name: row.star_name,
      description: row.star_description,
      mass_solar: row.mass_solar,
      radius_solar: row.radius_solar,
      thumbnail_url: row.star_thumbnail,
      system: {
        star_id: row.star_id,
        planetary_system_id: row.planetary_system_id,
        name: row.system_name,
        description: row.system_description,
        distance_ly: row.distance_ly,
        thumbnail_url: row.system_thumbnail,
        user_id: row.user_id,
        user: {
          user_id: row.user_id,
          username: row.user_username,
          profile_picture_url: row.user_profile_picture_url,
          created_at: row.user_created_at
        }
      }
    };
  }

  /**
   * Insert a new star into the database.
   */
  static async create(star: StarInput): Promise<Star> {
    const { name, description, mass_solar, radius_solar, thumbnail_url } = star;

    const [result] = await connection.query<ResultSetHeader>(
      'INSERT INTO stars (name, description, mass_solar, radius_solar, thumbnail_url) VALUES (?, ?, ?, ?, ?)',
      [name, description, mass_solar, radius_solar, thumbnail_url]
    );

    return {
      star_id: result.insertId,
      ...star
    };
  }

  /**
   * Fully update a star by ID.
   */
  static async update(id: number, star: StarInput): Promise<boolean> {
    const { name, description, mass_solar, radius_solar, thumbnail_url } = star;

    const [result] = await connection.query<ResultSetHeader>(
      `UPDATE stars SET name = ?, description = ?, mass_solar = ?, radius_solar = ?, thumbnail_url = ? WHERE star_id = ?`,
      [name, description, mass_solar, radius_solar, thumbnail_url, id]
    );

    return result.affectedRows > 0;
  }

  /**
   * Partially update one or more fields of a star.
   */
  static async patch(id: number, updates: StarPartialInput): Promise<boolean> {
    if (Object.keys(updates).length === 0) return false;

    const { sql: setClause, values } = buildSetClause(updates);

    const [result] = await connection.query<ResultSetHeader>(
      `UPDATE stars SET ${setClause} WHERE star_id = ?`,
      [...values, id]
    );

    return result.affectedRows > 0;
  }

  /**
   * Delete a star by ID.
   * Supports optional external connection for transaction contexts.
   */
  static async delete(id: number, conn?: PoolConnection): Promise<boolean> {
    const localConn = conn ?? await connection.getConnection();

    try {
      const [result] = await localConn.query<ResultSetHeader>(
        'DELETE FROM stars WHERE star_id = ?',
        [id]
      );
      return result.affectedRows > 0;
    } finally {
      if (!conn) localConn.release();
    }
  }
}
