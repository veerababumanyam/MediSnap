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

def _run_specialty_consult(specialty: str, role_definition: str, query: str) -> Dict[str, Any]:
    """
    Generic handler for specialty consultations.
    """
    patient = get_current_patient()
    
    # In a full implementation, we would key-word search reports here similar to TS
    # For now, we pass the recent report summaries to keep it efficient.
    # Note: A2A agents usually have context management.
    
    reports_brief = []
    for r in patient.get('reports', [])[:8]:
        content = r.get('content', '')
        if isinstance(content, dict): content = "[Complex Content]"
        reports_brief.append(f"{r.get('date')} [{r.get('type')}]: {str(content)[:300]}")
    
    context = "\n".join(reports_brief)

    prompt = f"""{role_definition}
    
    **Patient:** {patient.get('name')}, {patient.get('age')}y.
    **Condition:** {patient.get('currentStatus', {}).get('condition')}
    **Query:** "{query}"
    
    **Available Data Snippets:**
    {context}
    
    **Task:**
    1. Analyze from your specialty perspective.
    2. Identify pertinent findings.
    3. Provide assessment and plan.
    4. Return JSON.
    """
    
    response_schema = {
        "type": Type.OBJECT,
        "properties": {
            "title": {"type": Type.STRING},
            "keyFindings": {
                "type": Type.ARRAY,
                "items": {
                    "type": Type.OBJECT,
                    "properties": {
                        "label": {"type": Type.STRING},
                        "value": {"type": Type.STRING},
                        "status": {"type": Type.STRING}
                    },
                    "required": ["label", "value", "status"]
                }
            },
            "assessment": {"type": Type.STRING},
            "plan": {"type": Type.ARRAY, "items": {"type": Type.STRING}}
        },
        "required": ["title", "keyFindings", "assessment", "plan"]
    }

    try:
        response = client.models.generate_content(
            model='gemini-2.0-flash-exp', # Flash for speed
            contents=prompt,
            config=GenerateContentConfig(
                response_mime_type='application/json',
                response_schema=response_schema
            )
        )
        return json.loads(response.text)
    except Exception as e:
        return {"error": f"Consult failed: {str(e)}"}

# --- Exported Tools for each Specialty ---

def consult_cardiology(query: str) -> Dict[str, Any]:
    return _run_specialty_consult("Cardiology", "You are an expert Cardiologist.", query)

def consult_neurology(query: str) -> Dict[str, Any]:
    return _run_specialty_consult("Neurology", "You are an expert Neurologist. Focus on CNS/PNS.", query)

def consult_oncology(query: str) -> Dict[str, Any]:
    return _run_specialty_consult("Oncology", "You are an expert Oncologist. Focus on malignancy.", query)

def consult_gastroenterology(query: str) -> Dict[str, Any]:
    return _run_specialty_consult("Gastroenterology", "You are an expert Gastroenterologist.", query)

def consult_pulmonology(query: str) -> Dict[str, Any]:
    return _run_specialty_consult("Pulmonology", "You are an expert Pulmonologist.", query)

def consult_endocrinology(query: str) -> Dict[str, Any]:
    return _run_specialty_consult("Endocrinology", "You are an expert Endocrinologist.", query)

def consult_nephrology(query: str) -> Dict[str, Any]:
    return _run_specialty_consult("Nephrology", "You are an expert Nephrologist. Focus on renal function.", query)

def consult_hematology(query: str) -> Dict[str, Any]:
    return _run_specialty_consult("Hematology", "You are an expert Hematologist.", query)

def consult_infectious_disease(query: str) -> Dict[str, Any]:
    return _run_specialty_consult("Infectious Disease", "You are an expert in Infectious Diseases.", query)

# ... add others as needed, these cover the main ones requested
