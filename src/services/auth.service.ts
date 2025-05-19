import UserRepository from "../repositories/user.repo";
import User from "../schemas/UserSchema";
import Cryptography from "../utils/cryptography";

class AuthService {
  private userRepository: UserRepository;
  private cryptography: Cryptography;

  constructor() {
    this.userRepository = new UserRepository();
    this.cryptography = new Cryptography();
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
}

export default AuthService;
