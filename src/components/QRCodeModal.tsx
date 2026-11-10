import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { X, Copy, Check, QrCode, ExternalLink } from 'lucide-react';
import { WorkshopSettings } from '../types';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: WorkshopSettings;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({ isOpen, onClose, settings }) => {
  const [qrUrl, setQrUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const surveyUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${window.location.pathname}?view=survey`
    : '';

  useEffect(() => {
    if (isOpen && surveyUrl) {
      QRCode.toDataURL(surveyUrl, {
        width: 440,
        margin: 2,
        color: {
          dark: '#0f172a',
          light: '#ffffff',
        },
      })
        .then((url) => setQrUrl(url))
        .catch((err) => console.error(err));
    }
  }, [isOpen, surveyUrl]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(surveyUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 text-center relative">
        
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-3">
          <QrCode className="w-6 h-6" />
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-1">
          สแกนเพื่อร่วมประเมิน
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-5 max-w-sm mx-auto">
          {settings.title}
        </p>

        {/* Large Crisp QR Code Card */}
        <div className="bg-white p-4 sm:p-6 rounded-3xl shadow-md border border-slate-200 inline-block mx-auto mb-4">
          {qrUrl ? (
            <img
              src={qrUrl}
              alt="QR Code สำหรับแบบสอบถาม"
              className="w-64 h-64 sm:w-72 sm:h-72 object-contain"
            />
          ) : (
            <div className="w-64 h-64 sm:w-72 sm:h-72 bg-slate-100 animate-pulse rounded-2xl" />
          )}
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">
          เปิดแอปกล้องบนมือถือ (iOS / Android / LINE) ส่องที่ QR Code เพื่อเข้าสู่หน้าตอบแบบประเมิน
        </p>

        {/* Copy Link Field */}
        <div className="flex items-center gap-2 p-2 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <input
            type="text"
            readOnly
            value={surveyUrl}
            className="bg-transparent text-xs text-slate-700 dark:text-slate-300 px-2 flex-1 outline-none truncate"
          />
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition flex items-center gap-1 shrink-0"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'คัดลอกแล้ว' : 'คัดลอกลิงก์'}</span>
          </button>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-center">
          <a
            href={surveyUrl}
            target="_blank"
            rel="noreferrer"
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            <span>ทดลองเปิดหน้าตอบในแท็บใหม่</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

      </div>
    </div>
  );
};
