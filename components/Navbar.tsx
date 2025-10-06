"use client";
import Link from "next/link";
import LanguageSwitcher from "./LanguageSwitcher";
import { useLang } from "@/lib/useLang";
export default function Navbar(){
  const { t } = useLang();
  return (
    <header className="border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 bg-white/80 dark:bg-slate-900/70 backdrop-blur">
      <div className="container flex items-center justify-between py-3">
        <Link href="/" className="font-semibold tracking-tight text-xl flex items-center gap-2">
          {/* HEADER_AVATAR */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/header-totti.png" alt="logo" className="w-8 h-8 rounded-full border border-slate-300 dark:border-slate-700" />
          {t("blog")}
        </Link>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
