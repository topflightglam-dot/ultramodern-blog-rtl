import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
const contentDir = path.join(process.cwd(), "content");
const files = fs.existsSync(contentDir) ? fs.readdirSync(contentDir).filter(f=>/\.(mdx?)$/i.test(f)) : [];
const docs = files.map(fn=>{ const raw=fs.readFileSync(path.join(contentDir, fn),"utf8"); const {content,data}=matter(raw); const slug=fn.replace(/\.(mdx?)$/i,""); return { slug, title:data.title||slug, excerpt:data.excerpt||"", content }; });
fs.mkdirSync(path.join(process.cwd(),"public"), { recursive:true });
fs.writeFileSync(path.join(process.cwd(),"public","search-index.json"), JSON.stringify({ docs }, null, 2));
console.log("✅ search-index.json generated with", docs.length, "docs");
