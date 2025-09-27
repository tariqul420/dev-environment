/** biome-ignore-all lint/correctness/noUnusedVariables: <> */

type Flag = "g" | "i" | "m" | "s" | "u" | "y";

type MatchItem = {
  text: string;
  index: number;
  length: number;
  groups: Record<string, string | undefined>;
};
