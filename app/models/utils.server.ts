export function replaceEmptyStringsWithNull(obj: object): object {
  // TODO: Is this really the most efficient way to do this?
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [
      key,
      typeof value === "object"
        ? replaceEmptyStringsWithNull(value)
        : value === ""
        ? null
        : value,
    ]),
  );
}
