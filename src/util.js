export function noop() {}

let labelCount = 0;

export function resetIdentifiers() {
  labelCount = 0;
}

export function generateIdentifier(): string {
  return `progressive_form_generic_id_${labelCount++}`;
}

export const CHARCODES = {
  ENTER: 13, // LineFeed is never dispatched, it's always CR on the web.
  ESCAPE: 27,
  SPACE: 32,
};

Object.freeze(CHARCODES);
