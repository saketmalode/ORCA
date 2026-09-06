import React from 'react';
import { Clock, Waves, Wind } from 'lucide-react';
import type { WeatherData, OceanData } from '../types/orca';
import { TRANSLATIONS, type Language } from '../i18n/translations';

interface ForecastTimelineProps {
  weather?: WeatherData;
  ocean?: OceanData;
  selectedOffset: number;
  onSelectOffset: (offset: number) => void;
  currentLang?: Language;
}

export const ForecastTimeline: React.FC<ForecastTimelineProps> = ({
  weather,
  ocean,
  selectedOffset,
  onSelectOffset,
  currentLang = 'en',
}) => {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;
  const timeSlots = weather?.forecast_timeline || [
    { offset_hours: 0, label: '06:00', wind_speed_kmh: 31, precipitation_mm: 3.8, weather_code: 61 },
    { offset_hours: 2, label: '08:00', wind_speed_kmh: 28, precipitation_mm: 1.2, weather_code: 2 },
    { offset_hours: 4, label: '10:00', wind_speed_kmh: 24, precipitation_mm: 0.0, weather_code: 1 },
    { offset_hours: 6, label: '12:00', wind_speed_kmh: 22, precipitation_mm: 0.0, weather_code: 0 },
    { offset_hours: 8, label: '14:00', wind_speed_kmh: 26, precipitation_mm: 0.2, weather_code: 2 },
    { offset_hours: 12, label: '18:00', wind_speed_kmh: 30, precipitation_mm: 2.5, weather_code: 61 },
  ];

  const oceanSlots = ocean?.forecast_timeline || [
    { offset_hours: 0, wave_height_m: 2.8, wave_period_s: 14.0 },
    { offset_hours: 2, wave_height_m: 2.5, wave_period_s: 13.5 },
    { offset_hours: 4, wave_height_m: 2.2, wave_period_s: 13.0 },
    { offset_hours: 6, wave_height_m: 2.1, wave_period_s: 12.5 },
    { offset_hours: 8, wave_height_m: 2.3, wave_period_s: 13.0 },
    { offset_hours: 12, wave_height_m: 2.7, wave_period_s: 13.8 },
  ];

  return (
    <div className="bg-[#0b1322] border border-slate-800 rounded-xl p-3 shadow-xl flex flex-col gap-2">
      <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-cyan-400" />
          <h4 className="text-xs font-bold text-slate-200">
            {t.timelineTitle}
          </h4>
        </div>
        <span className="text-[10px] font-mono text-slate-400">
          Open-Meteo & INCOIS OSF
        </span>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {timeSlots.map((slot, idx) => {
          const oceanData = oceanSlots[idx] || { wave_height_m: 2.5 };
          const isSelected = selectedOffset === slot.offset_hours;

          return (
            <button
              key={idx}
              onClick={() => onSelectOffset(slot.offset_hours)}
              className={`p-2 rounded-lg border text-left flex flex-col gap-1 transition ${
                isSelected
                  ? 'bg-blue-900/60 border-cyan-400 shadow-md shadow-cyan-950'
                  : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] font-mono font-bold text-slate-200">
                <span>{slot.label}</span>
                {idx === 0 && (
                  <span className="text-[9px] px-1 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/50">
                    {t.timelineNow}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1 text-[11px] text-cyan-400 font-mono font-bold">
                <Waves className="w-3 h-3 shrink-0" />
                <span>{oceanData.wave_height_m.toFixed(1)} m</span>
              </div>

              <div className="flex items-center gap-1 text-[10px] text-sky-300 font-mono">
                <Wind className="w-3 h-3 shrink-0" />
                <span>{slot.wind_speed_kmh} km/h</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
