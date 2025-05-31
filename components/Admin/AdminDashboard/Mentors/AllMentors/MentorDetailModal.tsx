"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    Star,
    Mail,
    Globe,
    Github,
    Calendar,
    Clock,
    MessageSquare,
    Edit,
    User,
    Target,
    CheckCircle,
    Activity,
    Plus,
    Trash2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Import your actual API hooks and types
import { MentorSummary, MentorReview, MentorProfile } from '@/Redux/types/Users/mentor';
import {
    useGetMentorByIdQuery,
    useGetMentorReviewsQuery
} from '@/Redux/apiSlices/users/mentorApi';
import {
    useGetMentorAvailabilityQuery,
    useGetMentorBusySlotsQuery,
    useRemoveAvailabilitySlotMutation
} from '@/Redux/apiSlices/users/mentorAvailabilityApi';

interface MentorDetailModalProps {
    mentor: MentorSummary;
    onClose: () => void;
    onMessage: () => void;
}

const MentorDetailModal: React.FC<MentorDetailModalProps> = ({
    mentor,
    onClose,
    onMessage
}) => {
    const [activeTab, setActiveTab] = useState<string>('overview');
    const [dateRange] = useState({
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });

    // API calls with proper typing
    const {
        data: mentorDetailsResponse,
        isLoading: loadingDetails
    } = useGetMentorByIdQuery(mentor.id);

    const {
        data: reviewsResponse,
        isLoading: loadingReviews
    } = useGetMentorReviewsQuery({
        id: mentor.id,
        page: 1,
        limit: 5
    });

    // Use public availability endpoint instead of analytics
    const {
        data: availabilityResponse,
        isLoading: loadingAvailability
    } = useGetMentorAvailabilityQuery({
        mentorId: mentor.id,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate
    });

    // Get busy slots for more complete view
    const {
        data: busySlotsResponse
    } = useGetMentorBusySlotsQuery({
        mentorId: mentor.id,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate
    });

    // Mutations
    const [removeSlot] = useRemoveAvailabilitySlotMutation();


    // Extract data with proper typing
    const detailedMentor: MentorProfile = mentorDetailsResponse?.data || mentor as MentorProfile;
    const reviews: MentorReview[] = reviewsResponse?.data || [];
    const availabilityData = availabilityResponse?.data as Record<string, any[]> | undefined;
    const busySlotsData = busySlotsResponse?.data as Record<string, string[]> | undefined;

    const handleRemoveSlot = async (slotId: string) => {
        try {
            await removeSlot(slotId).unwrap();
            // Add success notification here if you have a notification system
        } catch (error) {
            console.error('Failed to remove slot:', error);
            // Add error notification here
        }
    };

    const OverviewTab: React.FC = () => (
        <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 rounded-lg bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-900/50 border border-slate-200/70 dark:border-slate-700/50">
                    <div className="flex items-center justify-center mb-2">
                        <Star className="h-5 w-5 text-amber-500 mr-1" />
                        <span className="text-xl font-bold text-slate-900 dark:text-white">
                            {detailedMentor.rating?.toFixed(1) || '0.0'}
                        </span>
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Rating</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-900/50 border border-slate-200/70 dark:border-slate-700/50">
                    <div className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                        {detailedMentor.reviewCount || 0}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Reviews</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-900/50 border border-slate-200/70 dark:border-slate-700/50">
                    <div className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                        {detailedMentor.sessionCount || 0}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Sessions</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-900/50 border border-slate-200/70 dark:border-slate-700/50">
                    <div className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                        {detailedMentor.sessionHours || 0}h
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Hours</div>
                </div>
            </div>

            {/* Profile Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className=" bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-900/50 border border-slate-200/70 dark:border-slate-700/50">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
                            <User className="h-5 w-5 mr-2 text-indigo-600" />
                            Profile Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">
                                Bio
                            </label>
                            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                                {detailedMentor.bio || 'No bio available'}
                            </p>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">
                                Company
                            </label>
                            <p className="text-slate-600 dark:text-slate-400">
                                {detailedMentor.company || 'Not specified'}
                            </p>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">
                                Experience
                            </label>
                            <p className="text-slate-600 dark:text-slate-400">
                                {detailedMentor.experience ? `${detailedMentor.experience} years` : 'Not specified'}
                            </p>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">
                                Timezone
                            </label>
                            <p className="text-slate-600 dark:text-slate-400">
                                {detailedMentor.timezone || 'Not specified'}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card className=" bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-900/50 border border-slate-200/70 dark:border-slate-700/50">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
                            <Mail className="h-5 w-5 mr-2 text-indigo-600" />
                            Contact Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center space-x-3">
                            <Mail className="h-4 w-4 text-slate-500" />
                            <span className="text-slate-600 dark:text-slate-400 text-sm">{detailedMentor.email}</span>
                        </div>

                        {detailedMentor.website && (
                            <div className="flex items-center space-x-3">
                                <Globe className="h-4 w-4 text-slate-500" />
                                <a
                                    href={detailedMentor.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-indigo-600 dark:text-indigo-400 hover:underline text-sm transition-colors"
                                >
                                    {detailedMentor.website}
                                </a>
                            </div>
                        )}

                        {detailedMentor.github && (
                            <div className="flex items-center space-x-3">
                                <Github className="h-4 w-4 text-slate-500" />
                                <a
                                    href={`https://github.com/${detailedMentor.github}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-indigo-600 dark:text-indigo-400 hover:underline text-sm transition-colors"
                                >
                                    {detailedMentor.github}
                                </a>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Skills and Expertise */}
            <Card className=" bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-900/50 border border-slate-200/70 dark:border-slate-700/50">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
                        <Target className="h-5 w-5 mr-2 text-indigo-600" />
                        Skills & Expertise
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                                Areas of Expertise
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {detailedMentor.expertise?.map((skill: string, index: number) => (
                                    <Badge
                                        key={index}
                                        className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white  hover:from-indigo-700 hover:to-purple-700"
                                    >
                                        {skill}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        {detailedMentor.skills && detailedMentor.skills.length > 0 && (
                            <div>
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                                    Additional Skills
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {detailedMentor.skills.map((skill: string, index: number) => (
                                        <Badge
                                            key={index}
                                            variant="outline"
                                            className="bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600"
                                        >
                                            {skill}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        {detailedMentor.languages && detailedMentor.languages.length > 0 && (
                            <div>
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                                    Languages
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {detailedMentor.languages.map((language: string, index: number) => (
                                        <Badge
                                            key={index}
                                            className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white "
                                        >
                                            {language}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );

    const AvailabilityTab: React.FC = () => (
        <div className="space-y-6">
            {/* Basic Stats from mentor data */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className=" bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-900/50 border border-slate-200/70 dark:border-slate-700/50">
                    <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                            {detailedMentor.rating?.toFixed(1) || '0.0'}
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">Rating</div>
                    </CardContent>
                </Card>

                <Card className=" bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-900/50 border border-slate-200/70 dark:border-slate-700/50">
                    <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                            {detailedMentor.reviewCount || 0}
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">Reviews</div>
                    </CardContent>
                </Card>

                <Card className=" bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-900/50 border border-slate-200/70 dark:border-slate-700/50">
                    <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                            {detailedMentor.sessionCount || 0}
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">Total Sessions</div>
                    </CardContent>
                </Card>
            </div>

            {/* Availability Display */}
            <Card className=" bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-900/50 border border-slate-200/70 dark:border-slate-700/50">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
                            <Calendar className="h-5 w-5 mr-2 text-indigo-600" />
                            Available Time Slots
                        </CardTitle>
                        <Button
                            size="sm"
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Slot
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {loadingAvailability ? (
                        <div className="animate-pulse space-y-4">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="h-16 bg-slate-200 dark:bg-slate-700 rounded"></div>
                            ))}
                        </div>
                    ) : availabilityData && Object.keys(availabilityData).length > 0 ? (
                        <div className="space-y-4">
                            {Object.entries(availabilityData).map(([date, slots]) => (
                                <div key={date} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 bg-white dark:bg-slate-800/50">
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="font-medium text-slate-900 dark:text-white">
                                            {new Date(date).toLocaleDateString('en-US', {
                                                weekday: 'long',
                                                month: 'long',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </h4>
                                        <Badge variant="outline" className="text-xs">
                                            {slots.length} available slots
                                        </Badge>
                                    </div>

                                    <div className="space-y-3">
                                        {/* Available Slots */}
                                        <div>
                                            <div className="text-sm font-medium text-emerald-700 dark:text-emerald-400 mb-2">
                                                Available Time Slots
                                            </div>
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                                {slots.map((slot: any, index: number) => (
                                                    <div key={slot.id || index} className="flex items-center justify-between p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded border border-emerald-200 dark:border-emerald-800">
                                                        <div>
                                                            <div className="text-sm font-medium text-slate-900 dark:text-white">
                                                                {slot.timeSlot}
                                                            </div>
                                                            <div className="text-xs text-slate-500 dark:text-slate-400">
                                                                {slot.duration}min
                                                            </div>
                                                        </div>
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() => slot.id && handleRemoveSlot(slot.id)}
                                                            className="h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                        >
                                                            <Trash2 className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Busy Slots */}
                                        {busySlotsData && busySlotsData[date] && busySlotsData[date].length > 0 && (
                                            <div>
                                                <div className="text-sm font-medium text-red-700 dark:text-red-400 mb-2">
                                                    Busy Time Slots
                                                </div>
                                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                                    {busySlotsData[date].map((timeSlot: string, index: number) => (
                                                        <div key={index} className="p-2 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-800">
                                                            <div className="text-sm font-medium text-slate-900 dark:text-white">
                                                                {timeSlot}
                                                            </div>
                                                            <div className="text-xs text-slate-500 dark:text-slate-400">
                                                                Booked
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <Calendar className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                                No availability slots
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400 mb-4">
                                This mentor hasn't set up any availability slots for the selected period.
                            </p>
                            <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                                <Plus className="h-4 w-4 mr-2" />
                                Add Availability
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Mentor Availability Info */}
            {detailedMentor.availability && (
                <Card className=" bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-900/50 border border-slate-200/70 dark:border-slate-700/50">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
                            <Clock className="h-5 w-5 mr-2 text-indigo-600" />
                            General Availability
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                                    Available Days
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {detailedMentor.availability.days?.map((day: string, index: number) => (
                                        <Badge
                                            key={index}
                                            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white "
                                        >
                                            {day}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            {detailedMentor.availability.timeSlots && detailedMentor.availability.timeSlots.length > 0 && (
                                <div>
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                                        Preferred Time Slots
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {detailedMentor.availability.timeSlots.map((timeSlot: string, index: number) => (
                                            <Badge
                                                key={index}
                                                variant="outline"
                                                className="bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600"
                                            >
                                                {timeSlot}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );

    const ReviewsTab: React.FC = () => (
        <div className="space-y-6">
            {/* Rating Overview */}
            <Card className=" bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-900/50 border border-slate-200/70 dark:border-slate-700/50">
                <CardContent className="p-6">
                    <div className="flex items-center justify-center">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                                {detailedMentor.rating?.toFixed(1) || '0.0'}
                            </div>
                            <div className="flex items-center justify-center mb-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`h-4 w-4 ${i < Math.floor(detailedMentor.rating || 0) ? 'text-amber-500 fill-current' : 'text-slate-300'}`}
                                    />
                                ))}
                            </div>
                            <div className="text-sm text-slate-600 dark:text-slate-400">
                                {detailedMentor.reviewCount || 0} reviews
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Recent Reviews */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Recent Reviews
                </h3>

                {loadingReviews ? (
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="animate-pulse">
                                <Card className=" bg-white dark:bg-slate-900">
                                    <CardContent className="p-4">
                                        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4 mb-3"></div>
                                        <div className="h-16 bg-slate-200 dark:bg-slate-700 rounded"></div>
                                    </CardContent>
                                </Card>
                            </div>
                        ))}
                    </div>
                ) : reviews.length > 0 ? (
                    reviews.map((review, index) => (
                        <Card key={review.id} className=" bg-white dark:bg-slate-900">
                            <CardContent className="p-4">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-semibold">
                                            {review.learnerName.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div>
                                            <div className="font-medium text-slate-900 dark:text-white">
                                                {review.learnerName}
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <div className="flex items-center">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={`h-3 w-3 ${i < review.rating ? 'text-amber-500 fill-current' : 'text-slate-300'}`}
                                                        />
                                                    ))}
                                                </div>
                                                <span className="text-sm text-slate-500 dark:text-slate-400">
                                                    {new Date(review.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <p className="text-slate-600 dark:text-slate-400 mb-3 text-sm">
                                    {review.comment}
                                </p>

                                {review.strengths && review.strengths.length > 0 && (
                                    <div className="mb-2">
                                        <div className="text-sm font-medium text-emerald-700 dark:text-emerald-400 mb-1">
                                            Strengths:
                                        </div>
                                        <div className="flex flex-wrap gap-1">
                                            {review.strengths.map((strength, i) => (
                                                <Badge
                                                    key={i}
                                                    className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-xs"
                                                >
                                                    {strength}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <Card className=" bg-white dark:bg-slate-900">
                        <CardContent className="p-12 text-center">
                            <MessageSquare className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                                No reviews yet
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400">
                                This mentor hasn't received any reviews yet
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );

    const ActivityTab: React.FC = () => (
        <div className="space-y-6">
            <Card className=" bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-900/50 border border-slate-200/70 dark:border-slate-700/50">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
                        <Activity className="h-5 w-5 mr-2 text-indigo-600" />
                        Recent Activity
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                            <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
                                <CheckCircle className="h-4 w-4 text-white" />
                            </div>
                            <div className="flex-1">
                                <div className="text-sm font-medium text-slate-900 dark:text-white">
                                    Completed session with learner
                                </div>
                                <div className="text-xs text-slate-500 dark:text-slate-400">
                                    2 hours ago
                                </div>
                            </div>
                        </div>

                        <div className="flex items-start space-x-3">
                            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                                <Calendar className="h-4 w-4 text-white" />
                            </div>
                            <div className="flex-1">
                                <div className="text-sm font-medium text-slate-900 dark:text-white">
                                    Updated availability schedule
                                </div>
                                <div className="text-xs text-slate-500 dark:text-slate-400">
                                    1 day ago
                                </div>
                            </div>
                        </div>

                        <div className="flex items-start space-x-3">
                            <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center">
                                <Star className="h-4 w-4 text-white" />
                            </div>
                            <div className="flex-1">
                                <div className="text-sm font-medium text-slate-900 dark:text-white">
                                    Received 5-star review
                                </div>
                                <div className="text-xs text-slate-500 dark:text-slate-400">
                                    3 days ago
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                />

                {/* Modal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ duration: 0.3 }}
                    className="relative w-full max-w-5xl mx-4 max-h-[90vh] overflow-hidden"
                >
                    <Card className=" bg-white dark:bg-slate-900 shadow-2xl">
                        {/* Header */}
                        <CardHeader className="pb-4 border-b border-slate-200 dark:border-slate-700">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                                        {detailedMentor.fullName.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <div>
                                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                                            {detailedMentor.fullName}
                                        </h1>
                                        <p className="text-slate-600 dark:text-slate-400 mb-2">{detailedMentor.email}</p>
                                        <div className="flex items-center space-x-3">
                                            {detailedMentor.disabled ? (
                                                <Badge variant="destructive">Inactive</Badge>
                                            ) : (
                                                <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                                                    Active
                                                </Badge>
                                            )}
                                            {detailedMentor.isAvailable ? (
                                                <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                                                    Available
                                                </Badge>
                                            ) : (
                                                <Badge variant="secondary">Unavailable</Badge>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={onMessage}
                                        className="hover:bg-slate-50 dark:hover:bg-slate-800"
                                    >
                                        <MessageSquare className="h-4 w-4 mr-2" />
                                        Message
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="hover:bg-slate-50 dark:hover:bg-slate-800"
                                    >
                                        <Edit className="h-4 w-4 mr-2" />
                                        Edit
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={onClose}
                                        className="hover:bg-slate-100 dark:hover:bg-slate-800"
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="p-0 max-h-[70vh] overflow-y-auto">
                            <Tabs value={activeTab} onValueChange={setActiveTab}>
                                <div className="border-b border-slate-200 dark:border-slate-700 px-6">
                                    <TabsList className="grid w-full grid-cols-4 bg-transparent">
                                        <TabsTrigger value="overview" className="data-[state=active]:bg-slate-100 dark:data-[state=active]:bg-slate-800">
                                            Overview
                                        </TabsTrigger>
                                        <TabsTrigger value="availability" className="data-[state=active]:bg-slate-100 dark:data-[state=active]:bg-slate-800">
                                            Availability
                                        </TabsTrigger>
                                        <TabsTrigger value="reviews" className="data-[state=active]:bg-slate-100 dark:data-[state=active]:bg-slate-800">
                                            Reviews
                                        </TabsTrigger>
                                        <TabsTrigger value="activity" className="data-[state=active]:bg-slate-100 dark:data-[state=active]:bg-slate-800">
                                            Activity
                                        </TabsTrigger>
                                    </TabsList>
                                </div>

                                <div className="p-6">
                                    <TabsContent value="overview" className="mt-0">
                                        <OverviewTab />
                                    </TabsContent>

                                    <TabsContent value="availability" className="mt-0">
                                        <AvailabilityTab />
                                    </TabsContent>

                                    <TabsContent value="reviews" className="mt-0">
                                        <ReviewsTab />
                                    </TabsContent>

                                    <TabsContent value="activity" className="mt-0">
                                        <ActivityTab />
                                    </TabsContent>
                                </div>
                            </Tabs>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default MentorDetailModal;