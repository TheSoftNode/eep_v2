"use client"

import React from 'react';
import { Bell, BellRing, AlertCircle, Clock, Zap } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

// Define the notification category type
type NotificationCategory = 'projectUpdates' | 'taskAssignments' | 'mentorSessions' | 'messages' | 'weeklyDigest';

interface PushNotificationSettingsProps {
    preferences: {
        projectUpdates: boolean;
        taskAssignments: boolean;
        mentorSessions: boolean;
        messages: boolean;
        weeklyDigest: boolean;
    };
    onToggle: (notificationType: NotificationCategory) => void;
    isDisabled: boolean;
}

export default function PushNotificationSettings({
    preferences,
    onToggle,
    isDisabled
}: PushNotificationSettingsProps) {
    return (
        <div className="py-3 px-1 border-t border-gray-100 dark:border-gray-800/40 mt-3 backdrop-blur-sm">
            <div className="flex items-center space-x-3 mb-4">
                <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-2 rounded-lg shadow-sm shadow-indigo-500/10 dark:shadow-indigo-900/20">
                    <BellRing className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Push Notifications</h3>
            </div>

            <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 p-3 rounded-lg hover:bg-gray-50/80 dark:hover:bg-gray-800/40 transition-all duration-200 group backdrop-blur-sm border border-transparent hover:border-gray-100 dark:hover:border-gray-800/40">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-purple-400 to-purple-600 rounded-full shadow-sm shadow-purple-500/10 text-white group-hover:shadow-md group-hover:shadow-purple-500/20 transition-all duration-200">
                            <Zap className="h-5 w-5" />
                        </div>
                        <div>
                            <Label htmlFor="push-project-updates" className="font-medium text-gray-900 dark:text-white">Project updates</Label>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Get push notifications about project status changes</p>
                        </div>
                    </div>
                    <Switch
                        id="push-project-updates"
                        checked={preferences.projectUpdates}
                        onCheckedChange={() => onToggle('projectUpdates')}
                        disabled={isDisabled}
                        className="data-[state=checked]:bg-indigo-600 data-[state=checked]:dark:bg-indigo-500"
                    />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 p-3 rounded-lg hover:bg-gray-50/80 dark:hover:bg-gray-800/40 transition-all duration-200 group backdrop-blur-sm border border-transparent hover:border-gray-100 dark:hover:border-gray-800/40">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-green-400 to-green-600 rounded-full shadow-sm shadow-green-500/10 text-white group-hover:shadow-md group-hover:shadow-green-500/20 transition-all duration-200">
                            <AlertCircle className="h-5 w-5" />
                        </div>
                        <div>
                            <Label htmlFor="push-task-assignments" className="font-medium text-gray-900 dark:text-white">Task assignments</Label>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Get notified immediately when assigned new tasks</p>
                        </div>
                    </div>
                    <Switch
                        id="push-task-assignments"
                        checked={preferences.taskAssignments}
                        onCheckedChange={() => onToggle('taskAssignments')}
                        disabled={isDisabled}
                        className="data-[state=checked]:bg-indigo-600 data-[state=checked]:dark:bg-indigo-500"
                    />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 p-3 rounded-lg hover:bg-gray-50/80 dark:hover:bg-gray-800/40 transition-all duration-200 group backdrop-blur-sm border border-transparent hover:border-gray-100 dark:hover:border-gray-800/40">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-blue-400 to-blue-600 rounded-full shadow-sm shadow-blue-500/10 text-white group-hover:shadow-md group-hover:shadow-blue-500/20 transition-all duration-200">
                            <Clock className="h-5 w-5" />
                        </div>
                        <div>
                            <Label htmlFor="push-mentor-sessions" className="font-medium text-gray-900 dark:text-white">Mentor sessions</Label>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Get reminders about upcoming mentor sessions</p>
                        </div>
                    </div>
                    <Switch
                        id="push-mentor-sessions"
                        checked={preferences.mentorSessions}
                        onCheckedChange={() => onToggle('mentorSessions')}
                        disabled={isDisabled}
                        className="data-[state=checked]:bg-indigo-600 data-[state=checked]:dark:bg-indigo-500"
                    />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 p-3 rounded-lg hover:bg-gray-50/80 dark:hover:bg-gray-800/40 transition-all duration-200 group backdrop-blur-sm border border-transparent hover:border-gray-100 dark:hover:border-gray-800/40">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-full shadow-sm shadow-indigo-500/10 text-white group-hover:shadow-md group-hover:shadow-indigo-500/20 transition-all duration-200">
                            <Bell className="h-5 w-5" />
                        </div>
                        <div>
                            <Label htmlFor="push-messages" className="font-medium text-gray-900 dark:text-white">Messages</Label>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Get real-time notifications for new messages</p>
                        </div>
                    </div>
                    <Switch
                        id="push-messages"
                        checked={preferences.messages}
                        onCheckedChange={() => onToggle('messages')}
                        disabled={isDisabled}
                        className="data-[state=checked]:bg-indigo-600 data-[state=checked]:dark:bg-indigo-500"
                    />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 p-3 rounded-lg hover:bg-gray-50/80 dark:hover:bg-gray-800/40 transition-all duration-200 group backdrop-blur-sm border border-transparent hover:border-gray-100 dark:hover:border-gray-800/40">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-pink-400 to-pink-600 rounded-full shadow-sm shadow-pink-500/10 text-white group-hover:shadow-md group-hover:shadow-pink-500/20 transition-all duration-200">
                            <Bell className="h-5 w-5" />
                        </div>
                        <div>
                            <Label htmlFor="push-weekly-digest" className="font-medium text-gray-900 dark:text-white">Weekly digest</Label>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Receive a weekly summary of your activity</p>
                        </div>
                    </div>
                    <Switch
                        id="push-weekly-digest"
                        checked={preferences.weeklyDigest}
                        onCheckedChange={() => onToggle('weeklyDigest')}
                        disabled={isDisabled}
                        className="data-[state=checked]:bg-indigo-600 data-[state=checked]:dark:bg-indigo-500"
                    />
                </div>
            </div>
        </div>
    );
}