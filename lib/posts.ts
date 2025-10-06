import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";

const contentDir = path.join(process.cwd(), "content");

export function getAllSlugs(){
  if (!fs.existsSync(contentDir)) return [];
  return fs.readdirSync(contentDir).filter(f => /\.(mdx?)$/i.test(f)).map(f=>f.replace(/\.(mdx?)$/i,""));
}
export function getPostBySlug(slug:string){
  const full = path.join(contentDir, slug + ".mdx");
  const raw = fs.readFileSync(full, "utf8");
  const { content, data } = matter(raw);
  const rt = readingTime(content).text;
  return { slug, content, data, readingTime: rt };
}
