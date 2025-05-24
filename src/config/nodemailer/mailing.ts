import nodemailer from "nodemailer";
import logger from "../logger";
import dotenv from "dotenv";
import handlebars from "handlebars";
import fs from "fs";
dotenv.config();

export const transporter = nodemailer.createTransport({
  // service: "gmail",
  host: "smtp.gmail.com",
  secure: false,
  port: 587,
  auth: {
    user: process.env.SENDER_EMAIL,
    pass: process.env.SENDER_PASSWORD,
  },
});

export const sendingVerificationEmail = async (email: string) => {
  try {
    const source = fs
      .readFileSync("src/assets/template.html", "utf-8")
      .toString();

    const my_template = handlebars.compile(source);

    const info = await transporter.sendMail({
      from: "Super Idol <stghoainam4002@gmail.com>",
      to: email,
      subject: "Testing Auto Sender",
      text: "Sending email",
      html: my_template({}),
    });

    // Log the response information
    logger.info("Send email success");
    logger.info(`Email info.response: ${info.response}`);
    console.log("Email sent successfully. Response:", info.response);
    console.log("Full info object:", JSON.stringify(info, null, 2));

    return info;
  } catch (error) {
    logger.error("Sending email failed:", error);
    console.log("Email error:", error);
    throw error; // Re-throw the error so it can be handled in the route
  }
};
