function parseLayoutParams(template) {
  const match = template.match(/\{\{\#>\s*(\w+)(?:\s+([^}]+))?\}\}/);
  if (!match) return {};

  const [, layoutName, attrsStr] = match;
  const context = { layout: layoutName };

  if (attrsStr) {
    attrsStr.trim().split(/\s+/).forEach(attr => {
      const m = attr.match(/(\w+)="([^"]+)"/);
      if (m) context[m[1]] = m[2];
    });
  }
  return context;
}

module.exports = parseLayoutParams;

