import AuthService from "../services/auth.service";
import UserService from "../services/user.service";

import Cryptography from "../utils/cryptography";
import { Request, Response } from "express";
import UserInputValidator from "../utils/validate";
import { v4 as uuidv4 } from "uuid";
import HttpResponse from "../config/response";
import { Code } from "../enums/code.enum";
import { Status } from "../enums/status.enum";
import logger from "../config/logger";
import { generateRandomPassword } from "../utils/passwordGen";

class AuthController {
  private authService: AuthService;
  private cryptography: Cryptography;
  private userInputValidator: UserInputValidator;
  private userService: UserService;

  constructor() {
    this.authService = new AuthService();
    this.cryptography = new Cryptography();
    this.userInputValidator = new UserInputValidator();
    this.userService = new UserService();
  }

  handleRegister = async (req: Request, res: Response): Promise<void> => {
    try {
      // Check if req.body exists
      if (!req.body) {
        logger.error("Request body doesnt contain value");
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
        user_role,
      } = req.body;

      // validate user input
      const validatedEmail = this.userInputValidator.validateEmail(user_email);
      const validatedPhone =
        this.userInputValidator.validatePhoneNumber(user_phone);
      const validatedUsername =
        this.userInputValidator.validateUsername(user_name);
      const validatedPassword =
        this.userInputValidator.validatePassword(user_password);

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

      if (!validatedPassword) {
        const randomPassword = generateRandomPassword();
        logger.error("Password does not satisfied requirements");
        res.status(Code.BAD_REQUEST).json(
          new HttpResponse(
            Code.BAD_REQUEST,
            Status.BAD_REQUEST,
            `A password must be at least 8 characters long and contain at least one uppercase letter, one number, and one special character`,
            {
              suggested_pasword: randomPassword,
            }
          )
        );
        return;
      }

      // Check phone existed
      const existedPhone = await this.userService.getUserPhone(user_phone);
      if (user_phone == existedPhone) {
        logger.error("Duplicate user_phone");
        res
          .status(Code.BAD_REQUEST)
          .json(
            new HttpResponse(
              Code.BAD_REQUEST,
              Status.BAD_REQUEST,
              "Phone number already existed"
            )
          );
        return;
      }

      // Check userName existed
      const existedUserName = await this.userService.getUserPhone(user_name);
      if (user_name == existedUserName) {
        logger.error("duplicate user_name");
        res
          .status(Code.BAD_REQUEST)
          .json(
            new HttpResponse(
              Code.BAD_REQUEST,
              Status.BAD_REQUEST,
              "username already existed"
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
        user_role: user_role,
      };

      await this.authService.registerUser(user);
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
            user_role,
          }
        )
      );
      //  return;
    } catch (error) {
      res.status(400).json({ error: "Error registering user" });
      console.log(error);
    }
  };

  handleLogin = async (req: Request, res: Response) => {
    try {
      if (!req.body.user_email || !req.body.user_password) {
        res.status(400).json({ message: "username and password are required" });
        return;
      }

      const user = await this.authService.getUserByEmail(req.body.user_email);
      if (!user) {
        res
          .status(Code.BAD_REQUEST)
          .json(
            new HttpResponse(
              Code.BAD_REQUEST,
              Status.BAD_REQUEST,
              "User not found"
            )
          );
        return;
      }

      const isPasswordValid = await this.cryptography.comparePassword(
        req.body.user_password,
        user.user_password
      );

      const validatedEmail = this.userInputValidator.validateEmail(
        req.body.user_email
      );
      if (!validatedEmail || !isPasswordValid) {
        res
          .status(Code.BAD_REQUEST)
          .json(
            new HttpResponse(
              Code.BAD_REQUEST,
              Status.BAD_REQUEST,
              "Please check your email or password"
            )
          );
        return;
      }

      const tokens = await this.authService.generateTokens(user);
      if (!tokens) {
        res
          .status(Code.BAD_REQUEST)
          .json(
            new HttpResponse(
              Code.BAD_REQUEST,
              Status.BAD_REQUEST,
              "Error generating tokens"
            )
          );
        return;
      }

      res.status(Code.SUCCESS).json(
        new HttpResponse(Code.SUCCESS, Status.SUCCESS, "Login successful", {
          user_name: user.user_name,
          user_first_name: user.user_first_name,
          user_last_name: user.user_last_name,
          user_email: user.user_email,
          user_phone: user.user_phone,
          user_role: user.user_role,

          access_token: tokens.accessToken,
          refresh_token: tokens.refreshToken,
        })
      );
      return;
    } catch (error) {
      res.status(400).json({ error: "Error logging in user" });
      console.log(error);
    }
  };

  handleGetSecretToken = async (req: Request, res: Response) => {};

  handleRefreshToken = async (req: Request, res: Response) => {};
}

export default new AuthController();
