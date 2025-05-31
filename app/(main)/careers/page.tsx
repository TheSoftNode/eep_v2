import ComingSoonSection from '@/components/CommingSoon/ComingSoonSection';
import React from 'react';

const CareersPage: React.FC = () => {
    return (
        <div className="mx-auto">
            <ComingSoonSection
                title="Careers Portal Coming Soon"
                description="We're building a dedicated careers portal to showcase opportunities to join our growing team."
                features={[
                    "Detailed job descriptions and requirements",
                    "Online application submission system",
                    "Company culture and benefits information",
                    "Employee testimonials and team profiles"
                ]}
                badgeText="Launching Soon"
                launchDateString="2025-04-01T00:00:00"
            />
        </div>
    );
};

export default CareersPage;