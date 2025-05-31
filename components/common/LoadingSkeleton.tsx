interface LoadingSkeletonProps {
    count?: number;
    height?: number;
    className?: string;
}

export default function LoadingSkeleton({
    count = 1,
    height = 100,
    className = "",
}: LoadingSkeletonProps) {
    return (
        <div className="space-y-4">
            {Array.from({ length: count }).map((_, index) => (
                <div
                    key={index}
                    className={`animate-pulse rounded-lg bg-gray-200 ${className}`}
                    style={{ height: `${height}px` }}
                ></div>
            ))}
        </div>
    );
}