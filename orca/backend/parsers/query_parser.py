import re
import json
from pathlib import Path
from datetime import datetime, timezone, timedelta
from typing import Dict, Any, Optional

class QueryParser:
    """
    Strictly Deterministic Query Parser without LLM.
    Uses regex rules, multilingual gazetteers, and keyword patterns.
    """
    def __init__(self):
        self.gazetteer_path = Path(__file__).resolve().parent.parent.parent / "data" / "ports_gazetteer.json"
        self._load_gazetteer()

    def _load_gazetteer(self):
        try:
            if self.gazetteer_path.exists():
                with open(self.gazetteer_path, "r", encoding="utf-8") as f:
                    self.ports = json.load(f)
            else:
                self.ports = []
        except Exception:
            self.ports = []

    def detect_language(self, query: str) -> str:
        q_lower = query.lower()
        # Marathi distinct words
        marathi_markers = ["उद्या", "सकाळी", "मासेमारी", "आहे का", "रत्नागिरीजवळ", "दाखवा", "मार्ग", "लाटा", "कशा", "निघालो", "काय"]
        if any(w in query for w in marathi_markers):
            return "mr"

        # Hindi distinct words
        hindi_markers = ["कल", "सुबह", "मछली", "पकड़ना", "सुरक्षित है", "कहाँ", "मौसम", "लहरें", "खतरा", "यदि"]
        if any(w in query for w in hindi_markers):
            return "hi"

        return "en"

    def parse_location(self, query: str) -> Dict[str, Any]:
        self._load_gazetteer()
        q_lower = query.lower()

        # 1. Check for explicit coordinate pair e.g. "17.5, 73.2"
        coord_match = re.search(r'(-?\d{1,2}\.\d+)[,\s]+(-?\d{2,3}\.\d+)', q_lower)
        if coord_match:
            try:
                lat = float(coord_match.group(1))
                lon = float(coord_match.group(2))
                return {
                    "id": f"coord_{lat:.2f}_{lon:.2f}",
                    "name": f"Offshore Sector ({lat:.2f}°N, {lon:.2f}°E)",
                    "state": "Indian Coastal EEZ",
                    "lat": lat,
                    "lon": lon,
                    "zone": "Offshore Waters"
                }
            except Exception:
                pass

        # 2. Extract all candidates with priority to longest match
        candidates = []
        for port in self.ports:
            p_id = port.get("id", "").lower()
            p_name = port.get("name", "").lower()
            p_base = p_name.split("(")[0].split("/")[0].strip()

            keys_to_test = [p_name, p_base, p_id] + [a.lower() for a in port.get("aliases", [])]
            for key in keys_to_test:
                if key and len(key) >= 2:
                    if key in q_lower:
                        candidates.append((len(key), port))
                        break

        if candidates:
            # Sort by longest matching string descending
            candidates.sort(key=lambda x: x[0], reverse=True)
            return candidates[0][1]

        # Default fallback to Ratnagiri (primary SIH demo baseline)
        for port in self.ports:
            if port.get("id") == "ratnagiri":
                return port

        return {
            "id": "ratnagiri",
            "name": "Ratnagiri",
            "state": "Maharashtra",
            "lat": 16.9902,
            "lon": 73.3120,
            "zone": "Konkan Coast"
        }

    def parse_time(self, query: str) -> (str, str, Optional[str], Optional[str]):
        """
        Returns (target_time_iso, target_time_display, scenario_time_iso, scenario_time_display)
        """
        now = datetime.now(timezone.utc)
        q_lower = query.lower()

        # Check for What-If scenario (e.g. 4 AM instead of 6 AM)
        what_if_match = re.search(r'(\d{1,2})\s*(?:am|pm)?\s*(?:instead of|vs|विरुद्ध)\s*(\d{1,2})', q_lower)
        if what_if_match:
            h_alt = int(what_if_match.group(1))
            h_curr = int(what_if_match.group(2))
            dt_curr = now.replace(hour=h_curr, minute=0, second=0, microsecond=0)
            dt_alt = now.replace(hour=h_alt, minute=0, second=0, microsecond=0)
            return (
                dt_curr.isoformat(),
                f"{h_curr:02d}:00",
                dt_alt.isoformat(),
                f"{h_alt:02d}:00"
            )

        # Check for 'what if i leave at 4 am'
        single_alt_match = re.search(r'(?:what if|leave at|निघालो तर)\s*(\d{1,2})\s*(?:am|pm|वाजता)?', q_lower)
        if single_alt_match:
            h_alt = int(single_alt_match.group(1))
            dt_alt = now.replace(hour=h_alt, minute=0, second=0, microsecond=0)
            dt_curr = dt_alt.replace(hour=6)
            return (
                dt_curr.isoformat(),
                "06:00",
                dt_alt.isoformat(),
                f"{h_alt:02d}:00"
            )

        # Check for tomorrow / उद्या / कल
        is_tomorrow = any(w in q_lower for w in ["tomorrow", "उद्या", "कल"])
        base_date = now + timedelta(days=1) if is_tomorrow else now

        # Check for morning / 6 AM
        if any(w in q_lower for w in ["6 am", "6:00", "06:00", "सकाळी 6", "सुबह 6"]):
            target_dt = base_date.replace(hour=6, minute=0, second=0, microsecond=0)
            display = f"{'Tomorrow' if is_tomorrow else 'Today'} 06:00 IST"
        elif any(w in q_lower for w in ["4 am", "4:00", "04:00", "सकाळी 4", "सुबह 4"]):
            target_dt = base_date.replace(hour=4, minute=0, second=0, microsecond=0)
            display = f"{'Tomorrow' if is_tomorrow else 'Today'} 04:00 IST"
        elif any(w in q_lower for w in ["morning", "सकाळी", "सुबह"]):
            target_dt = base_date.replace(hour=6, minute=0, second=0, microsecond=0)
            display = f"{'Tomorrow' if is_tomorrow else 'Today'} 06:00 IST (Morning)"
        else:
            target_dt = now
            display = "Now (Real-Time)"

        return (target_dt.isoformat(), display, None, None)

    def parse_intent(self, query: str) -> str:
        q_lower = query.lower()

        # 1. What-If Marine Simulation
        if any(w in q_lower for w in ["what if", "instead of", "जर मी", "काय जर", "अगर मैं"]):
            return "WHAT_IF"

        # 2. Predictive Geofence / Course projection
        if any(w in q_lower for w in ["heading", "knots", "course", "trajectory", "vector", "दिशा", "वेग"]):
            return "PREDICTIVE_GEOFENCE"

        # 3. Route Optimization / Safest Route
        if any(w in q_lower for w in ["route", "safest route", "path", "waypoint", "मार्ग", "रस्ता", "रास्ता"]):
            return "SAFE_ROUTE"

        # 4. Marine Safety / Can I venture / Is it safe? (High priority check)
        if any(w in q_lower for w in ["safe", "can i go", "venture", "सुरक्षित", "सुरक्षित है", "जाऊ शकतो का", "जा सकते हैं", "risk"]):
            return "MARINE_SAFETY"

        # 5. PFZ / Fishing Zone search
        if any(w in q_lower for w in ["fishing zone", "pfz", "fish productivity", "favourable fishing", "मछली पकड़ने का क्षेत्र", "मासेमारी क्षेत्र", "फिशिंग ज़ोन"]):
            return "PFZ_SEARCH"

        # 6. Geofence / Boundaries / Restricted areas
        if any(w in q_lower for w in ["restricted", "boundary", "imbl", "geofence", "प्रतिबंधित", "सीमा"]):
            return "GEOFENCE"

        # 7. Hazards / Dangerous areas / Cyclone / Lightning
        if any(w in q_lower for w in ["danger", "hazard", "lightning", "cyclone", "धोका", "बिजली", "चक्रवात"]):
            return "HAZARD_MAP"

        # 8. Ocean conditions / Waves / Sea state
        if any(w in q_lower for w in ["wave", "ocean", "swell", "sea state", "लाटा", "समुद्र", "लहरें"]):
            return "OCEAN_STATE"

        # 9. Weather / Wind / Rain
        if any(w in q_lower for w in ["weather", "wind", "rain", "temperature", "हवामान", "मौसम", "वारा", "हवा"]):
            return "WEATHER"
        return "MARINE_SAFETY"

    def parse(self, query: str, language_override: Optional[str] = None) -> Dict[str, Any]:
        if language_override and language_override in ["en", "hi", "mr"]:
            lang = language_override
        else:
            lang = self.detect_language(query)
        intent = self.parse_intent(query)
        location = self.parse_location(query)
        target_iso, target_disp, alt_iso, alt_disp = self.parse_time(query)

        # Extract vessel speed / heading if present
        speed = 10.0
        heading = 270.0

        spd_match = re.search(r'(\d+(?:\.\d+)?)\s*(?:knots|kn|km/h)', query.lower())
        if spd_match:
            speed = float(spd_match.group(1))

        hdg_match = re.search(r'heading\s*(\d+)', query.lower())
        if hdg_match:
            heading = float(hdg_match.group(1))

        return {
            "language": lang,
            "intent": intent,
            "raw_query": query,
            "location_id": location.get("id"),
            "location_name": location.get("name", "Ratnagiri"),
            "latitude": location.get("lat", 16.9902),
            "longitude": location.get("lon", 73.3120),
            "target_time_iso": target_iso,
            "target_time_display": target_disp,
            "scenario_time_iso": alt_iso,
            "scenario_time_display": alt_disp,
            "vessel_speed_knots": speed,
            "vessel_heading_deg": heading
        }
