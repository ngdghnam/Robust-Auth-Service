import express, { Express, Request, Response } from "express";

// Logger
import logger from "./config/logger";
import morgan from "morgan";

// Helmet
import helmet from "helmet";

// ROUTES
import authRouter from "./routes/auth.route";
import userRouter from "./routes/user.route";
import notFoundRouter from "./routes/notFound.route";

import emailRouter from "./routes/emailTest.route";

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World! Welcome to my server");
});

// Format file.log
// Logger
const morganFormat = ":method :url :status :response-time ms";
app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);

// Routes
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/email", emailRouter);
// 404 Handler
app.use(notFoundRouter);
// test email route

export default app;
