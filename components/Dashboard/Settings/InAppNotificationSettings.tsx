"use client"

import React from 'react';
import { Bell, MessageSquare, Activity, Calendar, CheckCircle } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

// Define the notification category type
type NotificationCategory = 'projectUpdates' | 'taskAssignments' | 'mentorSessions' | 'messages' | 'weeklyDigest';

interface InAppNotificationSettingsProps {
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

export default function InAppNotificationSettings({
    preferences,
    onToggle,
    isDisabled
}: InAppNotificationSettingsProps) {
    return (
        <div className="py-3 px-1 border-t border-gray-100 dark:border-gray-800/40 mt-3 backdrop-blur-sm">
            <div className="flex items-center space-x-3 mb-4">
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-2 rounded-lg shadow-sm shadow-purple-500/10 dark:shadow-purple-900/20">
                    <Bell className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">In-App Notifications</h3>
            </div>

            <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 p-3 rounded-lg hover:bg-gray-50/80 dark:hover:bg-gray-800/40 transition-all duration-200 group backdrop-blur-sm border border-transparent hover:border-gray-100 dark:hover:border-gray-800/40">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-full shadow-sm shadow-indigo-500/10 text-white group-hover:shadow-md group-hover:shadow-indigo-500/20 transition-all duration-200">
                            <Activity className="h-5 w-5" />
                        </div>
                        <div>
                            <Label htmlFor="inapp-project-updates" className="font-medium text-gray-900 dark:text-white">Project updates</Label>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Get notified within the app about project changes</p>
                        </div>
                    </div>
                    <Switch
                        id="inapp-project-updates"
                        checked={preferences.projectUpdates}
                        onCheckedChange={() => onToggle('projectUpdates')}
                        disabled={isDisabled}
                        className="data-[state=checked]:bg-purple-600 data-[state=checked]:dark:bg-purple-500"
                    />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 p-3 rounded-lg hover:bg-gray-50/80 dark:hover:bg-gray-800/40 transition-all duration-200 group backdrop-blur-sm border border-transparent hover:border-gray-100 dark:hover:border-gray-800/40">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-green-400 to-green-600 rounded-full shadow-sm shadow-green-500/10 text-white group-hover:shadow-md group-hover:shadow-green-500/20 transition-all duration-200">
                            <CheckCircle className="h-5 w-5" />
                        </div>
                        <div>
                            <Label htmlFor="inapp-task-assignments" className="font-medium text-gray-900 dark:text-white">Task assignments</Label>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Show notifications when you're assigned new tasks</p>
                        </div>
                    </div>
                    <Switch
                        id="inapp-task-assignments"
                        checked={preferences.taskAssignments}
                        onCheckedChange={() => onToggle('taskAssignments')}
                        disabled={isDisabled}
                        className="data-[state=checked]:bg-purple-600 data-[state=checked]:dark:bg-purple-500"
                    />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 p-3 rounded-lg hover:bg-gray-50/80 dark:hover:bg-gray-800/40 transition-all duration-200 group backdrop-blur-sm border border-transparent hover:border-gray-100 dark:hover:border-gray-800/40">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-blue-400 to-blue-600 rounded-full shadow-sm shadow-blue-500/10 text-white group-hover:shadow-md group-hover:shadow-blue-500/20 transition-all duration-200">
                            <Calendar className="h-5 w-5" />
                        </div>
                        <div>
                            <Label htmlFor="inapp-mentor-sessions" className="font-medium text-gray-900 dark:text-white">Mentor sessions</Label>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Show alerts for scheduled mentor sessions</p>
                        </div>
                    </div>
                    <Switch
                        id="inapp-mentor-sessions"
                        checked={preferences.mentorSessions}
                        onCheckedChange={() => onToggle('mentorSessions')}
                        disabled={isDisabled}
                        className="data-[state=checked]:bg-purple-600 data-[state=checked]:dark:bg-purple-500"
                    />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 p-3 rounded-lg hover:bg-gray-50/80 dark:hover:bg-gray-800/40 transition-all duration-200 group backdrop-blur-sm border border-transparent hover:border-gray-100 dark:hover:border-gray-800/40">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-pink-400 to-pink-600 rounded-full shadow-sm shadow-pink-500/10 text-white group-hover:shadow-md group-hover:shadow-pink-500/20 transition-all duration-200">
                            <MessageSquare className="h-5 w-5" />
                        </div>
                        <div>
                            <Label htmlFor="inapp-messages" className="font-medium text-gray-900 dark:text-white">Messages</Label>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Show in-app notifications for new messages</p>
                        </div>
                    </div>
                    <Switch
                        id="inapp-messages"
                        checked={preferences.messages}
                        onCheckedChange={() => onToggle('messages')}
                        disabled={isDisabled}
                        className="data-[state=checked]:bg-purple-600 data-[state=checked]:dark:bg-purple-500"
                    />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 p-3 rounded-lg hover:bg-gray-50/80 dark:hover:bg-gray-800/40 transition-all duration-200 group backdrop-blur-sm border border-transparent hover:border-gray-100 dark:hover:border-gray-800/40">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full shadow-sm shadow-yellow-500/10 text-white group-hover:shadow-md group-hover:shadow-yellow-500/20 transition-all duration-200">
                            <Bell className="h-5 w-5" />
                        </div>
                        <div>
                            <Label htmlFor="inapp-weekly-digest" className="font-medium text-gray-900 dark:text-white">Weekly digest</Label>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Show weekly summary in your notification center</p>
                        </div>
                    </div>
                    <Switch
                        id="inapp-weekly-digest"
                        checked={preferences.weeklyDigest}
                        onCheckedChange={() => onToggle('weeklyDigest')}
                        disabled={isDisabled}
                        className="data-[state=checked]:bg-purple-600 data-[state=checked]:dark:bg-purple-500"
                    />
                </div>
            </div>
        </div>
    );
}