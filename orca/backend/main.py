from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.api.routes import router

app = FastAPI(
    title="ORCA — Marine EcOsystem Reasoning with Collaborative Agents",
    description="Deterministic, Agentic Marine Intelligence Platform for ISRO / Department of Space (SIH26176). Strict Zero-LLM Architecture.",
    version="1.0.0"
)

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from pathlib import Path
from fastapi.staticfiles import StaticFiles

app.include_router(router)

# Mount static frontend build if present (for single-container unified deployment)
dist_dir = Path(__file__).resolve().parent.parent / "frontend" / "dist"
if dist_dir.exists():
    app.mount("/", StaticFiles(directory=str(dist_dir), html=True), name="static_frontend")
else:
    @app.get("/")
    def root():
        return {
            "platform": "ORCA",
            "description": "Marine EcOsystem Reasoning with Collaborative Agents",
            "organization": "ISRO / Department of Space",
            "theme": "Disaster Management & Blue Economy",
            "status": "ONLINE",
            "llm_dependency": "NONE (100% Deterministic Software Agents + Real Data Fusion)",
            "docs_url": "/docs"
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
