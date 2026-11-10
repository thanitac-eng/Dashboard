import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { 
  Users, 
  BarChart3, 
  MessageSquare, 
  QrCode, 
  Maximize2, 
  Minimize2, 
  PlusCircle, 
  Trash2, 
  Search, 
  TrendingUp, 
  Copy, 
  Check, 
  Clock,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { SurveyResponse, SurveySummary, WorkshopSettings } from '../types';
import { DEFAULT_QUESTIONS, RATING_SCALE_INFO, getLikertLevel } from '../constants';
import { StorageService } from '../services/storageService';
import { CircularScoreGauge, MultiSegmentDonut } from './CircularDonutChart';

interface DashboardViewProps {
  responses: SurveyResponse[];
  summary: SurveySummary;
  settings: WorkshopSettings;
  onOpenQR: () => void;
  onExportCSV: () => void;
  onSwitchToSurvey: () => void;
  isProjectorDark: boolean;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  responses,
  summary,
  settings,
  onOpenQR,
  onExportCSV,
  onSwitchToSurvey,
  isProjectorDark,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'breakdown' | 'comments'>('overview');
  const [chartViewMode, setChartViewMode] = useState<'circular_gauge' | 'circular_distribution' | 'bar'>('circular_gauge');

  const surveyUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}${window.location.pathname}?view=survey` 
    : '';

  useEffect(() => {
    if (surveyUrl) {
      QRCode.toDataURL(surveyUrl, {
        width: 320,
        margin: 1.5,
        color: {
          dark: isProjectorDark ? '#0f172a' : '#1e1b4b',
          light: '#ffffff',
        },
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error(err));
    }
  }, [surveyUrl, isProjectorDark]);

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
      }
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(surveyUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleAddSample = (count: number) => {
    StorageService.addSampleResponses(count);
  };

  const handleResetData = () => {
    if (window.confirm('คุณต้องการล้างข้อมูลคำตอบทั้งหมดและเริ่มต้นใหม่ใช่หรือไม่?')) {
      StorageService.clearAllResponses();
    }
  };

  const filteredSuggestions = summary.latestSuggestions.filter((item) =>
    item.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const responseRate = settings.expectedAttendees > 0
    ? Math.min(100, Math.round((summary.totalResponses / settings.expectedAttendees) * 100))
    : 100;

  // Calculate aggregated star counts across all questions for the master circular donut
  const overallCounts: { [rating: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let grandTotalRatings = 0;
  DEFAULT_QUESTIONS.forEach((q) => {
    const stat = summary.questionStats[q.id];
    if (stat) {
      for (let r = 1; r <= 5; r++) {
        const c = stat.counts[r] || 0;
        overallCounts[r] += c;
        grandTotalRatings += c;
      }
    }
  });

  return (
    <div className={`min-h-screen transition-colors ${isProjectorDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} pb-16`}>
      
      {/* Subheader / Presenter Stage Bar */}
      <div className={`px-4 sm:px-8 py-4 border-b ${isProjectorDark ? 'border-slate-800 bg-slate-900/60' : 'border-slate-200 bg-white/80'} backdrop-blur-sm`}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span>เรียลไทม์ (LIVE)</span>
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                คะแนนและกราฟจะขยับทันทีที่มีผู้ส่งแบบประเมิน
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight">
              {settings.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              วิทยากร: {settings.trainerName} · {settings.subtitle}
            </p>
          </div>

          {/* Presenter Quick Action Controls */}
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <button
              onClick={handleToggleFullscreen}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition ${
                isProjectorDark
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-sm'
              }`}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              <span>{isFullscreen ? 'ออกจากเต็มจอ' : 'จอโปรเจกเตอร์เต็มจอ'}</span>
            </button>

            <button
              onClick={() => handleAddSample(1)}
              title="จำลองคนตอบเพิ่ม 1 คน"
              className={`flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium border transition ${
                isProjectorDark
                  ? 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border-slate-700'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5 text-indigo-500" />
              <span>+1 จำลอง</span>
            </button>

            <button
              onClick={() => handleAddSample(5)}
              title="จำลองคนตอบเพิ่ม 5 คน"
              className={`hidden sm:flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium border transition ${
                isProjectorDark
                  ? 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border-slate-700'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5 text-emerald-500" />
              <span>+5 จำลอง</span>
            </button>

            <button
              onClick={handleResetData}
              title="ล้างข้อมูลและเริ่มต้นใหม่"
              className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-6">
        
        {/* KPI Strip & QR Scanner Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          
          {/* Card 1: On-Screen QR Code for Participants */}
          <div className={`p-5 rounded-3xl border flex flex-col justify-between relative overflow-hidden ${
            isProjectorDark
              ? 'bg-slate-900/90 border-slate-800 shadow-xl'
              : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                <QrCode className="w-4 h-4" />
                สแกนร่วมประเมิน
              </span>
              <button
                onClick={onOpenQR}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-semibold"
              >
                <span>ขยายใหญ่</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>

            <div className="flex items-center gap-4 my-auto">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="QR Code สำหรับแบบสอบถาม"
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-white p-1.5 shadow-sm border border-slate-200 cursor-pointer hover:scale-105 transition"
                  onClick={onOpenQR}
                />
              ) : (
                <div className="w-24 h-24 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
              )}
              <div className="flex flex-col justify-center">
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-snug">
                  ยกกล้องมือถือสแกน เพื่อเปิดแบบประเมิน
                </p>
                <button
                  onClick={handleCopyLink}
                  className="mt-2 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                >
                  {copiedLink ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedLink ? 'คัดลอกลิงก์แล้ว!' : 'คัดลอกลิงก์'}</span>
                </button>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 truncate">
              ไม่ต้องล็อกอิน · ตอบได้ทันที
            </div>
          </div>

          {/* Card 2: จำนวนผู้ตอบทั้งหมด (Total Respondents) */}
          <div className={`p-5 rounded-3xl border flex flex-col justify-between ${
            isProjectorDark
              ? 'bg-slate-900/90 border-slate-800 shadow-xl'
              : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
              <span>ผู้ตอบแบบประเมิน</span>
              <Users className="w-4 h-4 text-indigo-500" />
            </div>

            <div className="my-3">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-black tabular-nums tracking-tight text-slate-900 dark:text-white">
                  {summary.totalResponses}
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-sm font-semibold">
                  / {settings.expectedAttendees} คน
                </span>
              </div>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>คิดเป็น {responseRate}% ของผู้เข้าอบรม</span>
              </p>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${responseRate}%` }}
              />
            </div>
          </div>

          {/* Card 3: คะแนนเฉลี่ยรวมทุกด้าน (Overall Mean) */}
          <div className={`p-5 rounded-3xl border flex flex-col justify-between ${
            isProjectorDark
              ? 'bg-slate-900/90 border-slate-800 shadow-xl'
              : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
              <span>คะแนนเฉลี่ยรวม (Overall Mean)</span>
              <Sparkles className="w-4 h-4 text-amber-500" />
            </div>

            <div className="my-2">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-black tabular-nums tracking-tight text-indigo-600 dark:text-indigo-400">
                  {summary.overallMean.toFixed(2)}
                </span>
                <span className="text-slate-400 text-base font-semibold">
                  / 5.00
                </span>
              </div>

              {/* Likert Interpretation Badge */}
              <div className="mt-2">
                <span className={`inline-flex items-center px-3 py-1 rounded-xl text-xs font-bold border ${summary.overallLevel.bgClass} ${summary.overallLevel.colorClass} ${summary.overallLevel.borderClass}`}>
                  ระดับ {summary.overallLevel.label} ({summary.overallLevel.englishLabel})
                </span>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              เกณฑ์: 4.51-5.00 มากที่สุด | 3.51-4.50 มาก
            </div>
          </div>

          {/* Card 4: ข้อเสนอแนะ & ความคิดเห็น (Suggestions KPI) */}
          <div className={`p-5 rounded-3xl border flex flex-col justify-between ${
            isProjectorDark
              ? 'bg-slate-900/90 border-slate-800 shadow-xl'
              : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
              <span>ข้อเสนอแนะที่ได้รับ</span>
              <MessageSquare className="w-4 h-4 text-violet-500" />
            </div>

            <div className="my-3">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-black tabular-nums tracking-tight text-slate-900 dark:text-white">
                  {summary.suggestionsCount}
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-sm font-semibold">
                  ความคิดเห็น
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {summary.totalResponses > 0
                  ? `คิดเป็น ${Math.round((summary.suggestionsCount / summary.totalResponses) * 100)}% ของผู้ตอบ`
                  : 'รอความคิดเห็นแรก'}
              </p>
            </div>

            <button
              onClick={() => setActiveTab('comments')}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline text-left"
            >
              ดูข้อเสนอแนะทั้งหมด →
            </button>
          </div>

        </div>

        {/* Section Tabs for Projector Display */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
                activeTab === 'overview'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              ⭕ สรุปผลคะแนนรายข้อ (กราฟวงกลม)
            </button>
            <button
              onClick={() => setActiveTab('comments')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 ${
                activeTab === 'comments'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              💬 ข้อเสนอแนะล่าสุด ({summary.suggestionsCount})
            </button>
          </div>

          {/* Chart Display Mode Switcher (Circular Gauges vs Donut Distribution vs Bar) */}
          {activeTab === 'overview' && (
            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl text-xs self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setChartViewMode('circular_gauge')}
                className={`px-3 py-1.5 rounded-lg font-medium transition ${
                  chartViewMode === 'circular_gauge'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                ⭕ วงกลมคะแนนเฉลี่ย
              </button>
              <button
                type="button"
                onClick={() => setChartViewMode('circular_distribution')}
                className={`px-3 py-1.5 rounded-lg font-medium transition ${
                  chartViewMode === 'circular_distribution'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                🍩 วงกลมสัดส่วนดาว
              </button>
              <button
                type="button"
                onClick={() => setChartViewMode('bar')}
                className={`px-3 py-1.5 rounded-lg font-medium transition ${
                  chartViewMode === 'bar'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                📊 กราฟแท่ง
              </button>
            </div>
          )}
        </div>

        {/* TAB 1: OVERVIEW & CIRCULAR CHARTS */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left 2 Cols: Questions Circular Charts (or Bar) */}
            <div className={`lg:col-span-2 p-6 rounded-3xl border ${
              isProjectorDark
                ? 'bg-slate-900/90 border-slate-800'
                : 'bg-white border-slate-200'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800/80">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>คะแนนประเมินรายข้อ (สเกล 1-5)</span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400">
                      {chartViewMode === 'circular_gauge' ? 'กราฟวงกลมคะแนน' : chartViewMode === 'circular_distribution' ? 'กราฟวงกลมสัดส่วนดาว' : 'กราฟแท่ง'}
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {chartViewMode === 'circular_gauge' 
                      ? 'แสดงความคืบหน้าคะแนนเฉลี่ยเป็นวงกลมเต็ม 5.00 คะแนน พร้อมการแปลผลตามเกณฑ์'
                      : chartViewMode === 'circular_distribution'
                      ? 'แสดงสัดส่วนผู้ให้คะแนนระดับ 1 ถึง 5 ดาวในรูปวงกลม Donut'
                      : 'แสดงค่าเฉลี่ยและสัดส่วนผู้ให้คะแนนแต่ละระดับ'}
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-xs text-slate-400 block">เกณฑ์สูงสุด</span>
                  <span className="text-sm font-bold text-emerald-500">5.00 คะแนน</span>
                </div>
              </div>

              {/* MODE 1: CIRCULAR SCORE GAUGES (DEFAULT) */}
              {chartViewMode === 'circular_gauge' && (
                <div className="space-y-4">
                  {DEFAULT_QUESTIONS.map((q) => {
                    const stat = summary.questionStats[q.id];
                    const meanVal = stat ? stat.mean : 0;
                    const level = stat ? stat.level : getLikertLevel(0);

                    return (
                      <div
                        key={q.id}
                        className={`p-4 rounded-2xl border transition-all hover:scale-[1.01] ${
                          isProjectorDark
                            ? 'bg-slate-800/50 border-slate-700/60 hover:bg-slate-800/80'
                            : 'bg-slate-50/70 border-slate-200/80 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                          
                          {/* Circular Donut Gauge */}
                          <div className="shrink-0">
                            <CircularScoreGauge
                              score={meanVal}
                              maxScore={5.0}
                              level={level}
                              size={105}
                              strokeWidth={9}
                            />
                          </div>

                          {/* Question Details and Breakdown */}
                          <div className="flex-1 text-center sm:text-left w-full">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1.5">
                              <div className="flex items-center gap-2 justify-center sm:justify-start">
                                <span className="w-5 h-5 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-xs flex items-center justify-center shrink-0">
                                  {q.number}
                                </span>
                                <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                                  {q.title}
                                </h3>
                              </div>

                              <span className={`inline-flex items-center justify-center text-xs font-bold px-2.5 py-1 rounded-lg border w-fit mx-auto sm:mx-0 ${level.bgClass} ${level.colorClass} ${level.borderClass}`}>
                                ระดับ {level.label}
                              </span>
                            </div>

                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 line-clamp-1">
                              {q.description}
                            </p>

                            {/* Response breakdown pills */}
                            {stat && summary.totalResponses > 0 && (
                              <div className="flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-xs">
                                <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center sm:justify-start">
                                  {[5, 4, 3, 2, 1].map((r) => {
                                    const count = stat.counts[r] || 0;
                                    const pct = stat.percentages[r] || 0;
                                    const colors = ['#ef4444', '#f59e0b', '#eab308', '#3b82f6', '#10b981'];
                                    return (
                                      <span key={r} className="inline-flex items-center gap-1 text-[11px] tabular-nums text-slate-600 dark:text-slate-400">
                                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: colors[r - 1] }} />
                                        <span>★{r}: <strong>{count}</strong> ({pct}%)</span>
                                      </span>
                                    );
                                  })}
                                </div>
                                <span className="text-[11px] text-slate-400">
                                  จาก {summary.totalResponses} คน
                                </span>
                              </div>
                            )}
                          </div>

                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* MODE 2: MULTI-SEGMENT DONUT DISTRIBUTION CHARTS */}
              {chartViewMode === 'circular_distribution' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {DEFAULT_QUESTIONS.map((q) => {
                    const stat = summary.questionStats[q.id];
                    const meanVal = stat ? stat.mean : 0;
                    const level = stat ? stat.level : getLikertLevel(0);

                    return (
                      <div
                        key={q.id}
                        className={`p-4 rounded-2xl border text-center flex flex-col justify-between ${
                          isProjectorDark
                            ? 'bg-slate-800/50 border-slate-700/60'
                            : 'bg-slate-50/70 border-slate-200/80'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-1 mb-2">
                            <span className="w-5 h-5 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-xs flex items-center justify-center shrink-0">
                              {q.number}
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${level.bgClass} ${level.colorClass} ${level.borderClass}`}>
                              {level.label}
                            </span>
                          </div>

                          <h3 className="font-semibold text-xs text-slate-900 dark:text-white line-clamp-2 min-h-[2rem] mb-3">
                            {q.title}
                          </h3>
                        </div>

                        <div className="my-2 flex justify-center">
                          <MultiSegmentDonut
                            counts={stat?.counts || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }}
                            total={summary.totalResponses}
                            meanScore={meanVal}
                            size={120}
                            strokeWidth={12}
                          />
                        </div>

                        <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-[10px] text-slate-500 dark:text-slate-400 space-y-1">
                          <div className="flex justify-between">
                            <span className="text-emerald-500 font-semibold">★5 (มากที่สุด)</span>
                            <span>{stat?.counts[5] || 0} คน ({stat?.percentages[5] || 0}%)</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-blue-500 font-semibold">★4 (มาก)</span>
                            <span>{stat?.counts[4] || 0} คน ({stat?.percentages[4] || 0}%)</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-yellow-500 font-semibold">★3 (ปานกลาง)</span>
                            <span>{stat?.counts[3] || 0} คน ({stat?.percentages[3] || 0}%)</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* MODE 3: BAR CHART VIEW */}
              {chartViewMode === 'bar' && (
                <div className="space-y-6">
                  {DEFAULT_QUESTIONS.map((q) => {
                    const stat = summary.questionStats[q.id];
                    const meanVal = stat ? stat.mean : 0;
                    const level = stat ? stat.level : getLikertLevel(0);
                    const barPercent = Math.min(100, Math.round((meanVal / 5) * 100));

                    return (
                      <div key={q.id} className="group">
                        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-2">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold text-xs flex items-center justify-center shrink-0">
                              {q.number}
                            </span>
                            <span className="font-semibold text-sm sm:text-base text-slate-900 dark:text-slate-100">
                              {q.title}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 pl-7 sm:pl-0 shrink-0">
                            <span className="text-lg sm:text-xl font-extrabold text-indigo-600 dark:text-indigo-400 tabular-nums">
                              {meanVal.toFixed(2)}
                            </span>
                            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${level.bgClass} ${level.colorClass} ${level.borderClass}`}>
                              {level.label}
                            </span>
                          </div>
                        </div>

                        <div className="w-full h-4 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 mb-2">
                          <div
                            className="h-full rounded-full transition-all duration-700 ease-out bg-gradient-to-r from-indigo-500 to-indigo-600 dark:from-indigo-500 dark:to-indigo-400 shadow-sm"
                            style={{ width: `${barPercent}%` }}
                          />
                        </div>

                        {stat && summary.totalResponses > 0 && (
                          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pl-1">
                            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                              {[5, 4, 3, 2, 1].map((r) => {
                                const count = stat.counts[r] || 0;
                                const pct = stat.percentages[r] || 0;
                                return (
                                  <span key={r} className="tabular-nums">
                                    ★{r}: <strong className="text-slate-700 dark:text-slate-300">{count}</strong> ({pct}%)
                                  </span>
                                );
                              })}
                            </div>
                            <span className="text-[10px] text-slate-400 hidden sm:inline">
                              จาก {summary.totalResponses} คน
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Likert Scale Legend */}
              <div className="mt-8 pt-5 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
                <span className="font-semibold text-slate-700 dark:text-slate-300">เกณฑ์การแปลความหมาย:</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> 4.51 - 5.00: มากที่สุด</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500"></span> 3.51 - 4.50: มาก</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-yellow-500"></span> 2.51 - 3.50: ปานกลาง</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500"></span> 1.51 - 2.50: น้อย</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-500"></span> 1.00 - 1.50: น้อยที่สุด</span>
              </div>
            </div>

            {/* Right 1 Col: Overall Satisfaction Donut & Live Feedback */}
            <div className="space-y-6">
              
              {/* Overall Satisfaction Donut Card */}
              <div className={`p-5 rounded-3xl border ${
                isProjectorDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <span>⭕ สัดส่วนความพึงพอใจทั้งโครงการ</span>
                  </h3>
                  <span className="text-[11px] text-slate-400 font-medium">รวมทุกคำถาม</span>
                </div>

                <div className="flex items-center justify-center py-2">
                  <MultiSegmentDonut
                    counts={overallCounts}
                    total={grandTotalRatings}
                    meanScore={summary.overallMean}
                    size={135}
                    strokeWidth={13}
                  />
                </div>

                {/* Legend with percentages */}
                <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                    <span className="truncate">★5: <strong>{overallCounts[5]}</strong> ({grandTotalRatings > 0 ? Math.round((overallCounts[5] / grandTotalRatings) * 100) : 0}%)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0" />
                    <span className="truncate">★4: <strong>{overallCounts[4]}</strong> ({grandTotalRatings > 0 ? Math.round((overallCounts[4] / grandTotalRatings) * 100) : 0}%)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 shrink-0" />
                    <span className="truncate">★3: <strong>{overallCounts[3]}</strong> ({grandTotalRatings > 0 ? Math.round((overallCounts[3] / grandTotalRatings) * 100) : 0}%)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                    <span className="truncate">★2: <strong>{overallCounts[2]}</strong> ({grandTotalRatings > 0 ? Math.round((overallCounts[2] / grandTotalRatings) * 100) : 0}%)</span>
                  </div>
                  <div className="flex items-center gap-1.5 col-span-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
                    <span className="truncate">★1: <strong>{overallCounts[1]}</strong> ({grandTotalRatings > 0 ? Math.round((overallCounts[1] / grandTotalRatings) * 100) : 0}%)</span>
                  </div>
                </div>
              </div>

              {/* Recent Suggestions Card */}
              <div className={`p-6 rounded-3xl border flex flex-col ${
                isProjectorDark
                  ? 'bg-slate-900/90 border-slate-800'
                  : 'bg-white border-slate-200'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-indigo-500" />
                    <span>ข้อเสนอแนะล่าสุด</span>
                  </h3>
                  <span className="text-xs text-slate-400 tabular-nums">
                    {summary.suggestionsCount} ข้อความ
                  </span>
                </div>

                <div className="space-y-3 overflow-y-auto max-h-[360px] pr-1 flex-1">
                  {summary.latestSuggestions.length === 0 ? (
                    <div className="text-center py-12 text-slate-400 text-xs">
                      ยังไม่มีข้อเสนอแนะเพิ่มเติม
                      <p className="mt-1 text-[11px] text-slate-500">เมื่อผู้ตอบพิมพ์ข้อเสนอแนะ จะแสดงขึ้นที่นี่สดๆ</p>
                    </div>
                  ) : (
                    summary.latestSuggestions.slice(0, 6).map((item) => (
                      <div
                        key={item.id}
                        className={`p-3.5 rounded-2xl border text-xs leading-relaxed transition ${
                          isProjectorDark
                            ? 'bg-slate-800/60 border-slate-700/60 text-slate-200'
                            : 'bg-slate-50 border-slate-200 text-slate-800'
                        }`}
                      >
                        <p className="font-normal italic">"{item.text}"</p>
                        <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 pt-2 border-t border-slate-200/50 dark:border-slate-700/50">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(item.timestamp).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} น.
                          </span>
                          <span className="font-semibold text-indigo-500 dark:text-indigo-400">
                            ให้คะแนนเฉลี่ย {item.ratingAvg} ★
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {summary.latestSuggestions.length > 6 && (
                  <button
                    onClick={() => setActiveTab('comments')}
                    className="mt-3 text-xs font-semibold text-indigo-600 dark:text-indigo-400 text-center hover:underline"
                  >
                    ดูทั้งหมด {summary.latestSuggestions.length} ข้อความ →
                  </button>
                )}
              </div>

              {/* Presenter Tip Card */}
              <div className={`p-5 rounded-2xl border ${
                isProjectorDark
                  ? 'bg-indigo-950/20 border-indigo-900/40 text-indigo-200'
                  : 'bg-indigo-50/60 border-indigo-100 text-indigo-900'
              }`}>
                <h4 className="font-bold text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
                  <Sparkles className="w-3.5 h-3.5" />
                  คำแนะนำสำหรับการขึ้นจอโปรเจกเตอร์
                </h4>
                <p className="text-xs leading-relaxed opacity-90">
                  กดปุ่ม <strong>"จอโปรเจกเตอร์เต็มจอ"</strong> มุมขวาบนเพื่อซ่อนแถบเครื่องมือของบราวเซอร์ ให้ผู้เข้าอบรมเห็นคะแนนชัดเจนแม้อยู่หลังห้อง
                </p>
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: DETAILED COMMENTS & SEARCH */}
        {activeTab === 'comments' && (
          <div className={`p-6 rounded-3xl border ${
            isProjectorDark
              ? 'bg-slate-900/90 border-slate-800'
              : 'bg-white border-slate-200'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  ข้อเสนอแนะและเสียงสะท้อนจากผู้เข้าร่วมอบรม
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  รวมข้อคิดเห็นทั้งหมด {summary.suggestionsCount} รายการ
                </p>
              </div>

              {/* Search Box */}
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ค้นหาข้อเสนอแนะ..."
                  className={`w-full pl-9 pr-4 py-2 rounded-xl text-xs border outline-none transition ${
                    isProjectorDark
                      ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-400 focus:border-indigo-500'
                      : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-indigo-500'
                  }`}
                />
              </div>
            </div>

            {filteredSuggestions.length === 0 ? (
              <div className="text-center py-16 text-slate-400 text-sm">
                {searchQuery ? 'ไม่พบข้อเสนอแนะที่ตรงกับคำค้นหา' : 'ยังไม่มีข้อเสนอแนะที่บันทึกไว้'}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredSuggestions.map((item, idx) => (
                  <div
                    key={item.id}
                    className={`p-5 rounded-2xl border text-sm leading-relaxed ${
                      isProjectorDark
                        ? 'bg-slate-800/70 border-slate-700/80 text-slate-200'
                        : 'bg-slate-50/80 border-slate-200 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold text-indigo-500 dark:text-indigo-400">
                        ความคิดเห็นที่ {idx + 1}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {new Date(item.timestamp).toLocaleString('th-TH')}
                      </span>
                    </div>
                    <p className="font-normal italic text-slate-800 dark:text-slate-100">
                      "{item.text}"
                    </p>
                    <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
                      <span>คะแนนเฉลี่ยรวมของผู้ตอบนี้</span>
                      <span className="font-bold text-emerald-500 dark:text-emerald-400">
                        {item.ratingAvg} / 5.00
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
