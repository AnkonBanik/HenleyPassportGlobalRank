from pydantic import BaseModel
from typing import Optional, List, Dict

class PassportRecord(BaseModel):
    country: str
    rank: float
    access_to_countries: Optional[float] = None
    year: int

class CountryStatsResponse(BaseModel):
    country: str
    iso2: str
    iso3: str
    capital: str
    continent: str
    un_region: str
    current_rank: float
    current_access: float
    best_rank: float
    worst_rank: float
    average_rank: float
    median_rank: float
    volatility_score: float
    stability_score: float
    overall_improvement: float
    yearly_data: Dict[int, Dict[str, float]]
