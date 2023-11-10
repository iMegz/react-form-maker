export default {
  minmax(field: string, value: number, min = true) {
    const minOrMax = min ? "least" : "most";
    const s = value > 1 ? "s" : "";
    return `${field} must be at ${minOrMax} ${value} character${s}`;
  },
  size(field: string, subField: string, value: number, min = true) {
    const minOrMax = min ? "least" : "most";
    const s = value > 1 ? "s" : "";
    return `${field} must have at ${minOrMax} ${value} ${subField}${s}`;
  },
  isPositive(field: string) {
    return `${field} must have a positive value`;
  },
};
