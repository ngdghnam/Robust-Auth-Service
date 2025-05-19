import jwt, { SignOptions } from "jsonwebtoken";
import iTokenPayload from "../interfaces/iTokenPayload";

class JwtHandler {
  private secret: string;
  private refreshSecret: string;

  constructor(secret: string, refreshSecret: string) {
    this.secret = secret;
    this.refreshSecret = refreshSecret;
  }

  signToken(
    payload: object,
    secretOrOptions?: string | SignOptions,
    options?: SignOptions
  ): string {
    if (typeof secretOrOptions === "string") {
      return jwt.sign(payload, secretOrOptions, options || {});
    }
    return jwt.sign(payload, this.secret, secretOrOptions || {});
  }

  // signToken(payload: object, options?: SignOptions): string {
  //   return jwt.sign(payload, this.secret, options || {});
  // }

  // verifyToken(token: string): object | string {
  //   return jwt.verify(token, this.refreshSecret);
  // }

  verifyToken(token: string, secret: string): iTokenPayload | null {
    try {
      return jwt.verify(token, secret) as iTokenPayload;
    } catch (error) {
      return null;
    }
  }

  decodeToken(token: string): object | string | null {
    return jwt.decode(token);
  }
}

export default JwtHandler;
