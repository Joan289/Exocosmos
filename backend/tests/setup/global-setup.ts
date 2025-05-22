import { connection } from '../../src/database/mysql.js';
import fs from 'fs/promises';
import path from 'path';

export default async function () {
  const sqlPath = path.resolve(process.cwd(), 'tests/setup/init-db.sql');
  const sql = await fs.readFile(sqlPath, 'utf8');

  for (const statement of sql.split(';').map(s => s.trim()).filter(Boolean)) {
    await connection.query(statement);
  }

  await connection.query('USE exocosmos_test');

  await connection.query(`
    INSERT INTO planet_types (planet_type_id, name, min_mass, max_mass, min_radius, max_radius, has_rings, has_surface, max_moons) VALUES
      (1, 'TestType', 0, 10, 0, 10, FALSE, TRUE, 5),
      (2, 'NoSurface', 0, 10, 0, 10, TRUE, FALSE, 5),
      (3, 'NoRings', 0, 10, 0, 10, FALSE, TRUE, 5),
      (4, 'ZeroMoons', 0, 10, 0, 10, TRUE, TRUE, 0),
      (5, 'StrictMass', 5, 5, 1, 1, TRUE, TRUE, 5)
    ON DUPLICATE KEY UPDATE name = VALUES(name);
  `);

  await connection.end();
}
