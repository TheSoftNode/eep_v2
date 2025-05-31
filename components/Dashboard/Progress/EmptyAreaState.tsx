import React from 'react';
import { Layout } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function EmptyAreaState() {
    return (
        <Card className="border-dashed border-2 border-indigo-200 bg-indigo-50/30">
            <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                <Layout className="h-12 w-12 text-indigo-400 mb-4" />
                <h3 className="text-lg font-medium text-indigo-900 mb-2">No Project Areas Defined</h3>
                <p className="text-gray-600 max-w-md mb-6">
                    This project doesn't have any defined areas for tracking progress yet.
                </p>
                <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                    Add Project Area
                </Button>
            </CardContent>
        </Card>
    );
}

