import React from 'react';
import { CheckCircle2, ChevronDown, ChevronUp, Cpu } from 'lucide-react';
import type { AgentAuditStep } from '../types/orca';
import { TRANSLATIONS, type Language } from '../i18n/translations';

interface AgentAuditDrawerProps {
  auditSteps: AgentAuditStep[];
  isExpanded: boolean;
  onToggle: () => void;
  currentLang?: Language;
}

export const AgentAuditDrawer: React.FC<AgentAuditDrawerProps> = ({
  auditSteps,
  isExpanded,
  onToggle,
  currentLang = 'en',
}) => {
  const totalTime = auditSteps.reduce((acc, curr) => acc + curr.execution_time_ms, 0);
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  return (
    <div className="bg-[#0b1322] border border-slate-800 rounded-xl shadow-xl overflow-hidden transition-all">
      {/* Header Bar */}
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 bg-slate-900/90 hover:bg-slate-850 flex items-center justify-between text-left transition"
      >
        <div className="flex items-center gap-2.5">
          <span className="p-1.5 rounded-lg bg-indigo-950 border border-indigo-800/60 text-indigo-400">
            <Cpu className="w-4 h-4" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white tracking-wide">
                {t.drawerAuditTitle}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-700/50 text-emerald-400">
                {auditSteps.length} {currentLang === 'mr' ? 'एजंट्स पूर्ण' : currentLang === 'hi' ? 'एजेंट संपन्न' : 'Agents Completed'}
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">
              {t.drawerZeroAIProof} • Latency: {totalTime.toFixed(1)} ms
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-slate-400">
          <span className="text-xs font-mono">{isExpanded ? (currentLang === 'mr' ? 'बंद करा' : currentLang === 'hi' ? 'बंद करें' : 'Collapse') : (currentLang === 'mr' ? 'तपासा' : currentLang === 'hi' ? 'जाँचें' : 'Inspect Audit Log')}</span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Expanded Step-by-Step Execution */}
      {isExpanded && (
        <div className="p-4 border-t border-slate-800 bg-[#070c16] flex flex-col gap-2 max-h-72 overflow-y-auto">
          {auditSteps.map((step, idx) => (
            <div
              key={idx}
              className="bg-slate-900/60 border border-slate-800/80 rounded-lg p-2.5 flex items-start justify-between gap-3 text-xs"
            >
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-cyan-300">
                      {step.agent_name}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                      {step.status}
                    </span>
                  </div>
                  <p className="text-slate-200 mt-0.5 font-sans">{step.step_description}</p>
                  {step.details && (
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5 opacity-80">
                      ⤷ {step.details}
                    </p>
                  )}
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="font-mono text-[11px] text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded">
                  {step.execution_time_ms} ms
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
