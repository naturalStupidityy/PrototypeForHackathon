import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";

export const runtime = "nodejs";

export async function GET() {
  try {
    // Resolve the JSON file relative to this route file location
    const filePath = fileURLToPath(new URL("../../../data/terminology.json", import.meta.url));
    const file = await fs.readFile(filePath, "utf8");
    const json = JSON.parse(file);
    return NextResponse.json(json);
  } catch {
    return NextResponse.json({ error: "Failed to load terminology" }, { status: 500 });
  }
}


