// Brazilian phone normalization, following the same convention as
// legendarios-top/src/lib/whatsapp.ts (E.164-like digits with 55 prefix).

/**
 * Normalize a Brazilian phone into digits prefixed with country code 55.
 * Returns null when the number cannot be a valid BR phone (DDD + 8/9 digits).
 */
export function normalizePhoneBR(raw: string): string | null {
  const digits = (raw ?? "").replace(/\D/g, "");
  if (digits.startsWith("55") && (digits.length === 12 || digits.length === 13)) {
    return digits;
  }
  if (digits.length === 10 || digits.length === 11) {
    return `55${digits}`;
  }
  return null;
}
