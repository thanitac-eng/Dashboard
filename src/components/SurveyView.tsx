import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, ArrowRight, RotateCcw, Sparkles, MessageSquare, AlertCircle } from 'lucide-react';
import { DEFAULT_QUESTIONS, RATING_SCALE_INFO } from '../constants';
import { StorageService } from '../services/storageService';
import { SurveyResponse, WorkshopSettings } from '../types';

interface SurveyViewProps {
  settings: WorkshopSettings;
  onGoToDashboard: () => void;
}

export const SurveyView: React.FC<SurveyViewProps> = ({ settings, onGoToDashboard }) => {
  const [answers, setAnswers] = useState<{ [key: string]: number }>({
    q1: 0,
    q2: 0,
    q3: 0,
    q4: 0,
    q5: 0,
  });
  const [suggestion, setSuggestion] = useState('');
  const [existingSubmission, setExistingSubmission] = useState<SurveyResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    const existing = StorageService.hasSubmittedOnThisDevice();
    if (existing) {
      setExistingSubmission(existing);
    }
  }, []);

  const handleSelectScore = (questionId: string, score: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: score }));
    if (validationError) setValidationError(null);
  };

  const answeredCount = Object.values(answers).filter((v) => v > 0).length;
  const progressPercent = Math.round((answeredCount / DEFAULT_QUESTIONS.length) * 100);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check all 5 questions answered
    const unanswered = DEFAULT_QUESTIONS.filter((q) => !answers[q.id]);
    if (unanswered.length > 0) {
      setValidationError(`กรุณาตอบคำถามให้ครบทั้ง 5 ข้อ (เหลืออีก ${unanswered.length} ข้อ)`);
      const firstMissing = document.getElementById(`q-card-${unanswered[0].id}`);
      if (firstMissing) {
        firstMissing.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsSubmitting(true);
    setValidationError(null);

    try {
      const result = await StorageService.submitResponse({
        q1: answers.q1,
        q2: answers.q2,
        q3: answers.q3,
        q4: answers.q4,
        q5: answers.q5,
        suggestion: suggestion.trim(),
      });

      // Fire celebratory confetti
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#4f46e5', '#10b981', '#f59e0b', '#3b82f6'],
      });

      setExistingSubmission(result);
    } catch (err) {
      console.error(err);
      setValidationError('เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetake = () => {
    StorageService.clearDeviceSubmission();
    setExistingSubmission(null);
    setAnswers({ q1: 0, q2: 0, q3: 0, q4: 0, q5: 0 });
    setSuggestion('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If already submitted on this device
  if (existingSubmission) {
    const avg = ((existingSubmission.q1 + existingSubmission.q2 + existingSubmission.q3 + existingSubmission.q4 + existingSubmission.q5) / 5).toFixed(2);
    const submittedTime = new Date(existingSubmission.timestamp).toLocaleTimeString('th-TH', {
      hour: '2-digit',
      minute: '2-digit',
    });

    return (
      <div className="min-h-[calc(100vh-4rem)] bg-slate-50 dark:bg-slate-950 py-8 px-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-800 text-center">
          
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2">
            บันทึกการประเมินเรียบร้อยแล้ว
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
            ขอบคุณสำหรับเวลาและความคิดเห็นของท่าน คะแนนของท่านถูกส่งไปยังจอสรุปผลบนเวทีแบบเรียลไทม์เรียบร้อยแล้ว
          </p>

          {/* Submission Summary Receipt */}
          <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-700/80 text-left mb-6 space-y-2">
            <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 pb-2 border-b border-slate-200 dark:border-slate-700">
              <span>เวลาที่ส่งข้อมูล</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">{submittedTime} น.</span>
            </div>
            <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400">
              <span>คะแนนเฉลี่ยที่ท่านให้</span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400 text-base">{avg} / 5.00</span>
            </div>
            {existingSubmission.suggestion && (
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">ข้อเสนอแนะที่ฝากไว้:</span>
                <p className="text-xs text-slate-700 dark:text-slate-300 italic bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                  "{existingSubmission.suggestion}"
                </p>
              </div>
            )}
          </div>

          {/* CTAs */}
          <div className="space-y-3">
            <button
              onClick={onGoToDashboard}
              className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-600/20 active:scale-[0.98] transition flex items-center justify-center gap-2"
            >
              <span>ดูผลลัพธ์บน Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {settings.allowRetakeInTestMode && (
              <button
                onClick={handleRetake}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>ทำแบบประเมินใหม่อีกครั้ง (สำหรับทดสอบ)</span>
              </button>
            )}
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 pt-4">
      <div className="max-w-xl mx-auto px-4">
        
        {/* Workshop Header Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 mb-5">
          <div className="flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-2">
            <span>แบบสอบถามความพึงพอใจ</span>
            <span className="text-[11px] font-normal text-slate-500 dark:text-slate-400">
              ไม่ระบุชื่อผู้ตอบ
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-tight mb-2">
            {settings.title}
          </h1>

          <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-600 dark:text-slate-400">
            <span>วิทยากร: <strong className="text-slate-800 dark:text-slate-200 font-semibold">{settings.trainerName}</strong></span>
            <span>•</span>
            <span>{settings.subtitle}</span>
          </div>

          {/* Progress Indicator */}
          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-medium text-slate-700 dark:text-slate-300">
                ความคืบหน้าการตอบ
              </span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
                {answeredCount} / {DEFAULT_QUESTIONS.length} ข้อ ({progressPercent}%)
              </span>
            </div>
            <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Evaluation Scale Guide Pill */}
        <div className="bg-indigo-50/80 dark:bg-indigo-950/40 rounded-2xl p-3 border border-indigo-100 dark:border-indigo-900/50 mb-5 flex items-center justify-between text-xs text-indigo-900 dark:text-indigo-300">
          <span className="flex items-center gap-1.5 font-medium">
            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
            เกณฑ์: 1 = น้อยที่สุด, 3 = ปานกลาง, 5 = มากที่สุด
          </span>
          <span className="text-[11px] opacity-75">กดเลือกคะแนนได้ทันที</span>
        </div>

        {/* Survey Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {DEFAULT_QUESTIONS.map((question) => {
            const currentScore = answers[question.id] || 0;
            return (
              <div
                key={question.id}
                id={`q-card-${question.id}`}
                className={`bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 shadow-sm border transition-all ${
                  currentScore > 0
                    ? 'border-indigo-200 dark:border-indigo-900/80 bg-white dark:bg-slate-900'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                {/* Question Header */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-bold text-xs flex items-center justify-center shrink-0">
                      {question.number}
                    </span>
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      {question.category}
                    </span>
                  </div>

                  {currentScore > 0 ? (
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{RATING_SCALE_INFO[currentScore]?.label}</span>
                    </span>
                  ) : (
                    <span className="text-[11px] font-medium text-rose-500">
                      * จำเป็น
                    </span>
                  )}
                </div>

                <h3 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white leading-snug mb-1">
                  {question.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
                  {question.description}
                </p>

                {/* Rating Scale Buttons (1 to 5) with generous touch hitboxes (>= 48px) */}
                <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
                  {[1, 2, 3, 4, 5].map((score) => {
                    const isSelected = currentScore === score;
                    const info = RATING_SCALE_INFO[score];

                    return (
                      <button
                        key={score}
                        type="button"
                        onClick={() => handleSelectScore(question.id, score)}
                        className={`min-h-[56px] rounded-xl flex flex-col items-center justify-center p-1 transition-all active:scale-95 ${
                          isSelected
                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 ring-2 ring-indigo-600 dark:ring-indigo-400 scale-[1.02]'
                            : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700'
                        }`}
                      >
                        <span className={`text-base sm:text-lg font-bold leading-none ${isSelected ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                          {score}
                        </span>
                        <span className={`text-[10px] mt-1 tracking-tight truncate max-w-full px-1 ${
                          isSelected ? 'text-indigo-100 font-medium' : 'text-slate-500 dark:text-slate-400'
                        }`}>
                          {info.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Optional Suggestion Field */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 mb-1">
              <MessageSquare className="w-4 h-4 text-slate-500" />
              <h3 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white">
                ข้อเสนอแนะเพิ่มเติมเพื่อการพัฒนา (ไม่บังคับ)
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
              มีสิ่งที่ประทับใจ อยากเสนอแนะ หรือต้องการให้จัดหัวข้อใดเพิ่มเติมในอนาคตหรือไม่
            </p>
            <textarea
              value={suggestion}
              onChange={(e) => setSuggestion(e.target.value)}
              maxLength={500}
              rows={3}
              placeholder="พิมพ์ความคิดเห็นของท่านที่นี่..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none transition resize-none"
            />
            <div className="flex justify-end text-[11px] text-slate-400 mt-1">
              {suggestion.length}/500 ตัวอักษร
            </div>
          </div>

          {/* Validation Notice */}
          {validationError && (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs sm:text-sm flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-2xl shadow-lg shadow-indigo-600/25 active:scale-[0.99] transition flex items-center justify-center gap-2 text-base"
          >
            {isSubmitting ? (
              <span>กำลังบันทึกคะแนน...</span>
            ) : (
              <>
                <span>ส่งแบบประเมินความพึงพอใจ</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <p className="text-[11px] text-center text-slate-500 dark:text-slate-400 pt-2">
            ข้อมูลการตอบจะไม่ระบุตัวตน และถูกนำไปประมวลผลทางสถิติเพื่อการพัฒนาการอบรม
          </p>
        </form>

      </div>
    </div>
  );
};
