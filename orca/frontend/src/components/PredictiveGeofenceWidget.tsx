import React, { useState } from 'react';
import { Shield, Navigation, AlertTriangle, CheckCircle2 } from 'lucide-react';
import type { PredictiveGeofenceResult } from '../types/orca';
import { TRANSLATIONS, type Language } from '../i18n/translations';

interface PredictiveGeofenceWidgetProps {
  predictive?: PredictiveGeofenceResult;
  currentLat: number;
  currentLon: number;
  onSimulateVector: (lat: number, lon: number, heading: number, speed: number) => void;
  isLoading: boolean;
  currentLang?: Language;
}

export const PredictiveGeofenceWidget: React.FC<PredictiveGeofenceWidgetProps> = ({
  predictive,
  currentLat,
  currentLon,
  onSimulateVector,
  isLoading,
  currentLang = 'en',
}) => {
  const [heading, setHeading] = useState(270);
  const [speed, setSpeed] = useState(12);
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  const handleSimulate = (e: React.FormEvent) => {
    e.preventDefault();
    onSimulateVector(currentLat, currentLon, heading, speed);
  };

  if (!predictive) {
    return (
      <div className="bg-[#0b1322] border border-slate-800 rounded-xl p-4 shadow-xl text-center text-slate-400 text-xs">
        Loading Geofence Engine...
      </div>
    );
  }

  const isBreach = predictive.is_projected_breach;

  return (
    <div className="bg-[#0b1322] border border-slate-800 rounded-xl p-4 shadow-xl flex flex-col gap-3">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-white tracking-wide">
            {t.geofenceTitle}
          </h3>
        </div>
        <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
          60-Min Vectoring
        </span>
      </div>

      <p className="text-xs text-slate-300">
        {t.geofenceSubtitle}
      </p>

      {/* Vector Controls Form */}
      <form onSubmit={handleSimulate} className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex flex-col gap-3 text-xs">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[11px] text-slate-400 block mb-1">{t.headingLabel}</label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0"
                max="359"
                value={heading}
                onChange={(e) => setHeading(Number(e.target.value))}
                className="flex-1 accent-cyan-500"
              />
              <span className="font-mono text-cyan-300 font-bold w-10 text-right">{heading}°</span>
            </div>
          </div>

          <div>
            <label className="text-[11px] text-slate-400 block mb-1">{t.speedLabel}</label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="2"
                max="25"
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="flex-1 accent-cyan-500"
              />
              <span className="font-mono text-cyan-300 font-bold w-12 text-right">{speed} kn</span>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold rounded-lg transition flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
        >
          {isLoading ? (
            <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          ) : (
            <>
              <Navigation className="w-3.5 h-3.5" />
              <span>{t.btnCheckVector}</span>
            </>
          )}
        </button>
      </form>

      {/* Vector Alert Banner */}
      <div className={`p-3 rounded-xl border flex items-start gap-2.5 text-xs ${
        isBreach
          ? 'bg-rose-950/60 border-rose-800 text-rose-200'
          : 'bg-emerald-950/60 border-emerald-800 text-emerald-200'
      }`}>
        {isBreach ? (
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
        ) : (
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        )}
        <div className="flex flex-col gap-1">
          <span className="font-bold">
            {isBreach ? t.statusDangerVector : t.statusSafeVector}
          </span>
          <p className="text-[11px] leading-relaxed opacity-90">
            {predictive.warning_message}
          </p>
          {isBreach && predictive.time_to_boundary_min && (
            <div className="mt-1 font-mono font-bold text-rose-300">
              ⏱️ {t.etaToBorderLabel}: {predictive.time_to_boundary_min} minutes
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
