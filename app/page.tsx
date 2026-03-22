import { ArrowRight, Image as ImageIcon, Sparkles, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-[calc(100-4rem)] bg-gradient-to-b from-white to-primary-50">
      <div className="max-w-6xl mx-auto px-6 py-24 sm:py-32">
        <div className="text-center space-y-8 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-100 text-primary-700 font-semibold text-sm">
            <Sparkles className="w-4 h-4" />
            <span>AI 기반 블로그 리뷰 자동 생성 서비스</span>
          </div>
          
          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
            사진 몇 장으로 <br />
            <span className="text-primary-600">완벽한 블로그 리뷰</span>를.
          </h1>
          
          <p className="text-xl text-slate-600 leading-relaxed">
            체험단 방문 후 글쓰기가 막막하셨나요? <br className="hidden sm:block" />
            AI가 사진 속 감성부터 음식 특징까지 분석해 자연스러운 초안을 써드립니다.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/generate"
              className="w-full sm:w-auto px-10 py-5 bg-primary-600 text-white rounded-3xl font-bold text-lg hover:bg-primary-700 transition-all hover:scale-105 card-shadow flex items-center justify-center gap-2"
            >
              지금 무료로 시작하기
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/history"
              className="w-full sm:w-auto px-10 py-5 bg-white text-slate-700 border border-slate-200 rounded-3xl font-bold text-lg hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
            >
              지난 기록 보기
            </Link>
          </div>

          <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm font-medium text-slate-500">
            <div className="flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span>사진 무제한 분석</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span>자연스러운 한국어</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span>제목/해시태그 포함</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span>즉시 복사 가능</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
