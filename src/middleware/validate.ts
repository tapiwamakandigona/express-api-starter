import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler';

type Schema = Record<string, {
  type: 'string' | 'number' | 'boolean' | 'email';
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: RegExp;
}>;

/**
 * Request body validation middleware.
 * 
 * @example
 * router.post('/users', validate({
 *   email: { type: 'email', required: true },
 *   name: { type: 'string', required: true, min: 2, max: 100 },
 *   age: { type: 'number', min: 18, max: 120 },
 * }), handler);
 */
export function validate(schema: Schema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const errors: string[] = [];
    
    for (const [field, rules] of Object.entries(schema)) {
      const value = req.body[field];
      
      // Required check
      if (rules.required && (value === undefined || value === null || value === '')) {
        errors.push(`${field} is required`);
        continue;
      }
      
      if (value === undefined || value === null) continue;
      
      // Type checks
      if (rules.type === 'email') {
        if (typeof value !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errors.push(`${field} must be a valid email`);
        }
      } else if (rules.type === 'number') {
        const num = Number(value);
        if (isNaN(num)) {
          errors.push(`${field} must be a number`);
        } else {
          if (rules.min !== undefined && num < rules.min) errors.push(`${field} must be >= ${rules.min}`);
          if (rules.max !== undefined && num > rules.max) errors.push(`${field} must be <= ${rules.max}`);
        }
      } else if (rules.type === 'string') {
        if (typeof value !== 'string') {
          errors.push(`${field} must be a string`);
        } else {
          if (rules.min !== undefined && value.length < rules.min) errors.push(`${field} must be at least ${rules.min} characters`);
          if (rules.max !== undefined && value.length > rules.max) errors.push(`${field} must be at most ${rules.max} characters`);
          if (rules.pattern && !rules.pattern.test(value)) errors.push(`${field} format is invalid`);
        }
      }
    }
    
    if (errors.length > 0) {
      throw new AppError(errors.join('; '), 400);
    }
    
    next();
  };
}
