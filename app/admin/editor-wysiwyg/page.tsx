'use client';
import React, { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';

export default function EditorWysiwygPage(){
  const [slug, setSlug] = useState('hello-world');
  const [title, setTitle] = useState('مقال تجريبي');
  const [date, setDate] = useState<string>(()=> new Date().toISOString().slice(0,10));
  const [excerpt, setExcerpt] = useState('');

  const editor = useEditor({
    extensions: [StarterKit, Link.configure({ openOnClick:true }), Image, Placeholder.configure({ placeholder:'اكتب المحتوى هنا…' })],
    content: '<p>ابدأ الكتابة…</p>',
    editorProps: {
      handleDrop: (view, event) => {
        const dt = event.dataTransfer; if(!dt || !dt.files?.length) return false;
        for (const f of Array.from(dt.files)) if (f.type.startsWith('image/')||f.type==='application/pdf'||f.type==='video/mp4') upload(f);
        return true;
      }
    }
  }, []);

  async function upload(file: File){
    const fd = new FormData(); fd.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    const j = await res.json();
    if (j.ok && j.url) {
      if (file.type.startsWith('image/')) editor?.chain().focus().setImage({ src: j.url, alt: file.name }).run();
      else if (file.type === 'application/pdf') editor?.chain().focus().insertContent(`<p>📄 <a href="${j.url}" target="_blank" rel="noreferrer">ملف PDF</a></p>`).run();
      else if (file.type === 'video/mp4') editor?.chain().focus().insertContent(`<video controls src="${j.url}" style="width:100%;border-radius:12px"></video>`).run();
    } else alert('فشل الرفع: ' + (j.error||''));
  }

  async function save(){
    const html = editor?.getHTML() || '';
    const { default: Turndown } = await import('turndown');
    const td = new Turndown({ headingStyle:'atx', codeBlockStyle:'fenced' });
    td.keep(['video','source']); // keep video tags
    const md = td.turndown(html);
    const fm = ['---',`title: "${title}"`,`date: "${date}"`, excerpt?`excerpt: "${excerpt}"`:'','---','', md, ''].filter(Boolean).join('\n');
    const r = await fetch('/api/admin/save', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ slug, content: fm }) });
    if (r.headers.get('Content-Disposition')){ const b=await r.blob(); const u=URL.createObjectURL(b); const a=document.createElement('a'); a.href=u; a.download=`${slug}.mdx`; a.click(); URL.revokeObjectURL(u); }
    else { const j = await r.json(); alert(j.ok ? 'تم الحفظ' : 'فشل الحفظ'); }
  }

  return (
    <section className="space-y-3 text-right">
      <h1 className="text-2xl font-semibold">محرّر WYSIWYG</h1>
      <div className="grid md:grid-cols-2 gap-2">
        <input value={slug} onChange={e=>setSlug(e.target.value)} className="rounded-xl border px-3 py-2" placeholder="slug" />
        <input value={title} onChange={e=>setTitle(e.target.value)} className="rounded-xl border px-3 py-2" placeholder="العنوان" />
        <input type="date" value={date} onChange={e=>setDate(e.target.value)} className="rounded-xl border px-3 py-2" />
        <input value={excerpt} onChange={e=>setExcerpt(e.target.value)} className="rounded-xl border px-3 py-2 md:col-span-2" placeholder="الملخّص" />
      </div>
      <EditorContent editor={editor} />
      <div className="flex gap-2">
        <button onClick={save} className="tag">حفظ</button>
      </div>
    </section>
  );
}
