"use client";

import { useEffect, useState } from "react";
import { Calendar, ChevronRight } from "lucide-react";

export default function HistoryPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      const res = await fetch('/api/reviews');
      const data = await res.json();
      setReviews(data);
      setLoading(false);
    }
    fetchHistory();
  }, []);

  if (loading) return <div className="max-w-3xl mx-auto p-20 text-center text-gray-500">불러오는 중...</div>;

  return (
    <main className="max-w-4xl mx-auto p-6 py-12">
      <h1 className="text-3xl font-bold mb-8">생성 히스토리</h1>
      
      <div className="grid gap-4">
        {reviews.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border text-gray-400">
            아직 생성된 리뷰가 없습니다.
          </div>
        ) : (
          reviews.map((review: any) => (
            <a 
              key={review.id} 
              href={`/result/${review.id}`}
              className="bg-white p-6 rounded-2xl border hover:border-blue-500 transition flex items-center justify-between group"
            >
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                  {review.image_urls?.[0] && (
                    <img src={review.image_urls[0]} className="w-full h-full object-cover" alt="store" />
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-xl text-gray-900">{review.store_name}</h3>
                  <p className="text-gray-500 text-sm mt-1">{review.location_text}</p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                    <Calendar className="w-3 h-3" />
                    {new Date(review.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <ChevronRight className="w-6 h-6 text-gray-300 group-hover:text-blue-500 transition" />
            </a>
          ))
        )}
      </div>
    </main>
  );
}
