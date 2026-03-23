import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "VibeCoding AI - 블로그 리뷰 생성기",
  description: "사진 몇 장으로 맛집 블로그 리뷰 초안을 완성하세요.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="bg-[#f8fafc] min-h-screen text-slate-900">
        <nav className="border-b bg-white/70 backdrop-blur-md sticky top-0 z-[100]">
          <div className="max-w-screen-xl mx-auto px-6 h-14 flex items-center justify-between">
            <a href="/" className="font-black text-lg tracking-tighter text-slate-900">
              Vibe<span className="text-blue-600">Coding</span>
            </a>
            <div className="flex items-center gap-6">
              <a href="/generate" className="text-[13px] font-bold text-slate-500 hover:text-slate-900 transition-colors">새 글 작성</a>
              <a href="/history" className="text-[13px] font-bold text-slate-500 hover:text-slate-900 transition-colors">내 초안함</a>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
