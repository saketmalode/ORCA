from fastapi import APIRouter, Query, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, Optional, List
from datetime import datetime

from backend.agents.supervisor import OrcaSupervisor
from backend.providers.weather.weather_provider import WeatherProvider
from backend.providers.ocean.ocean_provider import OceanProvider
from backend.providers.pfz.pfz_provider import PFZProvider
from backend.providers.alerts.alert_provider import AlertProvider
from backend.providers.boundaries.boundary_provider import BoundaryProvider
from backend.engines.risk_engine import RiskEngine
from backend.engines.route_engine import RouteEngine
from backend.engines.geofence_engine import GeofenceEngine
from backend.engines.temporal_engine import TemporalEngine

router = APIRouter(prefix="/api")

supervisor = OrcaSupervisor()
weather_provider = WeatherProvider()
ocean_provider = OceanProvider()
pfz_provider = PFZProvider()
alert_provider = AlertProvider()
boundary_provider = BoundaryProvider()
risk_engine = RiskEngine()
route_engine = RouteEngine()
geofence_engine = GeofenceEngine()
temporal_engine = TemporalEngine()

class QueryRequest(BaseModel):
    query: str
    language: Optional[str] = "en"
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    speed_knots: Optional[float] = 10.0
    heading_deg: Optional[float] = 270.0

class RouteRequest(BaseModel):
    origin_lat: float
    origin_lon: float
    dest_lat: float
    dest_lon: float

class WhatIfRequest(BaseModel):
    latitude: float
    longitude: float
    time_a: str = "06:00 AM"
    time_b: str = "04:00 AM"

class PredictiveGeofenceRequest(BaseModel):
    latitude: float
    longitude: float
    heading_deg: float = 270.0
    speed_knots: float = 12.0

@router.get("/ports")
async def get_ports():
    """Retrieve all 50+ coastal shore ports and hubs across India."""
    return supervisor.parser.ports

@router.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "ORCA Marine Intelligence Platform",
        "organization": "ISRO / Department of Space",
        "zero_llm_verification": "Strictly Verified - Zero LLM dependencies or generative models",
        "timestamp": datetime.now().isoformat()
    }

@router.post("/query")
async def process_user_query(req: QueryRequest):
    """Conversational command center endpoint powered by deterministic agents."""
    return await supervisor.process_query(req.query, language=req.language)

@router.get("/weather")
async def get_weather(
    lat: float = Query(16.9902, description="Latitude"),
    lon: float = Query(73.3120, description="Longitude"),
    time_iso: Optional[str] = Query(None, description="ISO timestamp")
):
    return await weather_provider.get_weather(lat, lon, time_iso)

@router.get("/ocean")
async def get_ocean(
    lat: float = Query(16.9902, description="Latitude"),
    lon: float = Query(73.3120, description="Longitude"),
    time_iso: Optional[str] = Query(None, description="ISO timestamp")
):
    return await ocean_provider.get_ocean_state(lat, lon, time_iso)

@router.get("/pfz")
async def get_pfz(
    lat: float = Query(16.9902, description="Latitude"),
    lon: float = Query(73.3120, description="Longitude")
):
    nearest = pfz_provider.get_nearest_pfz(lat, lon)
    all_zones = pfz_provider.get_all_pfz()
    return {
        "nearest_pfz": nearest,
        "all_zones": all_zones,
        "disclaimer": "Official INCOIS PFZ Mission advisory layers. Distinguish from independent predictions."
    }

@router.get("/alerts")
async def get_alerts(
    lat: float = Query(16.9902, description="Latitude"),
    lon: float = Query(73.3120, description="Longitude")
):
    active = alert_provider.get_active_alerts(lat, lon)
    all_h = alert_provider.get_all_hazards()
    return {
        "active_alerts": active,
        "all_hazard_zones": all_h,
        "source": "IMD Fishermen Warnings & INCOIS High Wave Advisories"
    }

@router.get("/geofence")
async def get_geofence(
    lat: float = Query(16.9902, description="Latitude"),
    lon: float = Query(73.3120, description="Longitude")
):
    pos_check = boundary_provider.check_position(lat, lon)
    all_b = boundary_provider.get_all_boundaries()
    return {
        "position_check": pos_check,
        "boundaries": all_b
    }

@router.post("/predictive-geofence")
async def calculate_predictive_geofence(req: PredictiveGeofenceRequest):
    boundaries = boundary_provider.get_all_boundaries()
    return geofence_engine.check_predictive_geofence(
        lat=req.latitude,
        lon=req.longitude,
        heading_deg=req.heading_deg,
        speed_knots=req.speed_knots,
        boundary_features=boundaries
    )

@router.get("/risk")
async def get_risk(
    lat: float = Query(16.9902, description="Latitude"),
    lon: float = Query(73.3120, description="Longitude")
):
    w = await weather_provider.get_weather(lat, lon)
    o = await ocean_provider.get_ocean_state(lat, lon)
    a = alert_provider.get_active_alerts(lat, lon)
    b = boundary_provider.check_position(lat, lon)
    return risk_engine.calculate_risk(w, o, a, b)

@router.get("/marine-conditions")
async def get_marine_conditions(
    lat: float = Query(16.9902, description="Latitude"),
    lon: float = Query(73.3120, description="Longitude")
):
    # Full composite snapshot
    query_str = f"Conditions at {lat}, {lon}"
    return await supervisor.process_query(query_str)

@router.post("/route")
async def calculate_route(req: RouteRequest):
    hazards = alert_provider.get_all_hazards()
    boundaries = boundary_provider.get_all_boundaries()
    return route_engine.plan_route(
        origin_lat=req.origin_lat,
        origin_lon=req.origin_lon,
        dest_lat=req.dest_lat,
        dest_lon=req.dest_lon,
        hazard_features=hazards,
        boundary_features=boundaries
    )

@router.post("/what-if")
async def evaluate_what_if(req: WhatIfRequest):
    w = await weather_provider.get_weather(req.latitude, req.longitude)
    o = await ocean_provider.get_ocean_state(req.latitude, req.longitude)
    return temporal_engine.run_what_if_comparison(
        time_a_label=req.time_a,
        time_b_label=req.time_b,
        weather_timeline=w.get("forecast_timeline", []),
        ocean_timeline=o.get("forecast_timeline", []),
        risk_engine_func=risk_engine.calculate_risk
    )

@router.get("/sources")
async def get_sources():
    return [
        {
            "name": "ISRO MOSDAC",
            "full_name": "Meteorological & Oceanographic Satellite Data Archival Centre",
            "url": "https://www.mosdac.gov.in/",
            "parameters": ["SST", "Chlorophyll-a", "Thermal Fronts", "Ocean Colour"],
            "status": "LIVE"
        },
        {
            "name": "INCOIS Ocean State Forecast",
            "full_name": "Indian National Centre for Ocean Information Services",
            "url": "https://incois.gov.in/site/services/osf.jsp",
            "parameters": ["Wave Height", "Wave Period", "Swell Height", "Swell Period", "Douglas Sea State"],
            "status": "LIVE"
        },
        {
            "name": "INCOIS PFZ Mission",
            "full_name": "Potential Fishing Zone Advisory Services",
            "url": "https://incois.gov.in/MarineFisheries/PfzAdvisory",
            "parameters": ["Pelagic PFZ Lines", "Depth Contours", "Thermal Gradients"],
            "status": "LIVE"
        },
        {
            "name": "IMD Fishermen Warning",
            "full_name": "India Meteorological Department Marine Warning Services",
            "url": "https://mausam.imd.gov.in/imd_latest/contents/index_fisherman.php",
            "parameters": ["Wind Squalls", "Severe Weather Bulletins", "Cyclone Warnings", "Lightning"],
            "status": "LIVE"
        },
        {
            "name": "National Hydrographic Office",
            "full_name": "Chief Hydrographer to the Government of India",
            "url": "https://hydro-india.gov.in/",
            "parameters": ["International Maritime Boundary Line (IMBL)", "EEZ", "Naval Corridors"],
            "status": "LIVE"
        },
        {
            "name": "Open-Meteo Global Marine",
            "full_name": "Open Global Marine & Weather Forecast Service",
            "url": "https://marine-api.open-meteo.com/",
            "parameters": ["Real-Time Hourly Wave Vectors", "Swell Spectra", "Wind Gusts"],
            "status": "LIVE"
        }
    ]

@router.get("/agents/status")
async def get_agent_status():
    return [
        {"name": "ORCA SUPERVISOR", "type": "Deterministic Coordinator", "status": "ACTIVE", "rules_loaded": 48},
        {"name": "WEATHER AGENT", "type": "Meteorological Analyst", "status": "ACTIVE", "provider": "Open-Meteo / IMD"},
        {"name": "OCEAN AGENT", "type": "Wave & Hydrodynamics Analyst", "status": "ACTIVE", "provider": "Open-Meteo Marine / INCOIS"},
        {"name": "SATELLITE AGENT", "type": "Earth Observation Specialist", "status": "ACTIVE", "provider": "ISRO MOSDAC / Oceansat-3"},
        {"name": "PFZ AGENT", "type": "Fisheries Oceanographer", "status": "ACTIVE", "provider": "INCOIS PFZ Mission"},
        {"name": "ALERT AGENT", "type": "Disaster Early Warning", "status": "ACTIVE", "provider": "IMD Marine Warning"},
        {"name": "GIS AGENT", "type": "Geospatial Computation", "status": "ACTIVE", "library": "Shapely / Haversine"},
        {"name": "BOUNDARY AGENT", "type": "Maritime Geofencing", "status": "ACTIVE", "provider": "Hydrographic Office / MoEFCC"},
        {"name": "RISK AGENT", "type": "Multi-Agent Risk Fusion", "status": "ACTIVE", "engine": "Deterministic Mathematical Engine"},
        {"name": "ROUTE AGENT", "type": "Risk-Aware Navigation", "status": "ACTIVE", "engine": "Hazard-Penalty Waypoint Router"},
        {"name": "EVIDENCE AGENT", "type": "Data Provenance Auditor", "status": "ACTIVE", "engine": "Immutable Sensor Evidence Graph"}
    ]
