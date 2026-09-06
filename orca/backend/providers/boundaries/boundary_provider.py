import json
import math
from pathlib import Path
from typing import List, Dict, Any, Optional, Tuple
from shapely.geometry import shape, Point, LineString
from backend.providers.base_provider import BaseProvider

class BoundaryProvider(BaseProvider):
    def __init__(self):
        super().__init__(
            name="National Hydrographic Office / MoEFCC Maritime Boundaries",
            source_url="https://hydro-india.gov.in/"
        )
        self.geojson_path = Path(__file__).resolve().parent.parent.parent.parent / "data" / "geojson" / "restricted_zones.geojson"
        self._load_boundaries()

    def _load_boundaries(self):
        try:
            if self.geojson_path.exists():
                with open(self.geojson_path, "r", encoding="utf-8") as f:
                    self.features = json.load(f).get("features", [])
            else:
                self.features = []
        except Exception:
            self.features = []

    def check_position(self, lat: float, lon: float) -> Dict[str, Any]:
        """Check if lat/lon is inside or close to any restricted zone or IMBL."""
        pt = Point(lon, lat)
        is_inside = False
        inside_zones = []
        closest_zone = None
        min_dist_km = float("inf")

        for feat in self.features:
            geom = shape(feat.get("geometry", {}))
            props = feat.get("properties", {})
            
            if geom.geom_type == "Polygon" and geom.contains(pt):
                is_inside = True
                inside_zones.append(props)

            # Degree to km approx at Indian latitudes (~111 km per deg)
            dist_deg = geom.distance(pt)
            dist_km = dist_deg * 111.0

            if dist_km < min_dist_km:
                min_dist_km = dist_km
                closest_zone = {
                    "id": props.get("id"),
                    "name": props.get("name"),
                    "zone_type": props.get("zone_type"),
                    "severity": props.get("severity"),
                    "restriction": props.get("restriction"),
                    "authority": props.get("authority"),
                    "distance_km": round(dist_km, 1)
                }

        return {
            "is_inside_restricted_zone": is_inside,
            "inside_zones": inside_zones,
            "closest_zone": closest_zone,
            "distance_to_boundary_km": round(min_dist_km, 1) if closest_zone else 999.0
        }

    def check_trajectory_intersection(self, trajectory_coords: List[Tuple[float, float]]) -> Optional[Dict[str, Any]]:
        """
        trajectory_coords: list of (lon, lat) tuples.
        Returns first intersected boundary feature and intersection distance.
        """
        if len(trajectory_coords) < 2:
            return None

        traj_line = LineString(trajectory_coords)

        for feat in self.features:
            geom = shape(feat.get("geometry", {}))
            props = feat.get("properties", {})

            if traj_line.intersects(geom):
                intersection = traj_line.intersection(geom)
                return {
                    "zone_id": props.get("id"),
                    "zone_name": props.get("name"),
                    "zone_type": props.get("zone_type"),
                    "severity": props.get("severity"),
                    "restriction": props.get("restriction"),
                    "authority": props.get("authority")
                }
        return None

    def get_all_boundaries(self) -> List[Dict[str, Any]]:
        return self.features
