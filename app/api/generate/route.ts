import { NextResponse } from 'next/server';
import { openai, ANALYZE_PROMPT, GENERATE_PROMPT } from '@/lib/openai';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { imageUrls, storeName, locationText, userNotes, toneStyle, highlightPoints } = body;

    // 1단계: 사진 분석
    const analysisResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: ANALYZE_PROMPT },
        {
          role: "user",
          content: [
            { type: "text", text: "사진들을 보고 느낌 위주로 분석해줘." },
            ...imageUrls.slice(0, 5).map((url: string) => ({ 
              type: "image_url", 
              image_url: { url } 
            }))
          ],
        },
      ],
      response_format: { type: "json_object" }
    });

    const analysis = JSON.parse(analysisResponse.choices[0].message.content || "{}");

    // 2단계: 리뷰 본문 생성 (사람 문체 적용)
    const inputData = { storeName, locationText, userNotes, toneStyle, highlightPoints };
    const reviewResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: GENERATE_PROMPT(inputData, analysis) },
        { role: "user", content: "앞선 분석을 바탕으로 블로그 글을 완성해줘." }
      ],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(reviewResponse.choices[0].message.content || "{}");

    // 3단계: DB에 확실하게 저장 (이 부분이 히스토리의 핵심)
    const { data: insertedData, error: insertError } = await supabase
      .from('reviews')
      .insert([{
        store_name: storeName,
        location_text: locationText,
        user_notes: userNotes,
        image_urls: imageUrls,
        analysis_json: analysis,
        generated_titles: result.titles,
        generated_content: result.content,
        generated_hashtags: result.hashtags,
        tone_style: toneStyle,
        highlight_points: highlightPoints
      }])
      .select()
      .single();

    if (insertError) {
      console.error("DB Insert Error:", insertError);
      throw insertError;
    }

    return NextResponse.json({ success: true, id: insertedData.id });
  } catch (error: any) {
    console.error("API 처리 중 오류 발생:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
