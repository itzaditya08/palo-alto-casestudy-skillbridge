from pydantic import BaseModel, Field
from typing import List

# ==========================================
# 1. FRONTEND REQUEST MODELS (Input Validation)
# ==========================================
class UserProfile(BaseModel):
    full_name: str = Field(..., min_length=1, description="The user's full name.")
    education_level: str = Field(..., description="The user's current education level.")
    cgpa: float = Field(..., ge=0.0, le=4.0, description="The user's CGPA out of 4.0.")
    tech_stack: List[str] = Field(..., description="List of skills the user currently possesses.")

class GapAnalysisRequest(BaseModel):
    user_profile: UserProfile
    role_title: str = Field(..., description="The target job role the user is analyzing.")
    jd_skills: List[str] = Field(..., description="The skills required for the target job.")

# ==========================================
# 2. AI STRUCTURED OUTPUT MODELS (Langchain)
# ==========================================

class GapAnalysisResult(BaseModel):
    matched_skills: List[str] = Field(description="Skills from the resume that match the job requirements.")
    missing_skills: List[str] = Field(description="Skills required by the job that are missing from the resume.")
    summary: str = Field(description="A brief, 2-sentence encouraging summary of the candidate's fit.")

class Resource(BaseModel):
    name: str = Field(description="The title of the learning resource (e.g., 'React Official Documentation', 'Node.js Crash Course Video').")
    url: str = Field(description="The actual, valid, clickable URL link to the resource.")

class RoadmapPhase(BaseModel):
    phase: str = Field(description="The sequential title of the learning phase (e.g., 'Phase 1: Database Mastery').")
    description: str = Field(description="A concise, actionable description of what the user needs to learn and do in this phase.")
    resources: List[Resource] = Field(description="A list of 2-3 specific, actionable learning resources with real URLs.")

class LearningRoadmap(BaseModel):
    steps: List[RoadmapPhase] = Field(description="A sequential list of exactly 3 learning phases to cover the user's skill gaps.")

class InterviewQuestion(BaseModel):
    topic: str = Field(description="The overarching technical topic (e.g., 'Databases', 'API Design').")
    question: str = Field(description="A realistic, thought-provoking technical interview question.")
    difficulty: str = Field(description="Strictly classify as 'Easy', 'Medium', or 'Hard'.")
    # NEW: Added answer field for the AI to populate
    answer: str = Field(description="A clear, concise, and technically accurate answer to the question.")

class InterviewPrep(BaseModel):
    questions: List[InterviewQuestion] = Field(description="A list of exactly 5 technical interview questions tailored to the missing skills.")