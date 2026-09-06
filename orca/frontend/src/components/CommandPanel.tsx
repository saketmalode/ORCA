import React, { useState } from 'react';
import { Send, Sparkles, Clock, MapPin, Search, Mic } from 'lucide-react';
import type { QueryParseResult } from '../types/orca';
import { TRANSLATIONS, type Language } from '../i18n/translations';

interface CommandPanelProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
  parsedQuery?: QueryParseResult;
  currentLang: Language;
}

export const CommandPanel: React.FC<CommandPanelProps> = ({
  onSearch,
  isLoading,
  parsedQuery,
  currentLang,
}) => {
  const [inputText, setInputText] = useState('');
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      onSearch(inputText.trim());
    }
  };

  const handleSelectPreset = (query: string) => {
    setInputText(query);
    onSearch(query);
  };

  return (
    <div className="bg-[#0b1322] border border-slate-800 rounded-xl p-4 shadow-xl flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-blue-950 border border-blue-800/60 text-blue-400">
            <Search className="w-4 h-4" />
          </span>
          <h2 className="text-sm font-semibold text-slate-200 tracking-wide">
            {t.queryTitle}
          </h2>
        </div>
        <span className="text-[11px] font-mono text-cyan-400/80 bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-800/40">
          {t.querySubtitle}
        </span>
      </div>

      {/* Search Input Form */}
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={t.inputPlaceholder}
          className="w-full bg-[#070c16] border border-slate-700/80 rounded-xl pl-4 pr-24 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition shadow-inner"
        />
        <div className="absolute right-2 flex items-center gap-1">
          <button
            type="button"
            title="Voice query simulation"
            onClick={() => {
              const sampleQuery = currentLang === 'mr'
                ? 'उद्या सकाळी रत्नागिरीजवळ मासेमारी करणे सुरक्षित आहे का?'
                : currentLang === 'hi'
                ? 'कल सुबह रत्नागिरी के पास मछली पकड़ना सुरक्षित है क्या?'
                : 'Is it safe to go fishing tomorrow at 6 AM near Ratnagiri?';
              setInputText(sampleQuery);
              onSearch(sampleQuery);
            }}
            className="p-2 text-slate-400 hover:text-cyan-300 hover:bg-slate-800/60 rounded-lg transition"
          >
            <Mic className="w-4 h-4" />
          </button>
          <button
            type="submit"
            disabled={isLoading || !inputText.trim()}
            className="px-3.5 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold text-xs flex items-center gap-1.5 hover:from-blue-500 hover:to-cyan-500 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-cyan-900/30"
          >
            {isLoading ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              <>
                <span>{t.btnRun}</span>
                <Send className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Preset Scenario Chips */}
      <div>
        <p className="text-[11px] font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>{t.presetTitle}</span>
        </p>
        <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
          {t.presets.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectPreset(item.query)}
              className="text-xs px-2.5 py-1 rounded-md bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 border border-slate-700/60 transition flex items-center gap-1 text-left"
            >
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Parsed Entity Tags */}
      {parsedQuery && (
        <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 text-[11px] font-mono">
            {currentLang === 'mr' ? 'विश्लेषण:' : currentLang === 'hi' ? 'विश्लेषण:' : 'Supervisor Parsed:'}
          </span>
          
          <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-blue-950/70 border border-blue-800/60 text-blue-300 font-mono">
            <span>INTENT:</span>
            <span className="font-bold text-white">{parsedQuery.intent}</span>
          </div>

          <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-cyan-950/70 border border-cyan-800/60 text-cyan-300 font-mono">
            <MapPin className="w-3 h-3 text-cyan-400" />
            <span>{parsedQuery.location_name} ({parsedQuery.latitude.toFixed(2)}°N, {parsedQuery.longitude.toFixed(2)}°E)</span>
          </div>

          <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-amber-950/70 border border-amber-800/60 text-amber-300 font-mono">
            <Clock className="w-3 h-3 text-amber-400" />
            <span>{parsedQuery.target_time_display}</span>
          </div>

          <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-purple-950/70 border border-purple-800/60 text-purple-300 font-mono">
            <span>LANG: {parsedQuery.language.toUpperCase()}</span>
          </div>
        </div>
      )}
    </div>
  );
};
