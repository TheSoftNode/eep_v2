import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, BarChart3, Sparkles, Users, Clock } from "lucide-react";

const WorkspaceSchedulePlaceholder = ({ workspaceId }: any) => (
    <div className="h-full flex items-center justify-center p-8 bg-white dark:bg-slate-900">
        <div className="max-w-lg w-full text-center">
            {/* Icon */}
            <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 flex items-center justify-center mb-6 shadow-lg">
                <Calendar className="h-10 w-10 text-orange-600 dark:text-orange-400" />
            </div>

            {/* Title */}
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-3">
                Workspace Schedule
            </h3>

            {/* Description */}
            <p className="text-slate-600 dark:text-slate-400 text-center leading-relaxed mb-6">
                Manage deadlines, milestones, and team schedules. Keep everyone synchronized and on track with powerful scheduling tools.
            </p>

            {/* Feature badges */}
            <div className="flex flex-wrap gap-2 justify-center mb-8">
                <Badge variant="outline" className="bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-700 px-3 py-1">
                    <Clock className="h-3 w-3 mr-2" />
                    Timeline Management
                </Badge>
                <Badge variant="outline" className="bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-700 px-3 py-1">
                    <BarChart3 className="h-3 w-3 mr-2" />
                    Milestone Tracking
                </Badge>
                <Badge variant="outline" className="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700 px-3 py-1">
                    <Users className="h-3 w-3 mr-2" />
                    Team Coordination
                </Badge>
            </div>

            {/* Coming Soon button */}
            <Button
                disabled
                size="lg"
                className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white opacity-70 cursor-not-allowed px-8 py-3 text-base font-medium"
            >
                <Sparkles className="h-5 w-5 mr-2" />
                Coming Soon
            </Button>

            {/* Additional info */}
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-4">
                Advanced scheduling features will be available in the next update
            </p>
        </div>
    </div>
);

export default WorkspaceSchedulePlaceholder;