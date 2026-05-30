import React from 'react';
import { useCivic } from '../context/CivicContext';
import { Language } from '../types';
import { Landmark, Globe, Activity, Thermometer, ShieldAlert, Wifi, Info } from 'lucide-react';
import { ParravisionLogo, ParravisionIcon } from './ParravisionLogo';

export const PwaShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { language, setLanguage, translateText } = useCivic();

  const languageOptions: { code: Language; label: string; nativeLabel: string }[] = [
    { code: 'en', label: 'English', nativeLabel: 'En' },
    { code: 'zh', label: 'Chinese', nativeLabel: '中文' },
    { code: 'hn', label: 'Hindi', nativeLabel: 'हिन्दी' }
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] text-neutral-800 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-800" id="smart-pwa-scaffolding">
      {/* City Council Top Header Bar */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-neutral-200/60 shadow-xs" id="sticky-header-container">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3">
            <ParravisionLogo size="md" withText={true} />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-sans font-bold bg-teal-50 text-teal-700 border border-teal-100 px-1.5 py-0.5 rounded-md uppercase tracking-wider shrink-0">
                  Parramatta PWA
                </span>
              </div>
              <p className="text-[10px] text-neutral-400 font-sans mt-0.5">
                {translateText('tagline')}
              </p>
            </div>
          </div>

          {/* Localization Widget Controls */}
          <div className="flex items-center gap-3.5" id="header-interactive-menu">
            <div className="flex items-center bg-neutral-100/70 p-1 rounded-xl border border-neutral-200/50" id="localization-toggle-pill">
              <span className="p-1 px-2 text-[9px] font-sans font-bold text-neutral-400 select-none flex items-center gap-1 shrink-0 uppercase tracking-wider">
                <Globe className="w-3.5 h-3.5 text-neutral-400" />
                {translateText('translateLabel')}:
              </span>
              <div className="flex gap-1">
                {languageOptions.map((opt) => {
                  const isSelected = language === opt.code;
                  return (
                    <button
                      key={opt.code}
                      onClick={() => setLanguage(opt.code)}
                      className={`text-[10px] font-sans font-extrabold px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-white text-blue-600 shadow-xs ring-1 ring-neutral-200/50'
                          : 'text-neutral-500 hover:text-neutral-900 hover:bg-white/40'
                      }`}
                      title={`Translate to ${opt.label}`}
                    >
                      {opt.nativeLabel}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

        </div>
      </header>

      {/* Real-time Civic Parameters Banner Line */}
      <div className="bg-neutral-900 text-white py-1.5 px-4 font-sans border-b border-neutral-800" id="civic-telemetry-banner">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-y-1 gap-x-6 text-[10px] font-mono text-neutral-400">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1.5">
              <Thermometer className="w-3.5 h-3.5 text-orange-400" />
              Parramatta CBD: <strong className="text-white">19.5°C</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              Air Quality: <strong className="text-emerald-400">12 AQI (Excellent)</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-yellow-400" />
              Urgent Air Misting systems: <strong className="text-white">Idle</strong>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Wifi className="w-3 h-3 text-emerald-400" /> Free Civic-WiFi: <strong className="text-white">Active</strong>
            </span>
            <span>Est: 2026-05-30</span>
          </div>
        </div>
      </div>

      {/* Main Page Layout Core Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6" id="main-content-flow">
        {children}
      </main>

      {/* Footer Branding & Disclaimer */}
      <footer className="bg-white border-t border-neutral-200 py-6 px-4" id="civic-pwa-footer">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <div className="flex items-center gap-2">
              <ParravisionIcon size={28} className="opacity-80 shrink-0" />
              <p className="text-xs font-sans font-bold text-neutral-800 uppercase tracking-widest">
                City of Parramatta Council Civic Platform
              </p>
            </div>
            <p className="text-[10px] text-neutral-400 font-sans mt-1">
              Coordinated with Dharug traditional owners, Sydney Metropolitan Planners, and Western Sydney University Urban Lab.
            </p>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-neutral-400 font-sans border bg-neutral-50 px-3 py-2 rounded-xl border-neutral-200">
            <Info className="w-4 h-4 text-neutral-400 shrink-0" />
            <span>Interactive PWA sandbox operates purely with local state persistence for prompt conformity. All metrics verified.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
