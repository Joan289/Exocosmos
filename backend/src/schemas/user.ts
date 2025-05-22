import { z } from 'zod';
import { baseQuerySchema } from './query.js';

/**
 * Base schema for creating or updating a user.
 * Includes full password validation and optional profile picture.
 */
export const userBaseSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email().max(100),
  password: z.string()
    .min(8)
    .max(100)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/,
      'Password must include uppercase, lowercase, number and special character'
    ),
  profile_picture_url: z.string().url().max(200).nullable().optional()
});

/**
 * Schema for creating a new user (strict — no unknown fields).
 */
export const createUserSchema = userBaseSchema.strict();

/**
 * Alias for createUserSchema used in registration context.
 */
export const registerSchema = createUserSchema;

/**
 * Schema for user login — only requires email and password.
 */
export const loginSchema = z.object({
  email: z.string().email().max(100),
  password: z.string().min(6).max(100)
});

/**
 * Schema for full user update via PUT.
 */
export const updateUserSchema = userBaseSchema.strict();

/**
 * Schema for partial user update via PATCH.
 */
export const patchUserSchema = z.object({
  username: z.string().min(3).max(50).optional(),
  email: z.string().email().max(100).optional(),
  password: z.string()
    .min(8)
    .max(100)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/,
      'Password must include uppercase, lowercase, number and special character'
    )
    .optional(),
  profile_picture_url: z.string().url().max(200).nullable().optional()
});

/**
 * Public user schema for responses — excludes sensitive data.
 */
export const userSchema = z.object({
  user_id: z.number().int().positive(),
  username: z.string().min(3).max(50),
  profile_picture_url: z.string().url().max(200).nullable().optional(),
  created_at: z.coerce.date()
});

/**
 * Extended schema with email (used for authenticated contexts).
 */
export const userPrivateSchema = userSchema.extend({
  email: z.string().email().max(100)
});

/**
 * Schema for a user with associated planetary systems.
 */
export const userFullSchema = userSchema.extend({
  planetary_systems: z.array(z.object({
    planetary_system_id: z.number().int().positive(),
    name: z.string().min(1).max(20),
    description: z.string().nullable(),
    distance_ly: z.number().int().positive(),
    thumbnail_url: z.string().url().max(200),
    star_id: z.number().int().positive()
  }))
});

/**
 * Internal type for user including email and password (used in auth logic).
 */
export type PrivateUserWithPassword = PrivateUser & {
  password: string;
};

/**
 * Schema for validating user query parameters (used in GET /users).
 */
export const getUserQuerySchema = baseQuerySchema.extend({
  username: z.string().optional(),
  email: z.string().optional()
});

/**
 * Schema for validating route params like `:id`.
 */
export const idParamSchema = z.object({
  id: z.coerce.number().int().positive()
});

// ---- Types ----

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UserPatchInput = z.infer<typeof patchUserSchema>;

export type User = z.infer<typeof userSchema>;
export type PrivateUser = z.infer<typeof userPrivateSchema>;
export type UserFull = z.infer<typeof userFullSchema>;
