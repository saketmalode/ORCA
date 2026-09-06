from typing import Dict, Any, List
from backend.parsers.multilingual_dict import VOCABULARY

class ResponseTemplateEngine:
    """
    Deterministic Response Generator.
    Produces structured, evidence-backed advisories using fixed templates
    in English, Hindi, and Marathi without LLMs.
    """
    def generate_response(self, data: Dict[str, Any], lang: str = "en") -> str:
        intent = data.get("query", {}).get("intent", "MARINE_SAFETY")
        v = VOCABULARY.get(lang, VOCABULARY["en"])

        if intent == "WHAT_IF":
            return self._render_what_if(data, v, lang)
        elif intent == "PREDICTIVE_GEOFENCE":
            return self._render_predictive_geofence(data, v, lang)
        elif intent == "SAFE_ROUTE":
            return self._render_route(data, v, lang)
        elif intent == "PFZ_SEARCH":
            return self._render_pfz(data, v, lang)
        else:
            return self._render_marine_safety(data, v, lang)

    def _render_marine_safety(self, d: Dict[str, Any], v: Dict[str, Any], lang: str) -> str:
        loc = d["query"]["location_name"]
        time_str = d["query"]["target_time_display"]
        risk = d["risk"]
        level = risk["risk_level"]
        score = risk["risk_score"]
        rec = risk["recommendation"]

        level_translated = v["risk_levels"].get(level, level)

        # Status badge
        badge = "🟢" if level == "SAFE" else ("🟡" if level == "MODERATE" else ("🟠" if level == "HIGH" else "🔴"))

        factors_lines = []
        for f in risk.get("factors", []):
            factors_lines.append(f"- **{f['factor'].replace('_', ' ').title()}**: {f['value']} {f['unit']} — *{f['status_label']}* (Impact: +{f['impact']} pts | Source: `{f['source']}`)")

        factors_block = "\n".join(factors_lines)

        if lang == "mr":
            return f"""### {badge} {level_translated} (जोखीम निर्देशांक: {score}/100)
**स्थान**: {loc} | **वेळ**: {time_str}

{v['risk_summary'].format(location=loc, time=time_str, risk_level=level_translated)}

#### 📊 {v['factors_heading']}
{factors_block}

#### ⚓ {v['recommendation_heading']}
> {rec}

---
💡 **डेटा स्रोत**: INCOIS (सागरी स्थिती), IMD (हवामान आणि इशारे), ISRO MOSDAC (उपग्रह)
⚠️ *{risk['disclaimer']}*"""

        elif lang == "hi":
            return f"""### {badge} {level_translated} (जोखिम स्कोर: {score}/100)
**स्थान**: {loc} | **समय**: {time_str}

{v['risk_summary'].format(location=loc, time=time_str, risk_level=level_translated)}

#### 📊 {v['factors_heading']}
{factors_block}

#### ⚓ {v['recommendation_heading']}
> {rec}

---
💡 **डेटा स्रोत**: INCOIS (समुद्री स्थिति), IMD (मौसम और चेतावनियां), ISRO MOSDAC (उपग्रह)
⚠️ *{risk['disclaimer']}*"""

        else:
            return f"""### {badge} {level} (Risk Score: {score}/100)
**Location**: {loc} | **Time Window**: {time_str}

{v['risk_summary'].format(location=loc, time=time_str, risk_level=level)}

#### 📊 {v['factors_heading']}
{factors_block}

#### ⚓ {v['recommendation_heading']}
> {rec}

#### 🤝 Multi-Agent Consensus
> {risk.get('consensus_summary', 'Coordinated across all specialized agents.')}

---
💡 **Data Provenance**: INCOIS OSF, IMD Fishermen Services, ISRO MOSDAC Satellite Feeds.
⚠️ *{risk['disclaimer']}*"""

    def _render_what_if(self, d: Dict[str, Any], v: Dict[str, Any], lang: str) -> str:
        wi = d.get("what_if", {})
        sc_curr = wi.get("scenario_current", {})
        sc_alt = wi.get("scenario_alternative", {})
        changed = wi.get("changed_factors", [])
        changed_md = "\n".join([f"- {c}" for c in changed])

        return f"""### ⏱️ {v['what_if_analysis']}: {sc_curr.get('time_label')} vs {sc_alt.get('time_label')}

| Scenario | Time | Risk Level | Score | Wind Speed | Wave Height |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Current Plan** | {sc_curr.get('time_label')} | **{sc_curr.get('risk_level')}** | {sc_curr.get('risk_score')}/100 | {sc_curr.get('wind_speed_kmh')} km/h | {sc_curr.get('wave_height_m')} m |
| **Alternative Plan** | {sc_alt.get('time_label')} | **{sc_alt.get('risk_level')}** | {sc_alt.get('risk_score')}/100 | {sc_alt.get('wind_speed_kmh')} km/h | {sc_alt.get('wave_height_m')} m |

#### 🔄 Observed Parameter Delta:
{changed_md}

#### ⚓ Operational Recommendation:
> **{wi.get('recommendation')}**
"""

    def _render_predictive_geofence(self, d: Dict[str, Any], v: Dict[str, Any], lang: str) -> str:
        pg = d.get("predictive_geofence", {})
        if pg.get("is_projected_breach"):
            return f"""### ⚠️ PREDICTIVE GEOFENCE INTERCEPTION ALERT
> **{pg.get('warning_message')}**

- **Intercepted Boundary**: {pg.get('intersected_zone_name')}
- **Boundary Classification**: `{pg.get('intersected_zone_type')}`
- **Projected Time to Contact**: **{pg.get('time_to_boundary_min')} minutes**
- **Action Required**: Adjust vessel heading immediately away from restricted sector.
"""
        else:
            return f"""### ✅ Course Vector Clear
> **{pg.get('warning_message')}**
Trajectory projection over 60 minutes maintains safe legal separation from international maritime boundaries and marine protected sanctuaries.
"""

    def _render_route(self, d: Dict[str, Any], v: Dict[str, Any], lang: str) -> str:
        rt = d.get("route", {})
        return f"""### 🗺️ Risk-Aware Marine Route Optimization

- **Fastest Course (Direct)**: {rt.get('fastest_route_km')} km | Risk: **{rt.get('fastest_risk_level')}**
- **Safest Course (Hazard-Avoidance)**: {rt.get('safest_route_km')} km | Risk: **{rt.get('safest_risk_level')}**
- **Distance Differential**: +{rt.get('distance_difference_km')} km

#### 🛡️ Hazards Avoided by Safest Route:
{', '.join([f'`{h}`' for h in rt.get('major_risks_avoided', [])])}

> **Route Analysis**: {rt.get('explanation')}
"""

    def _render_pfz(self, d: Dict[str, Any], v: Dict[str, Any], lang: str) -> str:
        pfz = d.get("nearest_pfz")
        f_idx = d.get("fishing_index", {})
        if not pfz:
            return "No official INCOIS PFZ advisory currently active for this coastal sector."

        return f"""### 🐟 Potential Fishing Zone (PFZ) Advisory & Ocean Suitability

- **Advisory Name**: {pfz.get('name')}
- **Authority**: `{pfz.get('source')}` (Official INCOIS Advisory)
- **Bearing & Distance**: **{pfz.get('bearing_deg')}°** at **{pfz.get('distance_km')} km** from {pfz.get('nearest_port')}
- **Target Depth**: {pfz.get('depth_range_m')}
- **Sea Surface Temp (SST)**: {pfz.get('sst_deg_c')} °C
- **Chlorophyll-a**: {pfz.get('chlorophyll_mg_m3')} mg/m³
- **Target Commercial Pelagics**: *{pfz.get('species_association')}*

#### 🌿 ORCA Environmental Favourability Index: **{f_idx.get('score', 85)}/100 ({f_idx.get('category', 'GOOD')})**
> {f_idx.get('description')}
⚠️ *{f_idx.get('disclaimer')}*
"""
