import { Request, Response, NextFunction } from 'express';
import { connection } from '../database/mysql.js';

/**
 * Middleware to validate a planet's properties against its planet type constraints.
 * 
 * Ensures that mass, radius, rings, and moons are consistent with the selected type.
 * Supports both POST and PATCH methods.
 */
export const validatePlanetAgainstType = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      planet_type_id: providedTypeId,
      mass_earth,
      radius_earth,
      has_rings,
      moon_count,
      surface_texture_url,
      height_texture_url
    } = req.body;

    const isPatch = req.method === 'PATCH';
    let typeId = providedTypeId;

    // If PATCH and no typeId provided, fetch current one from DB
    if (!typeId && isPatch) {
      const planetId = Number(req.params.id);
      if (!planetId || isNaN(planetId)) {
        res.status(400).json({ error: 'Invalid planet ID' });
        return;
      }

      const [planetRows] = await connection.query(
        'SELECT planet_type_id FROM planets WHERE planet_id = ?',
        [planetId]
      );

      const planet = (planetRows as any[])[0];
      if (!planet) {
        res.status(404).json({ error: 'Planet not found' });
        return;
      }

      typeId = planet.planet_type_id;
    }

    // planet_type_id is required at this point
    if (!typeId) {
      res.status(400).json({ error: 'planet_type_id is required to validate planet properties' });
      return;
    }

    // Fetch planet type definition from DB
    const [rows] = await connection.query(
      'SELECT * FROM planet_types WHERE planet_type_id = ?',
      [typeId]
    );

    const type = (rows as any[])[0];
    if (!type) {
      res.status(400).json({ error: 'Invalid planet_type_id' });
      return;
    }

    // Validate field if it's present or if it's a full update
    const shouldValidate = (field: any) => !isPatch || field !== undefined;

    if (shouldValidate(mass_earth) && (mass_earth < type.min_mass || mass_earth > type.max_mass)) {
      res.status(400).json({ error: `mass_earth must be between ${type.min_mass} and ${type.max_mass}` });
      return;
    }

    if (shouldValidate(radius_earth) && (radius_earth < type.min_radius || radius_earth > type.max_radius)) {
      res.status(400).json({ error: `radius_earth must be between ${type.min_radius} and ${type.max_radius}` });
      return;
    }

    if (shouldValidate(has_rings) && !type.has_rings && has_rings === true) {
      res.status(400).json({ error: 'This planet type does not allow rings' });
      return;
    }

    if (shouldValidate(moon_count) && moon_count > type.max_moons) {
      res.status(400).json({ error: `moon_count must be <= ${type.max_moons}` });
      return;
    }

    next();
  } catch (err) {
    next(err);
  }
};
