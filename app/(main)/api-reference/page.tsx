import ComingSoonSection from '@/components/CommingSoon/ComingSoonSection';
import React from 'react';

const APIPage: React.FC = () => {
    return (
        <div className="mx-auto">
            <ComingSoonSection
                title="API Access Coming Soon"
                description="Our developer API is being finalized to allow seamless integration with our platform."
                features={[
                    "RESTful API endpoints for all core functionality",
                    "Comprehensive authentication system",
                    "Webhooks for real-time event notifications",
                    "Rate limiting and usage analytics"
                ]}
                badgeText="Coming Q2 2025"
                launchDateString="2025-04-30T00:00:00"
            />
        </div>
    );
};

export default APIPage;
