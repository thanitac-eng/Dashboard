import React, { useState } from 'react';
import { X, Copy, Check, Download, FileCode, BookOpen, ShieldCheck, Rocket, ExternalLink } from 'lucide-react';
import { STANDALONE_SURVEY_HTML, STANDALONE_DASHBOARD_HTML, FIREBASE_SETUP_GUIDE_THAI } from '../services/standaloneTemplates';

interface ExportCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportCodeModal: React.FC<ExportCodeModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'survey' | 'dashboard' | 'guide'>('survey');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentCode = activeTab === 'survey' ? STANDALONE_SURVEY_HTML : STANDALONE_DASHBOARD_HTML;
  const currentFilename = activeTab === 'survey' ? 'survey.html' : 'dashboard.html';

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                <FileCode className="w-4 h-4" />
              </span>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                ซอร์สโค้ดแยก 2 ไฟล์ & คู่มือติดตั้ง Firebase
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              นำไฟล์ทั้งสองไปเปิดใช้งานจริง หรืออัปโหลดขึ้นโฮสติ้งฟรี (GitHub Pages / Netlify / Firebase) ได้ทันที
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="px-6 pt-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50 dark:bg-slate-950/50">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('survey')}
              className={`px-4 py-2.5 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
                activeTab === 'survey'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
              }`}
            >
              <span>1. survey.html (หน้าตอบแบบสอบถาม)</span>
            </button>

            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2.5 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
                activeTab === 'dashboard'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
              }`}
            >
              <span>2. dashboard.html (หน้าจอสรุปผล)</span>
            </button>

            <button
              onClick={() => setActiveTab('guide')}
              className={`px-4 py-2.5 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
                activeTab === 'guide'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>คู่มือตั้งค่า Firebase & Deploy</span>
            </button>
          </div>

          {activeTab !== 'guide' && (
            <div className="flex items-center gap-2 pb-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'คัดลอกโค้ดแล้ว!' : 'คัดลอกโค้ด'}</span>
              </button>

              <button
                onClick={() => handleDownload(currentFilename, currentCode)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>ดาวน์โหลด {currentFilename}</span>
              </button>
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 text-slate-800 dark:text-slate-200">
          {activeTab === 'guide' ? (
            <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed space-y-4">
              
              <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 mb-6">
                <h3 className="font-bold text-sm text-indigo-900 dark:text-indigo-300 flex items-center gap-2 mb-1">
                  <Rocket className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  สรุปโครงสร้างของ 2 ไฟล์
                </h3>
                <p className="text-xs text-indigo-800 dark:text-indigo-300">
                  คุณสามารถดาวน์โหลดทั้ง <strong>survey.html</strong> และ <strong>dashboard.html</strong> ไปวางในโฟลเดอร์เดียวกัน แล้วเปิดใช้งานได้เลย! ทั้งสองไฟล์ใช้ Firebase Realtime Database SDK ตัวเดียวกันเพื่อซิงก์ข้อมูลทันที
                </p>
              </div>

              <div className="space-y-6">
                <section>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center font-bold">1</span>
                    สร้างโปรเจกต์ฟรีบน Firebase
                  </h3>
                  <ol className="list-decimal list-inside space-y-1.5 text-slate-600 dark:text-slate-300 mt-2 pl-2">
                    <li>ไปที่ <a href="https://console.firebase.google.com/" target="_blank" rel="noreferrer" className="text-indigo-600 dark:text-indigo-400 underline inline-flex items-center gap-1">Firebase Console <ExternalLink className="w-3 h-3" /></a></li>
                    <li>กด <strong>Add project</strong> ตั้งชื่อโปรเจกต์ (เช่น <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">workshop-eval-2026</code>)</li>
                    <li>เลือกใช้ <strong>Spark Plan (Free)</strong> ซึ่งฟรีตลอดชีพ ไม่ต้องผูกบัตรเครดิต</li>
                  </ol>
                </section>

                <section>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center font-bold">2</span>
                    สร้าง Realtime Database & ตั้งค่า Rules
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 mt-2">
                    ไปที่เมนู <strong>Build &gt; Realtime Database &gt; Create Database</strong>:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300 mt-1 pl-2">
                    <li>เลือกภูมิภาคเป็น <strong>Singapore (asia-southeast1)</strong> เพื่อความเร็วสูงสุดในไทย</li>
                    <li>คลิกแท็บ <strong>Rules</strong> และวางกฎนี้เพื่อให้ผู้ตอบส่งคะแนนได้โดยไม่ต้องล็อกอิน:</li>
                  </ul>
                  <div className="bg-slate-900 text-slate-200 p-4 rounded-xl font-mono text-xs my-2 overflow-x-auto border border-slate-800">
                    <pre>{`{
  "rules": {
    "responses": {
      ".read": true,
      ".write": true
    }
  }
}`}</pre>
                  </div>
                  <p className="text-xs text-slate-500">กดปุ่ม <strong>Publish</strong> เพื่อบันทึกกฎ</p>
                </section>

                <section>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center font-bold">3</span>
                    นำค่า Config มาใส่ในโค้ด
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 mt-2">
                    ใน Firebase Console คลิกไอคอน <strong>Project Settings (รูปเฟือง)</strong> &gt; เลื่อนลงมาที่ <strong>Your apps</strong> &gt; กดไอคอนเว็บ <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">&lt;/&gt;</code> &gt; คัดลอกค่า <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">firebaseConfig</code> มาแทนที่ในไฟล์ <strong>survey.html</strong> และ <strong>dashboard.html</strong>
                  </p>
                </section>

                <section>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center font-bold">4</span>
                    วิธีนำขึ้นออนไลน์ฟรี (Deploy ใน 3 นาที)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                    <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                      <strong className="block text-slate-900 dark:text-white mb-1">GitHub Pages (แนะนำ)</strong>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        เปลี่ยนชื่อ survey.html เป็น index.html แล้วอัปโหลดทั้งสองไฟล์ขึ้น GitHub repository จากนั้นเปิดใช้งาน Pages ใน Settings &gt; Pages
                      </p>
                    </div>

                    <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                      <strong className="block text-slate-900 dark:text-white mb-1">Netlify Drop (เร็วที่สุด)</strong>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        เพียงลากโฟลเดอร์ที่มีไฟล์ทั้งสองไปปล่อยที่ app.netlify.com/drop คุณจะได้ URL พร้อมใช้งานและแจก QR Code ทันที
                      </p>
                    </div>
                  </div>
                </section>
              </div>

            </div>
          ) : (
            <div className="relative">
              <pre className="p-4 rounded-2xl bg-slate-950 text-indigo-300 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800 max-h-[60vh]">
                <code>{currentCode}</code>
              </pre>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80 flex items-center justify-between">
          <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>โค้ดเป็น HTML + JS แบบ Standalone 100% ไม่ต้องติดตั้ง Node.js หรือ build process ใดๆ</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 transition"
          >
            ปิดหน้าต่าง
          </button>
        </div>

      </div>
    </div>
  );
};
