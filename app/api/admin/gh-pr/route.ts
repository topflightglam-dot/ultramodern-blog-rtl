import { NextResponse } from "next/server";
const GH_API = "https://api.github.com";
export async function POST(req: Request){
  try{
    const { slug, content, title } = await req.json();
    const token = process.env.GITHUB_TOKEN; const repo = process.env.GITHUB_REPO;
    const base = process.env.GITHUB_BASE_BRANCH || "main";
    const name = process.env.GITHUB_AUTHOR_NAME || "Bot";
    const email = process.env.GITHUB_AUTHOR_EMAIL || "bot@example.com";
    if (!token || !repo) return NextResponse.json({ ok:false, error:"Missing GitHub envs" }, { status:400 });
    const h = { Authorization:`Bearer ${token}`, Accept:"application/vnd.github+json" };

    const baseRes = await fetch(`${GH_API}/repos/${repo}/git/ref/heads/${base}`, { headers:h });
    const baseData = await baseRes.json(); const sha = baseData.object.sha;
    const branch = `content/${slug}-${Date.now()}`;
    await fetch(`${GH_API}/repos/${repo}/git/refs`, { method:"POST", headers:h, body:JSON.stringify({ ref:`refs/heads/${branch}`, sha }) });
    const path = `content/${slug}.mdx`;
    await fetch(`${GH_API}/repos/${repo}/contents/${encodeURIComponent(path)}`, {
      method:"PUT", headers:h,
      body: JSON.stringify({ message:`chore(content): ${slug}.mdx`, content: Buffer.from(content, "utf8").toString("base64"), branch,
        committer:{ name, email }, author:{ name, email } })
    });
    const pr = await fetch(`${GH_API}/repos/${repo}/pulls`, { method:"POST", headers:h, body: JSON.stringify({ title: title || `Add/Update ${slug}.mdx`, head: branch, base, body:"Automated PR" }) });
    const prData = await pr.json();
    return NextResponse.json({ ok:true, url: prData.html_url });
  }catch(e:any){ return NextResponse.json({ ok:false, error:e?.message || "error" }, { status:500 }); }
}
