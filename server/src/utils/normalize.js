/**
 * Normalizes a string by:
 * - converting it to lowercase
 * - removing diacritics (accents, umlauts, etc.)
 * 
 * @param {string} str - Input string to normalize
 * @returns {string} - Normalized string without diacritics and in lowercase
 */
export default function normalize(str) {
  if (!str) return ""; // Return empty string if input is null, undefined, or empty

  // 1) normalize("NFD") decomposes combined characters into base characters + diacritics
  // 2) replace(/[\u0300-\u036f]/g, "") removes all diacritic marks (Unicode range for combining marks)
  // 3) toLowerCase() converts the whole string to lowercase
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}
