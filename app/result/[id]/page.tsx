"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Copy, Check, ChevronLeft, Share2, MoreHorizontal, Save, Loader2, AlertCircle, Search } from "lucide-react";
import { PhotoAnalysisItem } from "@/types";

export default function ResultPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const [review, setReview] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [photoDetails, setPhotoDetails] = useState<PhotoAnalysisItem[]>([]);
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [content, setContent] = useState("");
  const [seoKeywords, setSeoKeywords] = useState<string[]>([]);
  
  const [copied, setCopied] = useState(false);
  const [keywordCopied, setKeywordCopied] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    async function fetchReview() {
      const { data } = await supabase.from('reviews').select('*').eq('id', id).single();
      if (data) {
        setReview(data);
        setTitle(data.generated_titles[0]);
        setHashtags(data.generated_hashtags || []);
        setContent(data.generated_content);
        if (data.analysis_json?.photoDetails) {
          setPhotoDetails(data.analysis_json.photoDetails);
        }
        if (data.analysis_json?.seoKeywords) {
          setSeoKeywords(data.analysis_json.seoKeywords);
        }
      }
    }
    fetchReview();
  }, [id]);

  // 자동 높이 조절 텍스트 영역 핸들러
  const handleTextareaChange = (index: number, value: string) => {
    const updatedDetails = [...photoDetails];
    updatedDetails[index].caption = value;
    setPhotoDetails(updatedDetails);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // 제목 배열 업데이트 (첫 번째 제목을 현재 수정된 제목으로)
      const updatedTitles = [...review.generated_titles];
      updatedTitles[0] = title;

      // 전체 텍스트 내용도 업데이트된 캡션들로 재구성 (선택 사항이나 정합성을 위해 권장)
      let updatedFullContent = photoDetails.map((p, i) => `[사진${i+1}]\n${p.caption}`).join('\n\n');

      const { error } = await supabase
        .from('reviews')
        .update({
          generated_titles: updatedTitles,
          generated_content: updatedFullContent,
          analysis_json: { ...review.analysis_json, photoDetails }
        })
        .eq('id', id);

      if (error) throw error;
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (err) {
      console.error("저장 실패:", err);
      alert("변경사항 저장 중 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const handleCopy = () => {
    // 현재 수정된 상태의 전체 텍스트 구성
    const currentFullContent = photoDetails.length > 0 
      ? photoDetails.map((p, i) => `[사진${i+1}]\n${p.caption}`).join('\n\n')
      : content;

    navigator.clipboard.writeText(currentFullContent).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(err => {
      console.error("복사 실패:", err);
    });
  };

  const handleCopyKeyword = (keyword: string) => {
    navigator.clipboard.writeText(keyword).then(() => {
      setKeywordCopied(keyword);
      setTimeout(() => setKeywordCopied(null), 2000);
    });
  };

  const renderStructuredContent = () => {
    if (photoDetails.length === 0) {
      return (
        <div className="prose prose-slate max-w-none">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full min-h-[400px] border-none focus:ring-0 p-0 text-slate-700 text-lg leading-relaxed resize-none outline-none"
            placeholder="블로그 본문을 입력하세요..."
          />
        </div>
      );
    }

    const { image_urls } = review;

    return (
      <div className="space-y-12">
        {photoDetails.map((item, idx) => {
          const imageUrl = image_urls[item.imageIndex - 1];
          
          return (
            <div key={idx} className="space-y-6">
              {imageUrl && (
                <div className="relative overflow-hidden rounded-sm shadow-sm group">
                  <img src={imageUrl} className="w-full object-cover max-h-[600px]" alt={`img-${idx}`} />
                  <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="bg-black/40 backdrop-blur-sm text-white px-2 py-1 rounded text-[10px] font-bold">
                      IMAGE {idx + 1}
                    </span>
                  </div>
                </div>
              )}
              
              <div className="px-1 group relative">
                <textarea
                  value={item.caption}
                  onChange={(e) => handleTextareaChange(idx, e.target.value)}
                  rows={3}
                  className="w-full border-none focus:ring-0 p-0 text-[17px] md:text-[18px] leading-[1.8] text-slate-800 break-keep font-normal resize-none outline-none bg-transparent overflow-hidden"
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = "auto";
                    target.style.height = `${target.scrollHeight}px`;
                  }}
                  ref={(el) => {
                    if (el) {
                      el.style.height = "auto";
                      el.style.height = `${el.scrollHeight}px`;
                    }
                  }}
                />
                <div className="absolute -left-4 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-1 h-6 bg-blue-200 rounded-full" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  if (!review) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-10 h-10 border-4 border-slate-100 border-t-blue-500 rounded-full animate-spin mx-auto" />
        <p className="text-slate-400 text-sm font-medium">초안 불러오는 중...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f4f4f4]">
      <main className="max-w-screen-xl mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
          
          <article className="w-full max-w-[780px] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.05)] rounded-sm overflow-hidden min-h-[800px]">
            {/* 포스트 헤더 */}
            <div className="px-6 md:px-12 pt-12 pb-8 border-b border-slate-50 relative group">
              <div className="mb-6 flex items-center gap-2 text-[13px] font-bold text-blue-500 uppercase tracking-wider">
                <span>BLOG DRAFT PREVIEW</span>
                <span className="w-1 h-1 bg-slate-200 rounded-full" />
                <span className="text-slate-400 font-medium">Drafting Mode</span>
              </div>
              
              <input 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-3xl md:text-[40px] font-bold text-slate-900 leading-[1.3] break-keep border-none focus:ring-0 p-0 outline-none bg-transparent"
                placeholder="제목을 입력하세요..."
              />

              <div className="mt-8 flex items-center gap-3 text-slate-400 text-sm">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-300">AI</div>
                <div className="flex flex-col">
                  <span className="text-slate-700 font-semibold">VibeCoding AI</span>
                  <span className="text-[12px] opacity-70">편집 중...</span>
                </div>
              </div>
            </div>

            {/* 포스트 본문 */}
            <div className="px-6 md:px-12 py-10">
              {renderStructuredContent()}

              <div className="mt-16 pt-8 border-t border-slate-50">
                <div className="flex flex-wrap gap-2">
                  {hashtags.map((tag, i) => (
                    <span key={i} className="text-[14px] text-blue-500 font-medium">
                      {tag.startsWith('#') ? tag : `#${tag}`}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </article>

          {/* 우측 도구함 */}
          <aside className="w-full lg:w-[320px] sticky top-[80px] space-y-6">
            <div className="bg-white shadow-[0_1px_3px_rgba(0,0,0,0.05)] rounded-sm p-6 space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Save className="w-4 h-4 text-blue-500" />
                  편집 도구
                </h3>
                
                <button 
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full py-3.5 bg-white border border-slate-200 hover:border-blue-500 hover:text-blue-600 rounded-md font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saveSuccess ? <Check className="w-4 h-4 text-green-500" /> : <Save className="w-4 h-4" />}
                  {saving ? "저장 중..." : saveSuccess ? "저장 완료" : "변경사항 저장"}
                </button>

                <button 
                  onClick={handleCopy}
                  className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-md font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? "복사 완료!" : "전체 내용 복사하기"}
                </button>
              </div>

              {/* SEO 키워드 섹션 추가 */}
              <div className="pt-6 border-t border-slate-50">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  <Search className="w-3 h-3" />
                  추천 SEO 키워드
                </p>
                <div className="flex flex-wrap gap-2">
                  {seoKeywords.length > 0 ? seoKeywords.map((keyword, i) => (
                    <button
                      key={i}
                      onClick={() => handleCopyKeyword(keyword)}
                      className={`text-[12px] px-2.5 py-1.5 rounded-full border transition-all flex items-center gap-1.5 ${
                        keywordCopied === keyword 
                          ? "bg-green-50 border-green-200 text-green-600" 
                          : "bg-slate-50 border-slate-100 text-slate-600 hover:border-blue-200 hover:text-blue-500"
                      }`}
                    >
                      {keywordCopied === keyword ? <Check className="w-3 h-3" /> : <Search className="w-3 h-3 opacity-30" />}
                      {keyword}
                    </button>
                  )) : (
                    <p className="text-[12px] text-slate-400 italic">추천 키워드가 없습니다.</p>
                  )}
                </div>
                <p className="mt-3 text-[11px] text-slate-400 leading-normal">
                  * 클릭하여 복사 후 본문에 활용하세요.
                </p>
              </div>

              <div className="pt-6 border-t border-slate-50">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">다른 제목 추천</p>
                <div className="space-y-2">
                  {review.generated_titles.slice(1).map((t: string, i: number) => (
                    <div 
                      key={i} 
                      onClick={() => setTitle(t)}
                      className="text-[13px] text-slate-600 p-3 bg-slate-50 rounded border border-transparent hover:border-blue-200 hover:bg-blue-50 transition-all cursor-pointer leading-snug break-keep"
                    >
                      {t}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="p-4 bg-amber-50 rounded-md flex gap-3">
                <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
                <p className="text-[12px] text-amber-800 leading-relaxed font-medium">
                  현재 <strong>편집 모드</strong>입니다. 본문을 클릭하여 내용을 자유롭게 수정하고 '저장' 버튼을 눌러주세요.
                </p>
              </div>
            </div>
          </aside>

        </div>
      </main>
      <div className="h-20" />
    </div>
  );
}
