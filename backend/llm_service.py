import os
import json
import logging
from langchain_google_genai import ChatGoogleGenerativeAI
from models import GapAnalysisResult, LearningRoadmap, InterviewPrep

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def load_fallback_data():
    file_path = os.path.join(os.path.dirname(__file__), "data", "jds.json")
    try:
        with open(file_path, "r") as f:
            return json.load(f)
    except Exception as e:
        logger.error(f"Failed to load fallback data: {e}")
        return []

def get_job_fallback(role_title: str):
    jds = load_fallback_data()
    return next((job for job in jds if job["role_title"] == role_title), jds[0] if jds else None)

def generate_gap_analysis_service(role_title: str, resume_skills: list, jd_skills: list):
    try:
        llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", temperature=0.1)
        structured_llm = llm.with_structured_output(GapAnalysisResult)
        
        prompt = f"""
        Analyze a candidate applying for a '{role_title}' role.
        Candidate's current tech stack: {', '.join(resume_skills)}.
        Job required tech stack: {', '.join(jd_skills)}.
        Categorize the skills into matched and missing. Provide a short 2-sentence summary of their fit.
        """
        
        result = structured_llm.invoke(prompt)
        response_data = result.model_dump()
        response_data["is_fallback"] = False
        return response_data
        
    except Exception as e:
        logger.warning(f"AI Gap Analysis Failed: {e}. Triggering Manual Fallback.")
        user_skills_lower = [s.lower() for s in resume_skills]
        matched = [s for s in jd_skills if s.lower() in user_skills_lower]
        missing = [s for s in jd_skills if s.lower() not in user_skills_lower]
        
        return {
            "matched_skills": matched,
            "missing_skills": missing,
            "summary": "We encountered an error analyzing your full profile, but we have calculated your technical gaps below.",
            "is_fallback": True
        }

def generate_roadmap_service(role_title: str, missing_skills: list):
    if not missing_skills:
        return {
            "steps": [{"phase": "Ready to Apply!", "description": "You meet all technical requirements.", "resources": []}],
            "is_fallback": False
        }

    try:
        llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", temperature=0.2)
        structured_llm = llm.with_structured_output(LearningRoadmap)
        
        skills_str = ", ".join(missing_skills)
        
        # UPDATED: Explicitly forbidden YouTube/Video links. Demanded text resources.
        prompt = f"""
        Act as a Senior Engineering Mentor. A candidate is applying for a '{role_title}' role.
        Generate a concise, sequential 3-phase learning roadmap to help them master ONLY these missing skills: {skills_str}.
        For each phase, provide 2-3 specific, high-quality learning resources (preferring official documentation sites, popular engineering blogs, or text-based tutorials). 
        DO NOT provide YouTube or video links. 
        You MUST provide the actual, valid URL link for each text resource.
        """
        
        result = structured_llm.invoke(prompt)
        response_data = result.model_dump()
        response_data["is_fallback"] = False
        return response_data
        
    except Exception as e:
        logger.warning(f"AI Roadmap Failed: {e}. Triggering Manual Fallback.")
        fallback_job = get_job_fallback(role_title)
        if fallback_job:
            return {"steps": fallback_job["fallback_roadmap"], "is_fallback": True}
        return {"steps": [{"phase": "System Error", "description": "Unable to generate roadmap at this time.", "resources": []}], "is_fallback": True}


def generate_interview_service(role_title: str, missing_skills: list, all_jd_skills: list):
    skills_to_test = missing_skills if missing_skills else all_jd_skills
    
    try:
        llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", temperature=0.5)
        structured_llm = llm.with_structured_output(InterviewPrep)
        
        skills_str = ", ".join(skills_to_test)
        
        prompt = f"""
        Act as a strict Technical Interviewer for a '{role_title}' position.
        Generate exactly 5 thoughtful technical interview questions covering these areas: {skills_str}.
        Assign a difficulty (Easy, Medium, Hard).
        Provide a clear, concise, and technically accurate answer for each question to help the candidate learn.
        """
        
        result = structured_llm.invoke(prompt)
        response_data = result.model_dump()
        response_data["is_fallback"] = False
        return response_data
        
    except Exception as e:
        logger.warning(f"AI Interview Prep Failed: {e}. Triggering Manual Fallback.")
        fallback_job = get_job_fallback(role_title)
        if fallback_job:
            return {"questions": fallback_job["fallback_questions"], "is_fallback": True}
        return {"questions": [{"topic": "General", "question": "Explain your background.", "difficulty": "Easy", "answer": "The candidate should clearly explain their relevant experience."}], "is_fallback": True}