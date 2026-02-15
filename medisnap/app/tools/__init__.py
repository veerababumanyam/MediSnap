from .diagnostics import (
    analyze_vital_trends,
    analyze_differential_diagnosis,
    analyze_ecg,
    analyze_arrhythmia_burden,
)
from .treatment import (
    check_guideline_adherence,
    check_medication_safety,
    optimize_dosage,
)
from .specialties import (
    consult_cardiology,
    consult_neurology,
    consult_oncology,
    consult_gastroenterology,
    consult_pulmonology,
    consult_endocrinology,
    consult_nephrology,
    consult_hematology,
    consult_infectious_disease,
)
from .workflow import (
    generate_clinical_note,
    generate_patient_summary,
    run_medical_board_review,
)

ALL_MEDICAL_TOOLS = [
    analyze_vital_trends,
    analyze_differential_diagnosis,
    analyze_ecg,
    analyze_arrhythmia_burden,
    check_guideline_adherence,
    check_medication_safety,
    optimize_dosage,
    consult_cardiology,
    consult_neurology,
    consult_oncology,
    consult_gastroenterology,
    consult_pulmonology,
    consult_endocrinology,
    consult_nephrology,
    consult_hematology,
    consult_infectious_disease,
    generate_clinical_note,
    generate_patient_summary,
    run_medical_board_review,
]
