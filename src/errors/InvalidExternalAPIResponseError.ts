import { AxiosResponse } from "axios";
import { ZodIssue } from "zod";

export class InvalidExternalAPIResponseError extends Error {
  constructor(
    response: AxiosResponse,
    responseErrors: ZodIssue[],
    endpoint: string
  ) {
    super();
    this.message = `Recieved an invalid response when fetching data from endpoint '/${endpoint}';
    There were problems in the following parameters: ${responseErrors.map(
      ({ message, path }) => `${path}: "${message}";`
    )} status code: ${response.status}; message: ${response.statusText}`;
  }
}
