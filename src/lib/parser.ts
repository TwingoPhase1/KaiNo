// Interface defining the structure of a parsed shopping item
// Contains all possible extracted fields from natural language input
export interface ParsedItem {
  name: string;                    // The main article name (required)
  quantity?: string;               // Normalized quantity string (e.g. "3 packs", "500g", "1")
  price?: number;                  // Price in euros (extracted from € symbol)
  assignedTo?: string;             // Person assigned to buy this item
  unit?: string;                   // Unit of measurement if isolated
}

/**
 * Parse a shopping list input string to extract structured information
 * 
 * This function uses regex patterns to extract structured data from natural language input.
 * It processes the input in a specific order to handle overlapping patterns correctly.
 * 
 * Processing Order:
 * 1. Price extraction
 * 2. Assignment extraction (French & English)
 * 3. Quantity with unit extraction (e.g. "3 packs", "500g")
 * 4. Name cleanup (strip stop-words like de, d', of, etc.)
 */
export function parseShoppingItem(input: string): ParsedItem {
  const trimmed = input.trim();
  if (!trimmed) {
    return { name: '' };
  }

  let buffer = trimmed;
  let price: number | undefined;
  let assignedTo: string | undefined;
  let quantity: string | undefined;
  let unit: string | undefined;

  // 1. Price Extraction
  // Scan for numeric values immediately followed by €, $, EUR, or euros (e.g., 5€, 12.50€, 0.99 EUR)
  // Bounded digit count (max 8 digits before, 4 after decimal) and space (max 4) to eliminate ReDoS
  const priceRegex = /(\d{1,8}(?:[.,]\d{1,4})?)\s{0,4}(?:€|\$|EUR\b|euros\b|euro\b)/i;
  const priceMatch = buffer.match(priceRegex);
  if (priceMatch) {
    price = parseFloat(priceMatch[1].replace(',', '.'));
    buffer = buffer.replace(priceMatch[0], '').trim();
  }

  // 2. Assignment (Target) Extraction
  // Scan for indicators such as "pour", "by", "for", "par" followed by a name
  // Bounded spaces and name character lengths to prevent ReDoS
  const assignRegex = /\b(?:pour|by|for|par)\s{1,4}([a-zA-ZÀ-ÿ]{1,30})/i;
  const assignMatch = buffer.match(assignRegex);
  if (assignMatch) {
    assignedTo = assignMatch[1];
    buffer = buffer.replace(assignMatch[0], '').trim();
  }

  // 3. Quantity and Unit Extraction
  // Match "N pack(s) of" or "N pack(s)"
  const packRegex = /\b(\d{1,8})\s{0,4}(?:pack|packs)(?:\s{1,4}of)?\b/i;
  const packMatch = buffer.match(packRegex);
  if (packMatch) {
    quantity = `${packMatch[1]} packs`;
    unit = 'pack';
    buffer = buffer.replace(packMatch[0], '').trim();
  } else {
    // Match standard units: g, kg, l, ml, x (e.g., 500g, 1.5L, x2)
    // Bounded digit lengths and spaces to guarantee linear execution complexity
    const unitRegex = /\b(\d{1,8}(?:[.,]\d{1,4})?)\s{0,4}(g|kg|l|ml|x)\b/i;
    const unitMatch = buffer.match(unitRegex);
    if (unitMatch) {
      const val = unitMatch[1].replace(',', '.');
      const u = unitMatch[2].toLowerCase();
      quantity = `${val}${u}`;
      unit = u;
      buffer = buffer.replace(unitMatch[0], '').trim();
    } else {
      // Match simple leading number as quantity (e.g. "3 " at the start)
      const numStartRegex = /^(\d{1,8}(?:[.,]\d{1,4})?)\s{1,4}/;
      const numStartMatch = buffer.match(numStartRegex);
      if (numStartMatch) {
        quantity = numStartMatch[1].replace(',', '.');
        buffer = buffer.replace(numStartMatch[0], '').trim();
      }
    }
  }

  // If no explicit quantity is found, default to "1"
  if (!quantity) {
    quantity = "1";
  }

  // 4. Article Name Clean-up Rule
  // Replace multiple spaces with a single space first to prevent backtracking in subsequent regexes
  let name = buffer.replace(/\s+/g, ' ').trim();
  // Remove leading stop-words using a strictly linear single-space match
  name = name.replace(/^(?:de|d'|du|des|le|la|les|l'|un|une|of)\s/i, '').trim();
  // Remove trailing stop-words/conjunctions using a strictly linear single-space match anchored at the end
  name = name.replace(/\s(?:de|d'|du|des|le|la|les|l'|un|une|of)$/i, '').trim();

  return {
    name,
    quantity,
    price,
    assignedTo,
    unit,
  };
}

/**
 * Format a parsed item back to a string representation
 */
export function formatParsedItem(item: ParsedItem): string {
  const parts: string[] = [];

  if (item.quantity && item.quantity !== "1") {
    parts.push(item.quantity);
  }

  if (item.name) {
    parts.push(item.name);
  }

  if (item.assignedTo) {
    parts.push(`pour ${item.assignedTo}`);
  }

  if (item.price) {
    parts.push(`${item.price.toFixed(2)}€`);
  }

  return parts.join(' ');
}
