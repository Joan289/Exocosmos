import { UserModel } from './user.js';

/**
 * Specialized model for authenticated user operations.
 * 
 * Overrides field visibility to include private fields (e.g., email).
 */
export class UserAuthModel extends UserModel {
  // Use private fields for authenticated context (e.g., includes email)
  static override readonly selectFields = this.selectFieldsPrivate;

  // Allow filtering by private fields in queries
  static override readonly allowedFields = this.allowedFieldsPrivate;
}
