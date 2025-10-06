import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
export const runtime = "nodejs";
export async function POST(req: Request){
  const { slug, content } = await req.json();
  if (!slug || !content) return NextResponse.json({ ok:false }, { status:400 });
  const isProd = process.env.NODE_ENV === "production";
  const p = path.join(process.cwd(), "content", `${slug}.mdx`);
  if (isProd){
    return new Response(content, { headers: { "Content-Type":"text/markdown", "Content-Disposition":`attachment; filename="${slug}.mdx"` } });
  } else {
    fs.mkdirSync(path.dirname(p), { recursive:true });
    fs.writeFileSync(p, content, "utf8");
    return NextResponse.json({ ok:true, path: p });
  }
}
