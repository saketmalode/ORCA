import time
from typing import Dict, Any
from backend.agents.base_agent import BaseAgent
from backend.providers.boundaries.boundary_provider import BoundaryProvider
from backend.engines.geofence_engine import GeofenceEngine

class BoundaryAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="BOUNDARY AGENT",
            role="Audits proximity to International Maritime Boundaries, MPAs, and restricted naval zones."
        )
        self.provider = BoundaryProvider()
        self.geofence_engine = GeofenceEngine()

    async def execute(self, context: Dict[str, Any]) -> Dict[str, Any]:
        t0 = time.time()
        lat = context.get("latitude", 16.9902)
        lon = context.get("longitude", 73.3120)
        speed = context.get("vessel_speed_knots", 10.0)
        heading = context.get("vessel_heading_deg", 270.0)

        position_check = self.provider.check_position(lat, lon)
        all_boundaries = self.provider.get_all_boundaries()

        # Run predictive trajectory geofence check
        predictive_result = self.geofence_engine.check_predictive_geofence(
            lat, lon, heading, speed, all_boundaries
        )

        elapsed = round((time.time() - t0) * 1000, 2)
        closest = position_check.get("closest_zone")
        closest_str = f"{closest['name']} ({closest['distance_km']} km)" if closest else "No restricted zone within 100km"

        return {
            "agent_name": self.name,
            "status": "COMPLETED",
            "execution_time_ms": elapsed,
            "data": {
                "position_check": position_check,
                "predictive_geofence": predictive_result,
                "all_boundaries": all_boundaries
            },
            "summary": f"Closest Boundary: {closest_str} | Projected Breach: {'YES' if predictive_result['is_projected_breach'] else 'NO'}"
        }
