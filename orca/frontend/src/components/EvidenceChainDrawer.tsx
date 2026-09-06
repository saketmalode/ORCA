import React from 'react';
import { Database, ExternalLink, ChevronDown, ChevronUp, Radio } from 'lucide-react';
import type { EvidenceItem } from '../types/orca';
import { TRANSLATIONS, type Language } from '../i18n/translations';

interface EvidenceChainDrawerProps {
  evidenceChain: EvidenceItem[];
  isExpanded: boolean;
  onToggle: () => void;
  currentLang?: Language;
}

export const EvidenceChainDrawer: React.FC<EvidenceChainDrawerProps> = ({
  evidenceChain,
  isExpanded,
  onToggle,
  currentLang = 'en',
}) => {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  return (
    <div className="bg-[#0b1322] border border-slate-800 rounded-xl shadow-xl overflow-hidden transition-all">
      {/* Header Bar */}
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 bg-slate-900/90 hover:bg-slate-850 flex items-center justify-between text-left transition"
      >
        <div className="flex items-center gap-2.5">
          <span className="p-1.5 rounded-lg bg-cyan-950 border border-cyan-800/60 text-cyan-400">
            <Database className="w-4 h-4" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white tracking-wide">
                {t.drawerEvidenceTitle}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-700/50 text-cyan-400">
                {evidenceChain.length} {currentLang === 'mr' ? 'प्रमाण घटक' : currentLang === 'hi' ? 'प्रमाण नोड्स' : 'Provenance Nodes'}
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">
              {t.dataSourceLabel}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-slate-400">
          <span className="text-xs font-mono">{isExpanded ? (currentLang === 'mr' ? 'बंद करा' : currentLang === 'hi' ? 'बंद करें' : 'Collapse') : (currentLang === 'mr' ? 'तपासा' : currentLang === 'hi' ? 'जाँचें' : 'Inspect Evidence DAG')}</span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Expanded Provenance DAG */}
      {isExpanded && (
        <div className="p-4 border-t border-slate-800 bg-[#070c16] flex flex-col gap-3 max-h-80 overflow-y-auto">
          <div className="text-[11px] text-slate-400 font-mono bg-slate-900/60 p-2 rounded border border-slate-800">
            {currentLang === 'mr'
              ? 'ओर्काद्वारे दिलेला प्रत्येक सल्ला थेट प्रमाणित सरकारी सागरी डेटावर आधारित आहे. कोणताही खोटा डेटा किंवा अंदाज नाही.'
              : currentLang === 'hi'
              ? 'ओरका द्वारा दी गई प्रत्येक सलाह सीधे प्रमाणित सरकारी समुद्री डेटा पर आधारित है। कोई मनगढ़ंत या भ्रामक जानकारी नहीं।'
              : 'Every recommendation produced by ORCA maps directly to verifiable public marine data sources. No hallucinations, no unsupported statements.'}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {evidenceChain.map((ev, idx) => (
              <div
                key={idx}
                className="bg-slate-900/80 border border-slate-800 rounded-lg p-3 flex flex-col justify-between text-xs hover:border-slate-700 transition"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-bold text-slate-200">{ev.parameter}</span>
                    <span className="flex items-center gap-1 font-mono text-[10px] text-emerald-400 bg-emerald-950/50 px-1.5 py-0.2 rounded border border-emerald-800/40">
                      <Radio className="w-2.5 h-2.5 animate-pulse" />
                      <span>{ev.status}</span>
                    </span>
                  </div>

                  <div className="text-sm font-mono font-bold text-cyan-300 mb-1">
                    {ev.value_display}
                  </div>

                  <div className="text-[11px] font-mono text-amber-400 bg-amber-950/30 px-2 py-0.5 rounded border border-amber-800/30 inline-block mb-2">
                    {ev.target_risk_factor}
                  </div>
                </div>

                <div className="border-t border-slate-800/80 pt-2 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span className="truncate max-w-[200px]" title={ev.source_name}>
                    {ev.source_name}
                  </span>
                  {ev.source_url ? (
                    <a
                      href={ev.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 shrink-0"
                    >
                      <span>Source Link</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-slate-500">Official Record</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
