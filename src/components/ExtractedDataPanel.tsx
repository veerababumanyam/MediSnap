/**
 * ExtractedDataPanel
 * 
 * Displays structured clinical data extracted from uploaded documents.
 * Shows medications, lab results, vital signs, and diagnoses in
 * collapsible, color-coded sections with extraction status indicators.
 */

import React, { useState, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { SparklesIcon } from './icons/SparklesIcon';

// --- Sub-components ---

const SectionHeader: React.FC<{ 
    title: string; 
    count: number; 
    color: string;
    icon: React.ReactNode;
    isOpen: boolean; 
    onToggle: () => void 
}> = ({ title, count, color, icon, isOpen, onToggle }) => (
    <button 
        onClick={onToggle}
        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
            isOpen ? `${color} shadow-sm` : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
        }`}
    >
        <span className="flex items-center gap-2">
            {icon}
            {title}
            {count > 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                    isOpen ? 'bg-white/20 text-white' : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                }`}>
                    {count}
                </span>
            )}
        </span>
        <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
    </button>
);

const EmptyState: React.FC<{ message: string }> = ({ message }) => (
    <div className="py-3 px-3 text-center">
        <p className="text-xs text-gray-400 dark:text-gray-500 italic">{message}</p>
    </div>
);

// --- Icons for sections ---
const PillIcon = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
);

const BeakerIcon = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
    </svg>
);

const HeartPulseIcon = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
);

const ClipboardIcon = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
);

// --- Extraction Progress Banner ---
const ExtractionProgressBanner: React.FC = () => {
    const { actions } = useAppContext();
    const progress = actions.extractionProgress;

    if (!progress || progress.status === 'completed' || progress.status === 'idle') return null;

    const statusColors: Record<string, string> = {
        extracting: 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300',
        saving: 'bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300',
        failed: 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300',
    };

    return (
        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs ${statusColors[progress.status] || statusColors.extracting}`}>
            {progress.status === 'extracting' || progress.status === 'saving' ? (
                <SparklesIcon className="w-4 h-4 animate-pulse flex-shrink-0" />
            ) : (
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            )}
            <span className="truncate">{progress.message}</span>
        </div>
    );
};

// --- Main Panel ---

export const ExtractedDataPanel: React.FC = () => {
    const { actions } = useAppContext();
    const data = actions.extractedData;
    
    const [openSections, setOpenSections] = useState<Record<string, boolean>>({
        medications: true,
        labs: false,
        vitals: false,
        diagnoses: false
    });

    const toggleSection = (section: string) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    if (!data) {
        return (
            <div className="p-3 space-y-3">
                <ExtractionProgressBanner />
                <EmptyState message="Upload health documents to see extracted clinical data here." />
            </div>
        );
    }

    const hasAnyData = data.medications.length > 0 || data.labs.length > 0 || data.vitals.length > 0 || data.diagnoses.length > 0;

    if (!hasAnyData) {
        return (
            <div className="p-3 space-y-3">
                <ExtractionProgressBanner />
                <div className="text-center py-4">
                    <SparklesIcon className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                    <p className="text-xs text-gray-400 dark:text-gray-500">No extracted data yet.</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Upload documents to automatically extract medications, labs, vitals & diagnoses.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-2 p-2">
            <ExtractionProgressBanner />
            
            {/* --- MEDICATIONS --- */}
            <SectionHeader 
                title="Medications" 
                count={data.medications.length} 
                color="bg-purple-600 text-white"
                icon={<PillIcon />}
                isOpen={openSections.medications} 
                onToggle={() => toggleSection('medications')} 
            />
            {openSections.medications && (
                <div className="pl-1 space-y-1">
                    {data.medications.length === 0 ? (
                        <EmptyState message="No medications extracted." />
                    ) : (
                        data.medications.map((med, idx) => (
                            <div key={med.id || idx} className="flex items-start gap-2 px-3 py-2 bg-white dark:bg-gray-800 rounded-md border border-gray-100 dark:border-gray-700">
                                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                                    med.status === 'active' ? 'bg-green-500' : med.status === 'stopped' ? 'bg-red-500' : 'bg-yellow-500'
                                }`} />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{med.name}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {med.dose} · {med.frequency}
                                        {med.route ? ` · ${med.route}` : ''}
                                    </p>
                                    {med.indication && (
                                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 italic">For: {med.indication}</p>
                                    )}
                                </div>
                                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                                    med.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                    med.status === 'stopped' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                    'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                }`}>
                                    {med.status}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* --- LAB RESULTS --- */}
            <SectionHeader 
                title="Lab Results" 
                count={data.labs.length} 
                color="bg-blue-600 text-white"
                icon={<BeakerIcon />}
                isOpen={openSections.labs} 
                onToggle={() => toggleSection('labs')} 
            />
            {openSections.labs && (
                <div className="pl-1 space-y-1">
                    {data.labs.length === 0 ? (
                        <EmptyState message="No lab results extracted." />
                    ) : (
                        <div className="bg-white dark:bg-gray-800 rounded-md border border-gray-100 dark:border-gray-700 overflow-hidden">
                            <table className="w-full text-xs">
                                <thead>
                                    <tr className="bg-gray-50 dark:bg-gray-750 text-gray-500 dark:text-gray-400">
                                        <th className="text-left px-3 py-1.5 font-medium">Test</th>
                                        <th className="text-right px-3 py-1.5 font-medium">Value</th>
                                        <th className="text-left px-2 py-1.5 font-medium">Ref</th>
                                        <th className="text-right px-3 py-1.5 font-medium">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.labs.slice(0, 20).map((lab, idx) => (
                                        <tr key={lab.id || idx} className="border-t border-gray-50 dark:border-gray-700">
                                            <td className="px-3 py-1.5 text-gray-800 dark:text-gray-200 font-medium">{lab.testName}</td>
                                            <td className={`px-3 py-1.5 text-right font-mono ${
                                                lab.isAbnormal ? 'text-red-600 dark:text-red-400 font-bold' : 'text-gray-700 dark:text-gray-300'
                                            }`}>
                                                {lab.value} {lab.unit}
                                                {lab.isAbnormal && ' ⚠'}
                                            </td>
                                            <td className="px-2 py-1.5 text-gray-400 dark:text-gray-500">{lab.referenceRange || '—'}</td>
                                            <td className="px-3 py-1.5 text-right text-gray-400 dark:text-gray-500">{lab.date}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {data.labs.length > 20 && (
                                <p className="text-center text-xs text-gray-400 py-1.5">
                                    + {data.labs.length - 20} more results
                                </p>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* --- VITAL SIGNS --- */}
            <SectionHeader 
                title="Vital Signs" 
                count={data.vitals.length} 
                color="bg-rose-600 text-white"
                icon={<HeartPulseIcon />}
                isOpen={openSections.vitals} 
                onToggle={() => toggleSection('vitals')} 
            />
            {openSections.vitals && (
                <div className="pl-1 space-y-1">
                    {data.vitals.length === 0 ? (
                        <EmptyState message="No vital signs extracted." />
                    ) : (
                        <div className="grid grid-cols-2 gap-1.5">
                            {data.vitals.slice(0, 12).map((vital, idx) => (
                                <div key={vital.id || idx} className="px-3 py-2 bg-white dark:bg-gray-800 rounded-md border border-gray-100 dark:border-gray-700">
                                    <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider">{vital.type}</p>
                                    <p className="text-sm font-bold text-gray-800 dark:text-gray-200 mt-0.5">
                                        {vital.type === 'BP' ? `${vital.value}/${vital.value2 || '?'}` : vital.value}
                                        <span className="text-xs font-normal text-gray-500 ml-1">{vital.unit}</span>
                                    </p>
                                    <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">{vital.date}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* --- DIAGNOSES --- */}
            <SectionHeader 
                title="Diagnoses" 
                count={data.diagnoses.length} 
                color="bg-amber-600 text-white"
                icon={<ClipboardIcon />}
                isOpen={openSections.diagnoses} 
                onToggle={() => toggleSection('diagnoses')} 
            />
            {openSections.diagnoses && (
                <div className="pl-1 space-y-1">
                    {data.diagnoses.length === 0 ? (
                        <EmptyState message="No diagnoses extracted." />
                    ) : (
                        data.diagnoses.map((dx, idx) => (
                            <div key={dx.id || idx} className="flex items-start gap-2 px-3 py-2 bg-white dark:bg-gray-800 rounded-md border border-gray-100 dark:border-gray-700">
                                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                                    dx.status === 'active' ? 'bg-amber-500' : dx.status === 'resolved' ? 'bg-green-500' : 'bg-gray-400'
                                }`} />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{dx.name}</p>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        {dx.icd10 && (
                                            <span className="text-[10px] px-1 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded font-mono">
                                                {dx.icd10}
                                            </span>
                                        )}
                                        <span className={`text-[10px] capitalize ${
                                            dx.status === 'active' ? 'text-amber-600 dark:text-amber-400' :
                                            dx.status === 'resolved' ? 'text-green-600 dark:text-green-400' :
                                            'text-gray-400'
                                        }`}>
                                            {dx.status}
                                        </span>
                                        {dx.onsetDate && (
                                            <span className="text-[10px] text-gray-400 dark:text-gray-500">since {dx.onsetDate}</span>
                                        )}
                                    </div>
                                    {dx.notes && (
                                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 italic">{dx.notes}</p>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};
