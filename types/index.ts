export type PhotoAnalysisItem = {
  imageIndex: number;
  sceneType: 'exterior' | 'interior' | 'display' | 'food_detail' | 'packaging' | 'other';
  visibleSubjects: string[];
  caption: string;
  confidence: number;
};

export type ReviewFormInput = {
  storeName: string;
  locationText: string;
  visitPurpose: string;
  highlightPoints: string[];
  toneStyle: string;
  includeKeywords: string[];
  avoidKeywords: string[];
  userNotes?: string;
  imageUrls: string[];
};

export interface ReviewRecord extends ReviewFormInput {
  id: string;
  analysis_json: {
    photoDetails: PhotoAnalysisItem[];
    storeMood: string;
    visibleMenus: string[];
  };
  generated_titles: string[];
  generated_content: string;
  generated_hashtags: string[];
  created_at: string;
}
