import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";

export const runtime = "nodejs";

type CsvRow = {
  NAMASTE_Code: string;
  NAMASTE_Term: string;
  ICD11_TM2_Code: string;
  ICD11_TM2_Term: string;
  Validation_Status: string;
  Confidence_Score: string;
  Last_Updated: string;
};

function parseCsv(csv: string): CsvRow[] {
  const lines = csv.trim().split(/\r?\n/);
  const [headerLine, ...rows] = lines;
  const headers = headerLine.split(",");
  return rows
    .filter((l) => l.trim().length > 0)
    .map((line) => {
      const cols = line.split(",");
      const obj: Partial<CsvRow> = {};
      headers.forEach((h, i) => {
        // @ts-expect-error index assignment mapped from CSV header
        obj[h] = cols[i] ?? "";
      });
      return obj as CsvRow;
    });
}

export async function GET() {
  try {
    const filePath = fileURLToPath(new URL("../../../data/sample-mappings.csv", import.meta.url));
    const csv = await fs.readFile(filePath, "utf8");
    const rows = parseCsv(csv);

    const nodeMap = new Map<string, { id: string; name: string; category: number; status: string; symbolSize: number }>();
    const links: Array<{ source: string; target: string; value: number }> = [];

    for (const r of rows) {
      const namasteId = r.NAMASTE_Code;
      const icdId = r.ICD11_TM2_Code;
      const status = (r.Validation_Status || "").toLowerCase();
      const confidence = Number(r.Confidence_Score || 0);

      if (!nodeMap.has(namasteId)) {
        nodeMap.set(namasteId, {
          id: namasteId,
          name: r.NAMASTE_Term,
          category: 0,
          status,
          symbolSize: 40,
        });
      }
      if (!nodeMap.has(icdId)) {
        nodeMap.set(icdId, {
          id: icdId,
          name: r.ICD11_TM2_Term,
          category: 1,
          status,
          symbolSize: 40,
        });
      }

      links.push({ source: namasteId, target: icdId, value: Math.max(0.1, Math.min(1, confidence)) });
    }

    const nodes = Array.from(nodeMap.values());

    return NextResponse.json({ nodes, links });
  } catch (_err) {
    return NextResponse.json({ error: "Failed to load mappings" }, { status: 500 });
  }
}


