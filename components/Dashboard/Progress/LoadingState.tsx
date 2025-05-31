import React from 'react';

export default function LoadingState() {
    return (
        <div className="flex items-center justify-center h-96">
            <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mb-4"></div>
                <p className="text-indigo-700">Loading project progress...</p>
            </div>
        </div>
    );
}