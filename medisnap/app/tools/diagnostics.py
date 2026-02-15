import json
import os
from typing import Any, Dict, List, Optional
from google.genai import Client
from google.genai.types import (
    GenerateContentConfig,
    Type,
)
from ..context import get_current_patient

# Initialize AI Client
# Note: In a real app, you might want this to be a singleton or passed in.
# For now, we instantiate per module or reuse a global one if available.
api_key = os.environ.get("GOOGLE_API_KEY")
client = Client(api_key=api_key)

def _get_report_text(report: Dict[str, Any]) -> str:
    content = report.get("content", "")
    if isinstance(content, str):
        return content
    if isinstance(content, dict):
        if content.get("type") == "pdf":
            return content.get("rawText", "")
        if content.get("type") == "link":
            return content.get("metadata", {}).get("simulatedContent", "")
    return ""

def _format_vitals(vitals_list: List[Dict[str, Any]]) -> str:
    # Basic formatter for vitals history if available, else assumes currentStatus provided
    return str(vitals_list)

def analyze_vital_trends(query: str) -> Dict[str, Any]:
    """
    Analyzes the patient's vital signs (BP, HR, etc.) to identify trends and clinical significance.
    """
    patient = get_current_patient()
    
    # Extract relevant vital data from patient history or reports
    # Assuming 'recentVitals' or similar is in the patient object
    vitals = patient.get("currentStatus", {}).get("vitals", "No recent vitals available")
    
    prompt = f"""You are an expert cardiologist AI. Analyze the patient's vital signs.
    
    **Patient:** {patient.get('name')}, {patient.get('age')}y {patient.get('gender')}.
    **Condition:** {patient.get('currentStatus', {}).get('condition')}
    **Query:** "{query}"
    
    **Vital Data:**
    {vitals}
    
    **Task:**
    1. Identify trends in BP, HR, Weight, etc.
    2. Correlate with medications if possible.
    3. Provide a clinical assessment (Stable/Unstable/Improving/Deteriorating).
    4. Return JSON.
    """
    
    response_schema = {
        "type": Type.OBJECT,
        "properties": {
            "trends": {
                "type": Type.ARRAY,
                "items": {
                    "type": Type.OBJECT,
                    "properties": {
                        "metric": {"type": Type.STRING},
                        "trend": {"type": Type.STRING}, # e.g. "Uptrend", "Stable"
                        "significance": {"type": Type.STRING}
                    },
                    "required": ["metric", "trend", "significance"]
                }
            },
            "assessment": {"type": Type.STRING},
            "recommendations": {"type": Type.ARRAY, "items": {"type": Type.STRING}}
        },
        "required": ["trends", "assessment", "recommendations"]
    }

    try:
        response = client.models.generate_content(
            model='gemini-2.0-flash-exp', # Using standard flash
            contents=prompt,
            config=GenerateContentConfig(
                response_mime_type='application/json',
                response_schema=response_schema
            )
        )
        return json.loads(response.text)
    except Exception as e:
        return {"error": f"Failed to analyze vitals: {str(e)}"}


def analyze_differential_diagnosis(query: str) -> Dict[str, Any]:
    """
    Generates a differential diagnosis based on the patient's current symptoms and history.
    """
    patient = get_current_patient()
    
    # Gather context
    history = ", ".join([h.get('description', '') for h in patient.get('medicalHistory', [])])
    symptoms = patient.get('currentStatus', {}).get('symptoms', []) # Assuming symptoms field or extract from condition
    reports_text = []
    for r in patient.get('reports', [])[:5]: # Last 5 reports
        reports_text.append(f"{r.get('type')}: {_get_report_text(r)[:200]}...")
    reports_summary = "\n".join(reports_text)

    prompt = f"""You are a world-class diagnostic AI. Formulate a Differential Diagnosis.
    
    **Patient:** {patient.get('name')}, {patient.get('age')}y {patient.get('gender')}.
    **History:** {history}
    **Presenting Condition/Query:** {query}
    **Recent Reports:**
    {reports_summary}
    
    **Task:**
    1. List top 3-5 differentials ranked by likelihood.
    2. For each, explain 'Reason For' and 'Reason Against'.
    3. Recommend next diagnostic steps.
    4. Return JSON.
    """

    response_schema = {
        "type": Type.OBJECT,
        "properties": {
            "differentials": {
                "type": Type.ARRAY,
                "items": {
                    "type": Type.OBJECT,
                    "properties": {
                        "condition": {"type": Type.STRING},
                        "likelihood": {"type": Type.STRING}, # High, Medium, Low
                        "reasonFor": {"type": Type.STRING},
                        "reasonAgainst": {"type": Type.STRING}
                    },
                    "required": ["condition", "likelihood", "reasonFor", "reasonAgainst"]
                }
            },
            "recommendedWorkup": {"type": Type.ARRAY, "items": {"type": Type.STRING}},
            "clinicalReasoning": {"type": Type.STRING}
        },
        "required": ["differentials", "recommendedWorkup", "clinicalReasoning"]
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
        return {"error": f"Failed to generate DDx: {str(e)}"}

def analyze_ecg(query: str) -> Dict[str, Any]:
    """
    Analyzes the most recent ECG report for arrhythmias and conduction abnormalities.
    """
    patient = get_current_patient()
    reports = patient.get('reports', [])
    # Find ECGs
    ecg_report = next((r for r in sorted(reports, key=lambda x: x['date'], reverse=True) if r.get('type') == 'ECG'), None)
    
    if not ecg_report:
        return {"error": "No ECG report found for this patient."}

    prompt = f"""You are an expert Electrophysiologist. Analyze this ECG report.
    
    **Patient:** {patient.get('name')}
    **Report Date:** {ecg_report.get('date')}
    **Report Content:** {_get_report_text(ecg_report)}
    
    **Task:**
    1. Identify rhythm (Sinus, AFib, Flutter, etc.).
    2. Measure Intervals if available (PR, QRS, QT).
    3. Note ST/T changes.
    4. Provide interpretation.
    """
    
    # We can perform a structured extraction
    response_schema = {
        "type": Type.OBJECT,
        "properties": {
            "rhythm": {"type": Type.STRING},
            "intervals": {"type": Type.OBJECT, "properties": {"pr": {"type": Type.STRING}, "qrs": {"type": Type.STRING}, "qtc": {"type": Type.STRING}}},
            "st_t_changes": {"type": Type.STRING},
            "interpretation": {"type": Type.STRING},
            "criticalAlert": {"type": Type.BOOLEAN}
        },
        "required": ["rhythm", "interpretation", "criticalAlert"]
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
        return {"error": f"Failed to analyze ECG: {str(e)}"}

def analyze_arrhythmia_burden(query: str) -> Dict[str, Any]:
    """
    Analyzes Holter/monitor reports to quantify arrhythmia burden (AFib %, PVCs, PACs).
    """
    patient = get_current_patient()
    reports = patient.get('reports', [])
    holter_report = next((r for r in sorted(reports, key=lambda x: x['date'], reverse=True) if r.get('type') in ['Holter', 'Patch', 'Monitor']), None)
    
    if not holter_report:
        return {"error": "No Holter/Monitor report found."}

    prompt = f"""Analyze the Holter report for arrhythmia burden.
    **Report:** {_get_report_text(holter_report)}
    
    Extract: AFib burden %, Total PVCs, PACs, Pauses.
    """

    response_schema = {
        "type": Type.OBJECT,
        "properties": {
            "afibBurden": {"type": Type.STRING},
            "pvcCount": {"type": Type.STRING},
            "pacCount": {"type": Type.STRING},
            "pauses": {"type": Type.STRING},
            "interpretation": {"type": Type.STRING}
        },
        "required": ["afibBurden", "interpretation"]
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
        return {"error": f"Failed to analyze arrhythmia: {str(e)}"}
