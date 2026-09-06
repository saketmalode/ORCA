from abc import ABC, abstractmethod
from typing import Dict, Any, Optional
from datetime import datetime, timezone

class BaseProvider(ABC):
    def __init__(self, name: str, source_url: str):
        self.name = name
        self.source_url = source_url
        self.last_status = "UNKNOWN"
        self.last_retrieved = None

    def create_observation(
        self,
        lat: float,
        lon: float,
        parameter: str,
        value: float,
        unit: str,
        status: str = "LIVE",
        quality: str = "verified",
        obs_time: Optional[str] = None
    ) -> Dict[str, Any]:
        now_utc = datetime.now(timezone.utc).isoformat()
        return {
            "source": self.name,
            "retrieved_at": now_utc,
            "observation_time": obs_time or now_utc,
            "location": {"latitude": lat, "longitude": lon},
            "parameter": parameter,
            "value": round(float(value), 2),
            "unit": unit,
            "quality": quality,
            "status": status,
            "source_url": self.source_url
        }
