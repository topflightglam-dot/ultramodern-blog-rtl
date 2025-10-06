"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { dict } from "./i18n";
type Lang = "ar" | "en";
const Ctx = createContext<{lang:Lang; t:(k:string)=>string; setLang:(l:Lang)=>void}>(null as any);
export function LangProvider({children}:{children:React.ReactNode}){
  const [lang,setLang] = useState<Lang>((typeof document!=="undefined" && (document.cookie.match(/lang=(ar|en)/)?.[1] as Lang)) || "ar");
  useEffect(()=>{ document.cookie = `lang=${lang};path=/;max-age=31536000`; document.documentElement.lang = lang; document.documentElement.dir = lang==="ar"?"rtl":"ltr"; },[lang]);
  const t = (k:string)=> (dict as any)[lang]?.[k] || k;
  return <Ctx.Provider value={{lang,setLang,t}}>{children}</Ctx.Provider>;
}
export function useLang(){ return useContext(Ctx); }
