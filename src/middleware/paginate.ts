import { Request, Response, NextFunction } from "express";

export interface PaginationQuery {
  page: number;
  limit: number;
  offset: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

/**
 * Pagination middleware. Parses ?page=1&limit=20 from query string.
 * Attaches parsed values to req.pagination.
 *
 * @example
 * router.get('/users', paginate({ defaultLimit: 20, maxLimit: 100 }), handler);
 */
export function paginate(options: { defaultLimit?: number; maxLimit?: number } = {}) {
  const { defaultLimit = 20, maxLimit = 100 } = options;

  return (req: Request & { pagination?: PaginationQuery }, _res: Response, next: NextFunction) => {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(maxLimit, Math.max(1, parseInt(req.query.limit as string) || defaultLimit));
    const offset = (page - 1) * limit;

    req.pagination = { page, limit, offset };
    next();
  };
}

/**
 * Create a paginated response object.
 */
export function paginatedResponse<T>(data: T[], total: number, query: PaginationQuery): PaginatedResponse<T> {
  const totalPages = Math.ceil(total / query.limit);
  return {
    data,
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages,
      hasNext: query.page < totalPages,
      hasPrev: query.page > 1,
    },
  };
}
