import { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * Wraps an async route handler so any thrown error / rejected promise is
 * forwarded to Express's error-handling middleware.
 *
 * In Express 4 an error thrown inside an async handler *after* an `await`
 * becomes an unhandled promise rejection and never reaches `errorHandler`
 * (the client hangs / gets a generic crash). Wrapping with this restores
 * the expected behaviour.
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>,
): RequestHandler {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
