import time
from typing import Dict, Any
from backend.agents.base_agent import BaseAgent
from backend.providers.weather.weather_provider import WeatherProvider

class WeatherAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="WEATHER AGENT",
            role="Retrieves meteorological forecasts, squall warnings, wind vectors, and convective indices."
        )
        self.provider = WeatherProvider()

    async def execute(self, context: Dict[str, Any]) -> Dict[str, Any]:
        t0 = time.time()
        lat = context.get("latitude", 16.9902)
        lon = context.get("longitude", 73.3120)
        target_iso = context.get("target_time_iso")

        weather_data = await self.provider.get_weather(lat, lon, target_iso)

        elapsed = round((time.time() - t0) * 1000, 2)
        return {
            "agent_name": self.name,
            "status": "COMPLETED",
            "execution_time_ms": elapsed,
            "data": weather_data,
            "summary": f"Wind {weather_data['wind_speed_kmh']} km/h ({weather_data['weather_condition']}), Gusts {weather_data['wind_gusts_kmh']} km/h"
        }
