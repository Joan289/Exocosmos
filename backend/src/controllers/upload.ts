import { Request, Response, NextFunction, RequestHandler } from 'express';
import { PlanetModel } from '../models/planet.js';
import { StarModel } from '../models/star.js';
import { PlanetarySystemModel } from '../models/planetary-system.js';
import { UserModel } from '../models/user.js';

/**
 * Middleware to handle file uploads for various entities.
 * 
 * This function updates the relevant resource's URL fields (e.g., thumbnail, profile picture, or textures)
 * depending on the type of uploaded image and the target entity.
 * 
 * Expected `req.params`:
 * - entity: "planets", "stars", "planetary_systems", or "users"
 * - id: numeric resource ID
 * - type: type of image ("thumbnail", "profile_picture", "surface", "height", "atmosphere")
 * 
 * Expects `req.file` to be populated by multer or a similar middleware.
 */
export function uploadImage(): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { entity, id, type } = req.params;
      const resourceId = Number(id);

      // Validate file presence
      if (!req.file) {
        res.status(400).json({ error: 'File is required' });
        return;
      }

      // Convert file path to a public URL format
      const publicPath = req.file.path.replace(/^public[\\/]/, '').replace(/\\/g, '/');
      const filePath = `/${publicPath}`;

      // Handle thumbnail uploads for various entities
      if (type === 'thumbnail') {
        switch (entity) {
          case 'planets':
            await PlanetModel.patch(resourceId, { thumbnail_url: filePath });
            break;
          case 'stars':
            await StarModel.patch(resourceId, { thumbnail_url: filePath });
            break;
          case 'planetary_systems':
            await PlanetarySystemModel.patch(resourceId, { thumbnail_url: filePath });
            break;
          default:
            res.status(400).json({ error: 'Invalid entity for thumbnail upload' });
            return;
        }
      }

      // Handle profile picture uploads for users
      else if (type === 'profile_picture' && entity === 'users') {
        await UserModel.patch(resourceId, { profile_picture_url: filePath });
      }

      // Handle other texture-related uploads (only for planets)
      else if (entity === 'planets') {
        const patch: Record<string, any> = {};

        // Determine which texture field to update
        if (type === 'surface') patch.surface_texture_url = filePath;
        else if (type === 'height') patch.height_texture_url = filePath;
        else if (type === 'atmosphere') patch.atmosphere = { texture_url: filePath };
        else {
          res.status(400).json({ error: 'Unsupported upload type' });
          return;
        }

        await PlanetModel.patch(resourceId, patch);
      }

      // If none of the above matched, the upload type is invalid
      else {
        res.status(400).json({ error: `${type} upload is only valid for planets` });
        return;
      }

      // Respond with the uploaded file's public URL
      res.status(200).json({ url: filePath });
    } catch (err) {
      next(err);
    }
  };
}
