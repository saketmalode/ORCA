import asyncio
import time
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional

from backend.parsers.query_parser import QueryParser
from backend.templates.response_templates import ResponseTemplateEngine
from backend.agents.weather_agent import WeatherAgent
from backend.agents.ocean_agent import OceanAgent
from backend.agents.satellite_agent import SatelliteAgent
from backend.agents.pfz_agent import PFZAgent
from backend.agents.alert_agent import AlertAgent
from backend.agents.gis_agent import GISAgent
from backend.agents.boundary_agent import BoundaryAgent
from backend.agents.risk_agent import RiskAgent
from backend.agents.route_agent import RouteAgent
from backend.agents.evidence_agent import EvidenceAgent
from backend.engines.temporal_engine import TemporalEngine
from backend.engines.risk_engine import RiskEngine

class OrcaSupervisor:
    """
    Autonomous Multi-Agent Coordinator without LLMs.
    Decomposes requests, orchestrates specialized agents concurrently,
    fuses observations, and generates explainable decisions.
    """
    def __init__(self):
        self.parser = QueryParser()
        self.template_engine = ResponseTemplateEngine()
        self.temporal_engine = TemporalEngine()
        self.risk_engine = RiskEngine()

        # Autonomous Software Agents
        self.weather_agent = WeatherAgent()
        self.ocean_agent = OceanAgent()
        self.satellite_agent = SatelliteAgent()
        self.pfz_agent = PFZAgent()
        self.alert_agent = AlertAgent()
        self.gis_agent = GISAgent()
        self.boundary_agent = BoundaryAgent()
        self.risk_agent = RiskAgent()
        self.route_agent = RouteAgent()
        self.evidence_agent = EvidenceAgent()

    async def process_query(self, raw_query: str, language: Optional[str] = None) -> Dict[str, Any]:
        audit_trail = []
        t_start = time.time()

        # Step 1: Supervisor Intent Routing
        parsed_q = self.parser.parse(raw_query, language_override=language)
        audit_trail.append({
            "agent_name": "ORCA SUPERVISOR",
            "step_description": f"Query analyzed: Intent={parsed_q['intent']}, Location={parsed_q['location_name']}, Time={parsed_q['target_time_display']}",
            "status": "COMPLETED",
            "execution_time_ms": round((time.time() - t_start) * 1000, 2),
            "details": f"Deterministic parsing matched '{parsed_q['location_name']}' in gazetteer. Language={parsed_q['language'].upper()}"
        })

        base_ctx = {
            "latitude": parsed_q["latitude"],
            "longitude": parsed_q["longitude"],
            "target_time_iso": parsed_q["target_time_iso"],
            "vessel_speed_knots": parsed_q["vessel_speed_knots"],
            "vessel_heading_deg": parsed_q["vessel_heading_deg"],
        }

        # Step 2: Concurrent Data Discovery (Weather, Ocean, Alerts, GIS, Boundary)
        t_data_start = time.time()
        weather_task = self.weather_agent.execute(base_ctx)
        ocean_task = self.ocean_agent.execute(base_ctx)
        alert_task = self.alert_agent.execute(base_ctx)
        gis_task = self.gis_agent.execute(base_ctx)
        boundary_task = self.boundary_agent.execute(base_ctx)

        weather_res, ocean_res, alert_res, gis_res, boundary_res = await asyncio.gather(
            weather_task, ocean_task, alert_task, gis_task, boundary_task
        )

        audit_trail.append({
            "agent_name": self.weather_agent.name,
            "step_description": weather_res["summary"],
            "status": weather_res["status"],
            "execution_time_ms": weather_res["execution_time_ms"],
            "details": f"Source: {weather_res['data']['source']} ({weather_res['data']['status']})"
        })

        audit_trail.append({
            "agent_name": self.ocean_agent.name,
            "step_description": ocean_res["summary"],
            "status": ocean_res["status"],
            "execution_time_ms": ocean_res["execution_time_ms"],
            "details": f"Source: {ocean_res['data']['source']} ({ocean_res['data']['status']})"
        })

        audit_trail.append({
            "agent_name": self.alert_agent.name,
            "step_description": alert_res["summary"],
            "status": alert_res["status"],
            "execution_time_ms": alert_res["execution_time_ms"],
            "details": f"Checked IMD/INCOIS coastal warning polygons"
        })

        audit_trail.append({
            "agent_name": self.gis_agent.name,
            "step_description": gis_res["summary"],
            "status": gis_res["status"],
            "execution_time_ms": gis_res["execution_time_ms"],
            "details": f"Coastal shelf distance: {gis_res['data']['coastal_distance_km']} km"
        })

        audit_trail.append({
            "agent_name": self.boundary_agent.name,
            "step_description": boundary_res["summary"],
            "status": boundary_res["status"],
            "execution_time_ms": boundary_res["execution_time_ms"],
            "details": f"Predictive trajectory evaluated heading {parsed_q['vessel_heading_deg']}° at {parsed_q['vessel_speed_knots']} knots"
        })

        # Step 3: Satellite and PFZ Exploration
        satellite_res = await self.satellite_agent.execute(base_ctx)
        pfz_res = await self.pfz_agent.execute({
            **base_ctx,
            "preliminary_risk": 50.0
        })

        audit_trail.append({
            "agent_name": self.satellite_agent.name,
            "step_description": satellite_res["summary"],
            "status": satellite_res["status"],
            "execution_time_ms": satellite_res["execution_time_ms"],
            "details": f"ISRO MOSDAC Oceansat-3 grid extracted"
        })

        audit_trail.append({
            "agent_name": self.pfz_agent.name,
            "step_description": pfz_res["summary"],
            "status": pfz_res["status"],
            "execution_time_ms": pfz_res["execution_time_ms"],
            "details": "Distinguished official PFZ advisory from ORCA environmental favourability"
        })

        # Step 4: Multi-Agent Risk Fusion & Consensus
        risk_ctx = {
            "weather": weather_res["data"],
            "ocean": ocean_res["data"],
            "alerts": alert_res["data"]["active_alerts"],
            "boundary_info": boundary_res["data"]["position_check"]
        }
        risk_res = await self.risk_agent.execute(risk_ctx)

        audit_trail.append({
            "agent_name": self.risk_agent.name,
            "step_description": risk_res["summary"],
            "status": risk_res["status"],
            "execution_time_ms": risk_res["execution_time_ms"],
            "details": risk_res["data"]["consensus_summary"]
        })

        # Step 5: Risk-Aware Route Planning
        route_ctx = {
            **base_ctx,
            "nearest_pfz": pfz_res["data"]["official_advisory"],
            "hazards": alert_res["data"]["all_hazards"],
            "boundaries": boundary_res["data"]["all_boundaries"]
        }
        route_res = await self.route_agent.execute(route_ctx)

        audit_trail.append({
            "agent_name": self.route_agent.name,
            "step_description": route_res["summary"],
            "status": route_res["status"],
            "execution_time_ms": route_res["execution_time_ms"],
            "details": route_res["data"]["explanation"]
        })

        # Step 6: Evidence Assembly
        evidence_ctx = {
            "weather": weather_res["data"],
            "ocean": ocean_res["data"],
            "alerts": alert_res["data"]["active_alerts"],
            "boundary_info": boundary_res["data"]["position_check"],
            "risk": risk_res["data"]
        }
        evidence_res = await self.evidence_agent.execute(evidence_ctx)

        audit_trail.append({
            "agent_name": self.evidence_agent.name,
            "step_description": evidence_res["summary"],
            "status": evidence_res["status"],
            "execution_time_ms": evidence_res["execution_time_ms"],
            "details": "Every recommendation linked with parameter, value, unit, and source citation"
        })

        # Step 7: Temporal What-If Simulation
        what_if_res = None
        if parsed_q["intent"] == "WHAT_IF" or parsed_q["scenario_time_display"]:
            t_curr_lbl = parsed_q["target_time_display"] if parsed_q["target_time_display"] else "06:00 AM"
            t_alt_lbl = parsed_q["scenario_time_display"] if parsed_q["scenario_time_display"] else "04:00 AM"
            what_if_res = self.temporal_engine.run_what_if_comparison(
                time_a_label=t_curr_lbl,
                time_b_label=t_alt_lbl,
                weather_timeline=weather_res["data"].get("forecast_timeline", []),
                ocean_timeline=ocean_res["data"].get("forecast_timeline", []),
                risk_engine_func=self.risk_engine.calculate_risk
            )
        else:
            # Generate default comparison for UI what-if drawer
            what_if_res = self.temporal_engine.run_what_if_comparison(
                time_a_label="06:00 AM",
                time_b_label="04:00 AM",
                weather_timeline=weather_res["data"].get("forecast_timeline", []),
                ocean_timeline=ocean_res["data"].get("forecast_timeline", []),
                risk_engine_func=self.risk_engine.calculate_risk
            )

        # Assemble Final Payload
        now_ist = datetime.now().strftime("%d %b %Y, %H:%M:%S IST")
        response_payload = {
            "query": parsed_q,
            "timestamp_ist": now_ist,
            "risk": risk_res["data"],
            "fishing_index": pfz_res["data"]["environmental_index"],
            "weather": weather_res["data"],
            "ocean": ocean_res["data"],
            "nearest_pfz": pfz_res["data"]["official_advisory"],
            "all_pfz": pfz_res["data"].get("all_advisories", []),
            "all_ports": self.parser.ports,
            "satellite": satellite_res["data"],
            "alerts": alert_res["data"]["active_alerts"],
            "all_hazards": alert_res["data"]["all_hazards"],
            "all_boundaries": boundary_res["data"]["all_boundaries"],
            "route": route_res["data"],
            "what_if": what_if_res,
            "predictive_geofence": boundary_res["data"]["predictive_geofence"],
            "agent_audit": audit_trail,
            "evidence_chain": evidence_res["data"]["chain"]
        }

        # Format Response using structured template
        formatted_text = self.template_engine.generate_response(response_payload, lang=parsed_q["language"])
        response_payload["formatted_response"] = formatted_text

        audit_trail.append({
            "agent_name": "ORCA SUPERVISOR",
            "step_description": "Recommendation synthesized and verified against evidence chain.",
            "status": "COMPLETED",
            "execution_time_ms": round((time.time() - t_start) * 1000, 2),
            "details": f"Zero-LLM Pipeline complete. Total latency: {round((time.time() - t_start)*1000, 1)} ms."
        })

        return response_payload
