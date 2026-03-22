import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "리뷰메이트 - 사진 기반 블로그 리뷰 AI",
  description: "사진 몇 장으로 맛집 블로그 리뷰 초안을 완성하세요.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="bg-slate-50 min-h-screen">
        <nav className="border-b bg-white">
          <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
            <a href="/" className="font-bold text-xl text-blue-600">ReviewMate</a>
            <div className="space-x-4 text-sm font-medium">
              <a href="/generate" className="hover:text-blue-600">새 리뷰 생성</a>
              <a href="/history" className="hover:text-blue-600">히스토리</a>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
