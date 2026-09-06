import time
from typing import Dict, Any
from backend.agents.base_agent import BaseAgent
from backend.providers.pfz.pfz_provider import PFZProvider
from backend.engines.fishing_index import FishingIndexEngine

class PFZAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="PFZ AGENT",
            role="Retrieves official INCOIS Potential Fishing Zone advisories and computes environmental favourability."
        )
        self.provider = PFZProvider()
        self.index_engine = FishingIndexEngine()

    async def execute(self, context: Dict[str, Any]) -> Dict[str, Any]:
        t0 = time.time()
        lat = context.get("latitude", 16.9902)
        lon = context.get("longitude", 73.3120)

        nearest_pfz = self.provider.get_nearest_pfz(lat, lon)
        all_pfz = self.provider.get_all_pfz()

        # Compute ORCA Environmental Favourability Index
        sst = nearest_pfz.get("sst_deg_c", 28.0) if nearest_pfz else 28.0
        chl = nearest_pfz.get("chlorophyll_mg_m3", 1.5) if nearest_pfz else 1.5
        pfz_dist = nearest_pfz.get("distance_km", 99.0) if nearest_pfz else 99.0
        risk_score = context.get("preliminary_risk", 40.0)

        f_index = self.index_engine.calculate_index(sst, chl, pfz_dist, risk_score)

        elapsed = round((time.time() - t0) * 1000, 2)
        pfz_name = nearest_pfz.get("name", "None") if nearest_pfz else "No active PFZ"
        return {
            "agent_name": self.name,
            "status": "COMPLETED",
            "execution_time_ms": elapsed,
            "data": {
                "official_advisory": nearest_pfz,
                "all_advisories": all_pfz,
                "environmental_index": f_index
            },
            "summary": f"Official PFZ: {pfz_name} ({pfz_dist} km) | ORCA Index: {f_index['score']}/100 [{f_index['category']}]"
        }
