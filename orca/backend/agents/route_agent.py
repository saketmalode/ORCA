import time
from typing import Dict, Any
from backend.agents.base_agent import BaseAgent
from backend.engines.route_engine import RouteEngine

class RouteAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="ROUTE AGENT",
            role="Calculates risk-aware marine routes, evaluating distance vs hazard avoidance."
        )
        self.engine = RouteEngine()

    async def execute(self, context: Dict[str, Any]) -> Dict[str, Any]:
        t0 = time.time()
        origin_lat = context.get("latitude", 16.9902)
        origin_lon = context.get("longitude", 73.3120)

        # Destination defaults to nearest PFZ or offshore 30km point
        dest = context.get("destination")
        if dest:
            dest_lat = dest["lat"]
            dest_lon = dest["lon"]
        else:
            pfz = context.get("nearest_pfz")
            if pfz and pfz.get("coordinates") and len(pfz["coordinates"]) > 0:
                first_pt = pfz["coordinates"][0]
                dest_lon = first_pt[0]
                dest_lat = first_pt[1]
            else:
                dest_lat = origin_lat + 0.25
                dest_lon = origin_lon - 0.35

        hazards = context.get("hazards", [])
        boundaries = context.get("boundaries", [])

        route_result = self.engine.plan_route(
            origin_lat=origin_lat,
            origin_lon=origin_lon,
            dest_lat=dest_lat,
            dest_lon=dest_lon,
            hazard_features=hazards,
            boundary_features=boundaries
        )

        elapsed = round((time.time() - t0) * 1000, 2)
        return {
            "agent_name": self.name,
            "status": "COMPLETED",
            "execution_time_ms": elapsed,
            "data": route_result,
            "summary": f"Fastest: {route_result['fastest_route_km']} km [{route_result['fastest_risk_level']}] vs Safest: {route_result['safest_route_km']} km [{route_result['safest_risk_level']}]"
        }
