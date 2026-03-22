import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // 캐시 방지 (항상 최신 데이터 불러오기)

export async function GET() {
  try {
    // 1. DB에서 데이터 가져오기
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Supabase 조회 에러:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // 2. 데이터가 없으면 빈 배열 반환
    return NextResponse.json(data || []);
  } catch (err: any) {
    console.error("서버 내부 에러:", err);
    return NextResponse.json({ error: "데이터를 불러오는 중 서버 에러가 발생했습니다." }, { status: 500 });
  }
}
