export function formatVariantsString(options) {
  let valueString = '';
  if (!options) return '';
  for (const [key, value] of Object.entries(options)) {
    valueString = valueString + `${value} `; //${key}:
  }
  return valueString.substring(0, valueString.length); //- 2);
}
