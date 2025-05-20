// Improved TokenPayload interface
interface TokenPayload {
  // Standard JWT claims
  sub: string; // Subject (typically user ID)
  iat?: number; // Issued at (timestamp)
  exp?: number; // Expiration (timestamp)
  jti?: string; // JWT ID (unique identifier for this token)

  // Custom claims
  userId: string; // User ID (matching your User class)
  username?: string; // Username
  role: string; // User role (e.g., "user", "admin")

  // For token management
  tokenVersion?: number; // Can be used for invalidating tokens on password change
}

export default TokenPayload;
