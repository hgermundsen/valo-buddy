import { Strat } from "@prisma/client";

export function replaceEmptyStringsWithNull(obj: Partial<Strat>) {
  // TODO: Is this really the most efficient way to do this?
  return Object.entries(obj).reduce(
    (acc: Record<string, unknown>, [key, value]) => {
      // If the value is an array, keep it as is
      if (Array.isArray(value)) {
        acc[key] = value;
      } else {
        // If the value is an empty string, replace it with null
        acc[key] = value === "" ? null : value;
      }
      return acc;
    },
    {} as Partial<Strat>,
  );
}
