export const getFormatNumber = (value: number | string): string => {
  const num =
    typeof value === "string"
      ? parseFloat(value.replace(/[^0-9.]/g, ""))
      : value;

  if (isNaN(num)) return value.toString();

  if (num >= 1_000_000_000) {
    return `${(num / 1_000_000_000).toFixed(2)}B`.replace(".0B", "B");
  } else if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(2)}M`.replace(".0M", "M");
  } else if (num >= 1_000) {
    return `${(num / 1_000).toFixed(2)}k`.replace(".0k", "k");
  }
  return num.toString();
};
