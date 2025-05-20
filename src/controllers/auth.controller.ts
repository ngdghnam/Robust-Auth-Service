import AuthService from "../services/auth.service";
import Cryptography from "../utils/cryptography";
import { Request, Response } from "express";
import UserInputValidator from "../utils/validate";
import { v4 as uuidv4 } from "uuid";
import HttpResponse from "../config/response";
import { Code } from "../enums/code.enum";
import { Status } from "../enums/status.enum";

class AuthController {
  private authService: AuthService;
  private cryptography: Cryptography;
  private userInputValidator: UserInputValidator;

  constructor() {
    this.authService = new AuthService();
    this.cryptography = new Cryptography();
    this.userInputValidator = new UserInputValidator();
  }

  handleRegister = async (req: Request, res: Response) => {
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
