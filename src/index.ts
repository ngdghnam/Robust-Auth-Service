import express, { Express, Request, Response } from "express";

// Logger
import logger from "./config/logger";
import morgan from "morgan";

// STATUS & HTTP RESPONSE
import { Code } from "./enums/code.enum";
import { Status } from "./enums/status.enum";
import HttpResponse from "./config/response";

// ROUTES
import authRouter from "./routes/auth.route";
import userRouter from "./routes/user.route";
import notFoundRouter from "./routes/notFound.route";

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World! Welcome to my server");
});

// Format file.log
const morganFormat = ":method :url :status :response-time ms";
// Logger
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
// 404 Handler
app.use(notFoundRouter);

export default app;
