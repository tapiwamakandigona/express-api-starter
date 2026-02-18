import { generateToken } from "../middleware/auth";

describe("JWT Token Generation", () => {
  it("generates a valid JWT string", () => {
    const token = generateToken("user-123");
    expect(typeof token).toBe("string");
    expect(token.split(".").length).toBe(3); // JWT has 3 parts
  });

  it("generates different tokens for different users", () => {
    const token1 = generateToken("user-1");
    const token2 = generateToken("user-2");
    expect(token1).not.toBe(token2);
  });
});
