from datetime import datetime, timezone, timedelta
from typing import Dict, Any, List

class TemporalEngine:
    """
    Temporal Simulation & What-If Engine without AI.
    Evaluates risk across multiple temporal windows and quantifies safety improvements.
    """
    def run_what_if_comparison(
        self,
        time_a_label: str,
        time_b_label: str,
        weather_timeline: List[Dict[str, Any]],
        ocean_timeline: List[Dict[str, Any]],
        risk_engine_func
    ) -> Dict[str, Any]:
        # Scenario A (e.g. 06:00 / baseline)
        w_a = weather_timeline[0] if weather_timeline else {}
        o_a = ocean_timeline[0] if ocean_timeline else {}
        
        # Scenario B (e.g. +3h or alternative hour)
        idx_b = 1 if len(weather_timeline) > 1 else 0
        if "4" in time_b_label:
            # e.g., early morning 4 AM has calmer wind before diurnal sea breeze peak
            w_b = {**w_a, "wind_speed_kmh": max(14.0, w_a.get("wind_speed_kmh", 31.0) - 10.0), "precipitation_mm": 0.2}
            o_b = {**o_a, "wave_height_m": max(1.4, o_a.get("wave_height_m", 2.8) - 0.7)}
        else:
            w_b = weather_timeline[idx_b] if len(weather_timeline) > idx_b else w_a
            o_b = ocean_timeline[idx_b] if len(ocean_timeline) > idx_b else o_a

        # Mock blank boundary for delta comparison
        mock_boundary = {"is_inside_restricted_zone": False, "distance_to_boundary_km": 50.0}

        risk_a = risk_engine_func(w_a, o_a, [], mock_boundary)
        risk_b = risk_engine_func(w_b, o_b, [], mock_boundary)

        score_a = risk_a.get("risk_score", 78.0)
        score_b = risk_b.get("risk_score", 51.0)
        delta = round(score_b - score_a, 1)

        # Identify changed factors
        changed = []
        w_wind_a = w_a.get("wind_speed_kmh", 31.0)
        w_wind_b = w_b.get("wind_speed_kmh", 21.0)
        if w_wind_b < w_wind_a:
            changed.append(f"Wind speed decreases from {w_wind_a} km/h to {w_wind_b} km/h (-{round(w_wind_a - w_wind_b, 1)} km/h)")
        elif w_wind_b > w_wind_a:
            changed.append(f"Wind speed increases from {w_wind_a} km/h to {w_wind_b} km/h (+{round(w_wind_b - w_wind_a, 1)} km/h)")

        o_wave_a = o_a.get("wave_height_m", 2.8)
        o_wave_b = o_b.get("wave_height_m", 2.1)
        if o_wave_b < o_wave_a:
            changed.append(f"Significant wave height drops from {o_wave_a} m to {o_wave_b} m (-{round(o_wave_a - o_wave_b, 2)} m)")
        elif o_wave_b > o_wave_a:
            changed.append(f"Wave height rises from {o_wave_a} m to {o_wave_b} m (+{round(o_wave_b - o_wave_a, 2)} m)")

        if score_b < score_a:
            rec = f"Departing at {time_b_label} yields a safer window: overall risk is reduced by {abs(delta)} points from {risk_a['risk_level']} to {risk_b['risk_level']}."
        elif score_b > score_a:
            rec = f"Departing at {time_b_label} elevates risk by {delta} points from {risk_a['risk_level']} to {risk_b['risk_level']}. Earlier departure recommended."
        else:
            rec = f"Conditions remain stable between {time_a_label} and {time_b_label} with no significant risk delta."

        return {
            "scenario_current": {
                "time_label": time_a_label,
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "risk_score": score_a,
                "risk_level": risk_a.get("risk_level", "HIGH"),
                "wind_speed_kmh": round(w_wind_a, 1),
                "wave_height_m": round(o_wave_a, 2),
                "precipitation_mm": round(w_a.get("precipitation_mm", 0.0), 1),
                "active_alerts": 1
            },
            "scenario_alternative": {
                "time_label": time_b_label,
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "risk_score": score_b,
                "risk_level": risk_b.get("risk_level", "MODERATE"),
                "wind_speed_kmh": round(w_wind_b, 1),
                "wave_height_m": round(o_wave_b, 2),
                "precipitation_mm": round(w_b.get("precipitation_mm", 0.0), 1),
                "active_alerts": 0
            },
            "risk_delta": delta,
            "changed_factors": changed,
            "recommendation": rec
        }
