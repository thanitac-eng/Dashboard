import React, { useState } from 'react';
import { X, Save, Settings, Database, RotateCcw, Check } from 'lucide-react';
import { WorkshopSettings, FirebaseCustomConfig } from '../types';
import { StorageService } from '../services/storageService';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: WorkshopSettings;
  onSaveSettings: (settings: WorkshopSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
}) => {
  const [form, setForm] = useState<WorkshopSettings>({ ...settings });
  const [fbConfig, setFbConfig] = useState<FirebaseCustomConfig>(() => {
    return StorageService.getFirebaseConfig() || {
      apiKey: '',
      databaseURL: '',
      projectId: '',
    };
  });
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(form);

    if (fbConfig.databaseURL.trim()) {
      StorageService.saveFirebaseConfig({
        ...fbConfig,
        databaseURL: fbConfig.databaseURL.trim(),
        projectId: fbConfig.projectId.trim(),
        apiKey: fbConfig.apiKey.trim(),
      });
    } else {
      StorageService.saveFirebaseConfig(null);
    }

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 relative">
        
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              <Settings className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                ตั้งค่าโครงการ & Firebase
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                ปรับแต่งข้อมูลหัวข้ออบรมและเชื่อมต่อ Realtime Database
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              ชื่อโครงการอบรม / สัมมนา
            </label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                ชื่อวิทยากร
              </label>
              <input
                type="text"
                required
                value={form.trainerName}
                onChange={(e) => setForm({ ...form, trainerName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                จำนวนผู้เข้าอบรม (คน)
              </label>
              <input
                type="number"
                min={1}
                required
                value={form.expectedAttendees}
                onChange={(e) => setForm({ ...form, expectedAttendees: parseInt(e.target.value, 10) || 1 })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              คำอธิบายเพิ่มเติม / รุ่น / หน่วยงาน
            </label>
            <input
              type="text"
              value={form.subtitle}
              onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
            />
          </div>

          {/* Firebase Database Connection (Optional) */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
              <Database className="w-3.5 h-3.5 text-amber-500" />
              <span>Firebase Realtime Database URL (ไม่บังคับ)</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2">
              หากไม่ระบุ ระบบจะใช้ Local Realtime Sync อัตโนมัติ (ข้ามแท็บ/หน้าต่างได้ทันที)
            </p>
            <input
              type="url"
              placeholder="https://your-project-default-rtdb.asia-southeast1.firebasedatabase.app"
              value={fbConfig.databaseURL}
              onChange={(e) => setFbConfig({ ...fbConfig, databaseURL: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="allowRetake"
              checked={form.allowRetakeInTestMode}
              onChange={(e) => setForm({ ...form, allowRetakeInTestMode: e.target.checked })}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
            />
            <label htmlFor="allowRetake" className="text-xs text-slate-700 dark:text-slate-300">
              แสดงปุ่ม "ตอบใหม่อีกครั้ง" ในหน้ามือถือสำหรับทดสอบ
            </label>
          </div>

          {/* Action buttons */}
          <div className="pt-4 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 transition flex items-center gap-1.5"
            >
              {savedSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              <span>{savedSuccess ? 'บันทึกเรียบร้อย!' : 'บันทึกการตั้งค่า'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
