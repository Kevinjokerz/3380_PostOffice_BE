import { Request, Response, NextFunction } from 'express';
import { AnySchema } from 'joi';


const validateQuery = <T>(schema: AnySchema<T>) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const value = req.query;
    const result = schema.validate(value);
    if (result.error) {
      const firstError = result.error.details[0];
      return next(new Error(firstError.message));
    }
    return next();
  };
};

export { validateQuery };