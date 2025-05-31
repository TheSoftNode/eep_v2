import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function EmptyTaskState() {
    return (
        <Card className="border-dashed border-2 border-indigo-200 bg-indigo-50/30">
            <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                <CheckCircle2 className="h-12 w-12 text-indigo-400 mb-4" />
                <h3 className="text-lg font-medium text-indigo-900 mb-2">No Tasks Created</h3>
                <p className="text-gray-600 max-w-md mb-6">
                    This project doesn't have any tasks created yet.
                </p>
                <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                    Add Task
                </Button>
            </CardContent>
        </Card>
    );
}