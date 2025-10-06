import { NextResponse } from "next/server";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
export const runtime = "nodejs";

const MAX_MB = parseInt(process.env.MAX_UPLOAD_MB || "25", 10);
const ALLOWED = ["image/","application/pdf","video/mp4"];

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file") as unknown as File | null;
    if (!file) return NextResponse.json({ ok:false, error:"no file" }, { status:400 });
    const type = file.type || "application/octet-stream";
    if (!ALLOWED.some(p=>type.startsWith(p))) return NextResponse.json({ ok:false, error:`type not allowed: ${type}` }, { status:400 });

    const arr = await file.arrayBuffer();
    const buf = Buffer.from(arr);
    const sizeMB = buf.byteLength/(1024*1024);
    if (sizeMB > MAX_MB) return NextResponse.json({ ok:false, error:`too large: ${sizeMB.toFixed(1)}MB > ${MAX_MB}MB` }, { status:400 });

    const ext = (file.name.split(".").pop() || (type.startsWith("image/")?type.split("/")[1]:"bin")).toLowerCase();
    const filename = crypto.randomBytes(8).toString("hex")+"."+ext;

    const token = process.env.VERCEL_BLOB_RW_TOKEN || process.env.VERCEL_BLOB_READ_WRITE_TOKEN;
    const accountId = process.env.VERCEL_BLOB_ACCOUNT_ID;
    if (token) {
      const endpoint = accountId? `https://api.vercel.com/v2/blob?accountId=${accountId}`: `https://api.vercel.com/v2/blob`;
      const up = await fetch(endpoint, { method:"POST", headers:{ Authorization:`Bearer ${token}`, "Content-Type":type }, body:buf });
      if (!up.ok){ const text = await up.text(); return NextResponse.json({ ok:false, error:`blob upload failed: ${text}` }, { status:400 }); }
      const data = await up.json();
      return NextResponse.json({ ok:true, url:data.url, contentType:type });
    }

    if (process.env.NODE_ENV==="production") return NextResponse.json({ ok:false, error:"No Blob token in production" }, { status:400 });
    const pub = path.join(process.cwd(), "public", "uploads");
    fs.mkdirSync(pub, { recursive: true });
    const dest = path.join(pub, filename);
    fs.writeFileSync(dest, buf);
    return NextResponse.json({ ok:true, url:`/uploads/${filename}`, contentType:type });
  } catch (e:any) {
    return NextResponse.json({ ok:false, error:e?.message || "upload error" }, { status:500 });
  }
}
