import express, { Router, Request, Response } from "express";
import { sendingVerificationEmail } from "../config/nodemailer/mailing";
import { Code } from "../enums/code.enum";
import { Status } from "../enums/status.enum";
import HttpResponse from "../config/response";

const emailRouter: Router = Router();

emailRouter.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    if (email) {
      await sendingVerificationEmail(email);
      res.json(
        new HttpResponse(
          Code.SUCCESS,
          Status.SUCCESS,
          "Send email successfully"
        )
      );
      return;
    }

    res.json(
      new HttpResponse(
        Code.BAD_REQUEST,
        Status.BAD_REQUEST,
        "Cannot send email"
      )
    );
  } catch (error) {
    res
      .status(500)
      .json(
        new HttpResponse(
          Code.INTERNAL_SERVER_ERROR,
          Status.BAD_REQUEST,
          "Server error"
        )
      );
  }
});

export default emailRouter;
