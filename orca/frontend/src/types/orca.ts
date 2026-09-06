export interface QueryParseResult {
  language: 'en' | 'hi' | 'mr';
  intent: string;
  raw_query: string;
  location_id?: string;
  location_name: string;
  latitude: number;
  longitude: number;
  target_time_iso: string;
  target_time_display: string;
  scenario_time_iso?: string;
  scenario_time_display?: string;
  vessel_speed_knots: number;
  vessel_heading_deg: number;
}

export interface RiskFactor {
  factor: string;
  value: any;
  unit: string;
  impact: number;
  source: string;
  threshold_limit?: string;
  status_label: string;
}

export interface AgentConsensusItem {
  agent_name: string;
  assessment: 'SAFE' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  weight: number;
  reason: string;
}

export interface RiskAssessment {
  risk_score: number;
  risk_level: 'SAFE' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  factors: RiskFactor[];
  consensus: AgentConsensusItem[];
  consensus_summary: string;
  recommendation: string;
  disclaimer: string;
}

export interface WeatherData {
  temperature_c: number;
  wind_speed_kmh: number;
  wind_gusts_kmh: number;
  wind_direction_deg: number;
  precipitation_mm: number;
  pressure_hpa: number;
  thunderstorm_index: number;
  weather_condition: string;
  forecast_timeline: Array<{
    offset_hours: number;
    label: string;
    time_iso: string;
    wind_speed_kmh: number;
    precipitation_mm: number;
    weather_code: number;
  }>;
  source: string;
  status: string;
  retrieved_at: string;
}

export interface OceanData {
  wave_height_m: number;
  wave_period_s: number;
  wave_direction_deg: number;
  swell_height_m: number;
  swell_period_s: number;
  sea_surface_temp_c: number;
  current_speed_knots: number;
  sea_state: string;
  sea_state_code: number;
  forecast_timeline: Array<{
    offset_hours: number;
    label: string;
    time_iso: string;
    wave_height_m: number;
    wave_period_s: number;
  }>;
  source: string;
  status: string;
  retrieved_at: string;
}

export interface PFZAdvisory {
  id: string;
  name: string;
  nearest_port: string;
  bearing_deg: number;
  distance_km: number;
  depth_range_m: string;
  sst_deg_c: number;
  chlorophyll_mg_m3: number;
  favourability_score: number;
  advisory_type: string;
  species_association: string;
  source: string;
  source_url?: string;
  status?: string;
  valid_until: string;
  coordinates: number[][];
}

export interface FishingOpportunityIndex {
  score: number;
  category: 'LOW' | 'MODERATE' | 'GOOD' | 'HIGH';
  sst_c: number;
  chlorophyll_mg_m3: number;
  nearest_pfz_distance_km: number;
  marine_risk_penalty: number;
  description: string;
  factors_summary: string[];
  disclaimer: string;
}

export interface MarineAlert {
  id: string;
  name: string;
  hazard_type: string;
  severity: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  description: string;
  issued_by: string;
  valid_until: string;
  is_direct_hit?: boolean;
  proximity_deg?: number;
  polygon: number[][];
}

export interface RouteResult {
  origin: { lat: number; lon: number };
  destination: { lat: number; lon: number };
  fastest_route_km: number;
  safest_route_km: number;
  distance_difference_km: number;
  fastest_risk_level: string;
  safest_risk_level: string;
  major_risks_avoided: string[];
  fastest_waypoints: number[][];
  safest_waypoints: number[][];
  explanation: string;
}

export interface WhatIfScenario {
  time_label: string;
  timestamp: string;
  risk_score: number;
  risk_level: string;
  wind_speed_kmh: number;
  wave_height_m: number;
  precipitation_mm: number;
  active_alerts: number;
}

export interface WhatIfResult {
  scenario_current: WhatIfScenario;
  scenario_alternative: WhatIfScenario;
  risk_delta: number;
  changed_factors: string[];
  recommendation: string;
}

export interface TrajectoryPoint {
  time_minutes: number;
  lat: number;
  lon: number;
}

export interface PredictiveGeofenceResult {
  is_projected_breach: boolean;
  time_to_boundary_min?: number;
  intersected_zone_name?: string;
  intersected_zone_type?: string;
  warning_message: string;
  trajectory: TrajectoryPoint[];
}

export interface AgentAuditStep {
  agent_name: string;
  step_description: string;
  status: 'COMPLETED' | 'RUNNING' | 'FAILED' | 'SKIPPED';
  execution_time_ms: number;
  details?: string;
}

export interface EvidenceItem {
  node_id: string;
  parameter: string;
  value_display: string;
  source_name: string;
  source_url: string;
  retrieved_at: string;
  status: string;
  target_risk_factor: string;
}

export interface OrcaResponse {
  query: QueryParseResult;
  timestamp_ist: string;
  risk: RiskAssessment;
  fishing_index?: FishingOpportunityIndex;
  weather?: WeatherData;
  ocean?: OceanData;
  nearest_pfz?: PFZAdvisory;
  all_pfz?: any[];
  all_ports?: Array<{
    id: string;
    name: string;
    state: string;
    lat: number;
    lon: number;
    zone: string;
    aliases?: string[];
  }>;
  satellite?: {
    point: any;
    grid: Array<{
      lat: number;
      lon: number;
      sst_c: number;
      chlorophyll_mg_m3: number;
      is_thermal_front: boolean;
    }>;
  };
  alerts: MarineAlert[];
  all_hazards: any[];
  all_boundaries: any[];
  route?: RouteResult;
  what_if?: WhatIfResult;
  predictive_geofence?: PredictiveGeofenceResult;
  agent_audit: AgentAuditStep[];
  evidence_chain: EvidenceItem[];
  formatted_response: string;
}
