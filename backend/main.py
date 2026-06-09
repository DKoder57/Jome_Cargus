from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import get_settings
from routers import catalog

settings = get_settings()

app = FastAPI(
    title="JomeCargus API",
    description="API do ecossistema JomeCargus Vestiario",
    version="0.1.0",
)

# CORS — permite requests do site e do app
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(catalog.router)

@app.get("/")
async def root():
    return {
        "status": "online",
        "app": "JomeCargus API",
        "version": "0.1.0",
        "docs": "/docs"
    }