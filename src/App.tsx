/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { SurveyView } from './components/SurveyView';
import { DashboardView } from './components/DashboardView';
import { ExportCodeModal } from './components/ExportCodeModal';
import { QRCodeModal } from './components/QRCodeModal';
import { SettingsModal } from './components/SettingsModal';
import { StorageService } from './services/storageService';
import { SurveyResponse, WorkshopSettings } from './types';

export default function App() {
  const [currentView, setCurrentView] = useState<'survey' | 'dashboard' | 'code'>('dashboard');
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [settings, setSettings] = useState<WorkshopSettings>(StorageService.getSettings());
  const [isProjectorDark, setIsProjectorDark] = useState<boolean>(true);
  
  // Modals
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Check URL query parameters for direct view routing
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const viewParam = params.get('view');
      if (viewParam === 'survey') {
        setCurrentView('survey');
      } else if (viewParam === 'dashboard') {
        setCurrentView('dashboard');
      } else if (viewParam === 'code') {
        setCurrentView('code');
        setIsExportModalOpen(true);
      }
    }
  }, []);

  // Subscribe to real-time updates
  useEffect(() => {
    const unsubscribe = StorageService.subscribe((updated) => {
      setResponses(updated);
    });
    return () => unsubscribe();
  }, []);

  // Sync theme with documentElement
  useEffect(() => {
    if (isProjectorDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isProjectorDark]);

  const summary = StorageService.calculateSummary(responses);

  const handleViewChange = (view: 'survey' | 'dashboard' | 'code') => {
    if (view === 'code') {
      setIsExportModalOpen(true);
      return;
    }
    setCurrentView(view);
    // Update URL quietly without reload
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('view', view);
      window.history.replaceState({}, '', url.toString());
    }
  };

  const handleSaveSettings = (newSettings: WorkshopSettings) => {
    setSettings(newSettings);
    StorageService.saveSettings(newSettings);
  };

  const handleExportCSV = () => {
    StorageService.exportToCSV(settings, responses);
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors ${isProjectorDark ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Universal Top Header */}
      <Header
        currentView={currentView}
        onViewChange={handleViewChange}
        settings={settings}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onOpenQR={() => setIsQRModalOpen(true)}
        onExportCSV={handleExportCSV}
        isProjectorDark={isProjectorDark}
        onToggleProjectorTheme={() => setIsProjectorDark(!isProjectorDark)}
        totalResponses={summary.totalResponses}
      />

      {/* Main Content View */}
      <main className="flex-1">
        {currentView === 'survey' ? (
          <SurveyView
            settings={settings}
            onGoToDashboard={() => handleViewChange('dashboard')}
          />
        ) : (
          <DashboardView
            responses={responses}
            summary={summary}
            settings={settings}
            onOpenQR={() => setIsQRModalOpen(true)}
            onExportCSV={handleExportCSV}
            onSwitchToSurvey={() => handleViewChange('survey')}
            isProjectorDark={isProjectorDark}
          />
        )}
      </main>

      {/* Standalone Code & Deployment Guide Modal */}
      <ExportCodeModal
        isOpen={isExportModalOpen}
        onClose={() => {
          setIsExportModalOpen(false);
          if (currentView === 'code') setCurrentView('dashboard');
        }}
      />

      {/* Large Screen QR Code Modal */}
      <QRCodeModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        settings={settings}
      />

      {/* Workshop & Firebase Settings Modal */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settings={settings}
        onSaveSettings={handleSaveSettings}
      />

    </div>
  );
}
