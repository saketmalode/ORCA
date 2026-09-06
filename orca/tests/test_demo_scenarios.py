import asyncio
import sys
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT_DIR))

from backend.agents.supervisor import OrcaSupervisor

DEMO_QUERIES = [
    ("Is it safe to go fishing tomorrow at 6 AM near Ratnagiri?", "en", "MARINE_SAFETY"),
    ("उद्या सकाळी रत्नागिरीजवळ मासेमारी करणे सुरक्षित आहे का?", "mr", "MARINE_SAFETY"),
    ("कल सुबह रत्नागिरी के पास मछली पकड़ना सुरक्षित है क्या?", "hi", "MARINE_SAFETY"),
    ("Where is the nearest favourable fishing zone?", "en", "PFZ_SEARCH"),
    ("Show me dangerous marine areas.", "en", "HAZARD_MAP"),
    ("Show restricted areas near me.", "en", "GEOFENCE"),
    ("Find the safest route to this location.", "en", "SAFE_ROUTE"),
    ("What if I leave at 4 AM?", "en", "WHAT_IF"),
    ("What are the ocean conditions here?", "en", "OCEAN_STATE"),
    ("Why is this area high risk?", "en", "MARINE_SAFETY"),
]

async def run_tests():
    supervisor = OrcaSupervisor()
    print("=" * 60)
    print("RUNNING ORCA ZERO-LLM DEMO SCENARIO VERIFICATION")
    print("=" * 60)

    for query, expected_lang, expected_intent in DEMO_QUERIES:
        res = await supervisor.process_query(query)
        q = res["query"]
        risk = res["risk"]
        audit = res["agent_audit"]
        evidence = res["evidence_chain"]

        print(f"\n[QUERY]: '{query}'")
        print(f"  -> Language Detected : {q['language']} (Expected: {expected_lang})")
        print(f"  -> Intent Parsed     : {q['intent']} (Expected: {expected_intent})")
        print(f"  -> Location Resolved : {q['location_name']} ({q['latitude']}, {q['longitude']})")
        print(f"  -> Risk Assessment   : {risk['risk_score']}/100 [{risk['risk_level']}]")
        print(f"  -> Agent Audit Steps : {len(audit)} autonomous agents executed")
        print(f"  -> Evidence Count    : {len(evidence)} verified data nodes")
        
        assert q["language"] == expected_lang, f"Language mismatch: {q['language']} != {expected_lang}"
        assert len(audit) >= 8, f"Insufficient agent steps: {len(audit)}"
        assert len(evidence) >= 4, f"Insufficient evidence: {len(evidence)}"
        assert res["formatted_response"] is not None and len(res["formatted_response"]) > 50

    print("\n" + "=" * 60)
    print("ALL 10 DEMO SCENARIOS PASSED WITH ZERO LLM DEPENDENCIES!")
    print("=" * 60)

if __name__ == "__main__":
    asyncio.run(run_tests())
