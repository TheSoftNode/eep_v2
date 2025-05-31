"use client";

import React from "react";
import UserActivityChart from "../Charts/UserActivityChart";
import RecentRegistrations from "../Tables/RecentRegistrations";
import SystemNotifications from "../Notifications/SystemNotifications";
import QuickActions from "../Actions/QuickActions";


const SecondRow: React.FC = () => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
            {/* Left Side (60%) */}
            <div className="lg:col-span-3 space-y-6">
                <UserActivityChart />
                <RecentRegistrations />
            </div>

            {/* Right Side (40%) */}
            <div className="lg:col-span-2 space-y-6">
                <SystemNotifications />
                <QuickActions />
            </div>
        </div>
    );
};

export default SecondRow;