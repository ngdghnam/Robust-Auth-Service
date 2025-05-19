interface iTokenPayload {
  refreshToken: string;
  exp?: number; // Expiration timestamp (optional)
  userId: number; // Add other expected properties
}

export default iTokenPayload;
