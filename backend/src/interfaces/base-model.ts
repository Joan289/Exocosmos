import { QueryOptions } from './query.js';

/**
 * Utility type to omit all fields ending with '_id'.
 */
type OmitIds<T> = {
  [K in keyof T as K extends `${string}_id` ? never : K]: T[K];
};

export interface BaseModel<T> {
  getAll(options?: QueryOptions): Promise<T[]>;
  getById(id: number, fields?: string[]): Promise<T | undefined>;
  create(data: T, userId?: number): Promise<T>;
  update(id: number, data: OmitIds<T>): Promise<boolean>;
  patch(id: number, updates: Partial<OmitIds<T>>): Promise<boolean>;
  delete(id: number): Promise<boolean>;
}