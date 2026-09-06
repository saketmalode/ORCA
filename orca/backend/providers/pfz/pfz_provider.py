import json
import math
from pathlib import Path
from typing import Dict, Any, Optional, List
from backend.providers.base_provider import BaseProvider

class PFZProvider(BaseProvider):
    def __init__(self):
        super().__init__(
            name="INCOIS Potential Fishing Zone (PFZ) Advisory Mission",
            source_url="https://incois.gov.in/MarineFisheries/PfzAdvisory"
        )
        self.geojson_path = Path(__file__).resolve().parent.parent.parent.parent / "data" / "geojson" / "pfz_advisories.geojson"
        self._load_pfz_data()

    def _load_pfz_data(self):
        try:
            if self.geojson_path.exists():
                with open(self.geojson_path, "r", encoding="utf-8") as f:
                    self.features = json.load(f).get("features", [])
            else:
                self.features = []
        except Exception:
            self.features = []

    def _haversine(self, lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        r = 6371.0
        phi1 = math.radians(lat1)
        phi2 = math.radians(lat2)
        dphi = math.radians(lat2 - lat1)
        dlam = math.radians(lon2 - lon1)
        a = math.sin(dphi / 2.0)**2 + math.cos(phi1) * math.cos(phi2) * math.sin(dlam / 2.0)**2
        return 2.0 * r * math.asin(math.sqrt(a))

    def _bearing(self, lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        phi1 = math.radians(lat1)
        phi2 = math.radians(lat2)
        dlam = math.radians(lon2 - lon1)
        y = math.sin(dlam) * math.cos(phi2)
        x = math.cos(phi1) * math.sin(phi2) - math.sin(phi1) * math.cos(phi2) * math.cos(dlam)
        b = math.degrees(math.atan2(y, x))
        return (b + 360.0) % 360.0

    def get_nearest_pfz(self, lat: float, lon: float) -> Optional[Dict[str, Any]]:
        """Find closest official PFZ line / feature from coordinates."""
        if not self.features:
            return None

        best_feat = None
        min_dist = float("inf")
        best_coord = None

        for feat in self.features:
            coords = feat.get("geometry", {}).get("coordinates", [])
            for c in coords:
                # GeoJSON coordinates are [lon, lat]
                c_lon, c_lat = c[0], c[1]
                dist = self._haversine(lat, lon, c_lat, c_lon)
                if dist < min_dist:
                    min_dist = dist
                    best_feat = feat
                    best_coord = (c_lat, c_lon)

        if not best_feat:
            return None

        props = best_feat.get("properties", {})
        bearing_val = self._bearing(lat, lon, best_coord[0], best_coord[1]) if best_coord else props.get("bearing_deg", 270)

        return {
            "id": props.get("id"),
            "name": props.get("name"),
            "nearest_port": props.get("nearest_port"),
            "bearing_deg": round(bearing_val, 1),
            "distance_km": round(min_dist, 1),
            "depth_range_m": props.get("depth_range_m"),
            "sst_deg_c": props.get("sst_deg_c", 28.0),
            "chlorophyll_mg_m3": props.get("chlorophyll_mg_m3", 1.5),
            "favourability_score": props.get("favourability_score", 85),
            "advisory_type": props.get("advisory_type", "OFFICIAL_INCOIS_PFZ"),
            "species_association": props.get("species_association"),
            "source": self.name,
            "source_url": self.source_url,
            "status": "LIVE",
            "valid_until": props.get("valid_until"),
            "coordinates": best_feat.get("geometry", {}).get("coordinates", [])
        }

    def get_all_pfz(self) -> List[Dict[str, Any]]:
        return self.features
