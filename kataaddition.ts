export type Comparable = {
  value: number;
};

export const max = (a: Comparable, b: Comparable) => {
  return a.value < b.value ? b : a;
};
