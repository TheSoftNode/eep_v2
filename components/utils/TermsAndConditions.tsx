import React, { useState, useEffect } from 'react';
import { Loader2Icon } from 'lucide-react';
import mammoth from 'mammoth';
import { cn } from "@/lib/utils";

const TermsAndConditions: React.FC = () => {
    const [termsContent, setTermsContent] = useState<string>('');
    const [isLoadingTerms, setIsLoadingTerms] = useState(false);

    const loadTermsContent = async () => {
        try {
            setIsLoadingTerms(true);
            const response = await fetch('/terms_and_conditions.docx');
            const arrayBuffer = await response.arrayBuffer();
            const result = await mammoth.convertToHtml({ arrayBuffer });
            setTermsContent(result.value);
        } catch (error) {
            console.error('Error loading terms:', error);
            setTermsContent('Error loading terms and conditions. Please try again later.');
        } finally {
            setIsLoadingTerms(false);
        }
    };

    useEffect(() => {
        loadTermsContent();
    }, []);

    if (isLoadingTerms) {
        return (
            <div className="min-h-[200px] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2Icon className="h-8 w-8 animate-spin text-blue-500" />
                    <p className="text-sm text-gray-500">Loading terms and conditions...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className={cn(
                "terms-content",
                "prose prose-sm max-w-none",
                "prose-headings:text-gray-900",
                "prose-p:text-gray-600",
                "prose-a:text-blue-600 prose-a:no-underline hover:prose-a:text-blue-700",
                "prose-strong:text-gray-800",
                "prose-ul:list-disc prose-ul:ml-6",
                "prose-ol:list-decimal prose-ol:ml-6",
            )}>
                <div dangerouslySetInnerHTML={{ __html: termsContent }} />
            </div>
        </div>
    );
};

export default TermsAndConditions;