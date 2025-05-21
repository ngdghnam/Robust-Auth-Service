import express from "express";

import { Code } from "../enums/code.enum";
import { Status } from "../enums/status.enum";
import HttpResponse from "../config/response";

import logger from "../config/logger";

const notFoundRouter = (_: express.Request, res: express.Response) => {
  logger.error("Not found path");
  res
    .status(Code.PATH_NOT_FOUND)
    .json(
      new HttpResponse(
        Code.PATH_NOT_FOUND,
        Status.PATH_NOT_FOUND,
        "Sorry, the path you're looking for doesn't exist :("
      )
    );
};

export default notFoundRouter;
