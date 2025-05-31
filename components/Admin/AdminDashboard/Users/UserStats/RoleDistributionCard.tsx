import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { PieChart } from "lucide-react";
import { Cell, Pie, ResponsiveContainer, Tooltip, PieChart as RechartsPieChart } from "recharts";

export const RoleDistributionCard: React.FC<{ byRole: Record<string, number>, totalUsers: number }> = ({ byRole, totalUsers }) => {
    const pieData = Object.entries(byRole).map(([role, count]) => ({
        name: role.charAt(0).toUpperCase() + role.slice(1),
        value: count,
        percentage: ((count / totalUsers) * 100).toFixed(1)
    }));

    const COLORS = {
        admin: '#ef4444',
        mentor: '#3b82f6',
        learner: '#10b981',
        user: '#6366f1'
    };

    return (
        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <CardHeader>
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                        <PieChart className="h-5 w-5" />
                    </div>
                    <div>
                        <CardTitle className="text-lg text-slate-900 dark:text-white">Role Distribution</CardTitle>
                        <p className="text-sm text-slate-500 dark:text-slate-400">User roles breakdown</p>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="h-64 mb-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart>
                            <Pie
                                dataKey="value"
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                label={({ name, percentage }) => `${name}: ${percentage}%`}
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[entry.name.toLowerCase() as keyof typeof COLORS]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </RechartsPieChart>
                    </ResponsiveContainer>
                </div>

                <div className="space-y-3">
                    {Object.entries(byRole).map(([role, count]) => {
                        const percentage = ((count / totalUsers) * 100).toFixed(1);
                        const roleColors = {
                            admin: "bg-red-500",
                            mentor: "bg-blue-500",
                            learner: "bg-emerald-500",
                            user: "bg-indigo-500"
                        };

                        return (
                            <div key={role} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className={cn("h-3 w-3 rounded-full", roleColors[role as keyof typeof roleColors])} />
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 capitalize">
                                        {role}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-slate-500 dark:text-slate-400">
                                        {count.toLocaleString()}
                                    </span>
                                    <Badge variant="outline" className="text-xs">
                                        {percentage}%
                                    </Badge>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
};
