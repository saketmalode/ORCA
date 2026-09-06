import React, { useState } from 'react';
import { Clock, TrendingDown, TrendingUp, Sparkles } from 'lucide-react';
import type { WhatIfResult } from '../types/orca';
import { TRANSLATIONS, type Language } from '../i18n/translations';

interface WhatIfWidgetProps {
  whatIf?: WhatIfResult;
  onSimulate: (timeA: string, timeB: string) => void;
  isLoading: boolean;
  currentLang?: Language;
}

const TIME_OPTIONS = [
  { label: '04:00 AM (पहाटे ४ / सुबह ४)', value: '04:00 AM' },
  { label: '06:00 AM (सकाळी ६ / सुबह ६)', value: '06:00 AM' },
  { label: '08:00 AM (सकाळी ८ / सुबह ८)', value: '08:00 AM' },
  { label: '10:00 AM (सकाळी १० / सुबह १०)', value: '10:00 AM' },
  { label: '12:00 PM (दुपारी १२ / दोपहर १२)', value: '12:00 PM' },
  { label: '02:00 PM (दुपारी २ / दोपहर २)', value: '02:00 PM' },
  { label: '04:00 PM (संध्याकाळी ४ / शाम ४)', value: '04:00 PM' },
  { label: '06:00 PM (संध्याकाळी ६ / शाम ६)', value: '06:00 PM' },
];

export const WhatIfWidget: React.FC<WhatIfWidgetProps> = ({
  whatIf,
  onSimulate,
  isLoading,
  currentLang = 'en',
}) => {
  const [timeA, setTimeA] = useState('06:00 AM');
  const [timeB, setTimeB] = useState('04:00 AM');
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  const handleRunSimulation = (e: React.FormEvent) => {
    e.preventDefault();
    onSimulate(timeA, timeB);
  };

  if (!whatIf) {
    return (
      <div className="bg-[#0b1322] border border-slate-800 rounded-xl p-4 shadow-xl text-center text-slate-400 text-xs">
        Loading What-If Simulation...
      </div>
    );
  }

  const isImprovement = whatIf.risk_delta < 0;

  return (
    <div className="bg-[#0b1322] border border-slate-800 rounded-xl p-4 shadow-xl flex flex-col gap-4">
      {/* Title Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-white tracking-wide">
            {t.whatIfTitle}
          </h3>
        </div>
        <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
          Temporal Engine
        </span>
      </div>

      <p className="text-xs text-slate-300">
        {t.whatIfSubtitle}
      </p>

      {/* Select Times Form */}
      <form onSubmit={handleRunSimulation} className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex flex-col gap-3">
        <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>{t.timeSelectTitle}</span>
        </span>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
          <div>
            <label className="text-[11px] text-slate-400 block mb-1">{t.timeCurrentLabel}</label>
            <select
              value={timeA}
              onChange={(e) => setTimeA(e.target.value)}
              className="w-full bg-[#070c16] border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100 focus:outline-none focus:border-cyan-500 font-mono text-xs"
            >
              {TIME_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] text-slate-400 block mb-1">{t.timeAltLabel}</label>
            <select
              value={timeB}
              onChange={(e) => setTimeB(e.target.value)}
              className="w-full bg-[#070c16] border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100 focus:outline-none focus:border-cyan-500 font-mono text-xs"
            >
              {TIME_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs rounded-lg transition flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
        >
          {isLoading ? (
            <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          ) : (
            <span>{t.btnSimulateWhatIf}</span>
          )}
        </button>
      </form>

      {/* Comparison Grid */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        {/* Scenario Current */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-lg p-3 flex flex-col gap-1.5">
          <span className="text-[10px] font-mono text-slate-400 uppercase">{whatIf.scenario_current.time_label} Plan</span>
          <div className="text-xl font-extrabold font-mono text-white">
            {whatIf.scenario_current.risk_score}
            <span className="text-xs font-normal text-slate-400">/100</span>
          </div>
          <span className="text-[11px] font-bold text-amber-400">
            {whatIf.scenario_current.risk_level}
          </span>
          <div className="text-[10px] text-slate-400 border-t border-slate-800 pt-1 mt-1 space-y-0.5">
            <div>Waves: {whatIf.scenario_current.wave_height_m} m</div>
            <div>Wind: {whatIf.scenario_current.wind_speed_kmh} km/h</div>
          </div>
        </div>

        {/* Scenario Alternative */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-lg p-3 flex flex-col gap-1.5">
          <span className="text-[10px] font-mono text-slate-400 uppercase">{whatIf.scenario_alternative.time_label} Plan</span>
          <div className="text-xl font-extrabold font-mono text-white">
            {whatIf.scenario_alternative.risk_score}
            <span className="text-xs font-normal text-slate-400">/100</span>
          </div>
          <span className="text-[11px] font-bold text-emerald-400">
            {whatIf.scenario_alternative.risk_level}
          </span>
          <div className="text-[10px] text-slate-400 border-t border-slate-800 pt-1 mt-1 space-y-0.5">
            <div>Waves: {whatIf.scenario_alternative.wave_height_m} m</div>
            <div>Wind: {whatIf.scenario_alternative.wind_speed_kmh} km/h</div>
          </div>
        </div>
      </div>

      {/* Delta Callout */}
      <div className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
        isImprovement
          ? 'bg-emerald-950/50 border-emerald-800/50 text-emerald-200'
          : 'bg-rose-950/50 border-rose-800/50 text-rose-200'
      }`}>
        <div className="flex items-center gap-2">
          {isImprovement ? <TrendingDown className="w-5 h-5 text-emerald-400" /> : <TrendingUp className="w-5 h-5 text-rose-400" />}
          <div>
            <span className="font-bold">{t.riskReductionLabel}: </span>
            <span className="font-mono font-bold text-sm">{whatIf.risk_delta > 0 ? `+${whatIf.risk_delta}` : whatIf.risk_delta} pts</span>
          </div>
        </div>
      </div>

      {/* Changes list & Recommendation */}
      <div className="space-y-1.5 text-xs">
        <span className="text-[11px] font-semibold text-slate-300">{t.keyChangesLabel}</span>
        <ul className="space-y-1 text-[11px] text-slate-300">
          {whatIf.changed_factors.map((c, i) => (
            <li key={i} className="flex items-start gap-1.5">
              <span className="text-cyan-400">•</span>
              <span>{c}</span>
            </li>
          ))}
        </ul>

        <div className="mt-2 p-2.5 rounded-lg bg-blue-950/50 border border-blue-800/40 text-[11px] text-blue-200 leading-relaxed font-medium">
          👉 {whatIf.recommendation}
        </div>
      </div>
    </div>
  );
};
