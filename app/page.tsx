export default function Home(){
  return (
    <section className="space-y-10 text-right">
      {/* HERO_INSERT: page header image */}
      <div className="flex justify-center mb-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/header-totti.png" alt="Header" className="w-40 h-40 rounded-full border-4 border-slate-200 dark:border-slate-800 object-cover" />
      </div>
      <h1 className="text-3xl font-semibold">مرحبًا بك في المدونة</h1>
      <p className="text-slate-600">هذا القالب جاهز للنشر على Vercel مع RTL، دعم وسائط، محرّر WYSIWYG، وتحليلات.</p>
    </section>
  );
}
