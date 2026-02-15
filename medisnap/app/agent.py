# ruff: noqa
# Copyright 2026 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

import datetime
from zoneinfo import ZoneInfo

from google.adk.agents import Agent
from google.adk.apps import App
from google.adk.models import Gemini
from google.adk.tools import LongRunningFunctionTool
from google.genai import types

import os
import google.auth
from app.tools import ALL_MEDICAL_TOOLS # Import our new toolset

_, project_id = google.auth.default()
os.environ["GOOGLE_CLOUD_PROJECT"] = project_id
os.environ["GOOGLE_CLOUD_LOCATION"] = "global"
os.environ["GOOGLE_GENAI_USE_VERTEXAI"] = "True"


def request_user_input(message: str) -> dict:
    """Request additional input from the user.

    Use this tool when you need more information from the user to complete a task.
    Calling this tool will pause execution until the user responds.

    Args:
        message: The question or clarification request to show the user.
    """
    return {"status": "pending", "message": message}


instruction = """You are an advanced Medical AI Assistant specialized in clinical decision support.
You have access to a suite of specialized tools to analyze patient data, run diagnostics, check guidelines, and simulate specialist consultations.

**Your Goal:** Provide accurate, evidence-based, and safe medical analysis.

**Guidelines:**
1. **Safety First:** Always prioritize patient safety. If critical findings are detected (e.g., in ECG or Vitals), highlight them immediately.
2. **Use Tools:** Do not hallucinate values. ALWAYS use the provided tools (e.g., `analyze_vital_trends`, `consult_cardiology`) to inspect patient data.
3. **Context Awareness:** The patient's data is implicitly available to your tools. You do not need to ask for it if the user query implies it is present.
4. **Professional Tone:** Maintain a clinical, professional tone suitable for a physician user.

**Capabilities:**
- **Diagnostics:** Analysis of trends, Lab results, ECGs, Rhythm formats.
- **Treatment:** GDMT adherence checks, Drug interactions, Dosage optimization.
- **Consults:** You can 'consult' virtual specialists (Cardiology, Neuro, etc.) for domain-specific insights.
- **Workflow:** Generate SOAP notes, Summaries, and run Board Reviews.
"""

root_agent = Agent(
    name="medical_agent", # Renamed logic name, valid for A2A
    model=Gemini(
        model="gemini-2.0-flash-exp", # Upgraded model
        retry_options=types.HttpRetryOptions(attempts=3),
    ),
    description="An AI specialized in medical analysis and clinical decision support.",
    instruction=instruction,
    tools=ALL_MEDICAL_TOOLS + [LongRunningFunctionTool(func=request_user_input)],
)

app = App(
    root_agent=root_agent,
    name="app",
)
