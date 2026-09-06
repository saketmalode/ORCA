import math
from typing import Dict, Any, List, Optional, Tuple
from shapely.geometry import shape, Point, LineString

class GeofenceEngine:
    """
    Mathematical Predictive Geofencing Engine.
    Projects vessel positions along course vectors over time and detects
    boundary penetrations without AI.
    """
    def project_trajectory(
        self,
        lat: float,
        lon: float,
        heading_deg: float,
        speed_knots: float,
        duration_minutes: int = 60,
        time_step_min: int = 3
    ) -> List[Dict[str, Any]]:
        trajectory = []
        rad_heading = math.radians(heading_deg)
        cos_lat = math.cos(math.radians(lat)) or 1.0

        for m in range(0, duration_minutes + 1, time_step_min):
            dist_nmi = speed_knots * (m / 60.0)
            dist_km = dist_nmi * 1.852

            # Latitude shift: 1 deg ~ 111 km
            d_lat = (dist_km * math.cos(rad_heading)) / 111.0
            # Longitude shift: 1 deg ~ 111 * cos(lat) km
            d_lon = (dist_km * math.sin(rad_heading)) / (111.0 * cos_lat)

            trajectory.append({
                "time_minutes": m,
                "lat": round(lat + d_lat, 5),
                "lon": round(lon + d_lon, 5)
            })

        return trajectory

    def check_predictive_geofence(
        self,
        lat: float,
        lon: float,
        heading_deg: float,
        speed_knots: float,
        boundary_features: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        trajectory = self.project_trajectory(lat, lon, heading_deg, speed_knots, duration_minutes=60, time_step_min=2)

        # Check each sequential segment
        for i in range(len(trajectory) - 1):
            p1 = trajectory[i]
            p2 = trajectory[i+1]
            seg_line = LineString([(p1["lon"], p1["lat"]), (p2["lon"], p2["lat"])])

            for feat in boundary_features:
                geom = shape(feat.get("geometry", {}))
                props = feat.get("properties", {})

                if seg_line.intersects(geom):
                    breach_time = p2["time_minutes"]
                    zone_name = props.get("name", "Restricted Maritime Zone")
                    zone_type = props.get("zone_type", "GEOFENCE")
                    return {
                        "is_projected_breach": True,
                        "time_to_boundary_min": breach_time,
                        "intersected_zone_name": zone_name,
                        "intersected_zone_type": zone_type,
                        "warning_message": f"⚠️ PREDICTIVE GEOFENCE ALERT: Course vector projects entering '{zone_name}' in approximately {breach_time} minutes at current speed of {speed_knots} knots.",
                        "trajectory": trajectory
                    }

        # If no breach projected within 60 mins
        return {
            "is_projected_breach": False,
            "time_to_boundary_min": None,
            "intersected_zone_name": None,
            "intersected_zone_type": None,
            "warning_message": f"Course clear: Projected trajectory over 60 minutes ({round(speed_knots * 1.852, 1)} km) maintains safe separation from all restricted maritime zones.",
            "trajectory": trajectory
        }
