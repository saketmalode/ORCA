import time
from typing import Dict, Any
from backend.agents.base_agent import BaseAgent
from backend.providers.alerts.alert_provider import AlertProvider

class AlertAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="MARINE ALERT AGENT",
            role="Correlates official IMD and INCOIS storm, high wave, and lightning disaster bulletins."
        )
        self.provider = AlertProvider()

    async def execute(self, context: Dict[str, Any]) -> Dict[str, Any]:
        t0 = time.time()
        lat = context.get("latitude", 16.9902)
        lon = context.get("longitude", 73.3120)

        active_alerts = self.provider.get_active_alerts(lat, lon)
        all_hazards = self.provider.get_all_hazards()

        # Severity breakdown
        severities = [a.get("severity", "LOW") for a in active_alerts]
        max_severity = "CRITICAL" if "CRITICAL" in severities else ("HIGH" if "HIGH" in severities else ("MODERATE" if "MODERATE" in severities else "LOW"))

        elapsed = round((time.time() - t0) * 1000, 2)
        return {
            "agent_name": self.name,
            "status": "COMPLETED",
            "execution_time_ms": elapsed,
            "data": {
                "active_alerts": active_alerts,
                "all_hazards": all_hazards,
                "max_severity": max_severity
            },
            "summary": f"{len(active_alerts)} active warnings intercepted (Peak Severity: {max_severity})"
        }
