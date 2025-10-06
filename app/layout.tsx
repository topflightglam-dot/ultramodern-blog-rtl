import "./globals.css";
import Navbar from "@/components/Navbar";
import SiteAnalytics from "@/components/Analytics";
import { LangProvider } from "@/lib/useLang";

export const metadata = {
  title: "UltraModern RTL Blog",
  description: "مدونة عصرية خفيفة RTL"
};

export default function RootLayout({ children }:{ children: React.ReactNode }){
  return (
    <html lang="ar" dir="rtl">
      <body>
        <LangProvider>
          <Navbar />
          <div id="progress-bar"></div>
          <main className="container py-8">{children}</main>
          <SiteAnalytics />
        </LangProvider>
      </body>
    </html>
  );
}
