import { connection } from '../database/mysql.js';
import {
  User,
  CreateUserInput,
  UpdateUserInput,
  UserPatchInput,
  PrivateUser
} from '../schemas/user.js';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { QueryConfig, QueryOptions } from '../interfaces/query.js';
import { buildQueryClauses, buildSetClause } from '../utils/query-builder.js';
import { parseFilters, formatSQLColumns, filterAllowedFields } from '../utils/parse.js';
import { PrivateUserWithPassword } from '../schemas/user.js';

/**
 * Model for interacting with the 'users' table.
 * 
 * Provides standard CRUD operations and custom queries.
 */
export class UserModel {

  // Public fields returned in general responses
  static readonly selectFields = [
    'user_id',
    'username',
    'profile_picture_url',
    'created_at'
  ];

  // Fields returned in authenticated/private contexts
  static readonly selectFieldsPrivate = [
    'user_id',
    'username',
    'email',
    'profile_picture_url',
    'created_at'
  ];

  // Allowed fields for safe filtering in public contexts
  static readonly allowedFieldsPrivate = new Set([
    'user_id',
    'username',
    'email',
    'profile_picture_url',
    'created_at'
  ]);

  static readonly allowedFields = new Set([
    'user_id',
    'username',
    'profile_picture_url',
    'created_at'
  ]);

  // Configuration for dynamic query builder
  static readonly queryConfig: QueryConfig = {
    searchable: ['username'],
    filterable: ['username', 'created_at'],
    sortable: ['user_id', 'username', 'created_at'],
    defaultSort: 'user_id'
  };

  // Parsing rules for filter values
  static readonly filterParsers: Record<string, (value: unknown) => any> = {
    username: String,
    email: String
  };

  /**
   * Get all users with support for pagination, filtering, sorting and searching.
   */
  static async getAll(options: QueryOptions): Promise<User[]> {
    const parsedFilters = parseFilters(options.filters || {}, this.filterParsers);
    const columns = formatSQLColumns(this.selectFields);

    const { whereSQL, sortSQL, pageSQL, values } = buildQueryClauses(
      { ...options, filters: parsedFilters },
      this.queryConfig
    );

    const query = `SELECT ${columns} FROM users ${whereSQL} ${sortSQL} ${pageSQL}`;
    const [rows] = await connection.query<RowDataPacket[]>(query, values);
    return rows as User[];
  }

  /**
   * Get a single user by ID, with optional field selection.
   */
  static async getById(id: number, fields?: string[]): Promise<User | undefined> {
    const filteredFields = fields?.length
      ? filterAllowedFields(fields, this.allowedFields)
      : this.selectFields;

    const columns = formatSQLColumns(filteredFields);
    const query = `SELECT ${columns} FROM users WHERE user_id = ?`;
    const [rows] = await connection.query<RowDataPacket[]>(query, [id]);
    return rows[0] as User | undefined;
  }

  /**
   * Get a user by username (public fields only).
   */
  static async getByUsername(username: string): Promise<User | undefined> {
    const query = `SELECT ${formatSQLColumns(this.selectFields)} FROM users WHERE username = ?`;
    const [rows] = await connection.query<RowDataPacket[]>(query, [username]);
    return rows[0] as User | undefined;
  }

  /**
   * Get a user by email with password (used for login).
   */
  static async getByEmail(email: string): Promise<(PrivateUserWithPassword & { password: string; }) | undefined> {
    const [rows] = await connection.query<RowDataPacket[]>(
      `SELECT user_id, username, email, password, profile_picture_url, created_at FROM users WHERE email = ?`,
      [email]
    );
    return rows[0] as (PrivateUserWithPassword & { password: string; }) | undefined;
  }

  /**
   * Create a new user.
   */
  static async create(user: CreateUserInput, hashedPassword: string): Promise<PrivateUser> {
    const { username, email, profile_picture_url } = user;

    const [result] = await connection.query<ResultSetHeader>(
      `INSERT INTO users (username, email, password, profile_picture_url) VALUES (?, ?, ?, ?)`,
      [username, email, hashedPassword, profile_picture_url ?? null]
    );

    return {
      user_id: result.insertId,
      username,
      email,
      profile_picture_url: profile_picture_url ?? null,
      created_at: new Date()
    };
  }

  /**
   * Fully update a user's information.
   */
  static async update(id: number, data: UpdateUserInput): Promise<boolean> {
    const { username, email, password, profile_picture_url } = data;

    const [result] = await connection.query<ResultSetHeader>(
      `UPDATE users SET username = ?, email = ?, password = ?, profile_picture_url = ? WHERE user_id = ?`,
      [username, email, password, profile_picture_url ?? null, id]
    );

    return result.affectedRows > 0;
  }

  /**
   * Partially update a user's fields.
   */
  static async patch(id: number, updates: UserPatchInput): Promise<boolean> {
    if (Object.keys(updates).length === 0) return false;

    const { sql: setClause, values } = buildSetClause(updates);
    const [result] = await connection.query<ResultSetHeader>(
      `UPDATE users SET ${setClause} WHERE user_id = ?`,
      [...values, id]
    );

    return result.affectedRows > 0;
  }

  /**
   * Delete a user by ID.
   */
  static async delete(id: number): Promise<boolean> {
    const [result] = await connection.query<ResultSetHeader>(
      `DELETE FROM users WHERE user_id = ?`,
      [id]
    );

    return result.affectedRows > 0;
  }

  /**
   * Get a user along with their planetary systems.
   */
  static async getFull(userId: number): Promise<User & { planetary_systems: any[]; } | undefined> {
    const [users] = await connection.query<RowDataPacket[]>(
      `SELECT ${formatSQLColumns(this.selectFields)} FROM users WHERE user_id = ?`,
      [userId]
    );
    if (!users.length) return undefined;

    const user = users[0] as User;

    const [systems] = await connection.query<RowDataPacket[]>(
      `
      SELECT
        planetary_system_id,
        name,
        description,
        distance_ly,
        thumbnail_url,
        star_id
      FROM planetary_systems
      WHERE user_id = ?
      ORDER BY planetary_system_id
      `,
      [userId]
    );

    return {
      ...user,
      planetary_systems: systems
    };
  }
}
