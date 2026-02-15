/*
 * Test Script for Database Interop
 * 
 * Verifies:
 * 1. Creating a patient with demographics (Legacy/Top-level)
 * 2. Adding granular data (Medication, Lab) via new service methods
 * 3. Fetching the patient via getPatient() aggregator
 * 4. Verifying the aggregated object contains the new data
 */

import * as dotenv from 'dotenv';
import { initializeApp } from "firebase/app";

// Load environment variables BEFORE importing services that depend on them
const result = dotenv.config({ path: '.env.local' });
if (result.error) {
    console.error("Error loading .env.local:", result.error);
}
console.log("Loaded API Key:", process.env.VITE_FIREBASE_API_KEY ? "YES (starts with " + process.env.VITE_FIREBASE_API_KEY.substring(0, 5) + ")" : "NO");

export const runDatabaseVerification = async () => {
    // Dynamic import to ensure env vars are loaded first
    const {
        savePatientDemographics,
        addMedication,
        addLabResult,
        getPatient,
        saveExtractedData
    } = await import('../src/services/ehrService.ts');

    console.log("Starting Database Verification...");
    const testId = `test_patient_${Date.now()}`;

    // 1. Create Patient Demographics
    console.log(`Creating patient ${testId}...`);
    await savePatientDemographics(testId, {
        id: testId,
        name: "Test Patient Zero",
        age: 45,
        gender: "Male",
        dob: "1980-01-01",
        createdAt: Date.now(),
        updatedAt: Date.now()
    });

    // 2. Add Medication (Granular)
    console.log("Adding Medication...");
    await addMedication(testId, {
        name: "Lisinopril",
        dose: "10mg",
        frequency: "daily",
        status: "active",
        createdAt: Date.now()
    } as any);

    // 3. Add Lab Result (Granular)
    console.log("Adding Lab Result...");
    await addLabResult(testId, {
        testName: "Creatinine",
        value: 1.2,
        unit: "mg/dL",
        date: new Date().toISOString(),
        createdAt: Date.now()
    } as any);

    // 4. Test Extraction Save
    console.log("Testing saveExtractedData...");
    await saveExtractedData(testId, "report_123", {
        medications: [],
        labs: [],
        vitals: [{ type: "BP", value: 120, value2: 80, unit: "mmHg", date: new Date().toISOString() }],
        diagnoses: [{ name: "Hypertension", status: "active", icd10: "I10" }]
    });

    // 5. Aggregate and Verify
    console.log("Fetching Aggregated Patient...");
    const patient = await getPatient(testId);

    if (!patient) {
        console.error("FAILED: Patient not found.");
        return;
    }

    console.log("Patient Fetched:", patient.name);

    // Verify Meds (mapped to string array)
    const hasMed = patient.currentStatus.medications.some(m => m.includes("Lisinopril"));
    console.log(`Verification - Medication (Lisinopril): ${hasMed ? "PASS" : "FAIL"}`);

    // Verify Vitals (from extraction)
    const hasBP = patient.currentStatus.vitals.includes("BP 120/80");
    console.log(`Verification - Vitals (BP 120/80): ${hasBP ? "PASS" : "FAIL"}`);

    // Verify Diagnoses (Medical History)
    const hasDiagnosis = patient.medicalHistory.some(h => h.description === "Hypertension");
    console.log(`Verification - Diagnosis (Hypertension): ${hasDiagnosis ? "PASS" : "FAIL"}`);

    console.log("Database Verification Complete.");
};

runDatabaseVerification().catch(console.error);
