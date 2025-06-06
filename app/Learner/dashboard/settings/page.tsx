"use client"

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Bell, Settings as SettingsIcon, UserCircle, PanelRight, Paintbrush, Lock } from 'lucide-react';
import ProfileSettings from '@/components/Dashboard/Settings/ProfileSettings';
import DangerZone from '@/components/Dashboard/Settings/DangerZone';
import NotificationPreferencesSettings from '@/components/Dashboard/Settings/NotificationPreferencesSettings';
import AppearanceSettings from '@/components/Dashboard/Settings/AppearanceSettings';
import PrivacySettings from '@/components/Dashboard/Settings/PrivacySettings';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('account');

    return (
        <div className="container mx-auto py-6 md:py-10 max-w-6xl px-4 md:px-6">
            <div className="flex flex-col space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="mb-4 md:mb-0">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/10 dark:shadow-indigo-900/20">
                                <SettingsIcon className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Settings</h1>
                                <p className="text-gray-500 dark:text-gray-400 mt-1">
                                    Manage your account settings and preferences
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="w-full"
                >
                    <TabsList className="grid h-full grid-cols-3 mb-8 bg-gradient-to-r from-gray-50/80 to-white/80 dark:from-gray-800/50 dark:to-gray-900/50 p-1.5 rounded-xl shadow-sm backdrop-blur-sm border border-gray-100/70 dark:border-gray-800/40">
                        <TabsTrigger
                            value="account"
                            className="flex items-center justify-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-white/80 data-[state=active]:to-gray-50/80 dark:data-[state=active]:from-gray-900/60 dark:data-[state=active]:to-gray-800/60 data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400 data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-gray-100/70 dark:data-[state=active]:border-gray-800/40 rounded-lg py-2.5 transition-all duration-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                        >
                            <UserCircle className="h-5 w-5" />
                            <span className="hidden sm:inline font-medium">Account</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="notifications"
                            className="flex items-center justify-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-white/80 data-[state=active]:to-gray-50/80 dark:data-[state=active]:from-gray-900/60 dark:data-[state=active]:to-gray-800/60 data-[state=active]:text-purple-600 dark:data-[state=active]:text-purple-400 data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-gray-100/70 dark:data-[state=active]:border-gray-800/40 rounded-lg py-2.5 transition-all duration-300 hover:text-purple-600 dark:hover:text-purple-400"
                        >
                            <Bell className="h-5 w-5" />
                            <span className="hidden sm:inline font-medium">Notifications</span>
                        </TabsTrigger>
                        {/* <TabsTrigger
                            value="appearance"
                            className="flex items-center justify-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-white/80 data-[state=active]:to-gray-50/80 dark:data-[state=active]:from-gray-900/60 dark:data-[state=active]:to-gray-800/60 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-gray-100/70 dark:data-[state=active]:border-gray-800/40 rounded-lg py-2.5 transition-all duration-300 hover:text-blue-600 dark:hover:text-blue-400"
                        >
                            <Paintbrush className="h-5 w-5" />
                            <span className="hidden sm:inline font-medium">Appearance</span>
                        </TabsTrigger> */}
                        <TabsTrigger
                            value="privacy"
                            className="flex items-center justify-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-white/80 data-[state=active]:to-gray-50/80 dark:data-[state=active]:from-gray-900/60 dark:data-[state=active]:to-gray-800/60 data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400 data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-gray-100/70 dark:data-[state=active]:border-gray-800/40 rounded-lg py-2.5 transition-all duration-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                        >
                            <Lock className="h-5 w-5" />
                            <span className="hidden sm:inline font-medium">Privacy</span>
                        </TabsTrigger>
                    </TabsList>

                    {/* Tab Contents with smooth transitions */}
                    <div className="relative perspective-1000">
                        {/* Account Settings */}
                        <TabsContent
                            value="account"
                            className="space-y-6 animate-fadeIn"
                        >
                            <div className="grid gap-6">
                                <ProfileSettings />
                                <DangerZone />
                            </div>
                        </TabsContent>

                        {/* Notification Settings */}
                        <TabsContent
                            value="notifications"
                            className="animate-fadeIn"
                        >
                            <NotificationPreferencesSettings />
                        </TabsContent>

                        {/* Appearance Settings
                        <TabsContent
                            value="appearance"
                            className="animate-fadeIn"
                        >
                            <AppearanceSettings />
                        </TabsContent> */}

                        {/* Privacy Settings */}
                        <TabsContent
                            value="privacy"
                            className="animate-fadeIn"
                        >
                            <PrivacySettings />
                        </TabsContent>
                    </div>
                </Tabs>
            </div>

            {/* Add custom CSS for animations */}
            <style jsx global>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out forwards;
                }
                
                .perspective-1000 {
                    perspective: 1000px;
                }
            `}</style>
        </div>
    );
}