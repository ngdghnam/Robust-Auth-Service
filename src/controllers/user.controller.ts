import { Request, Response } from "express";
import UserService from "../services/user.service";
import Cryptography from "../utils/cryptography";
import UserInputValidator from "../utils/validate";
import { v4 as uuidv4 } from "uuid";
import HttpResponse from "../config/response";
import { Code } from "../enums/code.enum";
import { Status } from "../enums/status.enum";

class UserController {
  private userService: UserService;
  private cryptography: Cryptography;
  private userInputValidator: UserInputValidator;

  constructor() {
    this.userService = new UserService();
    this.cryptography = new Cryptography();
    this.userInputValidator = new UserInputValidator();
  }

  getAllUsers = async (req: Request, res: Response) => {
    try {
      const users = await this.userService.getAllUsers();
      res
        .status(200)
        .json(
          new HttpResponse(
            Code.SUCCESS,
            Status.SUCCESS,
            "Users retrieved successfully",
            users
          )
        );
    } catch (error) {
      res.status(500).json({ error: "Error retrieving users" });
      console.log(error);
    }
  };

  getUserByUserEmail = async (req: Request, res: Response) => {
    try {
      const { user_email } = req.body;

      if (!user_email) {
        res
          .status(Code.BAD_REQUEST)
          .json(
            new HttpResponse(
              Code.BAD_REQUEST,
              Status.BAD_REQUEST,
              "Please checkout your fill again"
            )
          );
      }

      const user = await this.userService.getUserByEmail(user_email);
      res.status(Code.SUCCESS).json(
        new HttpResponse(
          Code.SUCCESS,
          Status.SUCCESS,
          "User retreived successfully",
          {
            user,
          }
        )
      );
    } catch (error) {}
  };

  createUser = async (req: Request, res: Response) => {
    try {
      // Check if req.body exists
      if (!req.body) {
        res
          .status(Code.BAD_REQUEST)
          .json(
            new HttpResponse(
              Code.BAD_REQUEST,
              Status.BAD_REQUEST,
              "Request body is required"
            )
          );
        return;
      }

      const {
        user_email,
        user_name,
        user_first_name,
        user_last_name,
        user_phone,
        user_password,
      } = req.body;

      // validate user input
      const validatedEmail = this.userInputValidator.validateEmail(user_email);
      const validatedPhone =
        this.userInputValidator.validatePhoneNumber(user_phone);
      const validatedUsername =
        this.userInputValidator.validateUsername(user_name);

      // Hash password
      const hashedPassword = await this.cryptography.hashPassword(
        user_password
      );

      if (!validatedEmail || !validatedPhone || !validatedUsername) {
        res
          .status(Code.BAD_REQUEST)
          .json(
            new HttpResponse(
              Code.BAD_REQUEST,
              Status.BAD_REQUEST,
              "Please check your email, phone number or username"
            )
          );
        return;
      }

      const generatedId = uuidv4();

      const user = {
        user_id: generatedId,
        user_name,
        user_first_name,
        user_last_name,
        user_email,
        user_phone,
        user_password: hashedPassword,
        // user_role: "user",
      };

      await this.userService.createUser(user);
      res.status(201).json(
        new HttpResponse(
          Code.SUCCESS,
          Status.SUCCESS,
          "User registered successfully",
          {
            user_name,
            user_first_name,
            user_last_name,
            user_email,
            user_phone,
          }
        )
      );
      //  return;
    } catch (error) {
      res
        .status(Code.BAD_REQUEST)
        .json(
          new HttpResponse(
            Code.BAD_REQUEST,
            Status.BAD_REQUEST,
            "Cannot register user"
          )
        );
      console.log(error);
    }
  };

  updateUser = async (req: Request, res: Response) => {
    try {
      const userId = req.params.userId;
      const userData = req.body;

      // Validate user input
      if (!userId || !userData) {
        res
          .status(Code.BAD_REQUEST)
          .json(
            new HttpResponse(
              Code.BAD_REQUEST,
              Status.BAD_REQUEST,
              "User ID and data are required"
            )
          );
        return;
      }

      // Handle password separately if it exists
      let dataToUpdate = { ...userData };
      if (userData.user_password) {
        // Hash the password
        const hashedPassword = await this.cryptography.hashPassword(
          userData.user_password
        );

        // Replace the plain text password with the hashed one
        dataToUpdate.user_password = hashedPassword;
      }

      await this.userService.updateUser(userId, dataToUpdate);
      res
        .status(200)
        .json(
          new HttpResponse(
            Code.SUCCESS,
            Status.SUCCESS,
            "User updated successfully"
          )
        );
    } catch (error) {
      res.status(400).json({ error: "Error updating user" });
      console.log(error);
    }
  };

  deleteUser = async (req: Request, res: Response) => {
    const userId = req.params.userId;

    if (!userId) {
      res
        .status(Code.BAD_REQUEST)
        .json(
          new HttpResponse(
            Code.BAD_REQUEST,
            Status.BAD_REQUEST,
            "Please check user id"
          )
        );
    }

    await this.userService.deleteUser(userId);
    res
      .status(200)
      .json(
        new HttpResponse(
          Code.SUCCESS,
          Status.SUCCESS,
          "User has been deleted successfully"
        )
      );
  };
}

export default UserController;
