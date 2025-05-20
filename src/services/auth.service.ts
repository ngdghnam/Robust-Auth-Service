import UserRepository from "../repositories/user.repo";
import User from "../schemas/UserSchema";
import Cryptography from "../utils/cryptography";
import JwtHandler from "../utils/jwt";
import dotenv from "dotenv";

dotenv.config();

class AuthService {
  private userRepository: UserRepository;
  private cryptography: Cryptography;
  private jwtHandler: JwtHandler;

  constructor() {
    this.userRepository = new UserRepository();
    this.cryptography = new Cryptography();
    this.jwtHandler = new JwtHandler(
      process.env.TOKEN_SECRET || "your_default_secret",
      process.env.TOKEN_REFRESH_SECRET || "your_default_refresh_secret"
    );
  }

  async registerUser(user: User): Promise<User> {
    try {
      const createdUser = await this.userRepository.createUser(user);
      return createdUser;
    } catch (error) {
      throw new Error(`Error registering user: ${error}`);
    }
  }

  async loginUser(user: User): Promise<User | null> {
    try {
      const foundUser = await this.userRepository.findUserByEmail(
        user.user_email
      );
      if (!foundUser) {
        throw new Error("User not found");
      }
      const isPasswordValid = await this.cryptography.comparePassword(
        user.user_password,
        foundUser.user_password
      );
      if (!isPasswordValid) {
        throw new Error("Invalid password");
      }
      return foundUser;
    } catch (error) {
      throw new Error(`Error logging in user: ${error}`);
    }
  }

  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const foundUser = await this.userRepository.findUserByEmail(email);
      if (!foundUser) {
        throw new Error("User not found");
      }
      return foundUser;
    } catch (error) {
      throw new Error(`Error fetching user by email: ${error}`);
    }
  }

  async generateTokens(
    user: User
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      // Generate token pair using the JwtHandler
      const tokens = this.jwtHandler.generateTokenPair({
        userId: user.user_id.toString(),
        username: user.user_name,
        role: user.user_role || "user",
      });

      return tokens;
    } catch (error) {
      throw new Error(`Error generating tokens: ${error}`);
    }
  }

  async refreshAccessToken(refreshToken: string): Promise<string | null> {
    try {
      return this.jwtHandler.refreshAccessToken(refreshToken);
    } catch (error) {
      throw new Error(`Error refreshing access token: ${error}`);
    }
  }

  verifyAccessToken(token: string) {
    return this.jwtHandler.verifyAccessToken(token);
  }
}

export default AuthService;
