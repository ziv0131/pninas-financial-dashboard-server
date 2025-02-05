import axios from "axios";
import { InvalidExternalAPIResponseError } from "../errors/InvalidExternalAPIResponseError";
import { ZodIssue, ZodSchema } from "zod";
import { externalAPIResponseSchema } from "../validation";

export const fetchData = async (endpoint: string, params: {}) => {
  const response = await axios.get(
    `${process.env.EXTERNAL_API_PREFIX}/${endpoint}`,
    {
      headers: {
        Authorization: process.env.EXTERNAL_API_AUTHORIZATION_KEY,
      },
      params,
    }
  );

  const responseValidationResult =
    externalAPIResponseSchema.safeParse(response);

  if (!responseValidationResult.success) {
    responseValidationResult.error.errors;
    throw new InvalidExternalAPIResponseError(
      response,
      responseValidationResult.error.errors,
      endpoint
    );
  }

  return responseValidationResult.data;
};

export const fetchDataWithPagination = async (
  endpoint: string,
  queryParams: object = {},
  validationSchema: ZodSchema,
  cursor: number = 1,
  per_page: number = 50,
  data: any[] = [],
  corruptedData: { record: {}; errors: ZodIssue[] }[] = []
) => {
  let next_cursor: number | undefined = cursor;

  while (!!next_cursor) {
    Object.assign(queryParams, { ...queryParams, next_cursor, per_page });
    const { data, meta } = await fetchData(endpoint, queryParams);
    await data.forEach((record) => {
      const validationResult = validationSchema.safeParse(record);
      validationResult.success
        ? data.push(validationResult.data)
        : corruptedData.push({ record, errors: validationResult.error.errors });
    });
    next_cursor = meta.next_cursor;
  }

  return { data, corruptedData };
};
