from contextvars import ContextVar
from typing import Any, Dict, Optional

# Context variable to hold the patient data for the current request
# We store it as a Dict/Any for flexibility, or we could define a Pydantic model
current_patient: ContextVar[Optional[Dict[str, Any]]] = ContextVar("current_patient", default=None)

def get_current_patient() -> Dict[str, Any]:
    """Retrieves the patient data for the current request context."""
    patient = current_patient.get()
    if patient is None:
        raise ValueError("No patient context active. Ensure this tool is called within a request context.")
    return patient
