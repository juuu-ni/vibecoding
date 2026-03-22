"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Copy, Check, Info, Layout, AlertTriangle } from "lucide-react";
import { PhotoAnalysisItem } from "@/types";

export default function ResultPage() {
  const { id } = useParams();
  const [review, setReview] = useState<any>(null);
  const [content, setContent] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchReview() {
      const { data } = await supabase.from('reviews').select('*').eq('id', id).single();
      if (data) {
        setReview(data);
        setContent(data.generated_content);
      }
    }
    fetchReview();
  }, [id]);

  const handleCopy = () => {
    if (!content) return alert("복사할 내용이 없습니다.");
    
    // AI가 생성한 실제 텍스트 내용을 클립보드에 복사
    navigator.clipboard.writeText(content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(err => {
      console.error("복사 실패:", err);
      alert("복사 중 오류가 발생했습니다.");
    });
  };

  // 이미지별 분석 결과를 매칭하여 렌더링하는 함수
  const renderStructuredContent = () => {
    if (!review?.analysis_json?.photoDetails || !review?.image_urls) {
      return <p className="text-slate-500 whitespace-pre-wrap leading-relaxed">{content}</p>;
    }

    const { photoDetails } = review.analysis_json;
    const { image_urls } = review;

    return photoDetails.map((item: PhotoAnalysisItem, idx: number) => {
      const imageUrl = image_urls[item.imageIndex - 1]; // 1-based index to 0-based
      
      return (
        <div key={idx} className="mb-12 space-y-6">
          {/* 이미지 렌더링 */}
          {imageUrl && (
            <div className="relative group overflow-hidden rounded-[2rem] border-8 border-white shadow-2xl transition-all duration-500 hover:scale-[1.02]">
              <img src={imageUrl} className="w-full aspect-video object-cover" alt={`photo-${idx}`} />
              <div className="absolute top-6 left-6 flex gap-2">
                <span className="bg-black/40 backdrop-blur-lg text-white px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-white/20">
                  {item.sceneType}
                </span>
                {item.confidence < 0.8 && (
                  <span className="bg-amber-500/80 backdrop-blur-lg text-white px-3 py-1.5 rounded-full text-[10px] font-bold flex items-center gap-1 border border-white/20">
                    <AlertTriangle className="w-3 h-3" />
                    추정됨
                  </span>
                )}
              </div>
            </div>
          )}
          
          {/* 설명 렌더링 (해당 이미지 아래에 배치) */}
          <div className="px-4 space-y-3">
            <p className="text-lg md:text-xl font-semibold leading-relaxed text-slate-800">
              {item.caption}
            </p>
            {/* 시각적 요소 태그 (선택 사항) */}
            <div className="flex flex-wrap gap-2 pt-2">
              {item.visibleSubjects.map((sub, i) => (
                <span key={i} className="text-[11px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded">
                  #{sub}
                </span>
              ))}
            </div>
          </div>
        </div>
      );
    });
  };

  if (!review) return (
    <div className="max-w-4xl mx-auto p-20 text-center animate-pulse">
      <div className="w-20 h-20 bg-primary-100 rounded-full mx-auto mb-6 flex items-center justify-center">
        <Layout className="w-8 h-8 text-primary-500" />
      </div>
      <p className="text-slate-400 font-black tracking-tight">AI 정밀 분석 결과를 구성하고 있습니다...</p>
    </div>
  );

  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        
        {/* 왼쪽: 포스팅 미리보기 */}
        <div className="lg:col-span-8 space-y-12">
          <div className="bg-white rounded-[3.5rem] p-10 md:p-16 shadow-2xl shadow-slate-200/50 border border-slate-50">
            <div className="mb-20 text-center space-y-4">
              <div className="inline-block px-4 py-1 bg-primary-50 text-primary-600 rounded-full text-xs font-black tracking-[0.2em] mb-4">
                BLOG DRAFT PREVIEW
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-[1.15] break-keep">
                {review.generated_titles[0]}
              </h1>
            </div>

            <div className="space-y-4">
              {renderStructuredContent()}
            </div>

            {/* 마무리 및 해시태그 */}
            <div className="mt-20 pt-12 border-t border-slate-100 space-y-6">
              <div className="flex flex-wrap gap-3">
                {review.generated_hashtags.map((tag: string, i: number) => (
                  <span key={i} className="text-primary-600 font-black hover:bg-primary-50 px-3 py-1 rounded-lg transition-colors cursor-pointer">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 오른쪽: 제어 도구 */}
        <div className="lg:col-span-4">
          <div className="sticky top-8 space-y-6">
            <section className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-slate-300">
              <h2 className="text-xl font-black mb-8 flex items-center gap-3">
                <Layout className="w-6 h-6 text-primary-400" />
                발행 준비
              </h2>
              
              <div className="space-y-6">
                <button 
                  onClick={handleCopy}
                  className="w-full py-5 bg-primary-600 hover:bg-primary-500 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-primary-900/20"
                >
                  {copied ? <Check className="w-6 h-6" /> : <Copy className="w-6 h-6" />}
                  {copied ? "복사 완료!" : "전체 복사하기"}
                </button>

                <div className="space-y-4 pt-4 border-t border-slate-800">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">추천 제목 리스트</p>
                  {review.generated_titles.slice(1).map((t: string, i: number) => (
                    <div key={i} className="text-sm font-bold text-slate-400 p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50 hover:border-primary-500 hover:text-white transition-all cursor-pointer leading-snug">
                      {t}
                    </div>
                  ))}
                </div>

                <div className="flex items-start gap-3 p-5 bg-white/5 rounded-2xl border border-white/10 text-slate-400 text-xs leading-relaxed">
                  <Info className="w-5 h-5 flex-shrink-0 text-primary-400" />
                  <p>AI가 분석한 정밀 캡션입니다. 이미지 아래에 딱 맞는 설명이 배치되어 그대로 블로그에 옮기기 좋습니다.</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
