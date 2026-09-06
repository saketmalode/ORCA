import time
from typing import Dict, Any
from backend.agents.base_agent import BaseAgent
from backend.engines.risk_engine import RiskEngine

class RiskAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="RISK AGENT",
            role="Performs deterministic multi-factor data fusion and evaluates cross-agent consensus."
        )
        self.engine = RiskEngine()

    async def execute(self, context: Dict[str, Any]) -> Dict[str, Any]:
        t0 = time.time()
        weather = context.get("weather", {})
        ocean = context.get("ocean", {})
        alerts = context.get("alerts", [])
        boundary_info = context.get("boundary_info", {})

        risk_assessment = self.engine.calculate_risk(
            weather=weather,
            ocean=ocean,
            alerts=alerts,
            boundary_info=boundary_info
        )

        elapsed = round((time.time() - t0) * 1000, 2)
        return {
            "agent_name": self.name,
            "status": "COMPLETED",
            "execution_time_ms": elapsed,
            "data": risk_assessment,
            "summary": f"Risk Score: {risk_assessment['risk_score']}/100 [{risk_assessment['risk_level']}] — {len(risk_assessment['factors'])} factors fused"
        }
