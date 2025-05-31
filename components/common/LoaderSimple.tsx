import { Loader2 } from "lucide-react";

export default function LoaderSimple() {
    return (
        <div className="flex items-center justify-center py-20">
            <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 text-indigo-600 animate-pulse" />
                </div>
            </div>
        </div>
    );
}