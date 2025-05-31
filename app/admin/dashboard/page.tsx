import BottomRow from "@/components/Admin/AdminDashboard/Overview/BottomRow";
import DashboardMetrics from "@/components/Admin/AdminDashboard/Overview/Metrics/DashboardMetrics";
import SecondRow from "@/components/Admin/AdminDashboard/Overview/SecondRow";
import ThirdRow from "@/components/Admin/AdminDashboard/Overview/ThirdRow";
import React from "react";

const AdminDashboardPage: React.FC = () => {
    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                        Admin Dashboard
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">
                        Overview of system performance and user activity
                    </p>
                </div>
            </div>

            {/* Top Row - Key Metrics Cards (4 cards) */}
            <DashboardMetrics />

            {/* Second Row - Split Layout */}
            <SecondRow />

            {/* Placeholder for remaining rows */}
            {/* <div className="text-center text-slate-400 py-8"> */}
            <ThirdRow />
            {/* </div> */}
            <BottomRow />
        </div>
    );
};

export default AdminDashboardPage;