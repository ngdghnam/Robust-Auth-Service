import { Request, Response, NextFunction } from "express";
import { Code } from "../enums/code.enum";
import { Status } from "../enums/status.enum";
import HttpResponse from "../config/response";
import JwtHandler from "../utils/jwt";
import dotenv from "dotenv";
import logger from "../config/logger";

dotenv.config();

class AuthMiddleware {
  private pathwhitelist: string[] = ["/register", "/login"];
  private jwtHandler: JwtHandler;

  constructor() {
    this.jwtHandler = new JwtHandler(
      process.env.TOKEN_SECRET || "your_default_secret",
      process.env.TOKEN_REFRESH_SECRET || "your_default_refresh_secret"
    );
  }

  private validate(req: Request, res: Response, next: NextFunction) {
    const { path } = req;
    if (this.pathwhitelist.includes(path)) {
      next();
    } else {
      if (req?.headers?.authorization?.split(" ")[1]) {
        const token = req.headers.authorization.split(" ")[1];
        try {
          const decoded = this.jwtHandler.decodeToken(token);
          return decoded;
        } catch (error) {
          logger.error("Can not validate token");
          throw new Error();
        }
      }

      res
        .status(Code.FORBIDDEN)
        .json(
          new HttpResponse(
            Code.FORBIDDEN,
            Status.FORBIDDEN,
            "Access to this path is forbidden"
          )
        );
    }
  }
}

export default AuthMiddleware;
