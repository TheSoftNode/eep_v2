"use client";

import React from "react";
import ProjectStatusOverview from "../Projects/ProjectStatusOverview";
import WorkspaceUsageAnalytics from "../Workspace/WorkspaceUsageAnalytics";

const BottomRow: React.FC = () => {
    return (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
            <ProjectStatusOverview />
            <WorkspaceUsageAnalytics />
        </div>
    );
};

export default BottomRow;