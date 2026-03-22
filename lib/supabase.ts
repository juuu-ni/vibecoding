import { createClient } from '@supabase/supabase-js';

// 환경 변수 안전하게 가져오기
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// URL 유효성 검사 (최소한의 형식 체크)
const isValidUrl = (url: string) => {
  return url.startsWith('https://') && url.includes('.supabase.co');
};

// 키 유효성 검사 (eyJ... 또는 sb_publishable_... 모두 허용)
const isValidKey = (key: string) => {
  return key.length > 10 && (key.startsWith('eyJ') || key.startsWith('sb_'));
};

// 안전한 값 설정
const finalUrl = isValidUrl(supabaseUrl) ? supabaseUrl : 'https://placeholder.supabase.co';
const finalKey = isValidKey(supabaseAnonKey) ? supabaseAnonKey : 'placeholder-key';

if (!isValidUrl(supabaseUrl) || !isValidKey(supabaseAnonKey)) {
  console.warn(
    "⚠️ [Supabase 설정 안내]\n" +
    "현재 입력된 URL 또는 KEY 형식이 평소와 다를 수 있습니다.\n" +
    "만약 접속 에러가 발생한다면 .env.local의 값을 다시 확인해주세요."
  );
}

export const supabase = createClient(finalUrl, finalKey, {
  auth: {
    persistSession: false,
  },
});
