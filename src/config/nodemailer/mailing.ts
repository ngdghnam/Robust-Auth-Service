import nodemailer from "nodemailer";
import logger from "../logger";
import dotenv from "dotenv";
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
    const info = await transporter.sendMail({
      from: "Hoai Nam <stghoainam4002@gmail.com>",
      to: email,
      subject: "Testing Auto Sender",
      text: "Sending my first email",
      html: "<b>Testing email sender</b>",
    });
    logger.info("send email success");
    return info;
  } catch (error) {
    logger.error("Sending email is not worked");
    console.log(">>>", error);
  }
};
