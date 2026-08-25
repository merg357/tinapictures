function mergeSettings(current = {}, patch = {}) {
  return { ...current, ...patch };
}

module.exports = { mergeSettings };
