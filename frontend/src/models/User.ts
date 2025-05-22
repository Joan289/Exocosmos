/**
 * Interface representing a user in the system.
 */
export interface User {
  user_id: number | string; // Unique identifier for the user
  username?: string; // Optional display name of the user
  profile_picture_url?: string | null; // Optional URL to the user's profile picture (can be null)
  [key: string]: unknown; // Allows for additional dynamic properties not explicitly defined
}
