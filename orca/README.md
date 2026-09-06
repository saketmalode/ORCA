# ORCA — Marine EcOsystem Reasoning with Collaborative Agents
### SIH26176 | Department of Space / ISRO | Disaster Management & Blue Economy

> **CRITICAL ARCHITECTURAL MANDATE: STRICT ZERO-LLM PLATFORM**  
> ORCA is an Agentic Marine Intelligence Platform engineered with **ZERO dependency on Large Language Models (LLMs) or Generative AI APIs**. It uses **Autonomous Specialized Software Agents + Real-Time Public Marine Data Fusion + Deterministic Spatial-Temporal Reasoning + Mathematical Risk Models**.

---

## 🌊 System Architecture Overview

```
                          USER QUERY / COMMAND
                                   ↓
                           ORCA SUPERVISOR
                     (Deterministic Intent Router)
                                   ↓
        ┌──────────────────────────┼──────────────────────────┐
        ↓                          ↓                          ↓
  WEATHER AGENT               OCEAN AGENT                 GIS AGENT
  (Wind, Gusts, Rain,         (Waves, Swells, SST,        (Coordinates, Haversine,
   Pressure, Storm Index)      Sea State Douglas Scale)    Shelf Depth Zone)
        ↓                          ↓                          ↓
   ALERT AGENT                 PFZ AGENT                BOUNDARY AGENT
  (IMD Cyclone/Swell/         (Official INCOIS PFZ vs     (EEZ, IMBL, MPAs,
   Lightning Warnings)         ORCA Favourability Index)   Naval Firing Geofences)
        └──────────────────────────┼──────────────────────────┘
                                   ↓
                          DATA FUSION ENGINE
                                   ↓
                              RISK ENGINE
                       (Multi-Factor Fusion &
                       Agent Consensus Resolution)
                                   ↓
                             ROUTE ENGINE
                      (Fastest vs Safest Hazard-
                       Avoidance A* Navigation)
                                   ↓
                            EVIDENCE ENGINE
                     (Verifiable Sensor Provenance
                     & Immutable Evidence DAG)
                                   ↓
                           ORCA RECOMMENDATION
                    (Multilingual Structured Templates:
                         English, Hindi, Marathi)
                                   ↓
                    INTERACTIVE COMMAND CENTER (MAP)
```

---

## 🛡️ Zero-LLM Verification Guarantee

ORCA strictly fulfills the non-negotiable hackathon requirement:
- **No OpenAI, ChatGPT, Claude, Anthropic, Gemini, Groq, Ollama, Hugging Face, or local generative models.**
- **No LLM abstraction layer or hidden AI prompts.**
- **Natural Language Parsing**: Done via deterministic regex rules, tokenizers, Indian coastal gazetteers (`data/ports_gazetteer.json`), and multilingual dictionaries (`multilingual_dict.py`).
- **Explainability**: Every recommendation includes a deterministic evidence chain linking physical readings (m, km/h, mm, °C), institutional sources (INCOIS, IMD, MOSDAC), timestamps, and safety thresholds.

---

## 📡 Real Data Providers & Provenance

1. **ISRO MOSDAC** ([mosdac.gov.in](https://www.mosdac.gov.in/)): Oceansat-3 OCM Chlorophyll-a and INSAT-3DR TIR Sea Surface Temperature (SST) satellite layers.
2. **INCOIS Ocean State Forecast (OSF)** ([incois.gov.in/site/services/osf.jsp](https://incois.gov.in/site/services/osf.jsp)): Significant wave height, wave period, swell surge, and Douglas Sea State scale.
3. **INCOIS PFZ Mission** ([incois.gov.in/MarineFisheries/PfzAdvisory](https://incois.gov.in/MarineFisheries/PfzAdvisory)): Official Potential Fishing Zone lines, bearings, depths, and target commercial species.
4. **IMD Fishermen Warnings & Cyclone Bulletins** ([mausam.imd.gov.in](https://mausam.imd.gov.in/)): Squall warnings, coastal weather advisories, convective thunderstorm indices.
5. **National Hydrographic Office / MoEFCC**: Indian Maritime Boundaries (IMBL Palk Bay / Sir Creek), Marine Protected Areas (Gulf of Mannar, Malvan, Gahirmatha), and offshore security geofences.
6. **Open-Meteo Global Marine & Weather Forecasts**: Live real-time hourly wave spectra, swell, surface pressure, and wind vectors across the Arabian Sea, Bay of Bengal, and Indian Ocean.

Every observation reports its freshness badge:
- 🟢 **LIVE**: Real-time HTTP API response retrieved within seconds.
- 🟡 **CACHED**: Latest official bulletin from local cache when offline.
- 🔴 **DEMO DATA**: Explicitly tagged offline scenarios.

---

## ⚡ Key Differentiators

### 1. Multi-Agent Consensus
Specialized agents assess conditions independently (Weather: HIGH, Ocean: HIGH, GIS: MODERATE). The Risk Agent documents points of consensus or divergence and provides a deterministic resolution rule prioritising crew safety.

### 2. What-If Temporal Marine Simulation
Compare departure scenarios (e.g., `06:00 AM` vs `04:00 AM` vs `08:00 AM`). ORCA calculates parameter deltas (wind drop, wave crest reduction) and highlights safer operational windows.

### 3. Mathematical Predictive Geofencing
Given vessel position, speed (knots), and heading (degrees), ORCA projects course vectors at 5, 10, 15, 30, and 60 minutes. If the vector intersects a restricted boundary, it triggers:
> *"⚠️ PREDICTIVE GEOFENCE: Course vector projects entering 'Ratnagiri Defense Exercise Area' in approximately 22 minutes."*

### 4. Risk-Aware Navigation (Fastest vs. Safest)
Computes both:
- **Fastest Course (Direct)**: Shortest nautical distance, but may traverse high-swell surge zones or firing ranges.
- **Safest Course (Hazard Avoidance)**: Detours around rough wave clusters and restricted boundary buffers.

### 5. Multilingual Native Support without AI
Deterministic parsers and response templates support **English**, **Hindi (हिंदी)**, and **Marathi (मराठी)** natively while preserving exact numerical readings.

---

## 🚀 Quick Start Guide

### Prerequisites
- Python 3.12+
- Node.js 20+ & npm

### 1. Backend Setup
```bash
cd orca
# Run backend tests to verify agents, rules, and demo scenarios
python tests/test_demo_scenarios.py
python tests/test_api_endpoints.py

# Start FastAPI server on port 8000
python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```

### 2. Frontend Setup
```bash
cd orca/frontend
# Install packages (already done)
npm install

# Build production bundle
npm run build

# Start Vite dev server on port 5173
npm run dev
```

Visit **http://localhost:5173** to access the ORCA Marine Command Center.

---

## 🧪 Verified Demo Scenarios

| Query | Language | Parsed Intent | Verified Result |
| :--- | :---: | :---: | :--- |
| `"Is it safe to go fishing tomorrow at 6 AM near Ratnagiri?"` | EN | `MARINE_SAFETY` | Risk calculated (22-61/100), 12 agent steps, 5 evidence nodes |
| `"उद्या सकाळी रत्नागिरीजवळ मासेमारी करणे सुरक्षित आहे का?"` | MR | `MARINE_SAFETY` | Native Marathi response template with full data fusion |
| `"कल सुबह रत्नागिरी के पास मछली पकड़ना सुरक्षित है क्या?"` | HI | `MARINE_SAFETY` | Native Hindi response template with full data fusion |
| `"Where is the nearest favourable fishing zone?"` | EN | `PFZ_SEARCH` | Locates Ratnagiri NW PFZ Line (28.5 km, 295° bearing) |
| `"What if I leave at 4 AM instead of 6 AM?"` | EN | `WHAT_IF` | Scenario comparison with risk delta and factor differences |
| `"Find the safest route to this location."` | EN | `SAFE_ROUTE` | Safest vs Fastest route with hazard avoidance analysis |
| `"Check vessel course heading 270 at 12 knots"` | EN | `PREDICTIVE_GEOFENCE` | Predictive trajectory vector warns of boundary breach |
| `"Show me dangerous marine areas."` | EN | `HAZARD_MAP` | Overlays swell surge and squall polygons on map |
| `"Show restricted areas near me."` | EN | `GEOFENCE` | Highlights naval ranges, IMBL, and MPAs |

---

## 📁 Repository Structure

```
orca/
├── frontend/                     # React + Vite + Tailwind CSS + Leaflet
│   ├── src/
│   │   ├── components/           # Header, CommandPanel, RiskCard, WhatIf, PredictiveGeofence, Drawers
│   │   ├── map/                  # MarineMap.tsx (Leaflet interactive digital twin)
│   │   ├── services/             # api.ts (Backend communication)
│   │   ├── types/                # orca.ts (TypeScript interfaces)
│   │   ├── App.tsx               # Main Dashboard
│   │   └── main.tsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                      # FastAPI Python Application
│   ├── agents/                   # 11 Specialized Autonomous Agents
│   │   ├── supervisor.py         # Deterministic query router & pipeline orchestrator
│   │   ├── weather_agent.py
│   │   ├── ocean_agent.py
│   │   ├── satellite_agent.py
│   │   ├── pfz_agent.py
│   │   ├── alert_agent.py
│   │   ├── gis_agent.py
│   │   ├── boundary_agent.py
│   │   ├── risk_agent.py
│   │   ├── route_agent.py
│   │   └── evidence_agent.py
│   │
│   ├── providers/                # Normalized Data Provider Abstraction
│   │   ├── base_provider.py
│   │   ├── weather/weather_provider.py
│   │   ├── ocean/ocean_provider.py
│   │   ├── satellite/satellite_provider.py
│   │   ├── pfz/pfz_provider.py
│   │   ├── alerts/alert_provider.py
│   │   └── boundaries/boundary_provider.py
│   │
│   ├── engines/                  # Deterministic Algorithmic Engines
│   │   ├── risk_engine.py        # 0-100 score formula & agent consensus
│   │   ├── route_engine.py       # Fastest vs Safest routing
│   │   ├── geofence_engine.py    # Vector trajectory projection
│   │   ├── fishing_index.py      # Environmental favourability formula
│   │   └── temporal_engine.py    # What-If scenario delta
│   │
│   ├── parsers/                  # Regex, Gazetteer, Multilingual Tokenizer (No AI)
│   │   ├── query_parser.py
│   │   └── multilingual_dict.py
│   │
│   ├── templates/                # Structured Response Generation
│   │   └── response_templates.py
│   │
│   ├── schemas/                  # Pydantic Schemas
│   │   └── marine_schemas.py
│   │
│   ├── api/                      # REST Endpoints
│   │   └── routes.py
│   └── main.py
│
├── data/                         # Verified Public Datasets & GeoJSON
│   ├── geojson/
│   │   ├── restricted_zones.geojson   # IMBL, MPAs, Naval firing corridors
│   │   ├── pfz_advisories.geojson     # Official INCOIS PFZ records
│   │   └── marine_hazards.geojson     # Swell surges, squalls, lightning
│   └── ports_gazetteer.json           # 20+ Indian coastal ports & coordinates
│
├── tests/
│   ├── test_demo_scenarios.py         # Verification of 10 hackathon scenarios
│   └── test_api_endpoints.py          # Verification of all 13 REST endpoints
│
├── .env.example
├── .gitignore
└── README.md
```
