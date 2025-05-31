import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { FolderOpen } from "lucide-react";

interface EmptyStateProps {
    title: string;
    description: string;
    actionLabel?: string;
    actionOnClick?: () => void;
    icon?: ReactNode;
}

export default function EmptyState({
    title,
    description,
    actionLabel,
    actionOnClick,
    icon,
}: EmptyStateProps) {
    return (
        <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                {icon || <FolderOpen className="h-6 w-6 text-gray-400" />}
            </div>
            <h3 className="mt-3 text-lg font-medium text-gray-900">{title}</h3>
            <p className="mt-2 text-sm text-gray-500 max-w-sm mx-auto">
                {description}
            </p>
            {actionLabel && actionOnClick && (
                <div className="mt-6">
                    <Button onClick={actionOnClick}>
                        {actionLabel}
                    </Button>
                </div>
            )}
        </div>
    );
}