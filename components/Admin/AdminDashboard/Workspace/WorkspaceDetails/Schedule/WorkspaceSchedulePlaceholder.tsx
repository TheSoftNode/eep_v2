import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { BarChart3, Sparkles, Users } from "lucide-react";

const WorkspaceSchedulePlaceholder = ({ workspaceId }: any) => (
    <div className="h-full flex flex-col items-center justify-center p-8">
        <div className="rounded-full bg-gradient-to-r from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 p-6 mb-6">
            <Calendar className="h-12 w-12 text-orange-600 dark:text-orange-400" />
        </div>
        <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
            Workspace Schedule
        </h3>
        <p className="text-slate-600 dark:text-slate-400 text-center max-w-md mb-4">
            Manage deadlines, milestones, and team schedules. Keep everyone synchronized and on track.
        </p>
        <div className="flex flex-wrap gap-2 justify-center mb-6">
            <Badge variant="outline" className="bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-700">
                <Calendar className="h-3 w-3 mr-1" />
                Timeline management
            </Badge>
            <Badge variant="outline" className="bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-700">
                <BarChart3 className="h-3 w-3 mr-1" />
                Milestone tracking
            </Badge>
            <Badge variant="outline" className="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700">
                <Users className="h-3 w-3 mr-1" />
                Team coordination
            </Badge>
        </div>
        <Button
            disabled
            className="bg-gradient-to-r from-orange-600 to-amber-600 text-white opacity-60"
        >
            <Sparkles className="h-4 w-4 mr-2" />
            Coming Soon
        </Button>
    </div>
);

export default WorkspaceSchedulePlaceholder;