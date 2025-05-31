import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ErrorState() {
    return (
        <div className="flex flex-col items-center justify-center h-96">
            <AlertCircle className="h-16 w-16 text-indigo-600 mb-4" />
            <h2 className="text-2xl font-bold text-indigo-900 mb-2">Project Not Found</h2>
            <p className="text-gray-600 mb-6">The project you're looking for doesn't exist or you don't have access.</p>
            <Button asChild className="bg-indigo-600 hover:bg-indigo-700">
                <Link href="/dashboard/projects">Return to Projects</Link>
            </Button>
        </div>
    );
}