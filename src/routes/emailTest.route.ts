import express, { Router, Request, Response } from "express";
import { sendingVerificationEmail } from "../config/nodemailer/mailing";
import { Code } from "../enums/code.enum";
import { Status } from "../enums/status.enum";
import HttpResponse from "../config/response";
import logger from "../config/logger";

const emailRouter: Router = Router();

emailRouter.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    if (email) {
      const sent_email = await sendingVerificationEmail(email);

      // Log the response if email was sent successfully
      if (sent_email && sent_email.response) {
        logger.info(`Email response: ${sent_email.response}`);
        console.log("Email info.response:", sent_email.response);
      }

      res.json(
        new HttpResponse(
          Code.SUCCESS,
          Status.SUCCESS,
          "Send email successfully",
          {
            email_response: sent_email?.response || "No response available",
          }
        )
      );
      return;
    }
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
