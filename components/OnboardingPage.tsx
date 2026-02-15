import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import type { UserRole, UserProfile } from '../types';

export const OnboardingPage: React.FC = () => {
    const { user, refreshProfile } = useAuth();
    const [role, setRole] = useState<UserRole | null>(null);
    const [age, setAge] = useState('');
    const [gender, setGender] = useState<string>('');
    const [apiKey, setApiKey] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleCompleteOnboarding = async () => {
        if (!user || !role) return;
        setIsSubmitting(true);
        try {
            const baseProfile: UserProfile = {
                uid: user.uid,
                email: user.email || '',
                displayName: user.displayName || 'User',
                photoURL: user.photoURL || '',
                role,
                geminiApiKey: apiKey,
                createdAt: Date.now()
            };

            let finalProfile: any = { ...baseProfile };

            if (role === 'patient') {
                finalProfile = {
                    ...finalProfile,
                    age: parseInt(age) || 0,
                    gender: gender || 'Other',
                    reports: [],
                    allergies: [],
                    medicalHistory: [],
                    vitalsLog: [],
                    tasks: [],
                    currentStatus: {
                        condition: 'Healthy',
                        vitals: 'BP 120/80',
                        medications: []
                    }
                };
            }

            await setDoc(doc(db, 'users', user.uid), finalProfile);
            await refreshProfile();
        } catch (error) {
            console.error("Error creating profile:", error);
            alert("Failed to create profile. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
            <div className="max-w-md w-full p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl space-y-8 glass-panel border border-white/20">
                <div className="text-center">
                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">Welcome to MediaSnap</h2>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">Let's set up your profile.</p>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">I am a...</label>
                        <div className="grid grid-cols-2 gap-4">
                            {(['doctor', 'patient', 'nurse'] as UserRole[]).map((r) => (
                                <button
                                    key={r}
                                    onClick={() => setRole(r)}
                                    className={`p-4 rounded-xl border transition-all duration-200 capitalize ${role === r
                                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 ring-2 ring-blue-500/50'
                                        : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
                                        }`}
                                >
                                    {r}
                                </button>
                            ))}
                        </div>
                    </div>

                    {role === 'patient' && (
                        <div className="grid grid-cols-2 gap-4 animate-fadeIn">
                            <div>
                                <label className="block text-sm font-medium mb-2">Age</label>
                                <input
                                    type="number"
                                    value={age}
                                    onChange={(e) => setAge(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Gender</label>
                                <select
                                    value={gender}
                                    onChange={(e) => setGender(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
                                >
                                    <option value="">Select</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium mb-2">Gemini API Key (Optional)</label>
                        <input
                            type="password"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder="Enter your API Key"
                            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        />
                        <p className="mt-2 text-xs text-gray-500">
                            Required for AI features. You can add this later in settings.
                            <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-blue-500 hover:underline ml-1">Get a key</a>
                        </p>
                    </div>

                    <button
                        onClick={handleCompleteOnboarding}
                        disabled={!role || isSubmitting || (role === 'patient' && (!age || !gender))}
                        className={`w-full py-3.5 rounded-xl font-semibold text-white transition-all shadow-lg ${!role || isSubmitting || (role === 'patient' && (!age || !gender))
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-[1.02] shadow-blue-500/25'
                            }`}
                    >
                        {isSubmitting ? 'Setting up...' : 'Complete Setup'}
                    </button>
                </div>
            </div>
        </div>
    );
};
