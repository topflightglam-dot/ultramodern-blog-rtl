export default function PdfViewer({ src, height=720 }:{ src:string; height?:number }){
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
      <object data={src} type="application/pdf" className="w-full" style={{ height }}>
        <p className="p-4">لا يمكن عرض الملف — <a className="underline" href={src}>تحميل</a></p>
      </object>
    </div>
  );
}
