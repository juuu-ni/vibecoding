"use client";

import { useState, useEffect } from "react";
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
  ArrowRight,
  Search,
  Navigation
} from "lucide-react";
import { cn } from "@/lib/utils";

const TONE_STYLES = ["자연스러운 블로그체", "친절한 후기체", "감성적인 에세이체", "정보 중심형", "나만의 문체(샘플 입력)"];
const HIGHLIGHT_POINTS = ["맛", "분위기", "가성비", "친절도", "주차/위치"];

export default function GeneratePage() {
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [selectedTone, setSelectedTone] = useState(TONE_STYLES[0]);
  const [customToneSample, setCustomToneSample] = useState("");
  const [selectedHighlights, setSelectedHighlights] = useState<string[]>([]);

  // 네이버 장소 검색 관련 상태
  const [storeSearch, setStoreSearch] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  
  // 폼 데이터 상태
  const [formData, setFormData] = useState({
    storeName: "",
    locationText: "",
    userNotes: "",
    storeAddress: "",
    storePhone: ""
  });
  
  const router = useRouter();

  // 매장명 검색 디바운스 로직 복구
  useEffect(() => {
    if (!storeSearch.trim() || storeSearch.length < 2) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        // 검색 품질을 위해 검색어 뒤에 '맛집'을 붙여서 검색 (사용자에게는 안 보임)
        const res = await fetch(`/api/naver/search?query=${encodeURIComponent(storeSearch)}`);
        const data = await res.json();
        setSearchResults(data.items || []);
        setShowResults(true);
      } catch (err) {
        console.error("검색 실패:", err);
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [storeSearch]);

  const handleSelectPlace = (place: any) => {
    const addrParts = place.address.split(' ');
    const region = addrParts[2] || addrParts[1] || "";
    
    setFormData({
      ...formData,
      storeName: place.title,
      locationText: region,
      storeAddress: place.roadAddress || place.address,
      storePhone: place.telephone
    });
    
    setStoreSearch(place.title);
    setShowResults(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (images.length + files.length > 10) return alert("최대 10장까지만 가능합니다.");
      
      const newImages = [...images, ...files];
      const newPreviews = [...previews, ...files.map(f => URL.createObjectURL(f))];
      
      setImages(newImages);
      setPreviews(newPreviews);
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
    
    if (selectedTone === "나만의 문체(샘플 입력)" && !customToneSample.trim()) {
      return alert("문체 분석을 위해 본인의 이전 글 샘플을 입력해주세요.");
    }
    
    setLoading(true);
    setStatus("이미지를 업로드 중입니다...");

    try {
      const domFormData = new FormData(e.currentTarget);
      const imageUrls = [];

      for (const file of images) {
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

      setStatus("AI가 문체 및 사진을 분석 중입니다...");

      // API 호출 시 storeAddress와 storePhone을formData 상태에서 가져와 포함시킵니다.
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storeName: formData.storeName || domFormData.get('storeName'),
          locationText: formData.locationText || domFormData.get('locationText'),
          userNotes: formData.userNotes || domFormData.get('userNotes'),
          storeAddress: formData.storeAddress,
          storePhone: formData.storePhone,
          toneStyle: selectedTone,
          customToneSample: selectedTone === "나만의 문체(샘플 입력)" ? customToneSample : null,
          highlightPoints: selectedHighlights,
          imageUrls
        }),
      });

      const result = await res.json();
      if (!result.success) throw new Error(result.error);
      router.push(`/result/${result.id}`);
    } catch (err: any) {
      console.error("제출 오류:", err);
      alert(`오류: ${err.message}`);
    } finally {
      setLoading(false);
      setStatus("");
    }
  };

  return (
    <main className="max-w-screen-xl mx-auto px-6 py-12 md:py-20">
      <div className="mb-16">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-4 flex items-center gap-3">
          <Camera className="w-8 h-8 text-blue-500" />
          블로그 초안 생성하기
        </h1>
        <p className="text-slate-500 font-medium leading-relaxed max-w-xl">
          사진을 업로드하고 원하는 스타일을 알려주세요. <br />
          본인의 이전 글을 입력하면 AI가 그 말투까지 똑같이 흉내 냅니다.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-10">
          <section className="bg-white p-6 md:p-10 shadow-[0_1px_3px_rgba(0,0,0,0.05)] rounded-sm border border-slate-50">
            <header className="flex items-center justify-between mb-8">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 bg-blue-500 text-white flex items-center justify-center rounded-full text-xs">1</span>
                사진 업로드
              </h2>
              <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                {images.length} / 10 PHOTOS
              </span>
            </header>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {previews.map((src, i) => (
                <div key={i} className="relative aspect-square group">
                  <img src={src} className="w-full h-full object-cover rounded-md border border-slate-100 shadow-sm transition-transform duration-300" alt="preview" />
                  <div className="absolute top-2 left-2">
                    <div className="bg-black/50 backdrop-blur-sm text-white text-[10px] font-bold px-1.5 py-0.5 rounded">#{i + 1}</div>
                  </div>
                  <button type="button" onClick={() => removeImage(i)} className="absolute -top-2 -right-2 bg-white text-slate-500 p-1.5 rounded-full shadow-md border border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {images.length < 10 && (
                <label className="aspect-square rounded-md border-2 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all group">
                  <UploadCloud className="w-6 h-6 text-slate-400 group-hover:text-blue-500 transition-colors" />
                  <span className="text-[11px] font-bold text-slate-400 mt-2">사진 추가</span>
                  <input type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
              )}
            </div>
            <div className="mt-6 flex items-start gap-2 text-slate-400 text-[12px] bg-slate-50 p-4 rounded-md">
              <span className="text-blue-500 font-bold">Tip:</span>
              <p>업로드한 순서대로 블로그 본문이 구성됩니다. 보여주고 싶은 순서대로 사진을 선택해 주세요!</p>
            </div>
          </section>

          <section className="bg-white p-6 md:p-10 shadow-[0_1px_3px_rgba(0,0,0,0.05)] rounded-sm border border-slate-50">
            <h2 className="text-lg font-bold text-slate-900 mb-8 flex items-center gap-2">
              <span className="w-6 h-6 bg-blue-500 text-white flex items-center justify-center rounded-full text-xs">2</span>
              방문 정보 및 추가 설명
            </h2>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <Store className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    name="storeName" 
                    required 
                    value={storeSearch}
                    onChange={(e) => {
                      setStoreSearch(e.target.value);
                      setFormData({ ...formData, storeName: e.target.value });
                    }}
                    onFocus={() => storeSearch.length >= 2 && setShowResults(true)}
                    className="w-full bg-slate-50 border-none pl-12 pr-4 py-3.5 rounded-md font-semibold outline-none focus:ring-1 focus:ring-blue-500 transition-all" 
                    placeholder="매장 이름 검색" 
                  />
                  {showResults && (searchResults.length > 0 || isSearching) && (
                    <div className="absolute z-10 w-full mt-2 bg-white border border-slate-100 shadow-xl rounded-md overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                      {isSearching ? (
                        <div className="p-4 text-center text-slate-400 text-sm flex items-center justify-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" /> 검색 중...
                        </div>
                      ) : (
                        <div className="divide-y divide-slate-50">
                          {searchResults.map((place, i) => (
                            <button key={i} type="button" onClick={() => handleSelectPlace(place)} className="w-full text-left p-4 hover:bg-blue-50 transition-colors group">
                              <div className="font-bold text-slate-900 group-hover:text-blue-600 flex items-center gap-2">
                                {place.title}
                                <span className="text-[10px] text-slate-400 font-medium px-1.5 py-0.5 bg-slate-100 rounded">{place.category}</span>
                              </div>
                              <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                                <Navigation className="w-3 h-3" /> {place.roadAddress || place.address}
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    name="locationText" 
                    required 
                    value={formData.locationText}
                    onChange={(e) => setFormData({ ...formData, locationText: e.target.value })}
                    className="w-full bg-slate-50 border-none pl-12 pr-4 py-3.5 rounded-md font-semibold outline-none focus:ring-1 focus:ring-blue-500 transition-all" 
                    placeholder="지역 (예: 성수동)" 
                  />
                </div>
              </div>
              <div className="relative">
                <MessageSquareText className="absolute left-4 top-4 w-4 h-4 text-slate-400" />
                <textarea 
                  name="userNotes" 
                  value={formData.userNotes}
                  onChange={(e) => setFormData({ ...formData, userNotes: e.target.value })}
                  className="w-full h-44 bg-slate-50 border-none rounded-md pl-12 pr-4 py-4 text-slate-700 placeholder:text-slate-400 resize-none outline-none focus:ring-1 focus:ring-blue-500 transition-all font-medium" 
                  placeholder="AI가 본문에 녹여내길 원하는 포인트(발렛 유무, 특정 메뉴 이름, 직원 서비스 등)를 자유롭게 적어주세요." 
                />
              </div>
            </div>
          </section>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <section className="bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.05)] rounded-sm border border-slate-50 space-y-8">
            <div className="space-y-4">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">강조 포인트</label>
              <div className="flex flex-wrap gap-2">
                {HIGHLIGHT_POINTS.map(p => (
                  <button key={p} type="button" onClick={() => toggleHighlight(p)} className={cn("px-3 py-1.5 rounded-md text-xs font-bold transition-all", selectedHighlights.includes(p) ? "bg-blue-600 text-white" : "bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-100")}>{p}</button>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">글 문체</label>
              <div className="space-y-2">
                {TONE_STYLES.map(t => (
                  <button key={t} type="button" onClick={() => setSelectedTone(t)} className={cn("w-full px-4 py-3 rounded-md text-left text-xs font-bold flex items-center justify-between border transition-all", selectedTone === t ? "border-blue-500 bg-blue-50 text-blue-700" : "border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200")}>
                    {t} {selectedTone === t && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
              {selectedTone === "나만의 문체(샘플 입력)" && (
                <div className="pt-2 animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="text-[10px] font-bold text-blue-600 mb-1.5 block">이전 블로그 글 샘플 (짧아도 괜찮아요!)</label>
                  <textarea value={customToneSample} onChange={(e) => setCustomToneSample(e.target.value)} className="w-full h-32 bg-blue-50/30 border border-blue-100 rounded-md p-3 text-[11px] focus:ring-1 focus:ring-blue-500 outline-none" placeholder="본인이 직접 쓴 블로그 글을 복사해서 붙여넣어 주세요. 한 문장이라도 있으면 그 말투를 분석합니다." />
                </div>
              )}
            </div>
          </section>
          <button type="submit" disabled={loading} className="w-full bg-slate-900 text-white py-5 rounded-md font-bold text-lg hover:bg-slate-800 transition-all disabled:bg-slate-200 shadow-xl shadow-slate-200 flex flex-col items-center justify-center gap-1 overflow-hidden group">
            {loading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                <span className="text-[10px] font-medium animate-pulse">{status}</span>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <span>블로그 초안 만들기</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            )}
          </button>
        </div>
      </form>
    </main>
  );
}
