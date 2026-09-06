import time
from typing import Dict, Any
from backend.agents.base_agent import BaseAgent
from backend.providers.satellite.satellite_provider import SatelliteProvider

class SatelliteAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="SATELLITE / ECOSYSTEM AGENT",
            role="Extracts satellite Earth Observation SST gradients, chlorophyll-a concentration, and thermal fronts."
        )
        self.provider = SatelliteProvider()

    async def execute(self, context: Dict[str, Any]) -> Dict[str, Any]:
        t0 = time.time()
        lat = context.get("latitude", 16.9902)
        lon = context.get("longitude", 73.3120)

        eco_point = self.provider.get_point_ecosystem(lat, lon)
        grid = self.provider.get_satellite_grid(lat, lon)

        elapsed = round((time.time() - t0) * 1000, 2)
        return {
            "agent_name": self.name,
            "status": "COMPLETED",
            "execution_time_ms": elapsed,
            "data": {
                "point": eco_point,
                "grid_sample_count": len(grid),
                "grid": grid
            },
            "summary": f"SST {eco_point['sst_c']} °C, Chlorophyll {eco_point['chlorophyll_mg_m3']} mg/m³ (Thermal front active)"
        }
