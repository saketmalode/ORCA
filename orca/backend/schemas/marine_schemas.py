from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field
from datetime import datetime

class LocationPoint(BaseModel):
    name: str
    latitude: float
    longitude: float
    state: Optional[str] = None
    zone: Optional[str] = None

class NormalizedObservation(BaseModel):
    source: str
    retrieved_at: str
    observation_time: str
    location: Dict[str, float]
    parameter: str
    value: float
    unit: str
    quality: str = "available"
    status: str = "LIVE"  # LIVE, CACHED, UNAVAILABLE, DEMO
    source_url: str = ""

class WeatherData(BaseModel):
    temperature_c: float
    wind_speed_kmh: float
    wind_gusts_kmh: float
    wind_direction_deg: float
    precipitation_mm: float
    pressure_hpa: float
    thunderstorm_index: float
    weather_condition: str
    forecast_timeline: List[Dict[str, Any]] = []
    source: str = "Open-Meteo Weather / IMD"
    status: str = "LIVE"
    retrieved_at: str = ""

class OceanData(BaseModel):
    wave_height_m: float
    wave_period_s: float
    wave_direction_deg: float
    swell_height_m: float
    swell_period_s: float
    sea_surface_temp_c: float
    current_speed_knots: float = 0.8
    sea_state: str
    sea_state_code: int
    forecast_timeline: List[Dict[str, Any]] = []
    source: str = "Open-Meteo Marine / INCOIS"
    status: str = "LIVE"
    retrieved_at: str = ""

class SatelliteLayerPoint(BaseModel):
    latitude: float
    longitude: float
    sst_c: float
    chlorophyll_mg_m3: float
    thermal_gradient_index: float

class PFZAdvisory(BaseModel):
    id: str
    name: str
    nearest_port: str
    bearing_deg: float
    distance_km: float
    depth_range_m: str
    sst_deg_c: float
    chlorophyll_mg_m3: float
    favourability_score: float
    advisory_type: str = "OFFICIAL_INCOIS_PFZ"
    species_association: str
    source: str = "INCOIS PFZ Advisory"
    valid_until: str
    coordinates: List[List[float]] = []

class MarineAlert(BaseModel):
    id: str
    name: str
    hazard_type: str
    severity: str  # LOW, MODERATE, HIGH, CRITICAL
    description: str
    issued_by: str
    valid_until: str
    polygon: List[List[float]] = []

class RiskFactor(BaseModel):
    factor: str
    value: Any
    unit: str
    impact: float
    source: str
    threshold_limit: Optional[str] = None
    status_label: str = "Normal"

class AgentConsensusItem(BaseModel):
    agent_name: str
    assessment: str  # SAFE, MODERATE, HIGH, CRITICAL
    weight: float
    reason: str

class RiskAssessment(BaseModel):
    risk_score: float  # 0 - 100
    risk_level: str    # SAFE, MODERATE, HIGH, CRITICAL
    factors: List[RiskFactor] = []
    consensus: List[AgentConsensusItem] = []
    consensus_summary: str = ""
    recommendation: str = ""
    disclaimer: str = "Prototype decision-support indicator. Not an official maritime safety standard."

class RouteWaypoint(BaseModel):
    lat: float
    lon: float
    name: Optional[str] = None

class RouteResult(BaseModel):
    origin: Dict[str, float]
    destination: Dict[str, float]
    fastest_route_km: float
    safest_route_km: float
    distance_difference_km: float
    fastest_risk_level: str
    safest_risk_level: str
    major_risks_avoided: List[str]
    fastest_waypoints: List[List[float]]
    safest_waypoints: List[List[float]]
    explanation: str

class WhatIfScenario(BaseModel):
    time_label: str
    timestamp: str
    risk_score: float
    risk_level: str
    wind_speed_kmh: float
    wave_height_m: float
    precipitation_mm: float
    active_alerts: int

class WhatIfResult(BaseModel):
    scenario_current: WhatIfScenario
    scenario_alternative: WhatIfScenario
    risk_delta: float
    changed_factors: List[str]
    recommendation: str

class TrajectoryPoint(BaseModel):
    time_minutes: int
    lat: float
    lon: float

class PredictiveGeofenceResult(BaseModel):
    is_projected_breach: bool
    time_to_boundary_min: Optional[int] = None
    intersected_zone_name: Optional[str] = None
    intersected_zone_type: Optional[str] = None
    warning_message: str
    trajectory: List[TrajectoryPoint] = []

class FishingOpportunityIndex(BaseModel):
    score: float
    category: str  # LOW, MODERATE, GOOD, HIGH
    sst_c: float
    chlorophyll_mg_m3: float
    nearest_pfz_distance_km: float
    marine_risk_penalty: float
    description: str
    disclaimer: str = "Prototype environmental favourability indicator. NOT guaranteed fish abundance prediction."

class EvidenceItem(BaseModel):
    parameter: str
    value_display: str
    source_name: str
    source_url: str
    retrieved_at: str
    status: str = "LIVE"
    node_id: str
    target_risk_factor: str

class AgentAuditStep(BaseModel):
    agent_name: str
    step_description: str
    status: str = "COMPLETED"  # RUNNING, COMPLETED, SKIPPED, FAILED
    execution_time_ms: float = 0.0
    details: Optional[str] = None

class QueryParseResult(BaseModel):
    language: str = "en"  # en, hi, mr
    intent: str
    raw_query: str
    location_id: Optional[str] = None
    location_name: str = "Ratnagiri"
    latitude: float = 16.9902
    longitude: float = 73.3120
    target_time_iso: str = ""
    target_time_display: str = "Now"
    scenario_time_iso: Optional[str] = None
    scenario_time_display: Optional[str] = None
    vessel_speed_knots: float = 10.0
    vessel_heading_deg: float = 270.0

class OrcaResponse(BaseModel):
    query: QueryParseResult
    timestamp_ist: str
    risk: RiskAssessment
    fishing_index: Optional[FishingOpportunityIndex] = None
    weather: Optional[WeatherData] = None
    ocean: Optional[OceanData] = None
    nearest_pfz: Optional[PFZAdvisory] = None
    alerts: List[MarineAlert] = []
    route: Optional[RouteResult] = None
    what_if: Optional[WhatIfResult] = None
    predictive_geofence: Optional[PredictiveGeofenceResult] = None
    agent_audit: List[AgentAuditStep] = []
    evidence_chain: List[EvidenceItem] = []
    formatted_response: str
