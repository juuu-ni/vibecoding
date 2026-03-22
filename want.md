# 사진 기반 맛집 체험단 블로그 리뷰 자동 생성 웹앱 PRD (Vibe Coding 전달용)

## 1. 프로젝트 개요

사진 여러 장과 기본 정보(매장명, 지역, 방문 목적, 강조 포인트, 문체)를 입력하면  
AI가 사진을 분석하고, 이를 바탕으로 **맛집 체험단용 블로그 리뷰 초안**을 자동 생성하는 웹앱을 만든다.

이 서비스의 목표는 다음과 같다.

- 사용자가 블로그 리뷰 초안을 빠르게 만들 수 있게 한다.
- 사진에 기반한 자연스러운 리뷰를 생성한다.
- 허위 정보나 과장된 표현을 최대한 줄인다.
- 사용자가 생성된 글을 직접 수정하고 복사할 수 있게 한다.

---

## 2. 핵심 컨셉

이 서비스는 완전 자동 게시용이 아니라,  
**“사진 기반 리뷰 초안 생성 + 사용자 최종 편집”** 구조로 만든다.

즉, 아래 흐름을 따른다.

1. 사용자가 사진 여러 장 업로드
2. 사용자가 매장 관련 기본 정보 입력
3. AI가 사진을 분석해 구조화된 정보(JSON) 생성
4. AI가 그 JSON 기반으로 블로그 리뷰 초안 생성
5. 사용자가 결과를 편집 / 복사 / 재생성

---

## 3. 서비스 이름(가칭)

- 리뷰메이트
- 맛집리뷰메이커
- 체험단 리뷰 생성기
- Photo to Blog Review
- Review Draft AI

실제 구현 시 임시 이름은 `review-draft-ai`로 사용한다.

---

## 4. 타겟 사용자

- 강남맛집 / 지역맛집 체험단 방문 후 블로그 리뷰를 작성해야 하는 사용자
- 체험단 후기 작성 시간이 오래 걸리는 사용자
- 사진은 많이 찍었지만 글쓰기가 어려운 사용자
- 네이버 블로그 후기 초안을 빠르게 만들고 싶은 사용자

---

## 5. 주요 기능 요구사항

## 5-1. 사진 업로드

사용자는 여러 장의 사진을 업로드할 수 있어야 한다.

요구사항:

- 다중 이미지 업로드 지원
- jpg, jpeg, png, webp 허용
- 사진 미리보기 제공
- 사진 순서 변경 가능 (drag & drop)
- 사진 삭제 가능
- 최대 업로드 개수 제한 예: 10장
- 파일 크기 제한 예: 장당 10MB

추가:

- 첫 번째 사진을 대표 사진으로 인식할 수 있게 한다.
- 사진 업로드 순서를 AI 입력 순서와 동일하게 사용한다.

---

## 5-2. 기본 정보 입력 폼

사용자는 아래 정보를 입력할 수 있어야 한다.

필수 입력:

- 매장명
- 지역명 또는 상권명

선택 입력:

- 방문 목적
  - 데이트
  - 친구 모임
  - 가족 외식
  - 혼밥
  - 회식
  - 기타
- 강조 포인트
  - 분위기
  - 가성비
  - 맛
  - 양
  - 친절
  - 사진 잘 나옴
  - 위치 접근성
- 문체 선택
  - 자연스러운 블로그체
  - 체험단 후기체
  - 감성형
  - 정보형
- 포함하고 싶은 키워드
- 피하고 싶은 표현
- 참고 메모 (예: “매장이 생각보다 넓었음”, “직원 응대 좋았음”)

---

## 5-3. AI 사진 분석 기능

AI는 업로드된 사진을 먼저 분석해서 아래 구조의 정보를 추출해야 한다.

목표:

- 바로 긴 글을 쓰지 말고 먼저 구조화된 결과(JSON)를 만든다.
- 사진에서 확인 가능한 정보와 추정 정보를 구분한다.

반드시 지켜야 할 원칙:

- 사진에 보이지 않는 사실은 단정하지 않는다.
- 추정 정보는 `추정` 또는 `가능성`으로 표현한다.
- 서비스 친절도, 맛 평가 등은 사진만으로 확정하지 않는다.
- 사용자가 추가 메모를 준 경우 그것을 우선 반영한다.

예시 JSON 구조:

```json
{
  "storeMood": "우드톤 인테리어와 따뜻한 조명으로 아늑한 분위기",
  "interiorFeatures": ["원목 테이블", "간접 조명", "깔끔한 테이블 세팅"],
  "visibleMenus": ["파스타", "스테이크", "에이드"],
  "foodAppearance": ["플레이팅이 정돈되어 있음", "양이 적당해 보임"],
  "likelyReviewPoints": [
    "데이트 장소로 어울리는 분위기",
    "사진 찍기 좋은 플레이팅"
  ],
  "photoOrderSummary": [
    "외관 또는 입구",
    "실내 분위기",
    "메뉴 전체샷",
    "음식 클로즈업"
  ],
  "uncertainPoints": [
    "정확한 메뉴명은 추정일 수 있음",
    "서비스 만족도는 사진만으로 판단 어려움"
  ]
}
```

---

## 5-4. 블로그 리뷰 생성 기능

사진 분석 결과와 사용자 입력 정보를 바탕으로  
AI가 **블로그 리뷰 초안**을 생성해야 한다.

출력 구성:

- 제목 3개
- 본문
- 마무리 문장
- 해시태그 10~15개
- 짧은 요약 한 줄 (선택)

본문 기본 구조:

1. 방문 계기 / 위치 언급
2. 외관 또는 첫인상
3. 실내 분위기 / 인테리어
4. 주문한 메뉴 / 음식 비주얼
5. 총평 / 추천 포인트

문체 특징:

- 너무 광고 같지 않게 자연스럽게
- 너무 과장된 표현 자제
- 한국어 블로그 후기체
- 체험단 느낌은 낼 수 있지만 과도한 홍보 문구는 피함

생성 조건:

- 사진에 없는 정보는 확정적으로 쓰지 말 것
- 사용자가 입력한 키워드는 자연스럽게 반영
- 금지 표현은 피할 것
- 필요시 “~처럼 보였다”, “~인상이었다”, “~느낌이었다” 같은 완곡 표현 사용

---

## 5-5. 결과 편집 기능

생성된 결과는 사용자가 바로 수정할 수 있어야 한다.

필수 기능:

- 제목 수정
- 본문 수정
- 해시태그 수정
- 전체 복사 버튼
- 제목만 복사 버튼
- 해시태그만 복사 버튼

추가 기능:

- 다시 생성
- 문체 바꿔서 재생성
- “광고 느낌 줄이기”
- “더 자연스럽게”
- “조금 더 감성적으로”
- “정보형으로 바꾸기”

---

## 5-6. 생성 히스토리 저장

사용자가 이전에 생성한 리뷰를 볼 수 있어야 한다.

저장 데이터:

- 프로젝트 ID
- 매장명
- 지역명
- 업로드 이미지 URL 목록
- 사용자 입력값
- 분석 JSON
- 생성된 제목 / 본문 / 해시태그
- 생성 시간
- 최종 수정본

마이페이지 또는 히스토리 페이지에서:

- 목록 조회
- 상세 보기
- 다시 편집
- 삭제

---

## 6. UX 플로우

## 6-1. 메인 플로우

1. 메인 페이지 진입
2. 사진 업로드
3. 기본 정보 입력
4. “리뷰 생성하기” 클릭
5. 로딩 상태 표시
6. 결과 페이지 이동
7. 제목 / 본문 / 해시태그 확인
8. 편집 후 복사 또는 저장

## 6-2. 상세 UI 섹션

### A. 업로드 영역

- 드래그 앤 드롭 업로드
- 클릭 업로드
- 업로드된 썸네일 리스트
- 순서 변경
- 삭제 버튼

### B. 입력 폼 영역

- 매장명
- 지역명
- 방문 목적 select
- 강조 포인트 multi-select
- 문체 선택 radio or select
- 키워드 입력
- 금지 표현 입력
- 메모 입력 textarea

### C. 결과 영역

- 제목 추천 카드 3개
- 본문 편집 에디터
- 해시태그 박스
- 분석 결과 요약 박스
- 복사 / 저장 / 재생성 버튼

---

## 7. 비기능 요구사항

- 반응형 웹 지원
- 모바일/PC 모두 사용 가능
- 이미지 업로드 후 미리보기 성능이 좋아야 함
- 생성 요청 중 중복 클릭 방지
- 에러 발생 시 사용자 친화적 메시지 출력
- 생성 시간 동안 로딩 UI 제공
- 저장된 데이터는 안정적으로 관리
- 추후 로그인 기능 추가 가능하도록 설계

---

## 8. 기술 스택 요구사항

## 8-1. 프론트엔드

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- React Hook Form
- Zod
- dnd-kit (사진 순서 변경용)

## 8-2. 백엔드

- Next.js Route Handler 또는 Server Actions 사용
- OpenAI API 연동
- 이미지 업로드 처리
- 리뷰 생성 API 구현

## 8-3. 데이터 / 스토리지

- Supabase
  - Database (PostgreSQL)
  - Storage (이미지 저장)
  - Auth (추후 확장 가능)

## 8-4. 배포

- Vercel

---

## 9. 아키텍처 설계

전체 흐름:

1. 사용자가 프론트에서 이미지 업로드
2. 이미지는 Supabase Storage에 저장
3. 프론트는 이미지 URL + 입력값을 백엔드 API에 전달
4. 백엔드는 OpenAI Vision 모델로 이미지 분석 요청
5. 백엔드는 분석 결과 JSON을 받음
6. 백엔드는 분석 JSON + 사용자 입력으로 글 생성 요청
7. 생성 결과를 DB에 저장
8. 프론트로 결과 반환

---

## 10. 데이터베이스 설계

## 10-1. reviews 테이블

필드 예시:

- id (uuid, pk)
- user_id (nullable, 추후 auth 연동용)
- store_name (text)
- location_text (text)
- visit_purpose (text)
- highlight_points (text[])
- tone_style (text)
- include_keywords (text[])
- avoid_keywords (text[])
- user_notes (text)
- image_urls (text[])
- analysis_json (jsonb)
- title_candidates (jsonb)
- generated_content (text)
- generated_hashtags (text[])
- final_content (text)
- created_at (timestamp)
- updated_at (timestamp)

---

## 11. API 설계

## 11-1. POST /api/upload

역할:

- 이미지 업로드 처리
- 업로드된 이미지 URL 반환

입력:

- multipart/form-data

출력 예시:

```json
{
  "success": true,
  "imageUrls": ["https://.../image1.jpg", "https://.../image2.jpg"]
}
```

## 11-2. POST /api/generate-review

역할:

- 사진 분석
- 리뷰 생성
- DB 저장

입력 예시:

```json
{
  "storeName": "OO식당",
  "locationText": "강남역",
  "visitPurpose": "데이트",
  "highlightPoints": ["분위기", "맛", "사진 잘 나옴"],
  "toneStyle": "자연스러운 블로그체",
  "includeKeywords": ["강남맛집", "강남역데이트"],
  "avoidKeywords": ["무조건", "인생맛집"],
  "userNotes": "플레이팅이 예뻤고 매장이 깔끔했음",
  "imageUrls": ["https://..."]
}
```

출력 예시:

```json
{
  "success": true,
  "data": {
    "analysis": {},
    "titles": [
      "강남역 분위기 좋은 맛집에서 즐긴 만족스러운 한 끼",
      "강남에서 데이트하기 좋았던 분위기 맛집 후기",
      "사진도 잘 나오고 음식 비주얼도 좋았던 강남 맛집"
    ],
    "content": "....",
    "hashtags": ["#강남맛집", "#강남역맛집"]
  }
}
```

## 11-3. GET /api/reviews

- 히스토리 목록 조회

## 11-4. GET /api/reviews/:id

- 단건 조회

## 11-5. PATCH /api/reviews/:id

- 최종 편집본 저장

## 11-6. DELETE /api/reviews/:id

- 리뷰 삭제

---

## 12. OpenAI 프롬프트 전략

반드시 2단계로 구현한다.

## 12-1. 1단계: 사진 분석 프롬프트

목표:

- 사진에서 보이는 내용을 구조화된 JSON으로 반환

예시 프롬프트:

```text
너는 음식점 사진을 분석해서 블로그 리뷰 작성을 돕는 도우미다.

아래 이미지들과 사용자 입력 정보를 바탕으로, 사진에서 확인 가능한 내용만 정리해라.
보이지 않는 정보는 추정 또는 불확실로 표시하라.
서비스 만족도, 실제 맛, 재방문 의사 등은 사진만으로 단정하지 마라.

반드시 아래 JSON 스키마에 맞춰 응답해라.

필드:
- storeMood: string
- interiorFeatures: string[]
- visibleMenus: string[]
- foodAppearance: string[]
- likelyReviewPoints: string[]
- photoOrderSummary: string[]
- uncertainPoints: string[]
```

## 12-2. 2단계: 리뷰 생성 프롬프트

목표:

- 분석 JSON 기반으로 블로그 초안 생성

예시 프롬프트:

```text
너는 한국어 맛집 블로그 리뷰 초안을 작성하는 에디터다.

아래 정보를 바탕으로 자연스럽고 과장되지 않은 체험단 리뷰 초안을 작성해라.

조건:
- 한국어
- 자연스러운 블로그 후기체
- 광고 문구가 과하지 않게
- 제목 3개 생성
- 본문은 5문단 내외
- 해시태그 10~15개 생성
- 사진에 없는 내용은 단정하지 말 것
- 사용자가 넣은 키워드는 자연스럽게 포함
- 금지 표현은 사용하지 말 것

입력:
매장명: {storeName}
지역명: {locationText}
방문 목적: {visitPurpose}
강조 포인트: {highlightPoints}
문체: {toneStyle}
포함 키워드: {includeKeywords}
금지 표현: {avoidKeywords}
사용자 메모: {userNotes}
사진 분석 결과: {analysisJson}
```

---

## 13. 허위정보 방지 원칙

이 프로젝트에서 매우 중요하다.

반드시 지킬 것:

- 사진에 없는 정보는 사실처럼 쓰지 않는다.
- 메뉴명을 확실히 모르면 “추정” 또는 일반 표현 사용
- 친절도, 맛, 서비스는 사용자 메모가 없으면 단정하지 않기
- “무조건 재방문”, “인생맛집”, “꼭 가야 한다” 같은 과장표현 남발 금지
- 협찬/체험단 문체는 가능하지만 노골적인 홍보문은 지양
- 최종 게시 전 사용자가 직접 검토하도록 UI 안내문 표시

추천 안내 문구:

- “생성된 글은 초안입니다. 실제 경험에 맞게 수정 후 사용해 주세요.”
- “사진 및 입력 정보에 기반한 자동 생성 결과입니다.”

---

## 14. 화면 구성 요구사항

## 14-1. 페이지 구조

### 1) 홈 페이지

- 서비스 소개
- 리뷰 생성 시작 버튼
- 최근 생성 예시(샘플)

### 2) 리뷰 생성 페이지

- 사진 업로드 섹션
- 입력 폼 섹션
- 생성 버튼

### 3) 결과 페이지

- 제목 후보
- 본문 에디터
- 해시태그
- 분석 요약
- 복사 / 저장 / 재생성

### 4) 히스토리 페이지

- 생성 목록
- 상세 보기
- 삭제

---

## 15. 디자인 방향

스타일 키워드:

- 깔끔함
- 따뜻함
- 사용하기 쉬움
- 여성스러운 블로그 감성 + 생산성 툴 느낌

디자인 가이드:

- 카드형 UI
- 라운드 큰 버튼
- 밝은 배경
- 업로드 박스 강조
- 결과 텍스트는 가독성 최우선
- 입력폼과 결과를 너무 복잡하게 나누지 말 것

Tailwind 기준:

- max-width container 사용
- 충분한 여백
- 모바일에서도 버튼 누르기 쉽도록
- 타이포그래피 가독성 우선

---

## 16. 폴더 구조 제안

```text
review-draft-ai/
├─ app/
│  ├─ page.tsx
│  ├─ generate/page.tsx
│  ├─ history/page.tsx
│  ├─ review/[id]/page.tsx
│  └─ api/
│     ├─ upload/route.ts
│     ├─ generate-review/route.ts
│     └─ reviews/
│        ├─ route.ts
│        └─ [id]/route.ts
├─ components/
│  ├─ upload/
│  │  ├─ image-dropzone.tsx
│  │  ├─ image-preview-list.tsx
│  │  └─ sortable-image-item.tsx
│  ├─ form/
│  │  ├─ review-form.tsx
│  │  └─ keyword-input.tsx
│  ├─ result/
│  │  ├─ title-candidates.tsx
│  │  ├─ review-editor.tsx
│  │  ├─ hashtag-box.tsx
│  │  └─ analysis-summary.tsx
│  └─ ui/
├─ lib/
│  ├─ openai.ts
│  ├─ supabase.ts
│  ├─ prompts.ts
│  ├─ validators.ts
│  └─ utils.ts
├─ types/
│  ├─ review.ts
│  └─ ai.ts
├─ hooks/
│  └─ use-review-generator.ts
├─ public/
├─ styles/
└─ README.md
```

---

## 17. 타입 설계 예시

```ts
export type ReviewFormInput = {
  storeName: string;
  locationText: string;
  visitPurpose?: string;
  highlightPoints: string[];
  toneStyle: string;
  includeKeywords: string[];
  avoidKeywords: string[];
  userNotes?: string;
  imageUrls: string[];
};

export type PhotoAnalysisResult = {
  storeMood: string;
  interiorFeatures: string[];
  visibleMenus: string[];
  foodAppearance: string[];
  likelyReviewPoints: string[];
  photoOrderSummary: string[];
  uncertainPoints: string[];
};

export type GeneratedReviewResult = {
  titles: string[];
  content: string;
  hashtags: string[];
  analysis: PhotoAnalysisResult;
};
```

---

## 18. 구현 우선순위

## Phase 1 - MVP

반드시 먼저 구현:

- 다중 이미지 업로드
- 매장명 / 지역명 입력
- AI 분석 + 리뷰 생성
- 제목 / 본문 / 해시태그 출력
- 복사 기능

## Phase 2

- 문체 선택
- 사진 순서 변경
- 결과 편집기
- 저장 기능
- 히스토리 조회

## Phase 3

- 로그인
- 사용자별 저장
- 문체 재생성 버튼
- 네이버 블로그 최적화 포맷
- 사진별 캡션 생성
- SEO 키워드 추천

---

## 19. 개발 시 주의사항

- 결과 품질보다 먼저 흐름이 끊기지 않는 MVP를 완성할 것
- 이미지 업로드와 AI 호출 로직을 분리할 것
- AI 응답이 실패하면 재시도 또는 사용자 메시지 처리할 것
- 프롬프트는 별도 파일(lib/prompts.ts)로 분리할 것
- Zod로 입력값 검증
- 생성 결과 저장 전후 로그 확인 가능하게 할 것
- UI는 화려함보다 사용성 우선
- 코드 구조는 확장 가능하게 작성

---

## 20. AI에게 기대하는 구현 범위

이 프로젝트를 구현할 AI/개발 도우미는 아래 작업을 수행해야 한다.

1. Next.js App Router 기반 프로젝트 초기 구조 생성
2. Tailwind + shadcn/ui 세팅
3. 이미지 업로드 UI 구현
4. 입력 폼 구현
5. Supabase Storage 연동
6. OpenAI API 연동
7. 2단계 프롬프트 로직 구현
8. 결과 페이지 구현
9. DB 저장 로직 구현
10. 히스토리 페이지 구현
11. 에러 처리 및 로딩 UI 구현

---

## 21. 최종 요청사항 (AI 코드 생성용)

이제부터 너는 시니어 풀스택 개발자 역할로 이 프로젝트를 구현해라.

구현 조건:

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- Supabase
- OpenAI API
- 유지보수 가능한 구조
- 실제 동작 가능한 코드
- 너무 추상적인 설명 말고 바로 실행 가능한 수준으로 작성
- 파일별 코드 생성 시 파일 경로를 먼저 명시
- 환경변수 예시도 함께 작성
- 필요한 경우 README와 .env.example도 함께 생성
- 더미 데이터가 아닌 실제 연동 가능한 구조로 작성
- 단, OpenAI 모델명과 API 방식은 쉽게 바꿀 수 있게 분리

추가 요청:

- 처음에는 MVP 기준으로 구현
- 이후 확장 포인트를 주석으로 남겨라
- 사용자 경험이 자연스럽도록 로딩/에러/빈 상태 UI도 챙겨라

---

## 22. 한 줄 요약

이 프로젝트는  
**“사진을 넣으면 AI가 맛집 체험단 블로그 리뷰 초안을 생성해주는 웹앱”** 이다.

핵심은:

- 사진 업로드
- 구조화된 사진 분석
- 블로그 리뷰 자동 생성
- 사용자의 최종 편집

이 흐름을 안정적으로 구현하는 것이다.
