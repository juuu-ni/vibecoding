import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('query');

  const clientId = process.env.NAVER_CLIENT_ID;
  const clientSecret = process.env.NAVER_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.error('네이버 API 키가 설정되지 않았습니다. .env.local을 확인하세요.');
    return NextResponse.json({ error: 'API 키 설정 오류', items: [] }, { status: 500 });
  }

  if (!query) {
    return NextResponse.json({ items: [] });
  }

  try {
    console.log(`네이버 장소 검색 요청: ${query}`);
    
    const response = await fetch(
      `https://openapi.naver.com/v1/search/local.json?query=${encodeURIComponent(query)}&display=5`,
      {
        headers: {
          'X-Naver-Client-Id': clientId,
          'X-Naver-Client-Secret': clientSecret,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('네이버 API 응답 에러:', errorData);
      return NextResponse.json({ error: '네이버 API 응답 에러', items: [] }, { status: response.status });
    }

    const data = await response.json();
    console.log(`네이버 검색 결과 개수: ${data.items?.length || 0}`);
    
    const items = data.items?.map((item: any) => ({
      title: item.title.replace(/<[^>]*>?/gm, ''), // HTML 태그 제거
      address: item.address,
      roadAddress: item.roadAddress,
      category: item.category,
      telephone: item.telephone
    })) || [];

    return NextResponse.json({ items });
  } catch (error) {
    console.error('네이버 API 호출 중 네트워크 에러:', error);
    return NextResponse.json({ error: '검색 중 오류가 발생했습니다.', items: [] }, { status: 500 });
  }
}
