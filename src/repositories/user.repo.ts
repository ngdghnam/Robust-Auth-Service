import db from "../config/database";
import User from "../schemas/UserSchema";

class UserRepository {
  private database;

  constructor() {
    this.database = db;
  }

  async getAllUsers(): Promise<User[]> {
    const users = await this.database("users").select("*");
    return users;
  }

  async createUser(user: User): Promise<User> {
    const [createdUser] = await this.database("users")
      .insert(user)
      .returning("*");
    return createdUser;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const user = await this.database("users")
      .where({ user_email: email })
      .first();
    return user || null;
  }

  async findUserByUsername(username: string): Promise<User | null> {
    const user = await this.database("users")
      .where({ user_name: username })
      .first();
    return user || null;
  }

  async updateUser(
    userId: string,
    userData: Partial<User>
  ): Promise<User | null> {
    try {
      const updateResult = await this.database("users")
        .where({ user_id: userId })
        .update(userData);

      // If no rows were affected (updateResult will be 0), return null
      if (!updateResult) {
        return null;
      }

      const updatedUser = await this.database("users")
        .where({ user_id: userId })
        .first();

      return updatedUser || null;
    } catch (error) {
      console.error("Database error when updating user:", error);
      throw error;
    }
  }

  async deleteUser(userId: string): Promise<void> {
    await this.database("users").where({ user_id: userId }).del();
  }
}

export default UserRepository;
