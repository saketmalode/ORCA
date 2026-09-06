from abc import ABC, abstractmethod
from typing import Dict, Any
import time

class BaseAgent(ABC):
    def __init__(self, name: str, role: str):
        self.name = name
        self.role = role

    @abstractmethod
    async def execute(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """Execute agent task and return structured output dictionary."""
        pass
