"use client"

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Save, Bell, Settings } from 'lucide-react';

// Import sub-components
import EmailNotificationSettings from './EmailNotificationSettings';
import PushNotificationSettings from './PushNotificationSettings';
import InAppNotificationSettings from './InAppNotificationSettings';
import StandardAlert from '@/components/common/StandardAlert';

// Import API hooks
import { User } from '@/Redux/types/Users/user';
import { useGetCurrentUserQuery, useUpdateNotificationPreferencesMutation } from '@/Redux/apiSlices/users/profileApi';

// Define the notification preference keys
type NotificationCategory = 'projectUpdates' | 'taskAssignments' | 'mentorSessions' | 'messages' | 'weeklyDigest';
type NotificationChannel = 'email' | 'push' | 'inApp';

export default function NotificationPreferencesSettings() {
    const { toast } = useToast();

    // RTK Query hooks - using the profile API from the provided code
    const { data: profileData, isLoading: isUserLoading } = useGetCurrentUserQuery();
    const [updateNotificationPreferences, { isLoading: isUpdating }] = useUpdateNotificationPreferencesMutation();

    // Local state for preferences (initialized from API data when available)
    const [preferences, setPreferences] = useState<User['notificationPreferences'] | null>(null);

    // Initialize preferences from user data when it loads
    useEffect(() => {
        if (profileData?.user?.notificationPreferences) {
            setPreferences(profileData.user.notificationPreferences);
        } else if (profileData?.user && !isUserLoading) {
            // Initialize with default preferences if the user exists but has no preferences set
            setPreferences({
                email: {
                    projectUpdates: true,
                    taskAssignments: true,
                    mentorSessions: true,
                    messages: true,
                    weeklyDigest: true
                },
                push: {
                    projectUpdates: true,
                    taskAssignments: true,
                    mentorSessions: true,
                    messages: true,
                    weeklyDigest: false
                },
                inApp: {
                    projectUpdates: true,
                    taskAssignments: true,
                    mentorSessions: true,
                    messages: true,
                    weeklyDigest: true
                }
            });
        }
    }, [profileData, isUserLoading]);

    // Handle toggling notification preferences with correct typing
    const handleToggleNotification = (
        channel: NotificationChannel,
        notificationType: NotificationCategory
    ) => {
        if (!preferences) return;

        // Update local state for immediate UI feedback
        setPreferences({
            ...preferences,
            [channel]: {
                ...preferences[channel],
                [notificationType]: !preferences[channel][notificationType]
            }
        });
    };

    // Loading state
    if (isUserLoading || !preferences) {
        return (
            <Card className="w-full border-none shadow-lg bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                <CardHeader className="border-b border-gray-100/70 dark:border-gray-800/40">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center rounded-lg shadow-md shadow-purple-500/10 dark:shadow-purple-900/20">
                            <Bell className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">Notification Preferences</CardTitle>
                            <CardDescription className="text-gray-500 dark:text-gray-400">Loading your notification preferences...</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="space-y-4">
                        <div className="h-16 w-full bg-gradient-to-r from-gray-200 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-md animate-pulse"></div>
                        <div className="h-16 w-full bg-gradient-to-r from-gray-200 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-md animate-pulse"></div>
                        <div className="h-16 w-full bg-gradient-to-r from-gray-200 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-md animate-pulse"></div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    // Handle saving all preferences
    const handleSaveAllPreferences = async () => {
        if (!preferences) return;

        try {
            // Call the API to update notification preferences
            await updateNotificationPreferences(preferences).unwrap();

            toast({
                title: "Preferences saved",
                description: "Your notification preferences have been updated successfully.",
                variant: "success"
            });
        } catch (error) {
            toast({
                title: "Failed to save preferences",
                description: "There was an error saving your preferences. Please try again.",
                variant: "destructive"
            });
        }
    };

    return (
        <Card className="w-full border-none shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl">
            <CardHeader className="border-b border-gray-100/70 dark:border-gray-800/40 bg-gradient-to-r from-white/60 to-gray-50/60 dark:from-gray-900/60 dark:to-gray-800/60">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center rounded-lg shadow-md shadow-purple-500/10 dark:shadow-purple-900/20">
                        <Bell className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">Notification Preferences</CardTitle>
                        <CardDescription className="text-gray-500 dark:text-gray-400">
                            Choose how you want to be notified about different activities
                        </CardDescription>
                    </div>
                </div>

                {process.env.NODE_ENV === 'development' && (
                    <div className="mt-2">
                        <StandardAlert type='info' title='Development Environment'>
                            You're currently in development mode. Changes will be saved to the development API.
                        </StandardAlert>
                    </div>
                )}
            </CardHeader>

            <CardContent className="p-4 md:p-6">
                <div className="space-y-4">
                    {/* Email Notifications */}
                    <div className="bg-white/60 dark:bg-gray-800/30 rounded-xl shadow-sm border border-gray-100/70 dark:border-gray-800/40 transition-all duration-200 hover:shadow-md hover:border-gray-200/80 dark:hover:border-gray-700/60">
                        <EmailNotificationSettings
                            preferences={preferences.email}
                            onToggle={(type: NotificationCategory) => handleToggleNotification('email', type)}
                            isDisabled={isUpdating}
                        />
                    </div>

                    {/* Push Notifications */}
                    <div className="bg-white/60 dark:bg-gray-800/30 rounded-xl shadow-sm border border-gray-100/70 dark:border-gray-800/40 transition-all duration-200 hover:shadow-md hover:border-gray-200/80 dark:hover:border-gray-700/60">
                        <PushNotificationSettings
                            preferences={preferences.push}
                            onToggle={(type: NotificationCategory) => handleToggleNotification('push', type)}
                            isDisabled={isUpdating}
                        />
                    </div>

                    {/* In-App Notifications */}
                    <div className="bg-white/60 dark:bg-gray-800/30 rounded-xl shadow-sm border border-gray-100/70 dark:border-gray-800/40 transition-all duration-200 hover:shadow-md hover:border-gray-200/80 dark:hover:border-gray-700/60">
                        <InAppNotificationSettings
                            preferences={preferences.inApp}
                            onToggle={(type: NotificationCategory) => handleToggleNotification('inApp', type)}
                            isDisabled={isUpdating}
                        />
                    </div>

                    <div className="pt-5 flex justify-end">
                        <Button
                            onClick={handleSaveAllPreferences}
                            disabled={isUpdating}
                            className="w-full md:w-auto px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium rounded-lg transition-all duration-300 shadow-md shadow-purple-500/10 hover:shadow-lg hover:shadow-purple-500/20 disabled:opacity-70 focus:ring-4 focus:ring-purple-300 dark:focus:ring-purple-800"
                        >
                            {isUpdating ? (
                                <div className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Saving...
                                </div>
                            ) : (
                                <div className="flex items-center">
                                    <Save className="h-4 w-4 mr-2" />
                                    Save All Preferences
                                </div>
                            )}
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}