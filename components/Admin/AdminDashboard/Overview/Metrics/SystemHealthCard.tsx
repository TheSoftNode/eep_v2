"use client";

import React from "react";
import { motion } from "framer-motion";
import { Activity, AlertTriangle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface SystemService {
    name: string;
    status: 'healthy' | 'warning' | 'error';
    uptime: number;
    responseTime?: number;
}

interface SystemHealthCardProps {
    className?: string;
}

const SystemHealthCard: React.FC<SystemHealthCardProps> = ({ className }) => {
    // This would typically come from your monitoring service
    const services: SystemService[] = [
        { name: 'API Server', status: 'healthy', uptime: 99.9, responseTime: 120 },
        { name: 'Database', status: 'healthy', uptime: 99.8, responseTime: 45 },
        { name: 'File Storage', status: 'warning', uptime: 98.5, responseTime: 230 },
        { name: 'CDN', status: 'healthy', uptime: 99.9, responseTime: 80 }
    ];

    const overallHealth = Math.round(
        services.reduce((acc, service) => acc + service.uptime, 0) / services.length
    );

    const getStatusColor = (status: SystemService['status']) => {
        switch (status) {
            case 'healthy':
                return 'text-emerald-500';
            case 'warning':
                return 'text-yellow-500';
            case 'error':
                return 'text-red-500';
            default:
                return 'text-slate-500';
        }
    };

    const getStatusIcon = (status: SystemService['status']) => {
        switch (status) {
            case 'healthy':
                return <CheckCircle className="h-4 w-4" />;
            case 'warning':
                return <AlertTriangle className="h-4 w-4" />;
            case 'error':
                return <AlertTriangle className="h-4 w-4" />;
            default:
                return <Activity className="h-4 w-4" />;
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className={cn(
                "bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6",
                className
            )}
        >
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-sm">
                        <Activity className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                            System Health
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Overall: {overallHealth}%
                        </p>
                    </div>
                </div>

                <div className="text-right">
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">
                        {overallHealth}%
                    </div>
                    <div className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        All systems operational
                    </div>
                </div>
            </div>

            <div className="space-y-3">
                {services.map((service, index) => (
                    <div
                        key={service.name}
                        className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50"
                    >
                        <div className="flex items-center gap-3">
                            <div className={cn("flex items-center gap-1", getStatusColor(service.status))}>
                                {getStatusIcon(service.status)}
                                <span className="text-sm font-medium">{service.name}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                            <span>{service.uptime}% uptime</span>
                            {service.responseTime && (
                                <span>{service.responseTime}ms</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

export default SystemHealthCard;