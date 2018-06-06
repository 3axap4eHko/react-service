function hashCode(string = '') {
  let hash = 0, i, chr;
  if (string.length === 0) {
    return hash;
  }
  for (i = 0; i < string.length; i++) {
    chr = string.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash.toString(16);
}

export function getHash(props) {
  const { name, params } = props;
  return hashCode(JSON.stringify({ name, params }));
}


export function createPool(item) {
  const buffer = [item];

  return {
    push(...items) {
      buffer.push(...items);
    },
    next() {
      buffer.splice(0, 1);
    },
    get length() {
      return buffer.length;
    },
    get value() {
      return buffer[0];
    },
    get done() {
      return buffer.length === 0;
    },
  };
}