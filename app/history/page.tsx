"use client";

import { useEffect, useState } from "react";
import { Calendar, ChevronRight, FileText, Clock, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";

export default function HistoryPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHistory() {
      const res = await fetch('/api/reviews');
      const data = await res.json();
      setReviews(data);
      setLoading(false);
    }
    fetchHistory();
  }, []);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault(); // 상세 페이지 이동 방지
    e.stopPropagation();

    if (!confirm("정말 이 초안을 삭제하시겠습니까?")) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/reviews/${id}`, {
        method: 'DELETE',
      });
      const result = await res.json();
      if (result.success) {
        setReviews(prev => prev.filter(r => r.id !== id));
      } else {
        alert("삭제 중 오류가 발생했습니다.");
      }
    } catch (err) {
      console.error(err);
      alert("삭제 중 오류가 발생했습니다.");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-10 h-10 border-4 border-slate-100 border-t-blue-500 rounded-full animate-spin mx-auto" />
        <p className="text-slate-400 text-sm font-medium">초안 목록을 불러오는 중...</p>
      </div>
    </div>
  );

  return (
    <main className="max-w-screen-md mx-auto px-6 py-12 md:py-20">
      <header className="mb-12">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
          <FileText className="w-6 h-6 text-blue-500" />
          내 블로그 초안함
        </h1>
        <p className="text-slate-500 mt-2 text-sm font-medium">AI가 작성한 블로그 리뷰 초안들이 보관되어 있습니다.</p>
      </header>
      
      <div className="space-y-1">
        {reviews.length === 0 ? (
          <div className="text-center py-32 bg-slate-50 rounded-lg border border-dashed border-slate-200">
            <p className="text-slate-400 font-medium">아직 생성된 초안이 없습니다.</p>
            <Link href="/generate" className="text-blue-500 font-bold text-sm mt-4 inline-block hover:underline">
              첫 번째 리뷰 작성하기
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {reviews.map((review: any) => (
              <Link 
                key={review.id} 
                href={`/result/${review.id}`}
                className="group flex items-center gap-6 py-8 hover:bg-slate-50/50 transition-all rounded-xl px-4 -mx-4"
              >
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0 shadow-sm">
                  {review.image_urls?.[0] ? (
                    <img src={review.image_urls[0]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="store" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <FileText className="w-8 h-8" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded">
                      Draft
                    </span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                      <Clock className="w-3 h-3" />
                      {new Date(review.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg md:text-xl text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                    {review.generated_titles?.[0] || review.store_name}
                  </h3>
                  <p className="text-slate-500 text-sm mt-1 flex items-center gap-1.5 font-medium">
                    {review.store_name} · {review.location_text}
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => handleDelete(e, review.id)}
                    className="p-3 text-slate-300 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100 active:scale-95"
                    disabled={deletingId === review.id}
                  >
                    {deletingId === review.id ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Trash2 className="w-5 h-5" />
                    )}
                  </button>
                  <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
