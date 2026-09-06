import time
from typing import Dict, Any
from backend.agents.base_agent import BaseAgent
from backend.providers.ocean.ocean_provider import OceanProvider

class OceanAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="OCEAN AGENT",
            role="Monitors significant wave heights, swell surge, periods, sea-state classification, and currents."
        )
        self.provider = OceanProvider()

    async def execute(self, context: Dict[str, Any]) -> Dict[str, Any]:
        t0 = time.time()
        lat = context.get("latitude", 16.9902)
        lon = context.get("longitude", 73.3120)
        target_iso = context.get("target_time_iso")

        ocean_data = await self.provider.get_ocean_state(lat, lon, target_iso)

        elapsed = round((time.time() - t0) * 1000, 2)
        return {
            "agent_name": self.name,
            "status": "COMPLETED",
            "execution_time_ms": elapsed,
            "data": ocean_data,
            "summary": f"Wave height {ocean_data['wave_height_m']} m, Period {ocean_data['wave_period_s']}s [{ocean_data['sea_state']}]"
        }
