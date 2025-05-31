"use client"

import React, { useState, useEffect, useRef } from 'react';
import { Save, User, Mail, FileText, Camera, RefreshCw, AlertCircle, Trash2, UserCircle, Sparkles } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useDeleteProfilePictureMutation, useGetCurrentUserQuery, useUpdateProfilePictureMutation, useUpdateUserProfileMutation } from '@/Redux/apiSlices/users/profileApi';


export default function ProfileSettings() {
    const { toast } = useToast();
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Get current user data using RTK Query
    const { data: userData, isLoading: isUserLoading, error: userError } = useGetCurrentUserQuery();

    // Initialize mutations for profile updates
    const [updateProfile, { isLoading: isProfileUpdating }] = useUpdateUserProfileMutation();
    const [updateProfilePicture, { isLoading: isPictureUpdating }] = useUpdateProfilePictureMutation();
    const [deleteProfilePicture, { isLoading: isDeleting }] = useDeleteProfilePictureMutation();

    // Form state
    const [profileForm, setProfileForm] = useState({
        fullName: '',
        displayName: '',
        email: '',
        bio: ''
    });

    // Update form data when user data is loaded
    useEffect(() => {
        if (userData) {
            setProfileForm({
                fullName: userData.user?.fullName || '',
                displayName: userData.user?.fullName?.split(' ')[0]?.toLowerCase() || '',
                email: userData.user?.email || '',
                bio: userData.user?.bio || ''
            });
        }
    }, [userData]);

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProfileForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSaveProfile = async () => {
        try {
            // Only send fields that have changed and are editable
            const updateData = {
                fullName: profileForm.fullName !== userData?.user?.fullName ? profileForm.fullName : undefined,
                bio: profileForm.bio !== userData?.user?.bio ? profileForm.bio : undefined
            };

            // Filter out undefined values
            const filteredUpdateData = Object.fromEntries(
                Object.entries(updateData).filter(([_, v]) => v !== undefined)
            );

            // Only make API call if there are changes
            if (Object.keys(filteredUpdateData).length > 0) {
                const updatedUser = await updateProfile(filteredUpdateData).unwrap();
                toast({
                    title: "Profile updated",
                    description: "Your profile information has been saved successfully."
                });
            } else {
                toast({
                    title: "No changes detected",
                    description: "Your profile information is already up to date."
                });
            }
        } catch (error) {
            console.error('Profile update error:', error);
            toast({
                title: "Error",
                description: "Failed to update profile. Please try again.",
                variant: "destructive"
            });
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const file = files[0];
            setImageFile(file);

            // Create preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // Function to trigger file input click
    const triggerFileInput = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleUploadPhoto = async () => {
        if (!imageFile) return;

        try {
            const result = await updateProfilePicture({ file: imageFile }).unwrap();
            // Clear the file and preview after successful upload
            setImageFile(null);
            setImagePreview(null);

            toast({
                title: "Profile photo updated",
                description: "Your profile photo has been updated successfully."
            });
        } catch (error) {
            console.error('Profile picture update error:', error);
            toast({
                title: "Error",
                description: "Failed to update profile picture. Please try again.",
                variant: "destructive"
            });
        }
    };

    const handleRemovePhoto = async () => {
        try {
            await deleteProfilePicture().unwrap();

            toast({
                title: "Profile photo removed",
                description: "Your profile photo has been removed successfully."
            });
        } catch (error) {
            console.error('Profile picture deletion error:', error);
            toast({
                title: "Error",
                description: "Failed to remove profile picture. Please try again.",
                variant: "destructive"
            });
        }
    };

    // If user data is loading, show a loading state
    if (isUserLoading) {
        return (
            <Card className="w-full border-none shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl">
                <CardHeader className="border-b border-gray-100/70 dark:border-gray-800/40 bg-gradient-to-r from-white/60 to-gray-50/60 dark:from-gray-900/60 dark:to-gray-800/60">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center rounded-lg shadow-md shadow-blue-500/10 dark:shadow-blue-900/20">
                            <UserCircle className="h-5 w-5 text-white" />
                        </div>
                        <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">Loading Profile...</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="p-6 flex justify-center">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-md shadow-purple-500/20">
                        <RefreshCw className="h-6 w-6 text-white animate-spin" />
                    </div>
                </CardContent>
            </Card>
        );
    }

    // If there was an error loading user data
    if (userError) {
        return (
            <Card className="w-full border-none shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl">
                <CardHeader className="border-b border-gray-100/70 dark:border-gray-800/40 bg-gradient-to-r from-white/60 to-gray-50/60 dark:from-gray-900/60 dark:to-gray-800/60">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center rounded-lg shadow-md shadow-red-500/10 dark:shadow-red-900/20">
                            <AlertCircle className="h-5 w-5 text-white" />
                        </div>
                        <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">Error Loading Profile</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="p-6">
                    <Alert variant="destructive" className="bg-gradient-to-br from-red-50 to-red-50/50 dark:from-red-900/10 dark:to-red-800/5 border border-red-100/70 dark:border-red-900/20">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            There was an error loading your profile information. Please refresh the page or try again later.
                        </AlertDescription>
                    </Alert>
                </CardContent>
            </Card>
        );
    }

    // Determine whether we're showing a preview, an existing profile picture, or initials
    const showPreview = !!imagePreview;
    const showProfilePicture = !showPreview && !!userData?.user?.profilePicture;
    const showInitials = !showPreview && !showProfilePicture;

    return (
        <Card className="w-full border-none shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl">
            <CardHeader className="border-b border-gray-100/70 dark:border-gray-800/40 bg-gradient-to-r from-white/60 to-gray-50/60 dark:from-gray-900/60 dark:to-gray-800/60">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center rounded-lg shadow-md shadow-purple-500/10 dark:shadow-purple-900/20">
                        <User className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">Profile Information</CardTitle>
                        <CardDescription className="text-gray-500 dark:text-gray-400">Update your personal information</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-6 p-4 md:p-6">
                {/* Profile Photo */}
                <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6 p-4 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800/30 dark:to-gray-900/30 rounded-lg border border-gray-100/70 dark:border-gray-800/40 shadow-sm">
                    <div className="relative group transition-all duration-300">
                        <div className="w-28 h-28 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg transition-transform group-hover:scale-105">
                            {showPreview && (
                                <img src={imagePreview} alt="Profile Preview" className="w-full h-full object-cover" />
                            )}
                            {showProfilePicture && (
                                <img src={userData.user?.profilePicture || ""} alt={userData.user?.fullName} className="w-full h-full object-cover" />
                            )}
                            {showInitials && (
                                <span className="text-3xl font-bold text-white">
                                    {profileForm.fullName.split(' ').map(name => name[0]).join('').toUpperCase()}
                                </span>
                            )}
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 cursor-pointer">
                            <button
                                className="w-full h-full flex items-center justify-center"
                                onClick={triggerFileInput}
                                type="button"
                            >
                                <div className="bg-white/90 dark:bg-gray-800/90 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-md transform scale-75 group-hover:scale-100">
                                    <Camera className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                </div>
                            </button>
                        </div>
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                            <Sparkles className="h-4 w-4 mr-2 text-yellow-500" />
                            Profile Photo
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            Upload a photo to personalize your profile. Your photo will be visible to other users.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <input
                                ref={fileInputRef}
                                id="profile-photo-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileChange}
                                disabled={isPictureUpdating || isDeleting}
                            />
                            <Button
                                variant="outline"
                                size="sm"
                                className="border-indigo-300 dark:border-indigo-700 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:border-indigo-400 dark:hover:border-indigo-600 transition-all duration-300 shadow-sm hover:shadow-md"
                                disabled={isPictureUpdating || isDeleting}
                                type="button"
                                onClick={triggerFileInput}
                            >
                                <Camera className="h-4 w-4 mr-2" />
                                Choose Photo
                            </Button>

                            {imageFile && (
                                <Button
                                    variant="default"
                                    size="sm"
                                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md shadow-indigo-500/10 hover:shadow-lg hover:shadow-indigo-500/20 transition-all duration-300"
                                    onClick={handleUploadPhoto}
                                    disabled={isPictureUpdating || isDeleting}
                                    type="button"
                                >
                                    {isPictureUpdating ? (
                                        <>
                                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                            Uploading...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="h-4 w-4 mr-2" />
                                            Upload Photo
                                        </>
                                    )}
                                </Button>
                            )}

                            {userData?.user?.profilePicture && !imageFile && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-red-300 dark:border-red-800/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 hover:border-red-400 dark:hover:border-red-700 transition-all duration-300 shadow-sm hover:shadow-md"
                                    onClick={handleRemovePhoto}
                                    disabled={isDeleting || isPictureUpdating}
                                    type="button"
                                >
                                    {isDeleting ? (
                                        <>
                                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                            Removing...
                                        </>
                                    ) : (
                                        <>
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Remove
                                        </>
                                    )}
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Personal Information */}
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <Label
                                htmlFor="fullName"
                                className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2"
                            >
                                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                                    <User className="h-3 w-3 text-white" />
                                </div>
                                Full Name
                            </Label>
                            <Input
                                id="fullName"
                                name="fullName"
                                value={profileForm.fullName}
                                onChange={handleProfileChange}
                                className="border-gray-200 dark:border-gray-700 focus:border-indigo-500 focus:ring-indigo-500 bg-white/70 dark:bg-gray-800/50 backdrop-blur-sm transition-all duration-300 shadow-sm hover:shadow-md"
                                disabled={isProfileUpdating}
                            />
                        </div>
                        <div className="space-y-3">
                            <Label
                                htmlFor="displayName"
                                className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2"
                            >
                                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center">
                                    <User className="h-3 w-3 text-white" />
                                </div>
                                Display Name
                            </Label>
                            <Input
                                id="displayName"
                                name="displayName"
                                value={profileForm.displayName}
                                onChange={handleProfileChange}
                                className="border-gray-200 dark:border-gray-700 bg-gray-50/70 dark:bg-gray-800/20 backdrop-blur-sm transition-all duration-300 shadow-sm"
                                disabled={true}
                            />
                            <p className="text-xs text-gray-500 dark:text-gray-400 ml-7">This is how your name will appear to other users</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Label
                            htmlFor="email"
                            className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2"
                        >
                            <div className="w-5 h-5 rounded-full bg-gradient-to-r from-yellow-500 to-red-500 flex items-center justify-center">
                                <Mail className="h-3 w-3 text-white" />
                            </div>
                            Email Address
                        </Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            value={profileForm.email}
                            onChange={handleProfileChange}
                            disabled
                            className="border-gray-200 dark:border-gray-700 bg-gray-50/70 dark:bg-gray-800/20 text-gray-500 dark:text-gray-400 backdrop-blur-sm transition-all duration-300 shadow-sm"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 ml-7">Your email cannot be changed</p>
                    </div>

                    <div className="space-y-3 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800/30 dark:to-gray-900/30 p-4 rounded-lg border border-gray-100/70 dark:border-gray-800/40 shadow-sm">
                        <Label
                            htmlFor="bio"
                            className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2"
                        >
                            <div className="w-5 h-5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                                <FileText className="h-3 w-3 text-white" />
                            </div>
                            Bio
                        </Label>
                        <Textarea
                            id="bio"
                            name="bio"
                            value={profileForm.bio}
                            onChange={handleProfileChange}
                            rows={4}
                            className="border-gray-200 dark:border-gray-700 focus:border-indigo-500 focus:ring-indigo-500 bg-white/70 dark:bg-gray-800/50 resize-none backdrop-blur-sm transition-all duration-300 shadow-sm hover:shadow-md"
                            placeholder="Tell us a little about yourself"
                            disabled={isProfileUpdating}
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 ml-7">Brief description for your profile. This will be visible to other users.</p>
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button
                            onClick={handleSaveProfile}
                            disabled={isProfileUpdating}
                            className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium rounded-lg transition-all duration-300 shadow-md shadow-purple-500/10 hover:shadow-lg hover:shadow-purple-500/20 focus:ring-4 focus:ring-purple-300 dark:focus:ring-purple-800 disabled:opacity-70"
                            type="button"
                        >
                            {isProfileUpdating ? (
                                <div className="flex items-center">
                                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
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
                </div>
            </CardContent>
        </Card>
    );
}