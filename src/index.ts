import express, { Express, Request, Response } from "express";

// Logger
import logger from "./config/logger";
import morgan from "morgan";

// ROUTES
import authRouter from "./routes/auth.route";

const app: Express = express();
// Add this middleware for parsing request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
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
app.use("/auth", authRouter);

// 404 Handler
app.use((_, res) => {
  res.status(404).json({ message: "Path not found" });
});

export default app;
