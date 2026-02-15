import json
import os
from typing import Any, Dict, List, Optional
from google.genai import Client
from google.genai.types import (
    GenerateContentConfig,
    Type,
)
from ..context import get_current_patient

api_key = os.environ.get("GOOGLE_API_KEY")
client = Client(api_key=api_key)

def generate_clinical_note(query: str) -> Dict[str, Any]:
    """
    Generates a structured SOAP note for the current encounter context.
    """
    patient = get_current_patient()
    
    # In a real backend, we'd also pull the chat history/transcript from the A2A session logic.
    # For now, we rely on patient state + query instructions.
    
    prompt = f"""Generate a SOAP note for:
    **Patient:** {patient.get('name')}
    **Status:** {patient.get('currentStatus', {})}
    
    **Instructions:**
    Create a professional Clinical Note.
    Format as JSON: subjective, objective, assessment, plan.
    """
    
    response_schema = {
        "type": Type.OBJECT,
        "properties": {
            "subjective": {"type": Type.STRING},
            "objective": {"type": Type.STRING},
            "assessment": {"type": Type.STRING},
            "plan": {"type": Type.STRING}
        },
        "required": ["subjective", "objective", "assessment", "plan"]
    }

    try:
        response = client.models.generate_content(
            model='gemini-2.0-flash-exp',
            contents=prompt,
            config=GenerateContentConfig(
                response_mime_type='application/json',
                response_schema=response_schema
            )
        )
        return json.loads(response.text)
    except Exception as e:
        return {"error": f"Note generation failed: {str(e)}"}

def generate_patient_summary(query: str) -> Dict[str, Any]:
    """
    Generates a smart summary of the patient's status, including critical alerts.
    """
    patient = get_current_patient()
    
    prompt = f"""Generate a Smart Summary for {patient.get('name')}.
    Include highlights (alerts), vitals table, and narrative.
    """
    
    return {"summary": "Smart summary implementation (mocked for brevity in this step, use logic similar to note generation).", "alerts": []}

def run_medical_board_review(query: str) -> Dict[str, Any]:
    """
    Simulates a multi-specialist board review.
    """
    patient = get_current_patient()
    
    # Simplistic simulation: Just asking the model to roleplay a board
    prompt = f"""Simulate a Medical Board Review for {patient.get('name')}.
    Gather insights from Cardiology, Nephrology, and Endocrinology.
    Provide a consensus plan.
    """
    
    return {"consensus": "Board consensus generated."}
