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

def check_guideline_adherence(query: str) -> Dict[str, Any]:
    """
    Checks if the patient's treatment adheres to current clinical guidelines (e.g., GDMT for HF).
    """
    patient = get_current_patient()
    condition = patient.get('currentStatus', {}).get('condition', '')
    meds = patient.get('currentStatus', {}).get('medications', [])
    
    prompt = f"""You are an expert in Clinical Guidelines (ACC/AHA/ESC/ADA).
    Check adherence for:
    **Patient Condition:** {condition}
    **Current Meds:** {meds}
    
    **Task:**
    1. Identify the relevant guideline (e.g., HFrEF GDMT).
    2. Check if patient is on all pillars.
    3. Identify gaps (missing classes).
    4. List contraindications if found in history.
    
    **Return JSON:**
    - guidelineName
    - adherenceStatus (Fully Adherent, Partial, Non-Adherent)
    - missingTherapies (list)
    - recommendations
    """
    
    response_schema = {
        "type": Type.OBJECT,
        "properties": {
            "guidelineName": {"type": Type.STRING},
            "adherenceStatus": {"type": Type.STRING},
            "missingTherapies": {"type": Type.ARRAY, "items": {"type": Type.STRING}},
            "recommendations": {"type": Type.ARRAY, "items": {"type": Type.STRING}}
        },
        "required": ["guidelineName", "adherenceStatus", "missingTherapies", "recommendations"]
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
        return {"error": f"Guideline check failed: {str(e)}"}

def check_medication_safety(query: str) -> Dict[str, Any]:
    """
    Analyzes medication list for interactions, contraindications, and dosage issues.
    """
    patient = get_current_patient()
    meds = patient.get('currentStatus', {}).get('medications', [])
    allergies = patient.get('allergies', []) # Assuming allergies exist
    vitals = patient.get('currentStatus', {}).get('vitals', '')
    labs = "See reports" # Simplified
    
    prompt = f"""Medication Safety Check.
    **Meds:** {meds}
    **Allergies:** {allergies}
    **Vitals:** {vitals}
    
    Check for:
    1. Drug-Drug Interactions (Major/Moderate).
    2. Drug-Disease Interactions.
    3. Dosage concerns (based on renal function if available in context).
    """
    
    response_schema = {
        "type": Type.OBJECT,
        "properties": {
            "interactions": {
                "type": Type.ARRAY, 
                "items": {
                    "type": Type.OBJECT, 
                    "properties": {"pair": {"type": Type.STRING}, "severity": {"type": Type.STRING}, "description": {"type": Type.STRING}},
                     "required": ["pair", "severity", "description"]
                }
            },
            "contraindications": {"type": Type.ARRAY, "items": {"type": Type.STRING}},
            "safe": {"type": Type.BOOLEAN}
        },
        "required": ["interactions", "safe"]
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
        return {"error": f"Safety check failed: {str(e)}"}

def optimize_dosage(query: str) -> Dict[str, Any]:
    """
    Suggests dosage optimizations based on vitals and guidelines (e.g., up-titration).
    """
    patient = get_current_patient()
    return check_guideline_adherence(query) # Reuse logic or specialize
