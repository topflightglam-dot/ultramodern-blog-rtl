import { getAllSlugs, getPostBySlug } from "@/lib/posts";
import { MDXRemote } from "next-mdx-remote/rsc";
import type { Metadata } from "next";
import Video from "@/components/Video";
import PdfViewer from "@/components/PdfViewer";

export async function generateStaticParams(){ return getAllSlugs().map(slug=>({ slug })); }
export async function generateMetadata({ params }:{ params:{slug:string} }): Promise<Metadata> {
  const post = getPostBySlug(params.slug);
  const og = `${process.env.NEXT_PUBLIC_SITE_URL || ""}/api/og?title=${encodeURIComponent(post.data.title)}`;
  return { title: post.data.title, description: post.data.excerpt, openGraph: { images:[og] }, twitter:{ card:"summary_large_image", images:[og] } };
}
const components = { Video, PdfViewer };

export default function BlogPost({ params }:{ params:{slug:string} }){
  const post = getPostBySlug(params.slug);
  return (
    <article className="ar-prose max-w-none text-right">
      <h1 className="text-3xl font-semibold">{post.data.title}</h1>
      <p className="text-sm text-slate-500">{post.data.date} • {post.readingTime}</p>
      <MDXRemote source={post.content} components={components as any} />
    </article>
  );
}
