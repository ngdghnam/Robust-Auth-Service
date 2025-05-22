import UserRepository from "../repositories/user.repo";
import User from "../schemas/UserSchema";

class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async getUserById(userId: string): Promise<User | null> {
    try {
      const user = await this.userRepository.findUserByEmail(userId);
      if (!user) {
        throw new Error("User not found");
      }
      return user;
    } catch (error) {
      throw new Error(`Error fetching user by ID: ${error}`);
    }
  }

  async getUserPhone(userPhone: string): Promise<string | null> {
    const user = await this.userRepository.findUserByUserPhone(userPhone);

    if (!user) {
      return null;
    }

    return user.user_phone;
  }

  async getUserName(userName: string): Promise<string | null> {
    const user = await this.userRepository.findUserByUsername(userName);

    if (!user) {
      return null;
    }

    return user.user_name;
  }

  async getAllUsers(): Promise<Omit<User, "user_password">[]> {
    try {
      const users = await this.userRepository.getAllUsers();
      if (!users || users.length === 0) {
        throw new Error("No users found");
      }

      // Remove password from each user
      return users.map((user) => {
        const { user_password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
    } catch (error) {
      throw new Error(`Error fetching all users: ${error}`);
    }
  }

  async createUser(user: User): Promise<User> {
    try {
      const createdUser = await this.userRepository.createUser(user);
      return createdUser;
    } catch (error) {
      throw new Error(`Error creating user: ${error}`);
    }
  }

  async updateUser(userId: string, user: Partial<User>): Promise<User | null> {
    try {
      const updatedUser = await this.userRepository.updateUser(userId, user);
      if (!updatedUser) {
        throw new Error("User not found");
      }
      return updatedUser;
    } catch (error) {
      throw new Error(`Error updating user: ${error}`);
    }
  }

  async deleteUser(userId: string): Promise<void> {
    try {
      await this.userRepository.deleteUser(userId);
    } catch (error) {
      throw new Error(`Error deleting user: ${error}`);
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

export default UserService;
