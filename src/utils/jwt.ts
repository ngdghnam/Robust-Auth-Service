import jwt, { SignOptions, VerifyOptions } from "jsonwebtoken";
import TokenPayload from "../interfaces/iTokenPayload";
import dotenv from "dotenv";
dotenv.config();

class JwtHandler {
  private accessSecret: string;
  private refreshSecret: string;

  constructor(accessSecret: string, refreshSecret: string) {
    this.accessSecret = accessSecret;
    this.refreshSecret = refreshSecret;
  }

  /**
   * Sign an access token using the access secret
   * @param payload The data to encode in the token
   * @param options JWT sign options (e.g., expiresIn)
   */
  signAccessToken(
    payload: Partial<TokenPayload>,
    options?: SignOptions
  ): string {
    // Ensure default expiration if not provided in options
    const defaultOptions: SignOptions = { expiresIn: "1h", ...options };
    return jwt.sign(payload, this.accessSecret, defaultOptions);
  }

  /**
   * Sign a refresh token using the refresh secret
   * @param payload The data to encode in the token
   * @param options JWT sign options (e.g., expiresIn)
   */
  signRefreshToken(
    payload: Partial<TokenPayload>,
    options?: SignOptions
  ): string {
    // Refresh tokens typically live longer than access tokens
    const defaultOptions: SignOptions = { expiresIn: "7d", ...options };
    return jwt.sign(payload, this.refreshSecret, defaultOptions);
  }

  /**
   * Verify an access token
   * @param token The token to verify
   * @param options JWT verify options
   */
  verifyAccessToken(
    token: string,
    options?: VerifyOptions
  ): TokenPayload | null {
    try {
      return jwt.verify(
        token,
        this.accessSecret,
        options
      ) as unknown as TokenPayload;
    } catch (error) {
      return null;
    }
  }

  /**
   * Verify a refresh token
   * @param token The token to verify
   * @param options JWT verify options
   */
  verifyRefreshToken(
    token: string,
    options?: VerifyOptions
  ): TokenPayload | null {
    try {
      return jwt.verify(token, this.refreshSecret, options) as TokenPayload;
    } catch (error) {
      return null;
    }
  }

  /**
   * Decode a token without verification
   * @param token The token to decode
   */
  decodeToken(token: string): TokenPayload | null {
    try {
      return jwt.decode(token) as TokenPayload;
    } catch (error) {
      return null;
    }
  }

  /**
   * Check if a token is expired
   * @param token The token to check
   */
  isTokenExpired(token: string): boolean {
    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.exp) return true;

    // exp is in seconds, Date.now() is in milliseconds
    return decoded.exp * 1000 < Date.now();
  }

  /**
   * Generate a token pair (access token and refresh token)
   * @param userData The user data to include in the tokens
   */
  generateTokenPair(userData: {
    userId: string;
    username?: string;
    role: string;
  }): { accessToken: string; refreshToken: string } {
    // Create a unique jti for this session
    const jti = this.generateTokenId();

    // Base payload for both tokens
    const basePayload: Partial<TokenPayload> = {
      sub: userData.userId,
      userId: userData.userId,
      role: userData.role,
      iat: Math.floor(Date.now() / 1000),
      jti,
    };

    if (userData.username) {
      basePayload.username = userData.username;
    }

    // Create the tokens
    const accessToken = this.signAccessToken(basePayload);
    const refreshToken = this.signRefreshToken(basePayload);

    return { accessToken, refreshToken };
  }

  /**
   * Refresh an access token using a valid refresh token
   * @param refreshToken The refresh token to use
   */
  refreshAccessToken(refreshToken: string): string | null {
    const payload = this.verifyRefreshToken(refreshToken);

    if (!payload) return null;

    // Create a new access token with the same data
    return this.signAccessToken({
      sub: payload.sub,
      userId: payload.userId,
      username: payload.username,
      role: payload.role,
      jti: payload.jti,
      tokenVersion: payload.tokenVersion,
    });
  }

  /**
   * Generate a unique token ID
   */
  private generateTokenId(): string {
    // Simple implementation - in production, use a more robust method
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }
}

export default JwtHandler;
