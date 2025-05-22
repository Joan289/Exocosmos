import { Request, Response, NextFunction, RequestHandler } from 'express';
import { connection } from '../database/mysql.js';
import { AuthenticatedRequest } from '../interfaces/express.js';

interface OwnershipConfig {
  table: string;
  idField: string;
  joinTable?: string;
  joinField?: string;
}

// Defines how to check ownership for each resource type
const ownershipMap: Record<string, OwnershipConfig> = {
  planet: {
    table: 'planets',
    idField: 'planet_id',
    joinTable: 'planetary_systems',
    joinField: 'planetary_system_id'
  },
  planetary_system: {
    table: 'planetary_systems',
    idField: 'planetary_system_id'
  }
};

/**
 * Middleware to check if the authenticated user owns a given resource.
 * 
 * Supports both direct and indirect ownership (via joins).
 * 
 * @param resource - Resource type (e.g. 'planet', 'planetary_system')
 * @param source - Where to extract the resource ID from ('params' or 'body')
 */
export const checkOwnership = (
  resource: 'planet' | 'planetary_system',
  source: 'params' | 'body' = 'params'
): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as AuthenticatedRequest).user?.user_id;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const config = ownershipMap[resource];
      const resourceId = source === 'params'
        ? Number(req.params.id)
        : req.body[config.idField];

      if (!resourceId) {
        res.status(400).json({ error: `${config.idField} is required` });
        return;
      }

      let query: string;
      let values: any[];

      // If ownership is determined via join (e.g. planets → planetary_systems)
      if (config.joinTable && config.joinField) {
        query = `
          SELECT 1
          FROM ${config.table}
          INNER JOIN ${config.joinTable} USING (${config.joinField})
          WHERE ${config.idField} = ? AND ${config.joinTable}.user_id = ?
        `;
        values = [resourceId, userId];
      } else {
        // Direct ownership check (e.g. planetary_system.user_id)
        query = `
          SELECT 1
          FROM ${config.table}
          WHERE ${config.idField} = ? AND user_id = ?
        `;
        values = [resourceId, userId];
      }

      const [rows] = await connection.query(query, values);

      // If no ownership found, check if resource exists to return proper error
      if ((rows as any[]).length === 0) {
        const [exists] = await connection.query(
          `SELECT 1 FROM ${config.table} WHERE ${config.idField} = ?`,
          [resourceId]
        );

        if ((exists as any[]).length === 0) {
          res.status(404).json({ error: `${resource.replace('_', ' ')} with ID ${resourceId} not found` });
          return;
        }

        res.status(403).json({
          error: `You do not own this ${resource.replace('_', ' ')} (ID: ${resourceId})`
        });
        return;
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};
