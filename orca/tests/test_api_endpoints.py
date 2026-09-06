import asyncio
import sys
from pathlib import Path
from fastapi.testclient import TestClient

ROOT_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT_DIR))

from backend.main import app

client = TestClient(app)

def test_health():
    res = client.get("/api/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "healthy"
    assert "Zero LLM" in data["zero_llm_verification"]
    print("✓ Health Check Passed")

def test_sources():
    res = client.get("/api/sources")
    assert res.status_code == 200
    sources = res.json()
    assert len(sources) >= 5
    print(f"✓ Data Sources Verified ({len(sources)} public providers)")

def test_agents_status():
    res = client.get("/api/agents/status")
    assert res.status_code == 200
    agents = res.json()
    assert len(agents) >= 10
    print(f"✓ Agents Status Verified ({len(agents)} autonomous software agents active)")

def test_weather():
    res = client.get("/api/weather?lat=16.9902&lon=73.3120")
    assert res.status_code == 200
    data = res.json()
    assert "wind_speed_kmh" in data
    assert "status" in data
    print(f"✓ Weather Endpoint Passed: Wind {data['wind_speed_kmh']} km/h ({data['status']})")

def test_ocean():
    res = client.get("/api/ocean?lat=16.9902&lon=73.3120")
    assert res.status_code == 200
    data = res.json()
    assert "wave_height_m" in data
    assert "sea_state" in data
    print(f"✓ Ocean Endpoint Passed: Wave {data['wave_height_m']} m [{data['sea_state']}]")

def test_pfz():
    res = client.get("/api/pfz?lat=16.9902&lon=73.3120")
    assert res.status_code == 200
    data = res.json()
    assert "nearest_pfz" in data
    print(f"✓ PFZ Endpoint Passed: {data['nearest_pfz']['name']}")

def test_alerts():
    res = client.get("/api/alerts?lat=16.9902&lon=73.3120")
    assert res.status_code == 200
    data = res.json()
    assert "active_alerts" in data
    print(f"✓ Alerts Endpoint Passed: {len(data['active_alerts'])} alerts intercepted")

def test_geofence():
    res = client.get("/api/geofence?lat=16.9902&lon=73.3120")
    assert res.status_code == 200
    data = res.json()
    assert "position_check" in data
    print("✓ Geofence Endpoint Passed")

def test_predictive_geofence():
    res = client.post("/api/predictive-geofence", json={
        "latitude": 17.00,
        "longitude": 73.22,
        "heading_deg": 270.0,
        "speed_knots": 12.0
    })
    assert res.status_code == 200
    data = res.json()
    assert "is_projected_breach" in data
    print(f"✓ Predictive Geofence Passed: Breach={data['is_projected_breach']} (ETA: {data.get('time_to_boundary_min')} mins)")

def test_route():
    res = client.post("/api/route", json={
        "origin_lat": 16.9902,
        "origin_lon": 73.3120,
        "dest_lat": 17.15,
        "dest_lon": 72.95
    })
    assert res.status_code == 200
    data = res.json()
    assert "fastest_route_km" in data
    assert "safest_route_km" in data
    print(f"✓ Route Endpoint Passed: Fastest={data['fastest_route_km']} km vs Safest={data['safest_route_km']} km")

def test_what_if():
    res = client.post("/api/what-if", json={
        "latitude": 16.9902,
        "longitude": 73.3120,
        "time_a": "06:00 AM",
        "time_b": "04:00 AM"
    })
    assert res.status_code == 200
    data = res.json()
    assert "scenario_current" in data
    assert "scenario_alternative" in data
    print(f"✓ What-If Endpoint Passed: Delta={data['risk_delta']} pts")

def test_conversational_query():
    res = client.post("/api/query", json={
        "query": "Is it safe to go fishing tomorrow at 6 AM near Ratnagiri?",
        "language": "en"
    })
    assert res.status_code == 200
    data = res.json()
    assert data["risk"]["risk_score"] is not None
    assert len(data["agent_audit"]) >= 8
    assert len(data["evidence_chain"]) >= 4
    print(f"✓ Conversational Terminal Query Passed: Risk={data['risk']['risk_score']}/100 [{data['risk']['risk_level']}]")

if __name__ == "__main__":
    print("=" * 60)
    print("RUNNING ORCA REST API INTEGRATION TESTS")
    print("=" * 60)
    test_health()
    test_sources()
    test_agents_status()
    test_weather()
    test_ocean()
    test_pfz()
    test_alerts()
    test_geofence()
    test_predictive_geofence()
    test_route()
    test_what_if()
    test_conversational_query()
    print("=" * 60)
    print("ALL API ENDPOINTS PASSED SUCCESSFULLY!")
    print("=" * 60)
