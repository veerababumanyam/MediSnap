
import React from 'react';

interface QuickActionsStitchProps {
    onAction: (action: string) => void;
}

export const QuickActionsStitch: React.FC<QuickActionsStitchProps> = ({ onAction }) => {
    return (
        <div className="flex gap-2 px-4 overflow-x-auto no-scrollbar pb-4 pt-2">
            <button
                onClick={() => onAction('upload_report')}
                className="whitespace-nowrap flex items-center gap-2 px-4 py-2 rounded-full bg-stitch-primary text-stitch-bg-dark text-xs font-bold transition-transform active:scale-95 shadow-md hover:shadow-lg"
            >
                <span className="material-symbols-outlined text-sm">upload_file</span>
                Upload Report
            </button>
            <button
                onClick={() => onAction('view_vitals')}
                className="whitespace-nowrap flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-bold hover:bg-white/10 text-gray-700 dark:text-gray-200"
            >
                <span className="material-symbols-outlined text-sm">monitor_heart</span>
                View Vitals
            </button>
            <button
                onClick={() => onAction('analyze_symptoms')}
                className="whitespace-nowrap flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-bold hover:bg-white/10 text-gray-700 dark:text-gray-200"
            >
                <span className="material-symbols-outlined text-sm">medical_services</span>
                Analyze Symptoms
            </button>
            <button
                onClick={() => onAction('emergency')}
                className="whitespace-nowrap flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/20 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-bold hover:bg-red-500/30"
            >
                <span className="material-symbols-outlined text-sm">emergency_home</span>
                Emergency
            </button>
            <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
        </div>
    );
};
