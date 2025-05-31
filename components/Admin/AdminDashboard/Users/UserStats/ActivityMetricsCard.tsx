import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";

export const ActivityMetricsCard: React.FC = () => {
    return (
        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <CardHeader>
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
                        <Activity className="h-5 w-5" />
                    </div>
                    <div>
                        <CardTitle className="text-lg text-slate-900 dark:text-white">Activity Metrics</CardTitle>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Key performance indicators</p>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">87.3%</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Retention Rate</p>
                    </div>
                    <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">12.4%</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Growth Rate</p>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600 dark:text-slate-400">Email Verified</span>
                        <div className="flex items-center gap-2">
                            <div className="w-24 h-2 bg-slate-200 dark:bg-slate-700 rounded-full">
                                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '92%' }} />
                            </div>
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">92%</span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600 dark:text-slate-400">Two-Factor Enabled</span>
                        <div className="flex items-center gap-2">
                            <div className="w-24 h-2 bg-slate-200 dark:bg-slate-700 rounded-full">
                                <div className="h-full bg-blue-500 rounded-full" style={{ width: '67%' }} />
                            </div>
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">67%</span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600 dark:text-slate-400">Profile Complete</span>
                        <div className="flex items-center gap-2">
                            <div className="w-24 h-2 bg-slate-200 dark:bg-slate-700 rounded-full">
                                <div className="h-full bg-purple-500 rounded-full" style={{ width: '84%' }} />
                            </div>
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">84%</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
