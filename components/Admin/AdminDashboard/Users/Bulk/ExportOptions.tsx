"use client";
import React, { useState } from "react";
import {
    Download,
    Loader2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";



export const ExportOptions: React.FC<{
    onExport: (format: 'json' | 'csv', fields: string[]) => void;
    isExporting: boolean;
}> = ({ onExport, isExporting }) => {
    const [format, setFormat] = useState<'json' | 'csv'>('csv');
    const [selectedFields, setSelectedFields] = useState([
        'id', 'fullName', 'email', 'role', 'disabled', 'createdAt'
    ]);

    const availableFields = [
        { id: 'id', label: 'User ID' },
        { id: 'fullName', label: 'Full Name' },
        { id: 'email', label: 'Email' },
        { id: 'role', label: 'Role' },
        { id: 'disabled', label: 'Status' },
        { id: 'createdAt', label: 'Created Date' },
        { id: 'updatedAt', label: 'Updated Date' },
        { id: 'company', label: 'Company' },
        { id: 'website', label: 'Website' }
    ];

    const handleFieldToggle = (fieldId: string) => {
        setSelectedFields(prev =>
            prev.includes(fieldId)
                ? prev.filter(id => id !== fieldId)
                : [...prev, fieldId]
        );
    };

    return (
        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Download className="h-5 w-5" />
                    Export Users
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <Label className="text-sm font-medium">Export Format</Label>
                    <Select value={format} onValueChange={(value: 'json' | 'csv') => setFormat(value)}>
                        <SelectTrigger className="mt-1">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="csv">CSV (Comma Separated)</SelectItem>
                            <SelectItem value="json">JSON (JavaScript Object)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Label className="text-sm font-medium mb-3 block">Fields to Export</Label>
                    <div className="grid grid-cols-2 gap-2">
                        {availableFields.map(field => (
                            <div key={field.id} className="flex items-center space-x-2">
                                <Checkbox
                                    id={field.id}
                                    checked={selectedFields.includes(field.id)}
                                    onCheckedChange={() => handleFieldToggle(field.id)}
                                />
                                <Label htmlFor={field.id} className="text-sm">
                                    {field.label}
                                </Label>
                            </div>
                        ))}
                    </div>
                </div>

                <Button
                    onClick={() => onExport(format, selectedFields)}
                    disabled={selectedFields.length === 0 || isExporting}
                    className="w-full bg-indigo-600 hover:bg-indigo-700"
                >
                    {isExporting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    {isExporting ? 'Exporting...' : `Export as ${format.toUpperCase()}`}
                </Button>
            </CardContent>
        </Card>
    );
};