import { ArrowRight, Image as ImageIcon, Sparkles, CheckCircle2, FileText, Camera } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-[calc(100vh-3.5rem)] bg-white">
      {/* 히어로 섹션 */}
      <div className="max-w-screen-xl mx-auto px-6 pt-24 pb-32 md:pt-32 md:pb-48">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 font-bold text-[12px] uppercase tracking-wider mb-8">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Blog Post Generator</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-slate-900 leading-[1.1] mb-8">
            당신의 기록을 <br />
            <span className="text-blue-600">완벽한 블로그 글</span>로.
          </h1>
          
          <p className="text-xl text-slate-500 leading-relaxed font-medium mb-12 max-w-2xl">
            맛집 탐방, 카페 투어 후 리뷰 쓰기가 번거로우셨나요? <br />
            AI가 사진 속 감성과 특징을 분석하여 1분 만에 완성된 초안을 써드립니다.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link
              href="/generate"
              className="w-full sm:w-auto px-8 py-4 bg-slate-900 text-white rounded-md font-bold text-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-3 shadow-xl shadow-slate-200"
            >
              새 글 작성하기
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/history"
              className="w-full sm:w-auto px-8 py-4 bg-white text-slate-600 border border-slate-200 rounded-md font-bold text-lg hover:bg-slate-50 transition-all flex items-center justify-center gap-3"
            >
              내 초안함 보기
            </Link>
          </div>

          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-slate-100 pt-12">
            <div className="space-y-3">
              <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center">
                <Camera className="w-5 h-5 text-slate-600" />
              </div>
              <h3 className="font-bold text-slate-900">정밀 이미지 분석</h3>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">사진 속 메뉴, 인테리어, 분위기를 읽고 설명으로 풀어냅니다.</p>
            </div>
            <div className="space-y-3">
              <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-slate-600" />
              </div>
              <h3 className="font-bold text-slate-900">블로그 최적화</h3>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">네이버 블로그의 '사진-설명' 흐름을 완벽히 재현한 초안을 제공합니다.</p>
            </div>
            <div className="space-y-3">
              <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-slate-600" />
              </div>
              <h3 className="font-bold text-slate-900">즉각적인 발행</h3>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">생성된 글을 그대로 복사해 블로그 에디터에 붙여넣기만 하세요.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
