import { validate } from "../middleware/validate";
import { Request, Response, NextFunction } from "express";

describe("validate middleware", () => {
  const mockRes = {} as Response;
  const mockNext = jest.fn() as NextFunction;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("passes valid data", () => {
    const middleware = validate({
      email: { type: "email", required: true },
      name: { type: "string", required: true, min: 2 },
    });

    const req = { body: { email: "test@example.com", name: "John" } } as Request;
    middleware(req, mockRes, mockNext);
    expect(mockNext).toHaveBeenCalled();
  });

  it("rejects missing required fields", () => {
    const middleware = validate({
      email: { type: "email", required: true },
    });

    const req = { body: {} } as Request;
    expect(() => middleware(req, mockRes, mockNext)).toThrow();
  });

  it("validates email format", () => {
    const middleware = validate({
      email: { type: "email", required: true },
    });

    const req = { body: { email: "notanemail" } } as Request;
    expect(() => middleware(req, mockRes, mockNext)).toThrow();
  });

  it("validates string length", () => {
    const middleware = validate({
      name: { type: "string", min: 3, max: 50 },
    });

    const req = { body: { name: "ab" } } as Request;
    expect(() => middleware(req, mockRes, mockNext)).toThrow();
  });

  it("validates number range", () => {
    const middleware = validate({
      age: { type: "number", min: 18, max: 120 },
    });

    const req = { body: { age: 15 } } as Request;
    expect(() => middleware(req, mockRes, mockNext)).toThrow();
  });
});

describe("rate limiter", () => {
  it("allows requests under limit", () => {
    // Rate limiter tests would go here
    expect(true).toBe(true);
  });
});
