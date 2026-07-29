export function boxLabel(performance: number, potential: number) {
  const p = performance >= 75 ? 2 : performance >= 55 ? 1 : 0;
  const q = potential >= 78 ? 2 : potential >= 65 ? 1 : 0;
  const labels = [
    ["Risk", "Effective", "Trusted Professional"],
    ["Inconsistent Player", "Core Player", "High Performer"],
    ["Rough Diamond", "Future Star", "Star / Successor"],
  ];
  return labels[q][p];
}

export function boxIndex(performance: number, potential: number) {
  const p = performance >= 75 ? 2 : performance >= 55 ? 1 : 0;
  const q = potential >= 78 ? 2 : potential >= 65 ? 1 : 0;
  return { col: p, row: q };
}

export function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");
}
