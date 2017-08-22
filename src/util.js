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

export function isInputTypeSupported(type) {
  return getInputEffectiveType(type) === type;
}

const effectiveTypeCache = Object.create(null);
export function getInputEffectiveType(type) {
  if (Object.prototype.hasOwnProperty.call(effectiveTypeCache, type)) {
    return effectiveTypeCache[type];
  }

  const input = document.createElement('input');
  input.setAttribute('type', type);
  effectiveTypeCache[type] = input.type;

  return input.type;
}
