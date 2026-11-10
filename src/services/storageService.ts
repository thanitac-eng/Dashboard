import { SurveyResponse, SurveySummary, WorkshopSettings, FirebaseCustomConfig } from '../types';
import { DEFAULT_QUESTIONS, getLikertLevel, INITIAL_SAMPLE_RESPONSES, DEFAULT_SETTINGS } from '../constants';

const STORAGE_KEY_RESPONSES = 'workshop_pulse_responses_v1';
const STORAGE_KEY_SUBMITTED = 'workshop_pulse_user_submission';
const STORAGE_KEY_SETTINGS = 'workshop_pulse_settings';
const STORAGE_KEY_FIREBASE = 'workshop_pulse_firebase_config';

const broadcastChannel = typeof window !== 'undefined' && 'BroadcastChannel' in window 
  ? new BroadcastChannel('workshop_pulse_channel') 
  : null;

// Subscribers for real-time state changes
type Listener = (responses: SurveyResponse[]) => void;
const listeners: Set<Listener> = new Set();

function notifyListeners(responses: SurveyResponse[]) {
  listeners.forEach((listener) => {
    try {
      listener(responses);
    } catch (err) {
      console.error('Error notifying listener:', err);
    }
  });
}

// Setup listeners for cross-tab communication
if (typeof window !== 'undefined') {
  if (broadcastChannel) {
    broadcastChannel.onmessage = (event) => {
      if (event.data?.type === 'RESPONSES_UPDATED') {
        const stored = loadLocalResponses();
        notifyListeners(stored);
      }
    };
  }

  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY_RESPONSES) {
      const stored = loadLocalResponses();
      notifyListeners(stored);
    }
  });
}

function loadLocalResponses(): SurveyResponse[] {
  if (typeof window === 'undefined') return INITIAL_SAMPLE_RESPONSES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_RESPONSES);
    if (!raw) {
      // Initialize with sample responses if first time
      localStorage.setItem(STORAGE_KEY_RESPONSES, JSON.stringify(INITIAL_SAMPLE_RESPONSES));
      return INITIAL_SAMPLE_RESPONSES;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load responses from localStorage', e);
    return INITIAL_SAMPLE_RESPONSES;
  }
}

function saveLocalResponses(responses: SurveyResponse[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_RESPONSES, JSON.stringify(responses));
    broadcastChannel?.postMessage({ type: 'RESPONSES_UPDATED', count: responses.length });
    notifyListeners(responses);
  } catch (e) {
    console.error('Failed to save responses to localStorage', e);
  }
}

export const StorageService = {
  getResponses(): SurveyResponse[] {
    return loadLocalResponses();
  },

  subscribe(listener: Listener): () => void {
    listeners.add(listener);
    // Initial call
    listener(loadLocalResponses());
    return () => {
      listeners.delete(listener);
    };
  },

  async submitResponse(data: Omit<SurveyResponse, 'id' | 'timestamp'>): Promise<SurveyResponse> {
    const newEntry: SurveyResponse = {
      ...data,
      id: 'resp-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      timestamp: Date.now(),
    };

    const current = loadLocalResponses();
    const updated = [newEntry, ...current];
    saveLocalResponses(updated);

    // Save submission flag for this device to prevent duplicate answers
    try {
      localStorage.setItem(STORAGE_KEY_SUBMITTED, JSON.stringify(newEntry));
    } catch (e) {
      console.warn('Could not store submission receipt', e);
    }

    // Attempt Firebase sync if configured
    const fbConfig = this.getFirebaseConfig();
    if (fbConfig?.databaseURL) {
      this.syncToFirebaseREST(fbConfig.databaseURL, newEntry).catch((err) => {
        console.warn('Firebase REST sync notice:', err);
      });
    }

    return newEntry;
  },

  async syncToFirebaseREST(databaseURL: string, entry: SurveyResponse): Promise<void> {
    try {
      const cleanUrl = databaseURL.replace(/\/+$/, '');
      const endpoint = `${cleanUrl}/responses/${entry.id}.json`;
      await fetch(endpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry),
      });
    } catch (err) {
      console.error('Firebase Realtime DB push error:', err);
    }
  },

  async fetchFromFirebaseREST(databaseURL: string): Promise<SurveyResponse[] | null> {
    try {
      const cleanUrl = databaseURL.replace(/\/+$/, '');
      const endpoint = `${cleanUrl}/responses.json`;
      const res = await fetch(endpoint);
      if (!res.ok) throw new Error('Firebase response error ' + res.status);
      const data = await res.json();
      if (!data) return [];
      
      const list: SurveyResponse[] = Object.keys(data).map((key) => ({
        ...data[key],
        id: data[key].id || key,
      }));
      list.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
      return list;
    } catch (err) {
      console.error('Firebase Realtime DB fetch error:', err);
      return null;
    }
  },

  hasSubmittedOnThisDevice(): SurveyResponse | null {
    if (typeof window === 'undefined') return null;
    try {
      const raw = localStorage.getItem(STORAGE_KEY_SUBMITTED);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  clearDeviceSubmission(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY_SUBMITTED);
  },

  addSampleResponses(count: number = 5): void {
    const sampleComments = [
      'เนื้อหาดีมาก ได้แนวคิดใหม่ๆ ไปปรับปรุงงานเยอะเลย',
      'วิทยากรสอนเป็นกันเอง ยกตัวอย่างให้เห็นภาพชัดเจน',
      'อยากให้มีเวลาฝึกปฏิบัติการเพิ่มขึ้นอีกครับ',
      'ระบบการอบรมราบรื่น เอกสารเข้าใจง่ายมาก',
      'ประทับใจมาก จะนำความรู้ไปแบ่งปันให้เพื่อนร่วมทีมต่อไปครับ',
      'หัวข้อตอบโจทย์ยุคปัจจุบันมากครับ',
      'จัดลำดับเนื้อหาได้ดี ไม่น่าเบื่อเลย',
      'อยากให้จัดคอร์สขั้นสูงต่อเนื่องอีกครับ',
    ];

    const current = loadLocalResponses();
    const newItems: SurveyResponse[] = [];
    const now = Date.now();

    for (let i = 0; i < count; i++) {
      // Generate realistic weighted high ratings (mostly 4 and 5, occasional 3)
      const getRandomRating = () => {
        const rand = Math.random();
        if (rand < 0.55) return 5;
        if (rand < 0.88) return 4;
        if (rand < 0.96) return 3;
        return 2;
      };

      const hasComment = Math.random() > 0.35;
      const comment = hasComment ? sampleComments[Math.floor(Math.random() * sampleComments.length)] : '';

      newItems.push({
        id: 'mock-' + (now - i * 60000) + '-' + Math.random().toString(36).substring(2, 6),
        timestamp: now - i * (Math.floor(Math.random() * 8) + 1) * 60000,
        q1: getRandomRating(),
        q2: getRandomRating(),
        q3: getRandomRating(),
        q4: getRandomRating(),
        q5: getRandomRating(),
        suggestion: comment,
      });
    }

    const updated = [...newItems, ...current];
    saveLocalResponses(updated);
  },

  clearAllResponses(): void {
    saveLocalResponses([]);
    this.clearDeviceSubmission();
  },

  resetToDefaultSample(): void {
    saveLocalResponses(INITIAL_SAMPLE_RESPONSES);
  },

  // Calculate stats
  calculateSummary(responses: SurveyResponse[]): SurveySummary {
    const total = responses.length;

    if (total === 0) {
      const emptyStats: SurveySummary['questionStats'] = {};
      DEFAULT_QUESTIONS.forEach((q) => {
        emptyStats[q.id] = {
          mean: 0,
          level: getLikertLevel(0),
          counts: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
          percentages: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        };
      });

      return {
        totalResponses: 0,
        overallMean: 0,
        overallLevel: getLikertLevel(0),
        questionStats: emptyStats,
        suggestionsCount: 0,
        latestSuggestions: [],
      };
    }

    let overallSum = 0;
    const questionStats: SurveySummary['questionStats'] = {};

    DEFAULT_QUESTIONS.forEach((q) => {
      let qSum = 0;
      const counts: { [rating: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

      responses.forEach((resp) => {
        const val = Number(resp[q.id]) || 0;
        qSum += val;
        overallSum += val;
        if (counts[val] !== undefined) {
          counts[val]++;
        }
      });

      const mean = total > 0 ? Number((qSum / total).toFixed(2)) : 0;
      const percentages: { [rating: number]: number } = {};
      for (let r = 1; r <= 5; r++) {
        percentages[r] = total > 0 ? Number(((counts[r] / total) * 100).toFixed(1)) : 0;
      }

      questionStats[q.id] = {
        mean,
        level: getLikertLevel(mean),
        counts,
        percentages,
      };
    });

    const totalRatingsGiven = total * DEFAULT_QUESTIONS.length;
    const overallMean = totalRatingsGiven > 0 ? Number((overallSum / totalRatingsGiven).toFixed(2)) : 0;
    const overallLevel = getLikertLevel(overallMean);

    const suggestionsList = responses
      .filter((r) => r.suggestion && r.suggestion.trim().length > 0)
      .map((r) => {
        const avg = (r.q1 + r.q2 + r.q3 + r.q4 + r.q5) / 5;
        return {
          id: r.id,
          text: r.suggestion.trim(),
          timestamp: r.timestamp,
          ratingAvg: Number(avg.toFixed(2)),
        };
      });

    return {
      totalResponses: total,
      overallMean,
      overallLevel,
      questionStats,
      suggestionsCount: suggestionsList.length,
      latestSuggestions: suggestionsList,
    };
  },

  // Export CSV with UTF-8 BOM for Thai language Excel support
  exportToCSV(settings: WorkshopSettings, responses: SurveyResponse[]): void {
    const summary = this.calculateSummary(responses);
    const dateStr = new Date().toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    let csv = '\uFEFF'; // UTF-8 BOM

    // Header info
    csv += `รายงานสรุปผลการประเมินความพึงพอใจการอบรม\n`;
    csv += `หัวข้อโครงการ,"${settings.title.replace(/"/g, '""')}"\n`;
    csv += `วิทยากร,"${settings.trainerName.replace(/"/g, '""')}"\n`;
    csv += `วันที่ส่งออกข้อมูล,"${dateStr}"\n`;
    csv += `จำนวนผู้ตอบแบบสอบถามทั้งหมด,${summary.totalResponses},คน\n`;
    csv += `คะแนนเฉลี่ยภาพรวม,${summary.overallMean.toFixed(2)} / 5.00,ระดับ ${summary.overallLevel.label} (${summary.overallLevel.englishLabel})\n\n`;

    // Question stats summary table
    csv += `สรุปผลคะแนนเฉลี่ยรายข้อ\n`;
    csv += `ข้อที่,หัวข้อการประเมิน,คะแนนเฉลี่ย (Mean),ระดับความพึงพอใจ,1 (น้อยที่สุด),2 (น้อย),3 (ปานกลาง),4 (มาก),5 (มากที่สุด)\n`;
    DEFAULT_QUESTIONS.forEach((q) => {
      const stats = summary.questionStats[q.id];
      csv += `${q.number},"${q.title.replace(/"/g, '""')}",${stats.mean.toFixed(2)},${stats.level.label},${stats.counts[1]},${stats.counts[2]},${stats.counts[3]},${stats.counts[4]},${stats.counts[5]}\n`;
    });
    csv += `\n`;

    // Detailed Individual Responses
    csv += `รายละเอียดข้อมูลรายบุคคล (Raw Data)\n`;
    csv += `ลำดับ,รหัสอ้างอิง,วันและเวลา,ข้อ 1 (เนื้อหา),ข้อ 2 (วิทยากร),ข้อ 3 (สื่อ/เอกสาร),ข้อ 4 (สถานที่/เวลา),ข้อ 5 (ภาพรวม),คะแนนเฉลี่ย,ข้อเสนอแนะเพิ่มเติม\n`;

    responses.forEach((resp, index) => {
      const respTime = new Date(resp.timestamp).toLocaleString('th-TH');
      const avg = ((resp.q1 + resp.q2 + resp.q3 + resp.q4 + resp.q5) / 5).toFixed(2);
      const cleanSuggestion = (resp.suggestion || '').replace(/"/g, '""').replace(/\n/g, ' ');
      csv += `${index + 1},"${resp.id}","${respTime}",${resp.q1},${resp.q2},${resp.q3},${resp.q4},${resp.q5},${avg},"${cleanSuggestion}"\n`;
    });

    // Create download link
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const filename = `workshop_feedback_${new Date().toISOString().slice(0, 10)}.csv`;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  // Settings
  getSettings(): WorkshopSettings {
    if (typeof window === 'undefined') return DEFAULT_SETTINGS;
    try {
      const raw = localStorage.getItem(STORAGE_KEY_SETTINGS);
      return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  saveSettings(settings: WorkshopSettings): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
  },

  // Firebase config
  getFirebaseConfig(): FirebaseCustomConfig | null {
    if (typeof window === 'undefined') return null;
    try {
      const raw = localStorage.getItem(STORAGE_KEY_FIREBASE);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  saveFirebaseConfig(config: FirebaseCustomConfig | null): void {
    if (typeof window === 'undefined') return;
    if (config) {
      localStorage.setItem(STORAGE_KEY_FIREBASE, JSON.stringify(config));
    } else {
      localStorage.removeItem(STORAGE_KEY_FIREBASE);
    }
  },
};
