from fastapi import FastAPI
from fatapi.middleware.cors import CORSMiddleware
app = FastAPI(tittle="JomeCargus API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://localhost:3000", "http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.get("/")
def read_root():
    return {"status": "JomeCargus API online"}
