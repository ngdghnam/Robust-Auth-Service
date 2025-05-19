import bcrypt from "bcryptjs";
import { Request, Response, NextFunction } from "express";

class Cryptography {
  private saltRounds: number;

  constructor(saltRounds: number = 10) {
    this.saltRounds = saltRounds;
  }

  async hashPassword(password: string): Promise<string> {
    try {
      const salt = await bcrypt.genSalt(this.saltRounds);
      return await bcrypt.hash(password, salt);
    } catch (error) {
      console.error("Error hashing password:", error);
      throw error;
    }
  }

  async comparePassword(
    plainPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    try {
      if (!plainPassword || !hashedPassword) {
        throw new Error("Both plain and hashed passwords are required");
      }
      return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
      console.error("Error comparing passwords:", error);
      throw error;
    }
  }

  hashPasswordMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (req.body.password) {
        req.body.password = await this.hashPassword(req.body.password);
      }
      next();
    } catch (error) {
      res.status(400).json({ error: "Password hashing failed" });
    }
  };
}

export default Cryptography;
