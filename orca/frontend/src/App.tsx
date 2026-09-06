import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { CommandPanel } from './components/CommandPanel';
import { RiskCard } from './components/RiskCard';
import { WhatIfWidget } from './components/WhatIfWidget';
import { PredictiveGeofenceWidget } from './components/PredictiveGeofenceWidget';
import { AgentAuditDrawer } from './components/AgentAuditDrawer';
import { EvidenceChainDrawer } from './components/EvidenceChainDrawer';
import { ForecastTimeline } from './components/ForecastTimeline';
import { MarineMap } from './map/MarineMap';
import { sendQuery, testWhatIf, testPredictiveGeofence } from './services/api';
import type { OrcaResponse } from './types/orca';
import { TRANSLATIONS, type Language } from './i18n/translations';
import { Fish } from 'lucide-react';

export const App: React.FC = () => {
  const [data, setData] = useState<OrcaResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentLang, setCurrentLang] = useState<Language>('en');
  const [isAuditExpanded, setIsAuditExpanded] = useState(false);
  const [isEvidenceExpanded, setIsEvidenceExpanded] = useState(false);
  const [selectedOffset, setSelectedOffset] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'overview' | 'simulation' | 'geofence' | 'fishing'>('overview');

  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  // Initial load: Run default SIH demo query for Ratnagiri
  useEffect(() => {
    handleRunQuery('Is it safe to go fishing tomorrow at 6 AM near Ratnagiri?', 'en');
  }, []);

  const handleRunQuery = async (queryText: string, langOverride?: Language) => {
    setIsLoading(true);
    const lang = langOverride || currentLang;
    try {
      const res = await sendQuery(queryText, lang);
      setData(res);
      if (langOverride) {
        setCurrentLang(langOverride);
      } else if (res.query && res.query.language) {
        setCurrentLang(res.query.language as Language);
      }
    } catch (err) {
      console.error('Failed to execute query:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMapClick = (lat: number, lon: number) => {
    const locQuery = currentLang === 'mr'
      ? `${lat.toFixed(4)}, ${lon.toFixed(4)} येथे मासेमारी करणे सुरक्षित आहे का?`
      : currentLang === 'hi'
      ? `क्या ${lat.toFixed(4)}, ${lon.toFixed(4)} के पास मछली पकड़ना सुरक्षित है?`
      : `Is it safe to go fishing near ${lat.toFixed(4)}, ${lon.toFixed(4)}?`;
    handleRunQuery(locQuery);
  };

  const handleSimulateWhatIf = async (timeA: string, timeB: string) => {
    if (!data) return;
    setIsLoading(true);
    try {
      const res = await testWhatIf(data.query.latitude, data.query.longitude, timeA, timeB);
      setData((prev) => (prev ? { ...prev, what_if: res } : prev));
    } catch (err) {
      console.error('What-If simulation failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSimulateGeofence = async (lat: number, lon: number, heading: number, speed: number) => {
    setIsLoading(true);
    try {
      const res = await testPredictiveGeofence(lat, lon, heading, speed);
      setData((prev) => (prev ? { ...prev, predictive_geofence: res } : prev));
    } catch (err) {
      console.error('Predictive geofence simulation failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectLang = (lang: Language) => {
    setCurrentLang(lang);
    if (data) {
      const portName = data.query.location_name || 'Ratnagiri';
      const q = lang === 'mr'
        ? `उद्या सकाळी ६ वाजता ${portName} जवळ मासेमारी करणे सुरक्षित आहे का?`
        : lang === 'hi'
        ? `क्या कल सुबह 6 बजे ${portName} के पास मछली पकड़ना सुरक्षित है?`
        : `Is it safe to go fishing tomorrow at 6 AM near ${portName}?`;
      handleRunQuery(q, lang);
    }
  };

  const handleSelectTimelineOffset = (offset: number) => {
    setSelectedOffset(offset);
    if (!data) return;
    const timeLabel = offset === 0 ? 'Now' : `in +${offset} hours`;
    handleRunQuery(`Conditions near ${data.query.location_name} ${timeLabel}`);
  };

  return (
    <div className="min-h-screen bg-[#060b13] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-white">
      {/* Top Navigation Header */}
      <Header
        currentLang={currentLang}
        onSelectLang={handleSelectLang}
        activeAgentsCount={data?.agent_audit.length || 11}
      />

      {/* Main Command Center Body */}
      <main className="flex-1 p-3 md:p-4 flex flex-col gap-3 max-w-[1700px] w-full mx-auto">
        {/* Natural Language & Scenario Dispatcher Bar */}
        <CommandPanel
          onSearch={(q) => handleRunQuery(q)}
          isLoading={isLoading}
          parsedQuery={data?.query}
          currentLang={currentLang}
        />

        {/* Core Layout: Left Map / Right Decision Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 flex-1 min-h-[620px]">
          {/* LEFT: Marine Map + Forecast Timeline (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-3">
            <div className="flex-1 min-h-[460px] relative">
              <MarineMap
                data={data || undefined}
                onMapClick={handleMapClick}
                onPortSelect={(portName) => {
                  const q = currentLang === 'mr'
                    ? `उद्या सकाळी ६ वाजता ${portName} जवळ मासेमारी करणे सुरक्षित आहे का?`
                    : currentLang === 'hi'
                    ? `क्या कल सुबह 6 बजे ${portName} के पास मछली पकड़ना सुरक्षित है?`
                    : `Is it safe to go fishing tomorrow at 6 AM near ${portName}?`;
                  handleRunQuery(q);
                }}
                currentLang={currentLang}
              />
            </div>

            {/* Forecast Timeline Bar */}
            <ForecastTimeline
              weather={data?.weather}
              ocean={data?.ocean}
              selectedOffset={selectedOffset}
              onSelectOffset={handleSelectTimelineOffset}
              currentLang={currentLang}
            />
          </div>

          {/* RIGHT: Analytical Intelligence Panel (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-3 overflow-y-auto max-h-[850px] pr-1">
            {/* View Tabs */}
            <div className="flex bg-[#0b1322] p-1 rounded-xl border border-slate-800 text-xs font-bold">
              <button
                onClick={() => setActiveTab('overview')}
                className={`flex-1 py-2 rounded-lg transition text-center ${
                  activeTab === 'overview'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t.tabSafety}
              </button>
              <button
                onClick={() => setActiveTab('simulation')}
                className={`flex-1 py-2 rounded-lg transition text-center ${
                  activeTab === 'simulation'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t.tabWhatIf}
              </button>
              <button
                onClick={() => setActiveTab('geofence')}
                className={`flex-1 py-2 rounded-lg transition text-center ${
                  activeTab === 'geofence'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t.tabGeofence}
              </button>
              <button
                onClick={() => setActiveTab('fishing')}
                className={`flex-1 py-2 rounded-lg transition text-center ${
                  activeTab === 'fishing'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t.tabFishing}
              </button>
            </div>

            {/* Tab 1: Safety & Decision Overview */}
            {activeTab === 'overview' && data && (
              <div className="flex flex-col gap-3">
                <RiskCard
                  risk={data.risk}
                  locationName={data.query.location_name}
                  timeWindow={data.query.target_time_display}
                  formattedText={data.formatted_response}
                  currentLang={currentLang}
                />

                {/* Natural Response Template Output */}
                <div className="bg-[#0b1322] border border-slate-800 rounded-xl p-4 shadow-xl text-xs">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
                    <span className="font-bold text-cyan-300 font-mono">
                      {currentLang === 'mr' ? 'ओर्का थेट अहवाल' : currentLang === 'hi' ? 'ओरका लाइव रिपोर्ट' : 'ORCA Synthesized Recommendation'}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      Zero-LLM ({data.query.language.toUpperCase()})
                    </span>
                  </div>
                  <div className="text-slate-200 leading-relaxed whitespace-pre-line font-mono bg-slate-950/60 p-3 rounded-lg border border-slate-900 font-medium">
                    {data.formatted_response}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: What-If Marine Simulation */}
            {activeTab === 'simulation' && data && (
              <WhatIfWidget
                whatIf={data.what_if}
                onSimulate={handleSimulateWhatIf}
                isLoading={isLoading}
                currentLang={currentLang}
              />
            )}

            {/* Tab 3: Predictive Geofencing */}
            {activeTab === 'geofence' && data && (
              <PredictiveGeofenceWidget
                predictive={data.predictive_geofence}
                currentLat={data.query.latitude}
                currentLon={data.query.longitude}
                onSimulateVector={handleSimulateGeofence}
                isLoading={isLoading}
                currentLang={currentLang}
              />
            )}

            {/* Tab 4: PFZ & Ecosystem Favourability */}
            {activeTab === 'fishing' && data && (
              <div className="bg-[#0b1322] border border-slate-800 rounded-xl p-4 shadow-xl flex flex-col gap-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <Fish className="w-4 h-4 text-cyan-400" />
                    <h3 className="text-sm font-bold text-white tracking-wide">
                      {t.pfzTitle}
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                    {t.pfzOfficialBadge}
                  </span>
                </div>

                {data.nearest_pfz ? (
                  <div className="space-y-2 text-xs">
                    <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3">
                      <span className="text-[10px] font-mono text-cyan-400 uppercase">{t.pfzNearestLabel}</span>
                      <div className="text-sm font-bold text-white mt-0.5">{data.nearest_pfz.name}</div>
                      <div className="text-[11px] text-slate-300 mt-1">
                        🧭 <strong>{data.nearest_pfz.bearing_deg}°</strong> | 📏 <strong>{data.nearest_pfz.distance_km} km</strong> ({data.nearest_pfz.nearest_port})
                      </div>
                      <div className="text-[11px] text-slate-300 mt-0.5">
                        🌊 {t.pfzDepth}: <strong>{data.nearest_pfz.depth_range_m}</strong>
                      </div>
                      <div className="text-[11px] text-slate-300 mt-0.5">
                        🐟 {t.pfzSpecies}: <em className="text-cyan-300 font-semibold">{data.nearest_pfz.species_association}</em>
                      </div>
                      <div className="text-[10px] text-slate-500 mt-2 font-mono">
                        Source: {data.nearest_pfz.source} • Valid: {data.nearest_pfz.valid_until}
                      </div>
                    </div>

                    {data.fishing_index && (
                      <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-200">{t.pfzSuitabilityScore}</span>
                          <span className="font-mono font-bold text-emerald-400">{data.fishing_index.score}/100 [{data.fishing_index.category}]</span>
                        </div>
                        <p className="text-[11px] text-slate-300 mt-1.5 font-medium">{data.fishing_index.description}</p>
                        <div className="mt-2 space-y-0.5 text-[10px] font-mono text-slate-400 border-t border-slate-800 pt-1.5">
                          {data.fishing_index.factors_summary.map((f, i) => (
                            <div key={i}>• {f}</div>
                          ))}
                        </div>
                        <div className="mt-2 text-[9px] font-mono text-slate-500 italic">
                          ⚠️ {data.fishing_index.disclaimer}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-xs text-slate-400 p-4 text-center">
                    {t.pfzNoAdvisory}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Drawers: Agent Execution Audit Trail & Evidence Provenance DAG */}
        <div className="flex flex-col gap-3 mt-1">
          {data && (
            <AgentAuditDrawer
              auditSteps={data.agent_audit}
              isExpanded={isAuditExpanded}
              onToggle={() => setIsAuditExpanded(!isAuditExpanded)}
              currentLang={currentLang}
            />
          )}

          {data && (
            <EvidenceChainDrawer
              evidenceChain={data.evidence_chain}
              isExpanded={isEvidenceExpanded}
              onToggle={() => setIsEvidenceExpanded(!isEvidenceExpanded)}
              currentLang={currentLang}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#070c16] text-slate-500 text-[11px] px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 font-mono">
        <div className="flex items-center gap-2">
          <span>{t.footerPlatform}</span>
          <span>|</span>
          <span className="text-slate-400">{t.footerDept}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-emerald-400">{t.footerSync}</span>
          <span>|</span>
          <span className="text-cyan-400">{t.footerNoAI}</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
