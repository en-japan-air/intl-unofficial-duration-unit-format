const INITIAL_ZERO = /^0/;

function leftTrim(parts) {
  let previousEmpty = true;
  return parts.filter((token) => {
    if (token.type === 'literal' && !token.value.trim()) {
      if (previousEmpty) return false;
      previousEmpty = true;
    } else {
      previousEmpty = false;
    }
    return true;
  });
}

export default function(parts, trimFirstPaddedValue = false) {
  const trimmed = leftTrim(leftTrim(parts).reverse()).reverse();
  if (trimFirstPaddedValue) {
    const first = trimmed.find((token) => token.type !== 'literal');
    first.value = first.value.replace(INITIAL_ZERO, '');
  }
  return trimmed;
}
