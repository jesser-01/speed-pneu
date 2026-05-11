/**
 * Locale-agnostic number parsing.
 * Handles cases like:
 * - "240,50" (comma decimal)
 * - "1 200,00" or "1\u00A0000,00" (spaces + comma decimal)
 * - "1.200,00" (thousand dot + comma decimal)
 */

export function parseFlexibleNumber(value) {
  if (value === null || value === undefined) return 0;

  // Convert non-string values (number, etc.) safely
  const raw = typeof value === 'string' ? value : String(value);

  // Normalize
  const cleaned = raw
    // remove non-breaking spaces and normal spaces
    .replace(/\u00A0/g, ' ')
    .replace(/\s+/g, '')
    .trim();

  if (!cleaned) return 0;

  // If both '.' and ',' exist, assume '.' are thousands separators and ',' is decimal.
  if (cleaned.includes('.') && cleaned.includes(',')) {
    const withoutThousands = cleaned.replace(/\./g, '');
    const decimalNormalized = withoutThousands.replace(/,/g, '.');
    const n = Number(decimalNormalized);
    return Number.isFinite(n) ? n : 0;
  }

  // If only ',' exists, assume it's decimal separator.
  if (cleaned.includes(',')) {
    const decimalNormalized = cleaned.replace(/,/g, '.');
    const n = Number(decimalNormalized);
    return Number.isFinite(n) ? n : 0;
  }

  // Otherwise parse as plain number (may contain '.' decimal)
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : 0;
}

