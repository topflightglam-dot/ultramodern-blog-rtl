"use client";
import { useLang } from "@/lib/useLang";
export default function LanguageSwitcher(){
  const { lang, setLang } = useLang();
  return (
    <select className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-1"
      value={lang} onChange={(e)=>setLang(e.target.value as any)}>
      <option value="ar">العربية</option>
      <option value="en">English</option>
    </select>
  );
}
