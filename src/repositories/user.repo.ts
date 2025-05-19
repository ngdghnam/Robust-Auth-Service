import db from "../config/database";
import User from "../schemas/UserSchema";

class UserRepository {
  private database;

  constructor() {
    this.database = db;
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
}

export default UserRepository;
