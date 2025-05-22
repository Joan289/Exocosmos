import { RequestHandler } from 'express';
import { BaseModel } from '../interfaces/base-model.js';
import { AppError } from '../middlewares/error.js';
import { parseFieldList, parseID } from '../utils/parse.js';
import { QueryOptions } from '../interfaces/query.js';

/**
 * Generic BaseController for standard CRUD operations.
 * All specific controllers extend this class to inherit basic functionality.
 *
 * @template T - Entity type
 * @template M - Model that implements BaseModel<T>
 */
export class BaseController<T, M extends BaseModel<T> = BaseModel<T>> {
  constructor(protected model: M) { }

  /**
   * Get a paginated list of items with optional sorting, filtering and search.
   *
   * @route GET /
   */
  getAll: RequestHandler = async (req, res, next) => {
    try {
      // Extract query parameters
      const { page = '1', limit = '10', sort, search, ...filters } = req.query;

      // Build query options
      const options: QueryOptions = {
        page: parseInt(page as string, 10),
        limit: parseInt(limit as string, 10),
        sort: sort as string,
        search: search as string,
        filters: filters as Record<string, unknown>
      };

      // Get filtered and paginated results from the model
      const items = await this.model.getAll(options);
      res.status(200).json({ status: 'success', data: items });
    } catch (err) {
      next(err);
    }
  };

  /**
   * Get a single item by ID, with optional field projection.
   *
   * @route GET /:id
   */
  getById: RequestHandler = async (req, res, next) => {
    try {
      const { fields } = req.query;

      // Parse and validate ID from request
      const id = parseID(req);

      // Parse optional list of fields
      const fieldList = parseFieldList(fields);

      // Retrieve item from model
      const item = await this.model.getById(id, fieldList);
      if (!item) return next(new AppError(404, `Item with ID ${id} not found.`));

      res.status(200).json({ status: 'success', data: item });
    } catch (err) {
      next(err);
    }
  };

  /**
   * Create a new item.
   *
   * @route POST /
   */
  create: RequestHandler = async (req, res, next) => {
    try {
      // Create new item using request body
      const created = await this.model.create(req.body);
      res.status(201).json({
        status: 'success',
        message: 'Item created successfully',
        data: created
      });
    } catch (err) {
      next(err);
    }
  };

  /**
   * Fully update an existing item by ID.
   *
   * @route PUT /:id
   */
  update: RequestHandler = async (req, res, next) => {
    try {
      const id = parseID(req);

      // Attempt to update item
      const updated = await this.model.update(id, req.body);
      if (!updated) return next(new AppError(404, `Item with ID ${id} not found.`));

      res.status(200).json({ status: 'success', message: 'Item updated successfully' });
    } catch (err) {
      next(err);
    }
  };

  /**
   * Partially update an existing item by ID.
   *
   * @route PATCH /:id
   */
  patch: RequestHandler = async (req, res, next) => {
    try {
      const id = parseID(req);
      const updates = req.body;

      // Validate update payload
      if (!updates || Object.keys(updates).length === 0) {
        return next(new AppError(400, 'No fields provided to update.'));
      }

      // Apply patch update
      const updated = await this.model.patch(id, updates);
      if (!updated) {
        return next(new AppError(404, `Item with ID ${id} not found.`));
      }

      res.status(200).json({
        status: 'success',
        message: 'Item updated successfully',
        updatedFields: Object.keys(updates)
      });
    } catch (err) {
      next(err);
    }
  };

  /**
   * Delete an item by ID.
   *
   * @route DELETE /:id
   */
  delete: RequestHandler = async (req, res, next) => {
    try {
      const id = parseID(req);

      // Attempt to delete item
      const deleted = await this.model.delete(id);
      if (!deleted) return next(new AppError(404, `Item with ID ${id} not found.`));

      res.status(200).json({
        status: 'success',
        message: `Item with ID ${id} deleted.`
      });
    } catch (err) {
      next(err);
    }
  };
}
