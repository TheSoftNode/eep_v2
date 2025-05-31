import ComingSoonSection from '@/components/CommingSoon/ComingSoonSection';
import React from 'react';

const NewAIWorkspacePage: React.FC = () => {
    return (
        <div className="mx-auto">
            <ComingSoonSection
                title="AI Workspace Coming Soon"
                description="Our advanced AI-powered workspace is being built to revolutionize your development workflow."
                features={[
                    "AI-assisted code generation and completion",
                    "Intelligent error detection and correction",
                    "Automated testing and optimization",
                    "Personalized learning recommendations",
                    "Real-time collaboration with AI suggestions"
                ]}
                badgeText="Under Active Development"
                launchDateString="2025-06-30T00:00:00"
            />
        </div>
    );
};

export default NewAIWorkspacePage;