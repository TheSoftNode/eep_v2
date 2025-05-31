import React, { useState, useRef } from 'react';
import {
    UserIcon,
    Mail,
    Calendar,
    CameraIcon,
    Edit,
    Code,
    Briefcase,
    Globe,
    CheckCircle,
    AlertCircle,
    Shield,
    ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useUpdateProfilePictureMutation, useUpdateUserProfileMutation } from '@/Redux/apiSlices/users/profileApi';
import { ProfileResponse, UpdateProfilePictureRequest } from '@/Redux/types/Users/profile';
import { User } from '@/Redux/types/Users/user';

interface ProfileCardProps {
    user: User | undefined;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ user }) => {
    const { toast } = useToast();
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isHoveringImage, setIsHoveringImage] = useState(false);

    // RTK Query mutations
    const [updateProfile, { isLoading: isUpdateLoading }] = useUpdateUserProfileMutation();
    const [updateProfilePicture, { isLoading: isPictureLoading }] = useUpdateProfilePictureMutation();

    // Form state for profile editing
    const [formData, setFormData] = useState<{
        fullName: string;
        bio: string;
        company: string;
        website: string;
        github: string;
    }>({
        fullName: user?.fullName || '',
        bio: user?.bio || '',
        company: user?.company || '',
        website: user?.website || '',
        github: user?.github || ''
    });

    // Update form data when user data changes
    React.useEffect(() => {
        if (user) {
            setFormData({
                fullName: user.fullName || '',
                bio: user?.bio || '',
                company: user?.company || '',
                website: user?.website || '',
                github: user?.github || ''
            });
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async () => {
        try {
            // Call the RTK Query mutation to update profile
            await updateProfile(formData).unwrap();

            toast({
                title: "Profile updated",
                description: "Your profile has been updated successfully!",
            });

            setIsEditing(false);
        } catch (error) {
            console.error('Failed to update profile:', error);
            toast({
                title: "Error",
                description: "Failed to update profile. Please try again.",
                variant: "destructive",
            });
        }
    };

    const handleCancel = () => {
        // Reset form data to original values
        if (user) {
            setFormData({
                fullName: user.fullName || '',
                bio: user?.bio || '',
                company: user?.company || '',
                website: user?.website || '',
                github: user?.github || ''
            });
        }
        setIsEditing(false);
    };

    const handleProfilePictureClick = () => {
        // Trigger the hidden file input
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            // Create a FormData object for file upload
            const requestData: UpdateProfilePictureRequest = {
                file: file
            };

            console.log(requestData)
            // Call the RTK Query mutation
            await updateProfilePicture(requestData).unwrap();

            toast({
                title: "Profile picture updated",
                description: "Your profile picture has been updated successfully!",
                variant: "default",
            });
        } catch (error) {
            console.error('Failed to update profile picture:', error);
            toast({
                title: "Error",
                description: "Failed to update profile picture. Please try again.",
                variant: "destructive",
            });
        }
    };

    // Generate user initials for avatar fallback
    const getUserInitials = (): string => {
        if (!user || !user.fullName) return 'U';
        return user.fullName
            .split(' ')
            .map((name) => name[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    // Format date for display
    const formatDate = (dateString?: string): string => {
        if (!dateString) return "";

        // Check if date is valid
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return "Unknown date";
        }

        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date);
    };

    // Role badge styling
    const getRoleBadgeStyles = () => {
        if (user?.role === 'admin') {
            return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-300 dark:border-indigo-800/50";
        } else if (user?.role === 'mentor') {
            return "bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-300 dark:border-purple-800/50";
        } else {
            return "bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300 dark:border-blue-800/50";
        }
    };

    if (!user) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full"
        >
            <Card className="backdrop-blur-sm bg-white/90 dark:bg-slate-900/80 shadow-lg border-0 overflow-hidden dark:text-slate-200">
                {/* Gradient header */}
                <div className="h-16 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-700 dark:to-purple-700 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjEiPjxwYXRoIGQ9Ik0zNiAxOGMxLjIgMCAyLjEuOSAyLjEgMi4xdjE5LjhjMCAxLjItLjkgMi4xLTIuMSAyLjFIMTguMWMtMS4yIDAtMi4xLS45LTIuMS0yLjFWMjAuMWMwLTEuMi45LTIuMSAyLjEtMi4xaDE3Ljl6TTIxIDZjMS4yIDAgMi4xLjkgMi4xIDIuMXY0LjJjMCAxLjItLjkgMi4xLTIuMSAyLjFoLTIuMWMtMS4yIDAtMi4xLS45LTIuMS0yLjFWOC4xYzAtMS4yLjktMi4xIDIuMS0yLjFIMjF6bTI0IDI0YzEuMiAwIDIuMS45IDIuMSAyLjF2NGMwIDEuMi0uOSAyLjEtMi4xIDIuMWgtNGMtMS4yIDAtMi4xLS45LTIuMS0yLjF2LTRjMC0xLjIuOS0yLjEgMi4xLTIuMWg0eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>
                </div>

                <CardHeader className="pb-0 pt-0 px-6 flex justify-center items-center flex-col relative">
                    {/* Avatar with animation */}
                    <div className="relative -mt-12 mb-4 group">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.2 }}
                            onHoverStart={() => setIsHoveringImage(true)}
                            onHoverEnd={() => setIsHoveringImage(false)}
                            className="relative"
                        >
                            <Avatar className="h-24 w-24 border-4 border-white dark:border-slate-800 shadow-lg">
                                <AvatarImage src={user?.profilePicture || ""} alt={user?.fullName || "User"} />
                                <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-2xl">
                                    {getUserInitials()}
                                </AvatarFallback>
                            </Avatar>

                            {/* Camera button with fade in/out animation */}
                            <AnimatePresence>
                                {isHoveringImage && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center"
                                    >
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-10 w-10 rounded-full bg-white/20 hover:bg-white/30 text-white"
                                            onClick={handleProfilePictureClick}
                                            disabled={isPictureLoading}
                                        >
                                            <CameraIcon className="h-5 w-5" />
                                        </Button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>

                        {/* Hidden file input */}
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                    </div>

                    {/* Username field - editable/display */}
                    <AnimatePresence mode="wait">
                        {isEditing ? (
                            <motion.div
                                key="editing"
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                className="w-full max-w-xs"
                            >
                                <Input
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    className="text-lg font-semibold text-center w-full dark:bg-slate-800/60 dark:border-slate-700"
                                />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="display"
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                            >
                                <CardTitle className="text-xl text-center mb-1 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                                    {user.fullName}
                                </CardTitle>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Role badge */}
                    <CardDescription className="text-center pb-4">
                        <Badge className={cn(
                            "rounded-full px-3 py-0.5 text-xs font-medium mt-1 border dark:border-opacity-20",
                            getRoleBadgeStyles()
                        )}>
                            {user.role === 'admin' ? 'Administrator' :
                                user.role === 'mentor' ? 'Mentor' : 'Learner'}
                        </Badge>
                    </CardDescription>
                </CardHeader>

                <CardContent className="pt-4 px-6">
                    <div className="space-y-4">
                        {/* Email info */}
                        <div className="flex items-start gap-3">
                            <div className="h-8 w-8 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
                                <Mail className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Email</p>
                                <span className="text-gray-800 dark:text-gray-200">{user.email}</span>
                            </div>
                        </div>

                        {/* Member since info */}
                        <div className="flex items-start gap-3">
                            <div className="h-8 w-8 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
                                <Calendar className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Member Since</p>
                                <span className="text-gray-800 dark:text-gray-200">{formatDate(user.createdAt)}</span>
                            </div>
                        </div>

                        {/* Email verification status */}
                        <div className="flex items-start gap-3">
                            <div className="h-8 w-8 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
                                <Shield className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Status</p>
                                <div className="flex items-center">
                                    {user.emailVerified ? (
                                        <>
                                            <span className="w-2 h-2 rounded-full mr-2 bg-green-500"></span>
                                            <span className="text-gray-800 dark:text-gray-200 flex items-center">
                                                <span>Email verified</span>
                                                <CheckCircle className="h-3.5 w-3.5 ml-1 text-green-500" />
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            <span className="w-2 h-2 rounded-full mr-2 bg-red-500"></span>
                                            <span className="text-gray-800 dark:text-gray-200 flex items-center">
                                                <span>Email not verified</span>
                                                <AlertCircle className="h-3.5 w-3.5 ml-1 text-red-500" />
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Bio - editing state */}
                        <AnimatePresence>
                            {isEditing && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="flex items-start gap-3"
                                >
                                    <div className="h-8 w-8 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
                                        <UserIcon className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Bio</p>
                                        <Input
                                            name="bio"
                                            value={formData.bio}
                                            onChange={handleChange}
                                            placeholder="Write a short bio..."
                                            className="w-full mt-1 dark:bg-slate-800/60 dark:border-slate-700"
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Bio - display state */}
                        <AnimatePresence>
                            {user.bio && !isEditing && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex items-start gap-3"
                                >
                                    <div className="h-8 w-8 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
                                        <UserIcon className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Bio</p>
                                        <p className="text-gray-800 dark:text-gray-200">{user.bio}</p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Additional information section */}
                        <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                            <h3 className="font-medium text-sm mb-3 text-indigo-600 dark:text-indigo-400">Additional Information</h3>

                            {/* Additional info - editing state */}
                            <AnimatePresence>
                                {isEditing && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="space-y-3"
                                    >
                                        {/* Company input */}
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
                                                <Briefcase className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Company</p>
                                                <Input
                                                    name="company"
                                                    value={formData.company}
                                                    onChange={handleChange}
                                                    className="flex-1 mt-1 dark:bg-slate-800/60 dark:border-slate-700"
                                                    placeholder="Company or Organization"
                                                />
                                            </div>
                                        </div>

                                        {/* GitHub input */}
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
                                                <Code className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">GitHub</p>
                                                <Input
                                                    name="github"
                                                    value={formData.github}
                                                    onChange={handleChange}
                                                    className="flex-1 mt-1 dark:bg-slate-800/60 dark:border-slate-700"
                                                    placeholder="GitHub URL"
                                                />
                                            </div>
                                        </div>

                                        {/* Website input */}
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
                                                <Globe className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Website</p>
                                                <Input
                                                    name="website"
                                                    value={formData.website}
                                                    onChange={handleChange}
                                                    className="flex-1 mt-1 dark:bg-slate-800/60 dark:border-slate-700"
                                                    placeholder="Website URL"
                                                />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Additional info - display state */}
                            <AnimatePresence>
                                {!isEditing && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="space-y-3"
                                    >
                                        {/* Company display */}
                                        {user.company && (
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
                                                    <Briefcase className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Company</p>
                                                    <span className="text-gray-800 dark:text-gray-200">{user.company}</span>
                                                </div>
                                            </div>
                                        )}

                                        {/* GitHub display */}
                                        {user.github && (
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
                                                    <Code className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">GitHub</p>
                                                    <a href={user.github.startsWith('http') ? user.github : `https://${user.github}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 hover:underline transition-colors flex items-center"
                                                    >
                                                        <span>{user.github.replace(/^https?:\/\//, '')}</span>
                                                        <ExternalLink className="h-3 w-3 ml-1 inline-block" />
                                                    </a>
                                                </div>
                                            </div>
                                        )}

                                        {/* Website display */}
                                        {user.website && (
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
                                                    <Globe className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Website</p>
                                                    <a href={user.website.startsWith('http') ? user.website : `https://${user.website}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 hover:underline transition-colors flex items-center"
                                                    >
                                                        <span>{user.website.replace(/^https?:\/\//, '')}</span>
                                                        <ExternalLink className="h-3 w-3 ml-1 inline-block" />
                                                    </a>
                                                </div>
                                            </div>
                                        )}

                                        {/* Display a placeholder if no additional info */}
                                        {!user.company && !user.github && !user.website && (
                                            <div className="py-2 px-4 rounded-md bg-gray-50 dark:bg-slate-800/50 text-center">
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    No additional information provided
                                                </p>
                                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                                    Click edit to add your company, GitHub, or website
                                                </p>
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </CardContent>

                {/* Footer with edit/save buttons */}
                <CardFooter className="flex justify-center border-t border-gray-100 dark:border-gray-800 pt-4 px-6 pb-6">
                    <AnimatePresence mode="wait">
                        {isEditing ? (
                            <motion.div
                                key="editing-buttons"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="flex gap-2 w-full"
                            >
                                <Button
                                    variant="outline"
                                    onClick={handleCancel}
                                    className="flex-1 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700"
                                    disabled={isUpdateLoading}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleSave}
                                    className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                                    disabled={isUpdateLoading}
                                >
                                    {isUpdateLoading ? (
                                        <div className="flex items-center">
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Saving...
                                        </div>
                                    ) : "Save Changes"}
                                </Button>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="edit-button"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="w-full"
                            >
                                <Button
                                    onClick={() => setIsEditing(true)}
                                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
                                >
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit Profile
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </CardFooter>

                {/* Decorative gradient elements */}
                <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-20"></div>
                <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 blur-xl -mr-8 -mt-8 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-gradient-to-tr from-purple-500/20 to-indigo-500/20 blur-xl -ml-8 -mb-8 pointer-events-none"></div>
            </Card>
        </motion.div>
    );
};

export default ProfileCard;