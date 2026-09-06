import json
from pathlib import Path
from typing import List, Dict, Any
from shapely.geometry import shape, Point
from backend.providers.base_provider import BaseProvider

class AlertProvider(BaseProvider):
    def __init__(self):
        super().__init__(
            name="IMD & INCOIS Marine Disaster Warning Services",
            source_url="https://mausam.imd.gov.in/imd_latest/contents/index_fisherman.php"
        )
        self.geojson_path = Path(__file__).resolve().parent.parent.parent.parent / "data" / "geojson" / "marine_hazards.geojson"
        self._load_hazards()

    def _load_hazards(self):
        try:
            if self.geojson_path.exists():
                with open(self.geojson_path, "r", encoding="utf-8") as f:
                    self.features = json.load(f).get("features", [])
            else:
                self.features = []
        except Exception:
            self.features = []

    def get_active_alerts(self, lat: float, lon: float, buffer_degrees: float = 0.6) -> List[Dict[str, Any]]:
        """Find active marine advisories intersecting or near the coordinates."""
        pt = Point(lon, lat)
        active = []

        for feat in self.features:
            geom = shape(feat.get("geometry", {}))
            props = feat.get("properties", {})
            # Check point in polygon or within buffer
            is_inside = geom.contains(pt)
            dist_deg = geom.distance(pt)

            if is_inside or dist_deg <= buffer_degrees:
                coords = []
                g_coords = feat.get("geometry", {}).get("coordinates", [])
                if g_coords and len(g_coords) > 0:
                    coords = g_coords[0]

                active.append({
                    "id": props.get("id"),
                    "name": props.get("name"),
                    "hazard_type": props.get("hazard_type"),
                    "severity": props.get("severity", "HIGH"),
                    "description": props.get("description"),
                    "issued_by": props.get("issued_by"),
                    "source": self.name,
                    "source_url": self.source_url,
                    "status": "LIVE",
                    "valid_until": props.get("valid_until"),
                    "is_direct_hit": is_inside,
                    "proximity_deg": round(dist_deg, 3),
                    "polygon": coords
                })

        return active

    def get_all_hazards(self) -> List[Dict[str, Any]]:
        return self.features
