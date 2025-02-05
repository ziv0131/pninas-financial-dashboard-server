import { HttpStatusCode } from "axios";
import {
  InvalidRequestParametersError,
  InvalidExternalAPIResponseError,
} from "../errors";
import { getLogger } from "../services";
import { Response } from "express";

const logger = getLogger();

export const handleErrors = (error: any, res: Response) => {
  if (error instanceof InvalidRequestParametersError) {
    logger.info(
      `Request was recieved with invalid request parameters; invalid parameters: ${error.message}`
    );
    res.status(HttpStatusCode.BadRequest).send(error.message);
  }
  if (error instanceof InvalidExternalAPIResponseError) {
    logger.error(error.message);
    res
      .status(HttpStatusCode.InternalServerError)
      .send("Couldn't get the requested data.");
  } else {
    logger.emerg(`Error occurred, server can't start: ${error}`);
    res
      .status(HttpStatusCode.InternalServerError)
      .send("Couldn't handle the request.");
  }
};
