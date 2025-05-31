import ComingSoonSection from '@/components/CommingSoon/ComingSoonSection';
import React from 'react';

const BlogPage: React.FC = () => {
    return (
        <div className=" mx-auto">
            <ComingSoonSection
                title="Blog Coming Soon"
                description="Our blog will feature insights, tutorials, industry news, and success stories to keep you informed and inspired."
                features={[
                    "Technical tutorials and deep dives",
                    "Industry trends and analysis",
                    "Customer success stories",
                    "Product updates and announcements"
                ]}
                badgeText="Content In Progress"
                launchDateString="2025-04-15T00:00:00"
            />
        </div>
    );
};

export default BlogPage;