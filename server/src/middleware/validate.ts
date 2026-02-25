import type { Request, Response, NextFunction } from "express";
import type { z } from "zod";

export function validateBody<T extends z.ZodType>(schema: T) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      res
        .status(400)
        .json({
          error: "Failed to validate request body",
          details: result.error.flatten(),
        });
      return;
    }
    req.body = result.data as z.infer<T>;
    next();
  };
}

export function validateQuery<T extends z.ZodType>(schema: T) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      res.status(400).json({ error: "", details: result.error.flatten() });
      return;
    }
    req.query = result.data as z.infer<T>;
    next();
  };
}

export function validateParams<T extends z.ZodType>(schema: T) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.params);
    if (!result.success) {
      res
        .status(400)
        .json({ error: "Validation failed", details: result.error.flatten() });
      return;
    }
    req.params = result.data as z.infer<T>;
    next();
  };
}
