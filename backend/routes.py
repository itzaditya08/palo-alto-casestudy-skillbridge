import os
import json
from fastapi import APIRouter, HTTPException
from models import GapAnalysisRequest

# Import the AI services
from llm_service import (
    generate_gap_analysis_service,
    generate_roadmap_service,
    generate_interview_service
)

router = APIRouter()

# --- HELPER ---
def load_json_file(filename: str):
    file_path = os.path.join(os.path.dirname(__file__), "data", filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail=f"Data file {filename} not found.")
    with open(file_path, "r") as f:
        return json.load(f)

# --- ROUTES ---

@router.get("/api/resumes")
async def get_dummy_resumes():
    try:
        return load_json_file("resume.json")
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error loading resumes.")

@router.get("/api/jobs")
async def get_job_descriptions():
    try:
        return load_json_file("jds.json")
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error loading job descriptions.")

@router.post("/api/gap-analysis")
async def get_gap_analysis(req: GapAnalysisRequest):
    try:
        return generate_gap_analysis_service(
            role_title=req.role_title,
            resume_skills=req.user_profile.tech_stack,
            jd_skills=req.jd_skills
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/api/roadmap")
async def get_learning_roadmap(req: GapAnalysisRequest):
    try:
        user_skills_lower = [s.lower() for s in req.user_profile.tech_stack]
        missing_skills = [s for s in req.jd_skills if s.lower() not in user_skills_lower]
        return generate_roadmap_service(req.role_title, missing_skills)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/api/interview")
async def get_mock_interview(req: GapAnalysisRequest):
    try:
        user_skills_lower = [s.lower() for s in req.user_profile.tech_stack]
        missing_skills = [s for s in req.jd_skills if s.lower() not in user_skills_lower]
        return generate_interview_service(req.role_title, missing_skills, req.jd_skills)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))