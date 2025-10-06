import { ImageResponse } from "next/og";
export const runtime = "edge";
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const ar = searchParams.get("title_ar");
  const en = searchParams.get("title_en");
  const title = searchParams.get("title") || ar || en || "مدونة عصرية خفيفة";
  const brand = searchParams.get("brand") || "#186687";
  const accent = searchParams.get("accent") || "#e87517";
  const bg = searchParams.get("bg") || "#f5f8fa";
  const logo = `${process.env.NEXT_PUBLIC_SITE_URL || ""}/header-totti.png`;
  return new ImageResponse(
    (<div style={{ width:1200, height:630, display:"flex", position:"relative" }}>
      <div style={{ position:"absolute", inset:0, background:`linear-gradient(135deg, ${bg}, ${brand}, ${accent})` }} />
      <div style={{ margin:"auto", textAlign:"center", color:"#fff", padding:"0 80px" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logo} width="120" height="120" />
        <div style={{ fontFamily:"Cairo, sans-serif", fontSize:64, lineHeight:1.2 }}>{title}</div>
        {en && <div style={{ fontFamily:"Inter, Arial", fontSize:36 }}>{en}</div>}
      </div>
    </div>), { width:1200, height:630 }
  );
}
