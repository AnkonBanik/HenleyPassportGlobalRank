from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
import pandas as pd

app = FastAPI(
    title="Henley Passport Index Analytics API",
    description="Production-grade API endpoint engine for passport rankings analytics (2006-2026)",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

CSV_PATH = os.path.join(os.path.dirname(__file__), "../../henley_passport_data_updated.csv")

@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "Henley Passport Index Analytics Backend",
        "version": "1.0.0",
        "dataset_loaded": os.path.exists(CSV_PATH)
    }

@app.get("/api/v1/summary")
def get_summary(year: int = 2026):
    if not os.path.exists(CSV_PATH):
        return {"error": "Dataset file not found"}
    df = pd.read_csv(CSV_PATH)
    year_df = df[df['YEAR'] == year]
    
    return {
        "year": year,
        "total_countries": len(year_df),
        "best_rank": float(year_df['RANK'].min()),
        "worst_rank": float(year_df['RANK'].max()),
        "average_rank": round(float(year_df['RANK'].mean()), 2),
        "median_rank": round(float(year_df['RANK'].median()), 2)
    }
