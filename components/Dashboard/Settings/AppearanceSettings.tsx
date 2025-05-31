"use client"

import React, { useState, useEffect } from 'react';
import { Moon, Sun, Save, Paintbrush } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useGetCurrentUserQuery, useUpdateUserSettingsMutation } from '@/Redux/apiSlices/users/profileApi';

// Define type for theme and language
// Making sure it matches what the API expects
type ThemeOption = 'light' | 'dark' | 'system';
type ApiThemeOption = 'light' | 'dark' | undefined; // API expects only 'light' or 'dark', or undefined (which we'll use for 'system')
type LanguageOption = 'english' | 'spanish' | 'french' | 'german';

export default function AppearanceSettings() {
    const { toast } = useToast();

    // RTK Query hooks
    const { data: profileData, isLoading: isUserLoading } = useGetCurrentUserQuery();
    const [updateUserSettings, { isLoading: isUpdating }] = useUpdateUserSettingsMutation();

    // State for theme and language
    const [theme, setTheme] = useState<ThemeOption>('system');
    const [language, setLanguage] = useState<LanguageOption>('english');

    // Initialize settings from user data when it loads
    useEffect(() => {
        if (profileData?.user?.settings) {
            // Map API theme value to UI theme value
            const apiTheme = profileData.user.settings.theme as ApiThemeOption;
            setTheme(apiTheme || 'system');
            setLanguage(profileData.user.settings.language as LanguageOption || 'english');
        }
    }, [profileData]);

    // Apply theme effect
    useEffect(() => {
        if (theme === 'system') {
            // Remove explicit theme class and let system preference decide
            document.documentElement.classList.remove('light', 'dark');
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.add('light');
            }
        } else {
            // Apply explicit theme
            document.documentElement.classList.remove('light', 'dark');
            document.documentElement.classList.add(theme);
        }
    }, [theme]);

    // Handle saving appearance settings
    const handleSaveAppearance = async () => {
        try {
            // Get current user settings to merge with changes
            const currentSettings = profileData?.user?.settings || {
                timezone: 'UTC',
                dateFormat: 'MM/DD/YYYY',
                notificationSound: true
            };

            // Convert UI theme to API theme
            // If theme is 'system', send undefined to the API
            const apiTheme: ApiThemeOption = theme === 'system' ? undefined : theme;

            // Update with new theme and language
            await updateUserSettings({
                ...currentSettings,
                theme: apiTheme,
                language
            }).unwrap();

            toast({
                title: "Appearance updated",
                description: "Your appearance settings have been saved successfully.",
                variant: "success"
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update appearance settings. Please try again.",
                variant: "destructive"
            });
        }
    };

    return (
        <Card className="w-full border-none shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl">
            <CardHeader className="border-b border-gray-100/70 dark:border-gray-800/40 bg-gradient-to-r from-white/60 to-gray-50/60 dark:from-gray-900/60 dark:to-gray-800/60">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center rounded-lg shadow-md shadow-blue-500/10 dark:shadow-blue-900/20">
                        <Paintbrush className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">Appearance Settings</CardTitle>
                        <CardDescription className="text-gray-500 dark:text-gray-400">Customize your experience</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-8 p-4 md:p-6">
                {isUserLoading ? (
                    // Loading state
                    <div className="space-y-6">
                        <div className="h-28 w-full bg-gradient-to-r from-gray-200 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-lg animate-pulse"></div>
                        <div className="h-16 w-3/4 bg-gradient-to-r from-gray-200 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-lg animate-pulse"></div>
                    </div>
                ) : (
                    <>
                        <div className="space-y-5">
                            <Label className="text-base font-medium text-gray-700 dark:text-gray-300 flex items-center">
                                <Sun className="h-4 w-4 mr-2 text-yellow-500" />
                                Theme
                            </Label>
                            <div className="flex flex-wrap gap-4 sm:gap-6">
                                <div
                                    className={`flex flex-col items-center justify-center w-28 h-28 rounded-xl cursor-pointer transition-all duration-300 shadow-sm ${theme === 'light'
                                            ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-500 shadow-lg shadow-blue-500/10'
                                            : 'bg-white border border-gray-200 hover:border-blue-200 hover:shadow-md hover:shadow-blue-500/5 dark:bg-gray-800 dark:border-gray-700 dark:hover:border-blue-700'
                                        }`}
                                    onClick={() => setTheme('light')}
                                >
                                    <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full shadow-md shadow-yellow-500/20 mb-3">
                                        <Sun className="h-6 w-6 text-white" />
                                    </div>
                                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200">Light</span>
                                </div>

                                <div
                                    className={`flex flex-col items-center justify-center w-28 h-28 rounded-xl cursor-pointer transition-all duration-300 shadow-sm ${theme === 'dark'
                                            ? 'bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border-2 border-indigo-500 shadow-lg shadow-indigo-500/10 dark:border-indigo-400'
                                            : 'bg-white border border-gray-200 hover:border-indigo-200 hover:shadow-md hover:shadow-indigo-500/5 dark:bg-gray-800 dark:border-gray-700 dark:hover:border-indigo-700'
                                        }`}
                                    onClick={() => setTheme('dark')}
                                >
                                    <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full shadow-md shadow-indigo-500/20 mb-3">
                                        <Moon className="h-6 w-6 text-white" />
                                    </div>
                                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200">Dark</span>
                                </div>

                                <div
                                    className={`flex flex-col items-center justify-center w-28 h-28 rounded-xl cursor-pointer transition-all duration-300 shadow-sm ${theme === 'system'
                                            ? 'bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-500 shadow-lg shadow-purple-500/10 dark:from-purple-900/20 dark:to-pink-900/20 dark:border-purple-400'
                                            : 'bg-white border border-gray-200 hover:border-purple-200 hover:shadow-md hover:shadow-purple-500/5 dark:bg-gray-800 dark:border-gray-700 dark:hover:border-purple-700'
                                        }`}
                                    onClick={() => setTheme('system')}
                                >
                                    <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500 rounded-full shadow-md shadow-purple-500/20 mb-3 relative overflow-hidden">
                                        <div className="absolute top-0 left-0 w-1/2 h-full bg-white/20"></div>
                                        <div className="absolute inset-1.5 rounded-full bg-gradient-to-br from-yellow-400 to-purple-600"></div>
                                    </div>
                                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200">System</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <Label htmlFor="language" className="text-base font-medium text-gray-700 dark:text-gray-300 flex items-center">
                                <span className="mr-2 text-lg">🌐</span>
                                Language
                            </Label>
                            <Select
                                value={language}
                                onValueChange={(value: LanguageOption) => setLanguage(value)}
                            >
                                <SelectTrigger id="language" className="w-full sm:w-72 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500 shadow-sm">
                                    <SelectValue placeholder="Select language" />
                                </SelectTrigger>
                                <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-lg">
                                    <SelectItem value="english" className="focus:bg-blue-50 dark:focus:bg-blue-900/20">
                                        <span className="flex items-center">
                                            <span className="mr-2">🇺🇸</span> English
                                        </span>
                                    </SelectItem>
                                    <SelectItem value="spanish" className="focus:bg-blue-50 dark:focus:bg-blue-900/20">
                                        <span className="flex items-center">
                                            <span className="mr-2">🇪🇸</span> Spanish
                                        </span>
                                    </SelectItem>
                                    <SelectItem value="french" className="focus:bg-blue-50 dark:focus:bg-blue-900/20">
                                        <span className="flex items-center">
                                            <span className="mr-2">🇫🇷</span> French
                                        </span>
                                    </SelectItem>
                                    <SelectItem value="german" className="focus:bg-blue-50 dark:focus:bg-blue-900/20">
                                        <span className="flex items-center">
                                            <span className="mr-2">🇩🇪</span> German
                                        </span>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                This will change the language throughout the application.
                            </p>
                        </div>

                        <div className="pt-4">
                            <Button
                                onClick={handleSaveAppearance}
                                disabled={isUpdating}
                                className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg transition-all duration-300 shadow-md shadow-blue-500/10 hover:shadow-lg hover:shadow-blue-500/20 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 disabled:opacity-70"
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
                                        Save Changes
                                    </div>
                                )}
                            </Button>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
}