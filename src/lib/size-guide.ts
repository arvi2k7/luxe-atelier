export const SIZE_GUIDE: Record<string, {
  columns: string[];
  rows: Array<{ size: string; measurements: string[] }>;
  note?: string;
}> = {
  Outerwear: {
    columns: ["Size", "Chest (cm)", "Waist (cm)", "Hip (cm)", "Length (cm)"],
    rows: [
      { size: "XS", measurements: ["82–86", "66–70", "88–92", "95"] },
      { size: "S",  measurements: ["86–90", "70–74", "92–96", "97"] },
      { size: "M",  measurements: ["90–94", "74–78", "96–100", "99"] },
      { size: "L",  measurements: ["94–98", "78–82", "100–104", "101"] },
      { size: "XL", measurements: ["98–104", "82–88", "104–110", "103"] },
    ],
    note: "Outerwear is cut with a relaxed fit. If between sizes, size down for a closer cut.",
  },
  Evening: {
    columns: ["Size", "Bust (cm)", "Waist (cm)", "Hip (cm)", "Length (cm)"],
    rows: [
      { size: "XS", measurements: ["80–84", "62–66", "86–90", "135"] },
      { size: "S",  measurements: ["84–88", "66–70", "90–94", "136"] },
      { size: "M",  measurements: ["88–92", "70–74", "94–98", "137"] },
      { size: "L",  measurements: ["92–96", "74–78", "98–102", "138"] },
    ],
    note: "Bias-cut pieces follow the body — take your usual size unless you prefer more ease.",
  },
  Accessories: {
    columns: ["Size", "Fits wrist/neck"],
    rows: [{ size: "One Size", measurements: ["Universal — adjustable"] }],
  },
  Archive: {
    columns: ["Size", "Chest (cm)", "Waist (cm)", "Hip (cm)"],
    rows: [
      { size: "S",  measurements: ["86–90", "70–74", "92–96"] },
      { size: "M",  measurements: ["90–94", "74–78", "96–100"] },
      { size: "L",  measurements: ["94–98", "78–82", "100–104"] },
    ],
    note: "Archive cuts vary by original season. Check individual product fit notes.",
  },
};
