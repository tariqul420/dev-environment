function variantsBD(phoneRaw: string) {
  const digits = String(phoneRaw).replace(/[^\d+]/g, "");
  const list = new Set<string>();

  // base guesses
  if (digits.startsWith("+")) list.add(digits);
  else list.add(digits);

  // 017... → +88017..., 88017...
  if (/^0\d{10}$/.test(digits)) {
    list.add("+88" + digits);
    list.add("88" + digits);
  }
  // +88017... → 017..., 88017...
  if (/^\+880\d{9}$/.test(digits)) {
    list.add(digits.replace("+880", "0"));
    list.add(digits.replace("+", ""));
  }
  // 88017... → 017..., +88017...
  if (/^880\d{9}$/.test(digits)) {
    list.add("0" + digits.slice(3));
    list.add("+" + digits);
  }

  // always include raw input too
  list.add(phoneRaw);

  return Array.from(list);
}
