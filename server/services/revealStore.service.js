const store = new Map();

export function saveReveal(hash, revealData) {
  store.set(hash, revealData);
}

export function getReveal(hash) {
  return store.get(hash);
}
