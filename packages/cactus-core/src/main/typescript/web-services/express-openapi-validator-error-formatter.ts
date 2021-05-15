import type {
  Request,
  Response,
  ErrorRequestHandler,
  NextFunction,
} from "express";

export interface IExpressOpenApiValidatorError {
  errors: Error[];
  message: string;
}

export function isOpenApiSpecValidationError(
  err: unknown,
): err is IExpressOpenApiValidatorError {
  return (
    !!err &&
    Array.isArray((err as IExpressOpenApiValidatorError).errors) &&
    (err as IExpressOpenApiValidatorError).message != null
  );
}

export const expressOpenApiValidatorErrorFormatter: ErrorRequestHandler = (
  err,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // According to the ExpressJS documentation if the request is already being
  // pumped through the wire then we must delegate to the default error handler
  if (res.headersSent) {
    return next(err);
  }
  // Otherwise we can format the response to our liking which we do here so that
  // errors stemming from OpenAPI validation are formatted as JSON rather than
  // HTML plain text
  res.status(err.status || 500).json(err);
};
