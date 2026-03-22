"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { 
  Camera, 
  Loader2, 
  UploadCloud, 
  X, 
  Check, 
  Store, 
  MapPin, 
  MessageSquareText, 
  ArrowRight // <- 누락되었던 ArrowRight 아이콘 추가
} from "lucide-react";
import { cn } from "@/lib/utils";

const TONE_STYLES = ["자연스러운 블로그체", "친절한 후기체", "감성적인 에세이체", "정보 중심형"];
const HIGHLIGHT_POINTS = ["맛", "분위기", "가성비", "친절도", "주차/위치"];

export default function GeneratePage() {
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [selectedTone, setSelectedTone] = useState(TONE_STYLES[0]);
  const [selectedHighlights, setSelectedHighlights] = useState<string[]>([]);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (images.length + files.length > 10) return alert("최대 10장까지만 가능합니다.");
      setImages(prev => [...prev, ...files]);
      setPreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const toggleHighlight = (point: string) => {
    setSelectedHighlights(prev => 
      prev.includes(point) ? prev.filter(p => p !== point) : [...prev, point]
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (images.length === 0) return alert("사진을 최소 1장 업로드해주세요.");
    
    setLoading(true);
    setStatus("이미지를 업로드 중입니다...");

    try {
      const formData = new FormData(e.currentTarget);
      const imageUrls = [];

      for (const file of images) {
        // 파일 이름 뒤에 원본 확장자 추가 (.jpg, .png 등)
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('review-images')
          .upload(`raw/${fileName}`, file);
        
        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('review-images')
          .getPublicUrl(`raw/${fileName}`);
        
        imageUrls.push(publicUrl);
      }

      setStatus("AI가 분석 중입니다. 잠시만 기다려주세요...");

      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storeName: formData.get('storeName'),
          locationText: formData.get('locationText'),
          userNotes: formData.get('userNotes'),
          toneStyle: selectedTone,
          highlightPoints: selectedHighlights,
          imageUrls
        }),
      });

      const result = await res.json();
      if (!result.success) throw new Error(result.error);
      router.push(`/result/${result.id}`);
    } catch (err: any) {
      alert(`오류: ${err.message}`);
    } finally {
      setLoading(false);
      setStatus("");
    }
  };

  return (
    <main className="max-w-4xl mx-auto px-6 py-12 pb-24">
      <div className="mb-10 text-center max-w-lg mx-auto">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-4">리뷰 생성을 시작할까요?</h1>
        <p className="text-slate-500 font-medium leading-relaxed">방문하신 매장 사진과 기본 정보를 알려주시면 <br /> AI가 가장 완벽한 초안을 써드릴게요.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7 space-y-8">
          {/* 사진 업로드 */}
          <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Camera className="w-5 h-5 text-blue-500" />
              1. 사진 업로드
            </h2>
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
              {previews.map((src, i) => (
                <div key={i} className="relative aspect-square group">
                  <img src={src} className="w-full h-full object-cover rounded-2xl border border-slate-100" alt="preview" />
                  <button 
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute -top-2 -right-2 bg-slate-900 text-white p-1 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {images.length < 10 && (
                <label className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all group">
                  <UploadCloud className="w-6 h-6 text-slate-400 group-hover:text-blue-500 transition-colors" />
                  <span className="text-[10px] font-bold text-slate-400 mt-2">사진 추가</span>
                  <input type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
              )}
            </div>
          </section>

          {/* 추가 메모 */}
          <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <MessageSquareText className="w-5 h-5 text-blue-500" />
              2. 추가 설명 및 메모
            </h2>
            <textarea 
              name="userNotes" 
              className="w-full h-40 bg-slate-50 border-none rounded-2xl p-4 text-slate-700 placeholder:text-slate-400 resize-none outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
              placeholder="직원 서비스, 특별히 기억남는 점, 발렛 유무 등을 적어주세요. AI가 자연스럽게 본문에 녹여냅니다." 
            />
          </section>
        </div>

        <div className="lg:col-span-5 space-y-8">
          {/* 기본 정보 */}
          <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Store className="w-5 h-5 text-blue-500" />
              매장 정보
            </h2>
            <div className="space-y-4">
              <div className="relative">
                <Store className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input name="storeName" required className="w-full bg-slate-50 border-none pl-12 pr-4 py-4 rounded-2xl font-semibold outline-none focus:ring-2 focus:ring-blue-500 transition-all" placeholder="매장 이름" />
              </div>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input name="locationText" required className="w-full bg-slate-50 border-none pl-12 pr-4 py-4 rounded-2xl font-semibold outline-none focus:ring-2 focus:ring-blue-500 transition-all" placeholder="지역 (예: 성수동)" />
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider">강조 포인트</label>
              <div className="flex flex-wrap gap-2">
                {HIGHLIGHT_POINTS.map(p => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => toggleHighlight(p)}
                    className={cn(
                      "px-4 py-2 rounded-full text-sm font-bold transition-all",
                      selectedHighlights.includes(p) 
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-100" 
                        : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider">글 문체</label>
              <div className="space-y-2">
                {TONE_STYLES.map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setSelectedTone(t)}
                    className={cn(
                      "w-full px-4 py-3 rounded-2xl text-left text-sm font-bold flex items-center justify-between border-2 transition-all",
                      selectedTone === t 
                        ? "border-blue-500 bg-blue-50 text-blue-700" 
                        : "border-slate-50 bg-slate-50 text-slate-500 hover:border-slate-100"
                    )}
                  >
                    {t}
                    {selectedTone === t && <Check className="w-4 h-4" />}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-6 rounded-[2.5rem] font-black text-xl hover:bg-blue-700 transition-all disabled:bg-slate-200 shadow-xl shadow-blue-100 flex items-center justify-center gap-3 overflow-hidden group"
          >
            {loading ? (
              <div className="flex flex-col items-center">
                <Loader2 className="w-6 h-6 animate-spin mb-1" />
                <span className="text-xs font-medium animate-pulse">{status}</span>
              </div>
            ) : (
              <>
                <span>생성 시작하기</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </div>
      </form>
    </main>
  );
}
