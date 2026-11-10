import { QuestionDef, LikertLevel, WorkshopSettings, SurveyResponse } from './types';

export const DEFAULT_QUESTIONS: QuestionDef[] = [
  {
    id: 'q1',
    number: 1,
    title: 'ความเหมาะสมและความชัดเจนของเนื้อหาหลักสูตร',
    category: 'ด้านเนื้อหาหลักสูตร',
    description: 'เนื้อหามีความน่าสนใจ ครบถ้วน ทันสมัย และตรงตามวัตถุประสงค์การอบรม',
  },
  {
    id: 'q2',
    number: 2,
    title: 'ความรู้ความเชี่ยวชาญและการถ่ายทอดของวิทยากร',
    category: 'ด้านวิทยากร',
    description: 'วิทยากรอธิบายเข้าใจง่าย มีเทคนิคการสอนที่น่าติดตาม และตอบข้อซักถามได้ชัดเจน',
  },
  {
    id: 'q3',
    number: 3,
    title: 'คุณภาพและความครบถ้วนของสื่อและเอกสารประกอบ',
    category: 'ด้านสื่อและเอกสาร',
    description: 'เอกสาร สไลด์ แบบฝึกหัด หรือเครื่องมือประกอบการเรียนรู้มีประโยชน์และนำไปใช้ได้จริง',
  },
  {
    id: 'q4',
    number: 4,
    title: 'ความเหมาะสมของการบริหารเวลาและสถานที่/ระบบห้องเรียน',
    category: 'ด้านการบริหารจัดการ',
    description: 'การจัดสรรเวลาการบรรยายและการลงมือทำ ระบบภาพ เสียง อุปกรณ์ หรือห้องเรียนมีความพร้อม',
  },
  {
    id: 'q5',
    number: 5,
    title: 'ความพึงพอใจในภาพรวมและประโยชน์ที่นำไปประยุกต์ใช้ได้',
    category: 'ภาพรวมและการนำไปใช้',
    description: 'ภาพรวมของหลักสูตรสร้างแรงบันดาลใจ และมั่นใจว่าสามารถนำความรู้ไปต่อยอดการทำงานได้',
  },
];

export const RATING_SCALE_INFO: { [rating: number]: { label: string; sublabel: string; emoji: string; color: string; ringColor: string } } = {
  1: {
    label: 'น้อยที่สุด',
    sublabel: 'ต้องปรับปรุงอย่างยิ่ง',
    emoji: '😞',
    color: 'text-rose-600 bg-rose-50 border-rose-300',
    ringColor: 'peer-checked:ring-rose-500 peer-checked:border-rose-500 peer-checked:bg-rose-50',
  },
  2: {
    label: 'น้อย',
    sublabel: 'ควรพัฒนาเพิ่มเติม',
    emoji: '🙁',
    color: 'text-amber-600 bg-amber-50 border-amber-300',
    ringColor: 'peer-checked:ring-amber-500 peer-checked:border-amber-500 peer-checked:bg-amber-50',
  },
  3: {
    label: 'ปานกลาง',
    sublabel: 'พอใช้ / ตามเกณฑ์',
    emoji: '😐',
    color: 'text-yellow-600 bg-yellow-50 border-yellow-300',
    ringColor: 'peer-checked:ring-yellow-500 peer-checked:border-yellow-500 peer-checked:bg-yellow-50',
  },
  4: {
    label: 'มาก',
    sublabel: 'น่าพอใจ / ดี',
    emoji: '🙂',
    color: 'text-blue-600 bg-blue-50 border-blue-300',
    ringColor: 'peer-checked:ring-blue-500 peer-checked:border-blue-500 peer-checked:bg-blue-50',
  },
  5: {
    label: 'มากที่สุด',
    sublabel: 'ประทับใจยอดเยี่ยม',
    emoji: '🤩',
    color: 'text-emerald-600 bg-emerald-50 border-emerald-300',
    ringColor: 'peer-checked:ring-emerald-500 peer-checked:border-emerald-500 peer-checked:bg-emerald-50',
  },
};

export const LIKERT_LEVELS: LikertLevel[] = [
  {
    label: 'มากที่สุด',
    englishLabel: 'Highest',
    min: 4.51,
    max: 5.0,
    colorClass: 'text-emerald-700 dark:text-emerald-300',
    bgClass: 'bg-emerald-50 dark:bg-emerald-950/60',
    borderClass: 'border-emerald-300 dark:border-emerald-800',
  },
  {
    label: 'มาก',
    englishLabel: 'High',
    min: 3.51,
    max: 4.5,
    colorClass: 'text-blue-700 dark:text-blue-300',
    bgClass: 'bg-blue-50 dark:bg-blue-950/60',
    borderClass: 'border-blue-300 dark:border-blue-800',
  },
  {
    label: 'ปานกลาง',
    englishLabel: 'Moderate',
    min: 2.51,
    max: 3.5,
    colorClass: 'text-yellow-700 dark:text-yellow-300',
    bgClass: 'bg-yellow-50 dark:bg-yellow-950/60',
    borderClass: 'border-yellow-300 dark:border-yellow-800',
  },
  {
    label: 'น้อย',
    englishLabel: 'Low',
    min: 1.51,
    max: 2.5,
    colorClass: 'text-amber-700 dark:text-amber-300',
    bgClass: 'bg-amber-50 dark:bg-amber-950/60',
    borderClass: 'border-amber-300 dark:border-amber-800',
  },
  {
    label: 'น้อยที่สุด',
    englishLabel: 'Lowest',
    min: 1.0,
    max: 1.5,
    colorClass: 'text-rose-700 dark:text-rose-300',
    bgClass: 'bg-rose-50 dark:bg-rose-950/60',
    borderClass: 'border-rose-300 dark:border-rose-800',
  },
];

export function getLikertLevel(score: number): LikertLevel {
  if (score <= 0) {
    return {
      label: 'ยังไม่มีข้อมูล',
      englishLabel: 'No Data',
      min: 0,
      max: 0,
      colorClass: 'text-slate-500 dark:text-slate-400',
      bgClass: 'bg-slate-100 dark:bg-slate-800',
      borderClass: 'border-slate-300 dark:border-slate-700',
    };
  }

  for (const level of LIKERT_LEVELS) {
    if (score >= level.min) {
      return level;
    }
  }
  return LIKERT_LEVELS[LIKERT_LEVELS.length - 1];
}

export const DEFAULT_SETTINGS: WorkshopSettings = {
  title: 'โครงการอบรมเชิงปฏิบัติการเสริมสร้างทักษะดิจิทัลแห่งอนาคต',
  subtitle: 'Digital Skills & AI for Productivity Workshop 2026',
  trainerName: 'คณะวิทยากรผู้เชี่ยวชาญ',
  date: new Date().toISOString().split('T')[0],
  expectedAttendees: 40,
  allowRetakeInTestMode: true,
};

export const INITIAL_SAMPLE_RESPONSES: SurveyResponse[] = [
  {
    id: 'sample-1',
    timestamp: Date.now() - 1000 * 60 * 35,
    q1: 5,
    q2: 5,
    q3: 4,
    q4: 4,
    q5: 5,
    suggestion: 'วิทยากรบรรยายได้สนุกมาก มีการยกตัวอย่างชัดเจน เข้าใจง่ายแม้ไม่มีพื้นฐานมาก่อนครับ',
  },
  {
    id: 'sample-2',
    timestamp: Date.now() - 1000 * 60 * 24,
    q1: 5,
    q2: 5,
    q3: 5,
    q4: 5,
    q5: 5,
    suggestion: 'สไลด์สวยงาม เครื่องมือที่ให้ทดลองทำจริงช่วยประหยัดเวลาการทำงานได้มาก อยากให้มีคอร์สขั้นสูงต่อครับ',
  },
  {
    id: 'sample-3',
    timestamp: Date.now() - 1000 * 60 * 18,
    q1: 4,
    q2: 5,
    q3: 4,
    q4: 4,
    q5: 4,
    suggestion: 'เนื้อหาแน่นดีมาก อยากให้เพิ่มเวลาในช่วง Workshop ปฏิบัติการอีกนิดเพื่อให้ทำโปรเจกต์ได้จบสมบูรณ์ครับ',
  },
  {
    id: 'sample-4',
    timestamp: Date.now() - 1000 * 60 * 11,
    q1: 5,
    q2: 4,
    q3: 5,
    q4: 5,
    q5: 5,
    suggestion: 'ระบบห้องอบรมและสิ่งอำนวยความสะดวกดีมาก ขอบคุณทีมงานและผู้จัดทุกคนครับ',
  },
  {
    id: 'sample-5',
    timestamp: Date.now() - 1000 * 60 * 3,
    q1: 4,
    q2: 5,
    q3: 4,
    q4: 3,
    q5: 4,
    suggestion: 'แอร์ในห้องช่วงบ่ายค่อนข้างเย็น นอกนั้นยอดเยี่ยมทุกอย่างครับ',
  },
];
