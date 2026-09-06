from typing import Dict, Any, Optional

class FishingIndexEngine:
    """
    Deterministic Environmental Favourability Index.
    Combines oceanographic bio-physical indicators without generative AI.
    """
    DISCLAIMER = "Prototype environmental favourability indicator. NOT guaranteed fish abundance prediction."

    def calculate_index(
        self,
        sst_c: float,
        chlorophyll_mg_m3: float,
        nearest_pfz_dist_km: float,
        marine_risk_score: float
    ) -> Dict[str, Any]:
        base_score = 50.0

        # 1. SST Suitability (optimal range 26.8 - 29.2 °C for tropical pelagic species)
        if 27.0 <= sst_c <= 29.0:
            sst_points = 25.0
            sst_status = "Optimal Thermal Window"
        elif 26.0 <= sst_c < 27.0 or 29.0 < sst_c <= 30.2:
            sst_points = 15.0
            sst_status = "Moderate Thermal Gradient"
        else:
            sst_points = 5.0
            sst_status = "Suboptimal Water Temperature"

        # 2. Chlorophyll-a concentration (optimal 1.0 - 2.5 mg/m3)
        if 1.0 <= chlorophyll_mg_m3 <= 2.5:
            chl_points = 25.0
            chl_status = "High Phytoplankton Productivity (Upwelling Active)"
        elif 0.5 <= chlorophyll_mg_m3 < 1.0 or 2.5 < chlorophyll_mg_m3 <= 4.0:
            chl_points = 16.0
            chl_status = "Moderate Ocean Colour Bloom"
        else:
            chl_points = 6.0
            chl_status = "Oligotrophic (Low Biomass) or Turbid Waters"

        # 3. Official PFZ Proximity (INCOIS satellite front matching)
        if nearest_pfz_dist_km <= 15.0:
            pfz_points = 30.0
            pfz_status = f"Inside or adjacent to Official INCOIS PFZ line ({nearest_pfz_dist_km} km)"
        elif nearest_pfz_dist_km <= 35.0:
            pfz_points = 20.0
            pfz_status = f"Within accessible distance to PFZ ({nearest_pfz_dist_km} km)"
        elif nearest_pfz_dist_km <= 60.0:
            pfz_points = 10.0
            pfz_status = f"Distant from official PFZ ({nearest_pfz_dist_km} km)"
        else:
            pfz_points = 4.0
            pfz_status = "No official PFZ advisory nearby"

        # 4. Marine Risk Penalty (High waves and squalls disperse schools and impair gear deployment)
        risk_penalty = 0.0
        if marine_risk_score > 70.0:
            risk_penalty = 35.0
        elif marine_risk_score > 50.0:
            risk_penalty = 20.0
        elif marine_risk_score > 30.0:
            risk_penalty = 8.0

        raw_score = sst_points + chl_points + pfz_points - risk_penalty + 20.0
        final_score = min(100.0, max(5.0, round(raw_score, 1)))

        if final_score <= 30.0:
            category = "LOW"
            desc = "Poor environmental conditions. Low chlorophyll or severe sea-state disrupts pelagic aggregation."
        elif final_score <= 60.0:
            category = "MODERATE"
            desc = "Fair environmental indicators. Marginal thermal fronts present with moderate oceanic suitability."
        elif final_score <= 80.0:
            category = "GOOD"
            desc = "Favourable SST gradient and chlorophyll concentration with acceptable navigation risk."
        else:
            category = "HIGH"
            desc = "Exceptional oceanic convergence zone: matching SST fronts, robust chlorophyll bloom, and active INCOIS PFZ."

        return {
            "score": final_score,
            "category": category,
            "sst_c": sst_c,
            "chlorophyll_mg_m3": chlorophyll_mg_m3,
            "nearest_pfz_distance_km": round(nearest_pfz_dist_km, 1),
            "marine_risk_penalty": round(risk_penalty, 1),
            "description": desc,
            "factors_summary": [
                f"SST ({sst_c}°C): {sst_status}",
                f"Chlorophyll ({chlorophyll_mg_m3} mg/m³): {chl_status}",
                f"PFZ Proximity: {pfz_status}",
                f"Risk Adjustment: -{risk_penalty} pts"
            ],
            "disclaimer": self.DISCLAIMER
        }
