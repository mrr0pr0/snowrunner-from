/** User entity - used by both client and server */
export interface User {
    id: string;
    email: string;
    username: string;
    avatarUrl: string | null;
    role: UserRole;
    createdAt: string;
    updatedAt: string;
  }
  
  export type UserRole = 'user' | 'admin' | 'moderator';
  
  /** Public user (no sensitive fields) for display in guides/comments */
  export interface PublicUser {
    id: string;
    username: string;
    avatarUrl: string | null;
    role: UserRole;
  }
  