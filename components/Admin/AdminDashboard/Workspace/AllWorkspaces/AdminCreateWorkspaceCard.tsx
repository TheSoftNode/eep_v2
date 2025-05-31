import React from 'react';
import { Plus, Sparkles } from 'lucide-react';

interface AdminCreateWorkspaceCardProps {
    onClick: () => void;
}

const AdminCreateWorkspaceCard: React.FC<AdminCreateWorkspaceCardProps> = ({ onClick }) => {
    return (
        <div
            onClick={onClick}
            className="cursor-pointer rounded-xl overflow-hidden bg-white dark:bg-slate-900 border-2 border-dashed border-indigo-300 dark:border-indigo-700 hover:border-indigo-500 dark:hover:border-indigo-500 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col items-center justify-center p-8 h-full min-h-[280px] group"
        >
            {/* Animated background on hover */}
            {/* <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-900/20 dark:to-purple-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-xl" /> */}

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center">
                <div className="rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900/50 dark:to-indigo-800/50 p-4 mb-4 group-hover:scale-110 transition-transform duration-200">
                    <Plus className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                </div>

                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2 text-center">
                    Create New Workspace
                </h3>

                <p className="text-slate-500 dark:text-slate-400 text-sm text-center max-w-xs leading-relaxed">
                    Set up a collaborative workspace for your team with projects, resources, and learning paths
                </p>

                {/* Feature hints */}
                <div className="mt-4 flex items-center gap-4 text-xs text-slate-400 dark:text-slate-500">
                    <div className="flex items-center gap-1">
                        <Sparkles className="h-3 w-3" />
                        <span>AI-Powered</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="h-2 w-2 rounded-full bg-indigo-400"></div>
                        <span>Multi-Project</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminCreateWorkspaceCard;