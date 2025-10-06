import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
export const runtime = "nodejs";
export async function GET(req: Request){
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");
  if (!slug) return NextResponse.json({});
  const p = path.join(process.cwd(), "content", `${slug}.mdx`);
  if (!fs.existsSync(p)) return NextResponse.json({});
  const content = fs.readFileSync(p, "utf8");
  return NextResponse.json({ content });
}
