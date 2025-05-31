import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export const UserGrowthChart: React.FC<{ data: any[] }> = ({ data }) => {
    return (
        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <CardHeader>
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
                        <TrendingUp className="h-5 w-5" />
                    </div>
                    <div>
                        <CardTitle className="text-lg text-slate-900 dark:text-white">User Growth Trends</CardTitle>
                        <p className="text-sm text-slate-500 dark:text-slate-400">New users and activity over time</p>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                            <XAxis
                                dataKey="date"
                                tick={{ fontSize: 12 }}
                                axisLine={false}
                            />
                            <YAxis
                                tick={{ fontSize: 12 }}
                                axisLine={false}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1e293b',
                                    border: 'none',
                                    borderRadius: '8px',
                                    color: '#fff'
                                }}
                            />
                            <Line
                                type="monotone"
                                dataKey="newUsers"
                                stroke="#6366f1"
                                strokeWidth={2}
                                name="New Users"
                            />
                            <Line
                                type="monotone"
                                dataKey="activeUsers"
                                stroke="#10b981"
                                strokeWidth={2}
                                name="Active Users"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
};
