/**
 * Removes Vietnamese accents and diacritics from a string.
 * Converts everything to a base Latin string, useful for fuzzy searching.
 * 
 * @param {string} str - The input string.
 * @returns {string} The normalized, unaccented string.
 */
export function removeAccents(str: string): string {
  if (!str) return '';
  return str.normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd')
            .replace(/Đ/g, 'D');
}
