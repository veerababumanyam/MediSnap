import requests
import json
import base64

# Mock Patient Data
patient = {
    "id": "p1",
    "name": "John Doe",
    "age": 65,
    "gender": "Male",
    "currentStatus": {
        "condition": "Heart Failure",
        "vitals": "BP 120/80, HR 70",
        "medications": ["Lisinopril", "Metoprolol"]
    },
    "reports": [],
    "medicalHistory": []
}

# Encode Context
ctx_json = json.dumps(patient)
ctx_b64 = base64.b64encode(ctx_json.encode('utf-8')).decode('utf-8')

headers = {
    "Content-Type": "application/json",
    "X-Patient-Context": ctx_b64
}

data = {
    "prompt": "Check guideline adherence for this patient."
}

print("Sending request to http://localhost:8000/chat...")
try:
    response = requests.post("http://localhost:8000/chat", headers=headers, json=data)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
    
    if response.status_code == 200:
        print("\nSUCCESS: Backend Agent responded.")
    else:
        print("\nFAILURE: Backend Agent returned error.")

except Exception as e:
    print(f"\nFAILURE: Connection failed. Ensure server is running. Error: {e}")
