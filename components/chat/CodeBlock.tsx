import React, { useState } from 'react';
import { Copy } from 'lucide-react';

interface CodeBlockProps {
    language?: string;
    value: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ language, value }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative group bg-gray-50 border border-gray-200 rounded-md my-3">
            <div className="absolute top-2 right-2">
                <button
                    onClick={handleCopy}
                    className="p-1 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs flex items-center opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label={copied ? "Copied" : "Copy code"}
                >
                    {copied ? 'Copied!' : <Copy className="h-3.5 w-3.5" />}
                </button>
            </div>
            <div className="overflow-x-auto p-4 font-mono text-sm">
                <pre>{value}</pre>
            </div>
            {language && (
                <div className="absolute bottom-2 right-2 text-xs text-gray-500 opacity-50">{language}</div>
            )}
        </div>
    );
};

export default CodeBlock;