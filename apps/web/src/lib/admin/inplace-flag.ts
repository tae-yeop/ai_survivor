export function isInPlaceEditEnabled(
  env: Record<string, string | undefined> = process.env,
): boolean {
  const v = (env.INPLACE_EDIT_ENABLED ?? "true").trim().toLowerCase();
  return v === "1" || v === "true" || v === "yes";
}
