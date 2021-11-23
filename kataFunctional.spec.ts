import { Comparable, max } from "./kataaddition";

describe("math", () => {
  it("should return 4 for max(4, 3)", () => {
    const a: Comparable = { value: 4 };
    const b: Comparable = { value: 3 };
    expect(max(a, b)).toBe(a);
  });
  it("should return 4 for max(3, 4)", () => {
    const a: Comparable = { value: 3 };
    const b: Comparable = { value: 4 };
    expect(max(a, b)).toBe(b);
  });
  it("should return 4 for max(4, 4)", () => {
    const a: Comparable = { value: 4 };
    const b: Comparable = { value: 4 };
    expect(max(a, b)).toBe(a);
  });
  it("should return 5 for max(5, 5)", () => {
    const a: Comparable = { value: 5 };
    const b: Comparable = { value: 5 };
    expect(max(b, a)).toBe(b);
  });
});
