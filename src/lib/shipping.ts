export function getDeliveryEstimate(country: string): string | null {
  if (!country) return null;
  const today = new Date();
  const dispatchDate = new Date(today);
  let daysAdded = 0;
  while (daysAdded < 2) {
    dispatchDate.setDate(dispatchDate.getDate() + 1);
    if (dispatchDate.getDay() !== 0 && dispatchDate.getDay() !== 6) daysAdded++;
  }

  const ranges: Record<string, [number, number]> = {
    GB: [2, 3], US: [7, 10], CA: [7, 10],
    AU: [10, 14], default: [10, 16],
  };
  const EU = ["DE","FR","IT","ES","NL","BE","PT","SE","DK","NO","FI","AT","CH"];
  const key = EU.includes(country.toUpperCase()) ? "EU" : (ranges[country.toUpperCase()] ? country.toUpperCase() : "default");
  const euRange: [number, number] = [4, 6];
  const [min, max] = key === "EU" ? euRange : (ranges[key] ?? ranges.default);

  const earliest = new Date(dispatchDate);
  const latest = new Date(dispatchDate);
  earliest.setDate(earliest.getDate() + min);
  latest.setDate(latest.getDate() + max);

  const fmt = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return `Estimated delivery: ${fmt(earliest)} – ${fmt(latest)}`;
}
