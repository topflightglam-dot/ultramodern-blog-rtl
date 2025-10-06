"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
export default function Login(){
  const [p,setP] = useState(""); const r = useRouter();
  async function submit(e:any){ e.preventDefault();
    const ok = p && p === process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
    if (ok){ document.cookie = `admin=1;path=/`; r.push("/admin/editor-wysiwyg"); }
    else alert("Wrong password");
  }
  return (
    <form onSubmit={submit} className="max-w-sm mx-auto space-y-3 text-right">
      <h1 className="text-2xl font-semibold">تسجيل الدخول</h1>
      <input type="password" onChange={e=>setP(e.target.value)} className="w-full rounded-xl border px-3 py-2" placeholder="كلمة المرور" />
      <button className="tag">دخول</button>
    </form>
  );
}
