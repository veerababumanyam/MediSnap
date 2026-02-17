
import React from 'react';
import { useAppContext } from '../contexts/AppContext';

interface ChatHeaderStitchProps {
    onOpenSettings?: () => void;
}

export const ChatHeaderStitch: React.FC<ChatHeaderStitchProps> = ({ onOpenSettings }) => {
    const { state } = useAppContext();
    const { isChatLoading } = state;

    return (
        <header className="sticky top-0 z-50 backdrop-blur-md bg-white/70 dark:bg-stitch-accent-dark/70 border-b border-gray-200/50 dark:border-white/10 px-4 py-3 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
                <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-stitch-primary/20 flex items-center justify-center border border-stitch-primary/30">
                        <span className="material-symbols-outlined text-stitch-primary">clinical_notes</span>
                    </div>
                    <div className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-white dark:border-stitch-bg-dark rounded-full ${isChatLoading ? 'bg-yellow-400 animate-pulse' : 'bg-stitch-primary'}`}></div>
                </div>
                <div>
                    <h1 className="text-lg font-bold leading-none tracking-tight text-gray-900 dark:text-white font-display">Zentis AI</h1>
                    <span className="text-[10px] uppercase tracking-widest text-stitch-primary font-bold">
                        {isChatLoading ? 'Processing...' : 'Online Assistant'}
                    </span>
                </div>
            </div>
            <button
                onClick={onOpenSettings}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-white/5 transition-colors text-gray-600 dark:text-gray-300"
            >
                <span className="material-symbols-outlined">settings</span>
            </button>
        </header>
    );
};
