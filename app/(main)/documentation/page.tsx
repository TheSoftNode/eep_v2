import ComingSoonSection from '@/components/CommingSoon/ComingSoonSection';
import React from 'react';

const DocumentationPage: React.FC = () => {
    return (
        <div className="mx-auto">
            <ComingSoonSection
                title="Documentation Coming Soon"
                description="Our comprehensive documentation is being carefully prepared to help you get the most out of our platform."
                features={[
                    "Step-by-step tutorials and guides",
                    "API reference documentation",
                    "Code examples and best practices",
                    "Troubleshooting and FAQ section"
                ]}
                badgeText="In Development"
                launchDateString="2025-05-15T00:00:00"
            />
        </div>
    );
};

export default DocumentationPage;