export interface SurveyResponse {
  id: string;
  timestamp: number;
  q1: number; // ด้านเนื้อหาหลักสูตร
  q2: number; // ด้านวิทยากร
  q3: number; // ด้านสื่อและเอกสารประกอบ
  q4: number; // ด้านการบริหารเวลาและสถานที่
  q5: number; // ด้านภาพรวมและการนำไปใช้
  suggestion: string;
  deviceId?: string;
}

export interface QuestionDef {
  id: keyof Pick<SurveyResponse, 'q1' | 'q2' | 'q3' | 'q4' | 'q5'>;
  number: number;
  title: string;
  category: string;
  description: string;
}

export interface SurveySummary {
  totalResponses: number;
  overallMean: number;
  overallLevel: LikertLevel;
  questionStats: {
    [key: string]: {
      mean: number;
      level: LikertLevel;
      counts: { [rating: number]: number }; // 1 to 5
      percentages: { [rating: number]: number };
    };
  };
  suggestionsCount: number;
  latestSuggestions: Array<{
    id: string;
    text: string;
    timestamp: number;
    ratingAvg: number;
  }>;
}

export interface LikertLevel {
  label: string;
  englishLabel: string;
  min: number;
  max: number;
  colorClass: string;
  bgClass: string;
  borderClass: string;
}

export interface FirebaseCustomConfig {
  apiKey: string;
  authDomain?: string;
  databaseURL: string;
  projectId: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
}

export interface WorkshopSettings {
  title: string;
  subtitle: string;
  trainerName: string;
  date: string;
  expectedAttendees: number;
  allowRetakeInTestMode: boolean;
}
