"use client";

import React from "react";
import UserDistributionChart from "../Charts/UserDistributionChart";
import PopularLearningPaths from "../Lists/PopularLearningPaths";
import RecentActivitiesFeed from "../Activities/RecentActivitiesFeed";
import PendingApprovals from "../Approvals/PendingApprovals";

const ThirdRow: React.FC = () => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Left Side */}
            <div className="space-y-6">
                <UserDistributionChart />
                <PopularLearningPaths />
            </div>

            {/* Right Side */}
            <div className="space-y-6">
                <RecentActivitiesFeed />
                <PendingApprovals />
            </div>
        </div>
    );
};

export default ThirdRow;