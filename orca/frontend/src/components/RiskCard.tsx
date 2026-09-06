import React from 'react';
import { AlertOctagon, CheckCircle2, AlertTriangle, ShieldAlert, Waves, Wind, CloudRain, Zap, Shield, Info } from 'lucide-react';
import type { RiskAssessment } from '../types/orca';
import { TRANSLATIONS, type Language } from '../i18n/translations';

interface RiskCardProps {
  risk: RiskAssessment;
  locationName: string;
  timeWindow: string;
  formattedText?: string;
  currentLang?: Language;
}

export const RiskCard: React.FC<RiskCardProps> = ({
  risk,
  locationName,
  timeWindow,
  currentLang = 'en',
}) => {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  const getBadgeStyle = (level: string) => {
    switch (level) {
      case 'SAFE':
        return {
          bg: 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300',
          indicator: 'bg-emerald-500',
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
          label: t.levelSafe,
        };
      case 'MODERATE':
        return {
          bg: 'bg-yellow-950/80 border-yellow-500/50 text-yellow-300',
          indicator: 'bg-yellow-500',
          icon: <AlertTriangle className="w-5 h-5 text-yellow-400" />,
          label: t.levelModerate,
        };
      case 'HIGH':
        return {
          bg: 'bg-orange-950/80 border-orange-500/50 text-orange-300',
          indicator: 'bg-orange-500',
          icon: <AlertOctagon className="w-5 h-5 text-orange-400" />,
          label: t.levelHigh,
        };
      case 'CRITICAL':
      default:
        return {
          bg: 'bg-rose-950/90 border-rose-500/70 text-rose-300',
          indicator: 'bg-rose-500',
          icon: <ShieldAlert className="w-5 h-5 text-rose-400" />,
          label: t.levelCritical,
        };
    }
  };

  const badge = getBadgeStyle(risk.risk_level);

  const getFactorLabel = (factorName: string) => {
    if (factorName.includes('wave')) return t.factorWave;
    if (factorName.includes('wind')) return t.factorWind;
    if (factorName.includes('precip')) return t.factorRain;
    if (factorName.includes('lightning') || factorName.includes('cyclone')) return t.factorLightning;
    if (factorName.includes('border') || factorName.includes('geofence')) return t.factorGeofence;
    return factorName.replace('_', ' ').toUpperCase();
  };

  const getFactorIcon = (factorName: string) => {
    if (factorName.includes('wave')) return <Waves className="w-4 h-4 text-cyan-400" />;
    if (factorName.includes('wind')) return <Wind className="w-4 h-4 text-sky-400" />;
    if (factorName.includes('precip')) return <CloudRain className="w-4 h-4 text-blue-400" />;
    if (factorName.includes('lightning') || factorName.includes('cyclone')) return <Zap className="w-4 h-4 text-amber-400" />;
    return <Shield className="w-4 h-4 text-indigo-400" />;
  };

  return (
    <div className="bg-[#0b1322] border border-slate-800 rounded-xl p-4 shadow-xl flex flex-col gap-4">
      {/* Top Banner with Score and Badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              {locationName}
            </span>
            <span className="text-[11px] px-2 py-0.2 rounded-full bg-slate-800 text-slate-300 font-mono">
              {timeWindow}
            </span>
          </div>
          <h3 className="text-lg font-bold text-white mt-0.5 flex items-center gap-2">
            <span>{t.riskHeader}</span>
          </h3>
        </div>

        <div className="flex items-center gap-3">
          {/* Circular/Meter Score */}
          <div className="flex flex-col items-end">
            <span className="text-2xl font-black font-mono tracking-tight text-white">
              {risk.risk_score}
              <span className="text-xs font-normal text-slate-400">/100</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono uppercase">{t.riskScoreLabel}</span>
          </div>

          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border font-bold text-xs tracking-wide ${badge.bg}`}
          >
            {badge.icon}
            <span>{badge.label}</span>
          </div>
        </div>
      </div>

      {/* Progress Risk Bar */}
      <div>
        <div className="w-full h-2 rounded-full bg-slate-900 border border-slate-800 overflow-hidden flex">
          <div
            className={`h-full transition-all duration-700 ease-out ${badge.indicator}`}
            style={{ width: `${Math.min(100, Math.max(5, risk.risk_score))}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
          <span>0 SAFE (सुरक्षित)</span>
          <span>30 CAUTION (सावध)</span>
          <span>60 DANGER (धोका)</span>
          <span>80+ CRITICAL</span>
        </div>
      </div>

      {/* Recommendation Block */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3">
        <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-300 mb-1">
          <Info className="w-3.5 h-3.5" />
          <span>{t.recommendationTitle}</span>
        </div>
        <p className="text-xs text-slate-200 leading-relaxed font-sans font-medium">
          {risk.recommendation}
        </p>
      </div>

      {/* Multi-Agent Consensus */}
      {risk.consensus && risk.consensus.length > 0 && (
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-lg p-2.5">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1.5">
            <span className="text-cyan-400 font-bold">{t.consensusTitle}</span>
            <span>{risk.consensus.length} Agents</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
            {risk.consensus.map((c, idx) => (
              <div
                key={idx}
                className="bg-slate-900/90 border border-slate-800 rounded p-1.5 text-[10px] flex flex-col justify-between"
              >
                <span className="text-slate-400 font-mono truncate">{c.agent_name.replace(' AGENT', '')}</span>
                <span
                  className={`font-bold mt-0.5 ${
                    c.assessment === 'SAFE'
                      ? 'text-emerald-400'
                      : c.assessment === 'MODERATE'
                      ? 'text-amber-400'
                      : 'text-rose-400'
                  }`}
                >
                  {c.assessment}
                </span>
                <span className="text-[9px] text-slate-500 truncate">{c.reason}</span>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-slate-400 mt-1.5 italic font-mono">
            {risk.consensus_summary}
          </p>
        </div>
      )}

      {/* Contributing Factors Breakdown */}
      <div>
        <h4 className="text-xs font-bold text-slate-300 mb-2 font-mono flex items-center justify-between">
          <span>{t.factorsTitle}</span>
          <span className="text-[10px] text-slate-500">Threshold Impact</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {risk.factors.map((factor, idx) => (
            <div
              key={idx}
              className="bg-slate-900/70 border border-slate-800 rounded-lg p-2 flex items-start justify-between gap-2"
            >
              <div className="flex items-start gap-2">
                <span className="p-1 rounded bg-slate-800/80 mt-0.5">
                  {getFactorIcon(factor.factor)}
                </span>
                <div>
                  <div className="text-xs font-semibold text-slate-200">
                    {getFactorLabel(factor.factor)}: <strong className="text-white">{factor.value} {factor.unit}</strong>
                  </div>
                  <div className="text-[11px] text-slate-400">{factor.status_label}</div>
                  <div className="text-[9px] font-mono text-slate-500">
                    Source: {factor.source}
                  </div>
                </div>
              </div>
              <span className="font-mono text-xs font-bold text-amber-400 bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-800/40">
                +{factor.impact}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Mandatory Disclaimer */}
      <div className="text-[10px] text-slate-400 border-t border-slate-800/80 pt-2 font-mono italic">
        ⚠️ {t.disclaimerNotice}
      </div>
    </div>
  );
};
