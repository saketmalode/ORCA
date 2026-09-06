import React, { useState, useEffect } from 'react';
import { ShieldCheck, Radio, Satellite, Compass, Globe2 } from 'lucide-react';
import { TRANSLATIONS, type Language } from '../i18n/translations';

interface HeaderProps {
  currentLang: Language;
  onSelectLang: (lang: Language) => void;
  activeAgentsCount?: number;
}

export const Header: React.FC<HeaderProps> = ({ currentLang, onSelectLang, activeAgentsCount = 11 }) => {
  const [timeStr, setTimeStr] = useState('');
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('en-IN', {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        }) + ' IST'
      );
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="bg-[#0b1322] border-b border-slate-800 text-slate-100 px-4 py-3 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-50 shadow-lg">
      <div className="flex items-center gap-3">
        <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-700 text-white shadow-cyan-500/20 shadow-md">
          <Compass className="w-6 h-6 animate-pulse" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-wider bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-200 bg-clip-text text-transparent">
              {t.appTitle}
            </h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-950/80 border border-blue-700/50 text-blue-300 font-mono font-medium">
              SIH26176
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-950/60 border border-amber-600/40 text-amber-300 font-semibold tracking-wide">
              ISRO / DOS
            </span>
          </div>
          <p className="text-xs text-slate-400 font-medium">
            {t.appSubtitle}
          </p>
        </div>
      </div>

      {/* System Badges */}
      <div className="hidden lg:flex items-center gap-2">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 text-xs font-mono">
          <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
          <span>{t.liveSensors}</span>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-950/60 border border-indigo-800/60 text-indigo-300 text-xs font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
          <span>{t.zeroLLM}</span>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-950/60 border border-cyan-800/60 text-cyan-300 text-xs font-mono">
          <Satellite className="w-3.5 h-3.5 text-cyan-400" />
          <span>{activeAgentsCount} {currentLang === 'mr' ? 'एजंट्स कार्यरत' : currentLang === 'hi' ? 'एजेंट सक्रिय' : 'Agents Active'}</span>
        </div>
      </div>

      {/* Language Switcher & Clock */}
      <div className="flex items-center gap-3">
        <div className="flex items-center bg-slate-900 border border-slate-700/80 rounded-lg p-1 text-xs">
          <Globe2 className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-1 shrink-0" />
          <button
            type="button"
            onClick={() => onSelectLang('en')}
            className={`px-3 py-1 rounded-md font-bold text-xs transition cursor-pointer ${
              currentLang === 'en'
                ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-400'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            English
          </button>
          <button
            type="button"
            onClick={() => onSelectLang('hi')}
            className={`px-3 py-1 rounded-md font-bold text-xs transition cursor-pointer ${
              currentLang === 'hi'
                ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-400'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            हिंदी
          </button>
          <button
            type="button"
            onClick={() => onSelectLang('mr')}
            className={`px-3 py-1 rounded-md font-bold text-xs transition cursor-pointer ${
              currentLang === 'mr'
                ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-400'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            मराठी
          </button>
        </div>

        <div className="font-mono text-xs text-cyan-300 bg-cyan-950/40 border border-cyan-800/40 px-3 py-1.5 rounded-lg shadow-inner">
          {timeStr || '12:00:00 IST'}
        </div>
      </div>
    </header>
  );
};
