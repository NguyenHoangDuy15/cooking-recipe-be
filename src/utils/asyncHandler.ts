import type { Request, Response, NextFunction } from 'express';

/**
 * Wraps an async route handler to pass errors to the global error handler automatically.
 */
export const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => 
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
