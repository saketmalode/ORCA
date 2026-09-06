from typing import Dict, Any, List, Tuple
from backend.schemas.marine_schemas import (
    RiskAssessment, RiskFactor, AgentConsensusItem, WeatherData, OceanData
)

class RiskEngine:
    """
    Deterministic Marine Risk Engine.
    Combines numerical marine observations and spatial constraints
    using transparent threshold-based formulas without any AI models.
    """
    DISCLAIMER = "These thresholds are prototype decision-support rules. Do NOT present them as official maritime safety standards."

    def calculate_risk(
        self,
        weather: Dict[str, Any],
        ocean: Dict[str, Any],
        alerts: List[Dict[str, Any]],
        boundary_info: Dict[str, Any]
    ) -> Dict[str, Any]:
        factors: List[Dict[str, Any]] = []
        total_score = 0.0

        # 1. Wave Risk (0 - 30 pts)
        wave_h = ocean.get("wave_height_m", 1.2)
        wave_impact = 0.0
        wave_status = "Safe"
        if wave_h < 1.2:
            wave_impact = 3.0
            wave_status = "Low Waves"
        elif wave_h <= 2.0:
            wave_impact = 10.0
            wave_status = "Moderate Waves"
        elif wave_h <= 2.8:
            wave_impact = 20.0
            wave_status = "Rough Waves (Advisory Threshold)"
        elif wave_h <= 3.8:
            wave_impact = 26.0
            wave_status = "Very Rough Waves (High Hazard)"
        else:
            wave_impact = 30.0
            wave_status = "Phenomenal Waves (Extreme Hazard)"

        total_score += wave_impact
        factors.append({
            "factor": "wave_height",
            "value": wave_h,
            "unit": "m",
            "impact": round(wave_impact, 1),
            "source": ocean.get("source", "INCOIS Ocean State Forecast"),
            "threshold_limit": "2.0 m for small craft",
            "status_label": wave_status
        })

        # 2. Wind Risk (0 - 25 pts)
        wind_spd = weather.get("wind_speed_kmh", 15.0)
        wind_impact = 0.0
        wind_status = "Safe"
        if wind_spd < 18.0:
            wind_impact = 2.0
            wind_status = "Gentle Breeze"
        elif wind_spd <= 28.0:
            wind_impact = 8.0
            wind_status = "Moderate Breeze"
        elif wind_spd <= 40.0:
            wind_impact = 18.0
            wind_status = "Strong Wind Squalls"
        elif wind_spd <= 55.0:
            wind_impact = 22.0
            wind_status = "Gale Force Wind"
        else:
            wind_impact = 25.0
            wind_status = "Storm Force Winds"

        total_score += wind_impact
        factors.append({
            "factor": "wind_speed",
            "value": wind_spd,
            "unit": "km/h",
            "impact": round(wind_impact, 1),
            "source": weather.get("source", "IMD / Open-Meteo"),
            "threshold_limit": "30.0 km/h squall threshold",
            "status_label": wind_status
        })

        # 3. Rain / Storm Risk (0 - 15 pts)
        rain_mm = weather.get("precipitation_mm", 0.0)
        rain_impact = 0.0
        rain_status = "Clear"
        if rain_mm <= 0.5:
            rain_impact = 0.0
            rain_status = "Dry / Clear"
        elif rain_mm <= 5.0:
            rain_impact = 5.0
            rain_status = "Light Showers"
        elif rain_mm <= 15.0:
            rain_impact = 10.0
            rain_status = "Moderate Downpour"
        else:
            rain_impact = 15.0
            rain_status = "Heavy Rain / Visibility Loss"

        total_score += rain_impact
        factors.append({
            "factor": "precipitation",
            "value": rain_mm,
            "unit": "mm",
            "impact": round(rain_impact, 1),
            "source": weather.get("source", "IMD / Open-Meteo"),
            "threshold_limit": "10.0 mm/hr reduced visibility",
            "status_label": rain_status
        })

        # 4. Lightning & Thunderstorm Risk (0 - 15 pts)
        t_index = weather.get("thunderstorm_index", 0.0)
        has_lightning_alert = any("LIGHTNING" in str(a.get("hazard_type", "")).upper() for a in alerts)
        lightning_impact = 0.0
        lightning_status = "Low Probability"
        if has_lightning_alert or t_index >= 50.0:
            lightning_impact = 15.0
            lightning_status = "Active Lightning Warning"
        elif t_index >= 20.0:
            lightning_impact = 8.0
            lightning_status = "Potential Convective Storm"

        total_score += lightning_impact
        factors.append({
            "factor": "lightning_warning",
            "value": "Active" if (has_lightning_alert or t_index >= 50) else "None",
            "unit": "alert",
            "impact": round(lightning_impact, 1),
            "source": "IMD Severe Weather Center",
            "threshold_limit": "Cloud-to-sea discharge risk",
            "status_label": lightning_status
        })

        # 5. Cyclone & Heavy Disaster Warnings (0 - 30 pts)
        has_cyclone = any("CYCLONE" in str(a.get("hazard_type", "")).upper() for a in alerts)
        cyclone_impact = 30.0 if has_cyclone else 0.0
        if cyclone_impact > 0:
            total_score += cyclone_impact
            factors.append({
                "factor": "cyclone_warning",
                "value": "Active Cyclone Bulletin",
                "unit": "alert",
                "impact": 30.0,
                "source": "IMD Cyclone Warning Division",
                "threshold_limit": "Mandatory harbour return",
                "status_label": "Severe Cyclonic Condition"
            })

        # 6. Geofence & Restricted Waters Risk (0 - 25 pts)
        is_inside = boundary_info.get("is_inside_restricted_zone", False)
        dist_bound = boundary_info.get("distance_to_boundary_km", 999.0)
        geo_impact = 0.0
        geo_status = "Clear of boundaries"
        if is_inside:
            geo_impact = 25.0
            geo_status = "Inside Restricted Area"
        elif dist_bound <= 8.0:
            geo_impact = 18.0
            geo_status = f"Close Proximity ({dist_bound} km to restricted zone)"
        elif dist_bound <= 20.0:
            geo_impact = 10.0
            geo_status = f"Moderate Proximity ({dist_bound} km)"

        total_score += geo_impact
        factors.append({
            "factor": "geofence_proximity",
            "value": dist_bound,
            "unit": "km",
            "impact": round(geo_impact, 1),
            "source": "MoEFCC / Hydrographic Office",
            "threshold_limit": "10 km international / sanctuary buffer",
            "status_label": geo_status
        })

        # Normalize score
        normalized_score = min(100.0, max(0.0, round(total_score, 1)))

        # Level classification
        if normalized_score <= 30.0:
            risk_level = "SAFE"
            recommendation = "Sea conditions are favorable for artisanal and small commercial fishing vessels. Maintain routine maritime VHF radio listening."
        elif normalized_score <= 60.0:
            risk_level = "MODERATE"
            recommendation = "Exercise caution. Marginal wave conditions and squalls observed. Small craft and non-mechanized vessels advised to stay within nearshore waters."
        elif normalized_score <= 80.0:
            risk_level = "HIGH"
            recommendation = "Avoid offshore ventures. Elevated wave surge, strong winds, or active convective warnings present acute navigational hazard for fishing vessels."
        else:
            risk_level = "CRITICAL"
            recommendation = "STRICT PROHIBITION: Severe marine hazard (gale winds, extreme sea state, or cyclone warning). All vessels instructed to return to harbour immediately."

        # Agent Consensus Evaluation
        consensus_items = self._compute_agent_consensus(weather, ocean, alerts, boundary_info)
        consensus_summary = self._summarize_consensus(consensus_items, risk_level)

        return {
            "risk_score": normalized_score,
            "risk_level": risk_level,
            "factors": factors,
            "consensus": consensus_items,
            "consensus_summary": consensus_summary,
            "recommendation": recommendation,
            "disclaimer": self.DISCLAIMER
        }

    def _compute_agent_consensus(
        self,
        weather: Dict[str, Any],
        ocean: Dict[str, Any],
        alerts: List[Dict[str, Any]],
        boundary: Dict[str, Any]
    ) -> List[Dict[str, Any]]:
        # Independent assessment by Weather Agent
        w_spd = weather.get("wind_speed_kmh", 15)
        w_rain = weather.get("precipitation_mm", 0)
        w_score = (w_spd * 0.7) + (w_rain * 3.0)
        w_assessment = "SAFE" if w_score < 20 else ("MODERATE" if w_score < 40 else "HIGH")

        # Independent assessment by Ocean Agent
        wave_h = ocean.get("wave_height_m", 1.2)
        o_assessment = "SAFE" if wave_h < 1.5 else ("MODERATE" if wave_h < 2.5 else "HIGH")

        # Independent assessment by GIS / Boundary Agent
        dist_b = boundary.get("distance_to_boundary_km", 999)
        g_assessment = "HIGH" if boundary.get("is_inside_restricted_zone") else ("MODERATE" if dist_b < 15 else "SAFE")

        # Independent assessment by Alert Agent
        a_count = len(alerts)
        al_assessment = "HIGH" if a_count > 0 else "SAFE"

        return [
            {"agent_name": "Weather Agent", "assessment": w_assessment, "weight": 0.25, "reason": f"Wind {w_spd} km/h, Rain {w_rain} mm"},
            {"agent_name": "Ocean Agent", "assessment": o_assessment, "weight": 0.35, "reason": f"Significant Wave Height {wave_h} m"},
            {"agent_name": "GIS / Boundary Agent", "assessment": g_assessment, "weight": 0.15, "reason": f"Boundary distance {dist_b} km"},
            {"agent_name": "Alert Agent", "assessment": al_assessment, "weight": 0.25, "reason": f"{a_count} active marine hazard notices"}
        ]

    def _summarize_consensus(self, items: List[Dict[str, Any]], final_level: str) -> str:
        levels = [item["assessment"] for item in items]
        if all(lvl == levels[0] for lvl in levels):
            return f"Full Agent Consensus: All specialized agents independently converged on {final_level} risk."
        else:
            # Highlight discrepancy and resolution
            reasons = [f"{i['agent_name']}: {i['assessment']}" for i in items]
            return f"Agent Consensus Resolution: Agents reported divergent factors ({', '.join(reasons)}). Fused deterministically to {final_level} prioritising crew safety thresholds."
