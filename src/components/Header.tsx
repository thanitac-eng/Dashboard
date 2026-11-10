import React from 'react';
import { Smartphone, LayoutDashboard, Code, QrCode, Download, Settings, Sun, Moon } from 'lucide-react';
import { WorkshopSettings } from '../types';

interface HeaderProps {
  currentView: 'survey' | 'dashboard' | 'code';
  onViewChange: (view: 'survey' | 'dashboard' | 'code') => void;
  settings: WorkshopSettings;
  onOpenSettings: () => void;
  onOpenQR: () => void;
  onExportCSV: () => void;
  isProjectorDark: boolean;
  onToggleProjectorTheme: () => void;
  totalResponses: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onViewChange,
  onOpenSettings,
  onOpenQR,
  onExportCSV,
  isProjectorDark,
  onToggleProjectorTheme,
  totalResponses,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Zone */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-sm font-bold text-lg">
            W
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-slate-900 dark:text-white tracking-tight text-base sm:text-lg whitespace-nowrap">
              Workshop Pulse
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium hidden sm:inline whitespace-nowrap">
              ระบบประเมินความพึงพอใจการอบรม & Realtime Dashboard
            </span>
          </div>
        </div>

        {/* Navigation Tabs (Functional Segmented Control) */}
        <nav className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl shrink-0">
          <button
            onClick={() => onViewChange('survey')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              currentView === 'survey'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>หน้าตอบแบบสอบถาม (มือถือ)</span>
          </button>

          <button
            onClick={() => onViewChange('dashboard')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all relative ${
              currentView === 'dashboard'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>จอแสดงผล (Dashboard)</span>
            {totalResponses > 0 && (
              <span className="inline-flex items-center justify-center px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 ml-0.5">
                {totalResponses}
              </span>
            )}
          </button>

          <button
            onClick={() => onViewChange('code')}
            className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              currentView === 'code'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>โค้ด 2 ไฟล์ & วิธีตั้งค่า</span>
          </button>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {currentView === 'dashboard' && (
            <>
              <button
                onClick={onOpenQR}
                title="เปิด QR Code ขึ้นจอ"
                className="hidden sm:flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>QR Code</span>
              </button>

              <button
                onClick={onExportCSV}
                title="ส่งออกผลคะแนนเป็น CSV (Excel)"
                className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/80 border border-indigo-200 dark:border-indigo-800 transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">ส่งออก CSV</span>
              </button>

              <button
                onClick={onToggleProjectorTheme}
                title="สลับโหมดโปรเจกเตอร์ มืด/สว่าง"
                className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                {isProjectorDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
              </button>
            </>
          )}

          <button
            onClick={onOpenSettings}
            title="ตั้งค่าชื่อโครงการ & Firebase"
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

      </div>
    </header>
  );
};
