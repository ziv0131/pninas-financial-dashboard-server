import { ZodIssue } from "zod";

export class InvalidRequestParametersError extends Error {

  constructor (errors: ZodIssue[]) {
    super();
    this.message = errors.map(({path, message}) =>
      `Invalid parameter "${path.join('.')}": ${message}`
    ).join('; ');
  }

}