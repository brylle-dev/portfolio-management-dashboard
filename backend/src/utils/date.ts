export const parseDuration = (
  durationStr: string
): { amount: number; unit: "minutes" | "hours" | "days" } => {
  const match = durationStr.match(/^(\d+)([mhd])$/);
  if (!match) {
    return { amount: 7, unit: "days" };
  }

  const amount = parseInt(match[1] ?? "0", 10);
  const unit =
    match[2] === "m" ? "minutes" : match[2] === "h" ? "hours" : "days";

  return { amount, unit };
};

export const msFromDuration = (durationStr: string): number => {
  const match = durationStr.match(/^(\d+)([mhd])$/);
  if (!match) return 7 * 24 * 60 * 60 * 1000;
  const num = parseInt(match[1] ?? "0", 10);
  const unit = match[2];
  const mult =
    unit === "m"
      ? 60 * 1000
      : unit === "h"
      ? 60 * 60 * 1000
      : 24 * 60 * 60 * 1000;
  return num * mult;
};
