import React from 'react';
import { LikertLevel } from '../types';

interface CircularScoreGaugeProps {
  score: number;
  maxScore?: number;
  level: LikertLevel;
  size?: number;
  strokeWidth?: number;
}

export const CircularScoreGauge: React.FC<CircularScoreGaugeProps> = ({
  score,
  maxScore = 5.0,
  level,
  size = 120,
  strokeWidth = 9,
}) => {
  const center = size / 2;
  const radius = center - strokeWidth - 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min(100, Math.max(0, (score / maxScore) * 100));
  const strokeDashoffset = circumference - (circumference * percentage) / 100;

  // Determine vibrant stroke color based on Likert score
  let strokeColor = '#10b981'; // มากที่สุด (emerald)
  let glowColor = 'rgba(16, 185, 129, 0.25)';
  if (score < 1.51) {
    strokeColor = '#ef4444'; // น้อยที่สุด (rose)
    glowColor = 'rgba(239, 68, 68, 0.25)';
  } else if (score < 2.51) {
    strokeColor = '#f59e0b'; // น้อย (amber)
    glowColor = 'rgba(245, 158, 11, 0.25)';
  } else if (score < 3.51) {
    strokeColor = '#eab308'; // ปานกลาง (yellow)
    glowColor = 'rgba(234, 179, 8, 0.25)';
  } else if (score < 4.51) {
    strokeColor = '#3b82f6'; // มาก (blue)
    glowColor = 'rgba(59, 130, 246, 0.25)';
  }

  return (
    <div className="relative inline-flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rotate-[-90deg]">
        {/* Background Track */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="currentColor"
          className="text-slate-200 dark:text-slate-800"
          strokeWidth={strokeWidth}
        />
        {/* Progress Arc */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{
            filter: `drop-shadow(0 0 6px ${glowColor})`,
            transition: 'stroke-dashoffset 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        />
      </svg>

      {/* Center Value */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
        <span className="text-xl sm:text-2xl font-black tabular-nums tracking-tight leading-none text-slate-900 dark:text-white">
          {score > 0 ? score.toFixed(2) : '0.00'}
        </span>
        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold mt-0.5">
          / {maxScore.toFixed(2)}
        </span>
      </div>
    </div>
  );
};

interface MultiSegmentDonutProps {
  counts: { [rating: number]: number };
  total: number;
  size?: number;
  strokeWidth?: number;
  meanScore?: number;
}

const RATING_COLORS: { [key: number]: string } = {
  5: '#10b981', // emerald
  4: '#3b82f6', // blue
  3: '#eab308', // yellow
  2: '#f59e0b', // amber
  1: '#ef4444', // rose
};

export const MultiSegmentDonut: React.FC<MultiSegmentDonutProps> = ({
  counts,
  total,
  size = 120,
  strokeWidth = 10,
  meanScore,
}) => {
  const center = size / 2;
  const radius = center - strokeWidth - 2;
  const circumference = 2 * Math.PI * radius;

  // Build segments for 5, 4, 3, 2, 1
  let accumulatedPercent = 0;
  const segments = [5, 4, 3, 2, 1].map((r) => {
    const count = counts[r] || 0;
    const fraction = total > 0 ? count / total : 0;
    const dashLength = fraction * circumference;
    const offset = -(accumulatedPercent * circumference);
    accumulatedPercent += fraction;

    return {
      rating: r,
      count,
      fraction,
      dashLength,
      offset,
      color: RATING_COLORS[r],
    };
  });

  return (
    <div className="relative inline-flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rotate-[-90deg]">
        {/* Background Circle if total is 0 */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="currentColor"
          className="text-slate-200 dark:text-slate-800"
          strokeWidth={strokeWidth}
        />

        {total > 0 &&
          segments.map((seg) => {
            if (seg.count === 0) return null;
            return (
              <circle
                key={seg.rating}
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke={seg.color}
                strokeWidth={strokeWidth}
                strokeDasharray={`${seg.dashLength} ${circumference - seg.dashLength}`}
                strokeDashoffset={seg.offset}
                style={{
                  transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              />
            );
          })}
      </svg>

      {/* Center Label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
        {meanScore !== undefined ? (
          <>
            <span className="text-xl sm:text-2xl font-black tabular-nums tracking-tight leading-none text-slate-900 dark:text-white">
              {meanScore.toFixed(2)}
            </span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium mt-0.5">
              คะแนนเฉลี่ย
            </span>
          </>
        ) : (
          <>
            <span className="text-xl font-black tabular-nums text-slate-900 dark:text-white">
              {total}
            </span>
            <span className="text-[10px] text-slate-400 font-medium">
              ผู้ตอบ
            </span>
          </>
        )}
      </div>
    </div>
  );
};
