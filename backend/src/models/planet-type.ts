import { connection } from "../database/mysql.js";
import { PlanetType } from "../schemas/planet-type.js";
import { RowDataPacket } from "mysql2";

/**
 * Model for interacting with the 'planet_types' table.
 * 
 * Provides read-only access to planet type definitions.
 */
export class PlanetTypeModel {
  // Fields to include in SELECT queries
  static readonly selectFields = [
    'planet_type_id',
    'name',
    'min_mass',
    'max_mass',
    'min_radius',
    'max_radius',
    'has_rings',
    'has_surface',
    'max_moons'
  ];

  /**
   * Retrieve all planet types.
   */
  static async getAll(): Promise<PlanetType[]> {
    const fields = this.selectFields.join(', ');
    const [rows] = await connection.query<RowDataPacket[]>(`SELECT ${fields} FROM planet_types`);
    return rows as PlanetType[];
  }

  /**
   * Retrieve a specific planet type by ID.
   */
  static async getById(id: number): Promise<PlanetType | undefined> {
    const fields = this.selectFields.join(', ');
    const [rows] = await connection.query<RowDataPacket[]>(
      `SELECT ${fields} FROM planet_types WHERE planet_type_id = ?`,
      [id]
    );
    return (rows as PlanetType[])[0];
  }
}
