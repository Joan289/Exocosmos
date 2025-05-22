import { connection } from '../database/mysql.js';
import { Compound, CreateCompoundInput } from '../schemas/compound.js';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { QueryConfig, QueryOptions } from '../interfaces/query.js';
import { parseFilters, formatSQLColumns } from '../utils/parse.js';
import { buildQueryClauses } from '../utils/query-builder.js';
import { fetchCompoundFromPubChem } from '../utils/pubchem.js';
import createHttpError from 'http-errors';

/**
 * Model for interacting with the 'compounds' table.
 * 
 * Includes local caching and optional fetch from PubChem API.
 */
export class CompoundModel {
  // Fields to include in SELECT queries
  static readonly selectFields = ['CID', 'name', 'formula'];

  // Query configuration
  static readonly queryConfig: QueryConfig = {
    searchable: ['name', 'formula'],
    filterable: ['name', 'formula'],
    sortable: ['CID', 'name', 'formula'],
    defaultSort: 'CID'
  };

  // Value parsers for filters
  static readonly filterParsers: Record<string, (value: unknown) => any> = {
    name: String,
    formula: String
  };

  /**
   * Get all compounds with optional filtering, sorting, and pagination.
   */
  static async getAll({ page, limit, sort, search, filters = {} }: QueryOptions): Promise<Compound[]> {
    const parsedFilters = parseFilters(filters, this.filterParsers);
    const columns = formatSQLColumns(this.selectFields);

    const { whereSQL, sortSQL, pageSQL, values } = buildQueryClauses(
      { page, limit, sort, search, filters: parsedFilters },
      this.queryConfig
    );

    const query = `SELECT ${columns} FROM compounds ${whereSQL} ${sortSQL} ${pageSQL}`;
    const [rows] = await connection.query<RowDataPacket[]>(query, values);
    return rows as Compound[];
  }

  /**
   * Get a compound by its CID.
   */
  static async getById(id: number): Promise<Compound | undefined> {
    const columns = formatSQLColumns(this.selectFields);
    const [rows] = await connection.query<RowDataPacket[]>(
      `SELECT ${columns} FROM compounds WHERE CID = ?`,
      [id]
    );
    return rows[0] as Compound | undefined;
  }

  /**
   * Ensure a compound exists in the local DB. If not, fetch it from PubChem and insert.
   */
  static async create(data: CreateCompoundInput): Promise<Compound> {
    const existing = await this.getById(data.CID);
    if (existing) return existing;

    const compound = await fetchCompoundFromPubChem(data.CID);
    if (!compound) {
      throw createHttpError(404, `Compound with CID ${data.CID} not found in PubChem.`);
    }

    await connection.query<ResultSetHeader>(
      `INSERT IGNORE INTO compounds (CID, name, formula) VALUES (?, ?, ?)`,
      [compound.CID, compound.name, compound.formula]
    );

    return compound;
  }
}
