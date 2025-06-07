import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    Calendar,
    User,
    Users,
    Edit3,
    Trash2,
    UserMinus,
    Globe,
    Lock,
    Target,
    ExternalLink,
    Save,
    AlertTriangle,
    CheckCircle2,
    Copy,
    Settings,
    MoreHorizontal,
    RefreshCw,
    Award,
    Play,
    UserX,
    Trash
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { OpenSessionData } from '@/Redux/types/Sessions/session';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

// PROPERLY IMPORT YOUR APIs
import {
    useGetSessionParticipantsQuery,
    useRemoveSessionParticipantMutation,
    useUpdateOpenSessionMutation,
    useCancelOpenSessionMutation,
    useCompleteOpenSessionMutation, // NOW PROPERLY IMPORTED
    useStartOpenSessionMutation, // NOW PROPERLY IMPORTED
    useBulkRemoveParticipantsMutation, // NOW PROPERLY IMPORTED
} from '@/Redux/apiSlices/Sessions/sessionApi';

interface Participant {
    id: string;
    name: string;
    email: string;
    profilePicture?: string;
    joinedAt: string;
}

interface OpenSessionManagementModalProps {
    session: OpenSessionData;
    isOpen: boolean;
    onClose: () => void;
    onUpdate?: () => void;
}

const OpenSessionManagementModal: React.FC<OpenSessionManagementModalProps> = ({
    session,
    isOpen,
    onClose,
    onUpdate
}) => {
    const [activeTab, setActiveTab] = useState<'overview' | 'participants' | 'edit' | 'settings'>('overview');
    const [linkCopied, setLinkCopied] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showCompleteDialog, setShowCompleteDialog] = useState(false);
    const [showStartDialog, setShowStartDialog] = useState(false);
    const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false);
    const [deleteReason, setDeleteReason] = useState('');
    const [completionNotes, setCompletionNotes] = useState('');
    const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);

    // Edit form state
    const [editForm, setEditForm] = useState({
        topic: session.topic || '',
        description: session.description || '',
        date: session.date || '',
        timeSlot: session.timeSlot || '',
        duration: session.duration || 60,
        link: session.link || '',
        maxParticipants: session.maxParticipants || 10,
        isPublic: session.isPublic ?? true,
        objectives: session.objectives || []
    });
    const [newObjective, setNewObjective] = useState('');

    // API hooks - NOW ALL PROPERLY IMPORTED
    const { data: participantsData, isLoading: isLoadingParticipants, refetch: refetchParticipants } = useGetSessionParticipantsQuery(session.id!, {
        skip: !isOpen || !session.id
    });
    const [removeParticipant] = useRemoveSessionParticipantMutation();
    const [updateSession, { isLoading: isUpdating }] = useUpdateOpenSessionMutation();
    const [cancelSession, { isLoading: isCancelling }] = useCancelOpenSessionMutation();
    const [completeSession, { isLoading: isCompleting }] = useCompleteOpenSessionMutation(); // FIXED
    const [startSession, { isLoading: isStarting }] = useStartOpenSessionMutation(); // ADDED
    const [bulkRemoveParticipants, { isLoading: isBulkRemoving }] = useBulkRemoveParticipantsMutation(); // ADDED

    const participants = participantsData?.data || [];

    useEffect(() => {
        if (isOpen) {
            setEditForm({
                topic: session.topic || '',
                description: session.description || '',
                date: session.date || '',
                timeSlot: session.timeSlot || '',
                duration: session.duration || 60,
                link: session.link || '',
                maxParticipants: session.maxParticipants || 10,
                isPublic: session.isPublic ?? true,
                objectives: session.objectives || []
            });
            setSelectedParticipants([]); // Reset selected participants
        }
    }, [session, isOpen]);

    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch {
            return 'Invalid date';
        }
    };

    const formatTime = (dateString: string) => {
        try {
            return formatDistanceToNow(new Date(dateString), { addSuffix: true });
        } catch {
            return 'Unknown time';
        }
    };

    const getStatusBadge = (status: string) => {
        const baseClasses = "px-3 py-1.5 text-sm font-medium rounded-full border";
        switch (status) {
            case 'open':
                return <Badge className={`${baseClasses} bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-800/30`}>Open for Registration</Badge>;
            case 'in_progress':
                return <Badge className={`${baseClasses} bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-800/30`}>In Progress</Badge>;
            case 'completed':
                return <Badge className={`${baseClasses} bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-900/50 dark:text-slate-400 dark:border-slate-700/50`}>Completed</Badge>;
            case 'cancelled':
                return <Badge className={`${baseClasses} bg-red-50 text-red-600 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-800/30`}>Cancelled</Badge>;
            default:
                return <Badge className={`${baseClasses} bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700`}>{status}</Badge>;
        }
    };

    const copySessionLink = async () => {
        if (session.link) {
            try {
                await navigator.clipboard.writeText(session.link);
                setLinkCopied(true);
                setTimeout(() => setLinkCopied(false), 2000);
            } catch (err) {
                console.error('Failed to copy link:', err);
            }
        }
    };

    const handleRemoveParticipant = async (participantId: string) => {
        try {
            await removeParticipant({
                sessionId: session.id!,
                participantId
            }).unwrap();
            refetchParticipants();
            onUpdate?.();
        } catch (error) {
            console.error('Failed to remove participant:', error);
        }
    };

    // NEW: Handle bulk remove participants
    const handleBulkRemoveParticipants = async () => {
        if (selectedParticipants.length === 0) return;

        try {
            await bulkRemoveParticipants({
                sessionId: session.id!,
                participantIds: selectedParticipants
            }).unwrap();
            setSelectedParticipants([]);
            setShowBulkDeleteDialog(false);
            refetchParticipants();
            onUpdate?.();
        } catch (error) {
            console.error('Failed to bulk remove participants:', error);
        }
    };

    const handleUpdateSession = async () => {
        try {
            await updateSession({
                id: session.id!,
                updates: editForm
            }).unwrap();
            onUpdate?.();
        } catch (error) {
            console.error('Failed to update session:', error);
        }
    };

    const handleCancelSession = async () => {
        try {
            await cancelSession({
                id: session.id!,
                reason: deleteReason || 'Session cancelled by creator'
            }).unwrap();
            setShowDeleteDialog(false);
            onUpdate?.();
            onClose();
        } catch (error) {
            console.error('Failed to cancel session:', error);
        }
    };

    // FIXED: Now properly uses the imported completeSession
    const handleCompleteSession = async () => {
        try {
            await completeSession({
                id: session.id!,
                notes: completionNotes
            }).unwrap();
            setShowCompleteDialog(false);
            onUpdate?.();
            onClose();
        } catch (error) {
            console.error('Failed to complete session:', error);
        }
    };

    // NEW: Handle start session
    const handleStartSession = async () => {
        try {
            await startSession(session.id!).unwrap();
            setShowStartDialog(false);
            onUpdate?.();
        } catch (error) {
            console.error('Failed to start session:', error);
        }
    };

    const addObjective = () => {
        if (newObjective.trim() && !editForm.objectives.includes(newObjective.trim())) {
            setEditForm(prev => ({
                ...prev,
                objectives: [...prev.objectives, newObjective.trim()]
            }));
            setNewObjective('');
        }
    };

    const removeObjective = (index: number) => {
        setEditForm(prev => ({
            ...prev,
            objectives: prev.objectives.filter((_, i) => i !== index)
        }));
    };

    // Participant selection handlers
    const handleSelectParticipant = (participantId: string, checked: boolean) => {
        if (checked) {
            setSelectedParticipants(prev => [...prev, participantId]);
        } else {
            setSelectedParticipants(prev => prev.filter(id => id !== participantId));
        }
    };

    const handleSelectAllParticipants = (checked: boolean) => {
        if (checked) {
            setSelectedParticipants(participants.map(p => p.id));
        } else {
            setSelectedParticipants([]);
        }
    };

    const isUpcoming = new Date(session.date) > new Date();
    const spotsLeft = session.maxParticipants - session.currentParticipants;
    const progressPercentage = (session.currentParticipants / session.maxParticipants) * 100;

    if (!isOpen) return null;

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
                    className="relative w-full max-w-6xl mx-4 max-h-[90vh] overflow-auto rounded-xl"
                >
                    <Card className="border-0 bg-white dark:bg-slate-900 shadow-2xl">
                        {/* Header */}
                        <CardHeader className="pb-6 border-b border-slate-200 dark:border-slate-700">
                            <div className="flex items-start justify-between">
                                <div className="flex items-start space-x-4 flex-1">
                                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-lg">
                                        <Settings className="h-8 w-8" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                                            Manage Session
                                        </CardTitle>
                                        <p className="text-lg text-slate-700 dark:text-slate-300 mb-3">
                                            {session.topic}
                                        </p>
                                        <div className="flex items-center space-x-4">
                                            {getStatusBadge(session.status)}
                                            <Badge variant="outline" className="flex items-center space-x-1">
                                                {session.sessionType === 'group' ? <Users className="h-3 w-3" /> : <User className="h-3 w-3" />}
                                                <span className="capitalize">{session.sessionType} Session</span>
                                            </Badge>
                                            <Badge variant="outline" className="flex items-center space-x-1">
                                                {session.isPublic ? (
                                                    <>
                                                        <Globe className="h-3 w-3" />
                                                        <span>Public</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Lock className="h-3 w-3" />
                                                        <span>Private</span>
                                                    </>
                                                )}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={onClose}
                                    className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                                >
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>
                        </CardHeader>

                        <CardContent className="p-6">
                            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
                                <TabsList className="grid w-full grid-cols-4 mb-6">
                                    <TabsTrigger value="overview" className="flex items-center space-x-2">
                                        <Target className="h-4 w-4" />
                                        <span>Overview</span>
                                    </TabsTrigger>
                                    <TabsTrigger value="participants" className="flex items-center space-x-2">
                                        <Users className="h-4 w-4" />
                                        <span>Participants ({participants.length})</span>
                                    </TabsTrigger>
                                    <TabsTrigger value="edit" className="flex items-center space-x-2">
                                        <Edit3 className="h-4 w-4" />
                                        <span>Edit Session</span>
                                    </TabsTrigger>
                                    <TabsTrigger value="settings" className="flex items-center space-x-2">
                                        <Settings className="h-4 w-4" />
                                        <span>Actions</span>
                                    </TabsTrigger>
                                </TabsList>

                                {/* Overview Tab - Same as before */}
                                <TabsContent value="overview" className="space-y-6">
                                    {/* Previous overview content remains the same */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Session Details */}
                                        <Card className="bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700">
                                            <CardContent className="p-4">
                                                <h5 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center">
                                                    <Calendar className="h-4 w-4 mr-2" />
                                                    Schedule & Details
                                                </h5>
                                                <div className="space-y-2">
                                                    <div className="flex justify-between">
                                                        <span className="text-slate-600 dark:text-slate-400">Date:</span>
                                                        <span className="font-medium text-slate-900 dark:text-white">{formatDate(session.date)}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-slate-600 dark:text-slate-400">Time:</span>
                                                        <span className="font-medium text-slate-900 dark:text-white">{session.timeSlot}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-slate-600 dark:text-slate-400">Duration:</span>
                                                        <span className="font-medium text-slate-900 dark:text-white">{session.duration} minutes</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-slate-600 dark:text-slate-400">Type:</span>
                                                        <span className="font-medium text-slate-900 dark:text-white capitalize">{session.sessionType}</span>
                                                    </div>
                                                    <div className="pt-2 border-t border-slate-200 dark:border-slate-600">
                                                        <span className="text-xs text-slate-500 dark:text-slate-400">
                                                            {isUpcoming ? `Starts ${formatTime(session.date)}` : formatTime(session.date)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        {/* Participants Stats */}
                                        <Card className="bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700">
                                            <CardContent className="p-4">
                                                <h5 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center">
                                                    <Users className="h-4 w-4 mr-2" />
                                                    Registration Status
                                                </h5>
                                                <div className="space-y-3">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-slate-600 dark:text-slate-400">Registered:</span>
                                                        <span className="font-bold text-lg text-slate-900 dark:text-white">
                                                            {session.currentParticipants}/{session.maxParticipants}
                                                        </span>
                                                    </div>
                                                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                                        <div
                                                            className={cn(
                                                                "h-2 rounded-full transition-all duration-300",
                                                                progressPercentage < 70 ? "bg-emerald-500" :
                                                                    progressPercentage < 90 ? "bg-amber-500" : "bg-red-500"
                                                            )}
                                                            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                                                        />
                                                    </div>
                                                    <div className="flex justify-between text-xs">
                                                        <span className="text-slate-500 dark:text-slate-400">
                                                            {spotsLeft > 0 ? `${spotsLeft} spots available` : 'Session full'}
                                                        </span>
                                                        <span className="text-slate-500 dark:text-slate-400">
                                                            {Math.round(progressPercentage)}% filled
                                                        </span>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>

                                    {/* Session Link */}
                                    {session.link && (
                                        <div>
                                            <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-3 flex items-center">
                                                <ExternalLink className="h-5 w-5 mr-2" />
                                                Meeting Link
                                            </h4>
                                            <div className="flex items-center space-x-3 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800/30">
                                                <div className="flex-1">
                                                    <p className="text-sm text-blue-700 dark:text-blue-400 font-medium mb-1">Session Meeting Link</p>
                                                    <p className="text-xs text-blue-600 dark:text-blue-500 truncate">{session.link}</p>
                                                </div>
                                                <div className="flex space-x-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={copySessionLink}
                                                        className="border-blue-200 text-blue-600 hover:bg-blue-100 dark:border-blue-700 dark:text-blue-400"
                                                    >
                                                        {linkCopied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        onClick={() => window.open(session.link, '_blank')}
                                                        className="bg-blue-600 hover:bg-blue-700 text-white"
                                                    >
                                                        <ExternalLink className="h-4 w-4 mr-2" />
                                                        Open
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </TabsContent>

                                {/* ENHANCED Participants Tab with bulk actions */}
                                <TabsContent value="participants" className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-lg font-semibold text-slate-900 dark:text-white">
                                            Session Participants ({participants.length})
                                        </h4>
                                        <div className="flex items-center space-x-3">
                                            {selectedParticipants.length > 0 && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => setShowBulkDeleteDialog(true)}
                                                    className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800/30 dark:text-red-400"
                                                >
                                                    <UserX className="h-4 w-4 mr-2" />
                                                    Remove Selected ({selectedParticipants.length})
                                                </Button>
                                            )}
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => refetchParticipants()}
                                                disabled={isLoadingParticipants}
                                            >
                                                <RefreshCw className={cn("h-4 w-4 mr-2", isLoadingParticipants && "animate-spin")} />
                                                Refresh
                                            </Button>
                                        </div>
                                    </div>

                                    {isLoadingParticipants ? (
                                        <div className="text-center py-8">
                                            <div className="animate-spin w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full mx-auto"></div>
                                            <p className="text-slate-600 dark:text-slate-400 mt-2">Loading participants...</p>
                                        </div>
                                    ) : participants.length > 0 ? (
                                        <div className="space-y-4">
                                            {/* Select All Checkbox */}
                                            <div className="flex items-center space-x-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border">
                                                <Checkbox
                                                    id="select-all"
                                                    checked={selectedParticipants.length === participants.length}
                                                    onCheckedChange={handleSelectAllParticipants}
                                                />
                                                <Label htmlFor="select-all" className="font-medium">
                                                    Select All ({participants.length} participants)
                                                </Label>
                                            </div>

                                            {participants.map((participant) => (
                                                <Card key={participant.id} className="bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700">
                                                    <CardContent className="p-4">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center space-x-4">
                                                                <Checkbox
                                                                    id={`participant-${participant.id}`}
                                                                    checked={selectedParticipants.includes(participant.id)}
                                                                    onCheckedChange={(checked) => handleSelectParticipant(participant.id, checked as boolean)}
                                                                />
                                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-medium">
                                                                    {participant.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                                                                </div>
                                                                <div>
                                                                    <h5 className="font-medium text-slate-900 dark:text-white">{participant.name}</h5>
                                                                    <p className="text-sm text-slate-600 dark:text-slate-400">{participant.email}</p>
                                                                    <p className="text-xs text-slate-500 dark:text-slate-500">
                                                                        Joined {formatTime(participant.joinedAt)}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                                        <MoreHorizontal className="h-4 w-4" />
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end">
                                                                    <DropdownMenuItem
                                                                        onClick={() => handleRemoveParticipant(participant.id)}
                                                                        className="text-red-600 focus:text-red-600"
                                                                    >
                                                                        <UserMinus className="h-4 w-4 mr-2" />
                                                                        Remove from session
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12">
                                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center mx-auto mb-6">
                                                <Users className="h-12 w-12 text-slate-400" />
                                            </div>
                                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                                                No participants yet
                                            </h3>
                                            <p className="text-slate-600 dark:text-slate-400">
                                                Participants will appear here once they join your session.
                                            </p>
                                        </div>
                                    )}
                                </TabsContent>

                                {/* Edit Tab - Same as before but add your edit logic here */}
                                <TabsContent value="edit" className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div>
                                                <Label htmlFor="topic">Session Topic</Label>
                                                <Input
                                                    id="topic"
                                                    value={editForm.topic}
                                                    onChange={(e) => setEditForm(prev => ({ ...prev, topic: e.target.value }))}
                                                    placeholder="Enter session topic"
                                                />
                                            </div>

                                            <div>
                                                <Label htmlFor="description">Description</Label>
                                                <Textarea
                                                    id="description"
                                                    value={editForm.description}
                                                    onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                                                    placeholder="Describe your session"
                                                    rows={4}
                                                />
                                            </div>

                                            <div>
                                                <Label htmlFor="date">Date</Label>
                                                <Input
                                                    id="date"
                                                    type="date"
                                                    value={editForm.date?.split('T')[0]}
                                                    onChange={(e) => setEditForm(prev => ({ ...prev, date: e.target.value }))}
                                                />
                                            </div>

                                            <div>
                                                <Label htmlFor="timeSlot">Time Slot</Label>
                                                <Input
                                                    id="timeSlot"
                                                    value={editForm.timeSlot}
                                                    onChange={(e) => setEditForm(prev => ({ ...prev, timeSlot: e.target.value }))}
                                                    placeholder="e.g., 10:00 AM - 11:00 AM"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <Label htmlFor="duration">Duration (minutes)</Label>
                                                <Input
                                                    id="duration"
                                                    type="number"
                                                    value={editForm.duration}
                                                    onChange={(e) => setEditForm(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                                                    min="15"
                                                    step="15"
                                                />
                                            </div>

                                            <div>
                                                <Label htmlFor="maxParticipants">Max Participants</Label>
                                                <Input
                                                    id="maxParticipants"
                                                    type="number"
                                                    value={editForm.maxParticipants}
                                                    onChange={(e) => setEditForm(prev => ({ ...prev, maxParticipants: parseInt(e.target.value) }))}
                                                    min="1"
                                                    max="100"
                                                />
                                            </div>

                                            <div>
                                                <Label htmlFor="link">Meeting Link</Label>
                                                <Input
                                                    id="link"
                                                    value={editForm.link}
                                                    onChange={(e) => setEditForm(prev => ({ ...prev, link: e.target.value }))}
                                                    placeholder="https://zoom.us/j/..."
                                                />
                                            </div>

                                            <div className="flex items-center space-x-3">
                                                <Switch
                                                    id="isPublic"
                                                    checked={editForm.isPublic}
                                                    onCheckedChange={(checked) => setEditForm(prev => ({ ...prev, isPublic: checked }))}
                                                />
                                                <div>
                                                    <Label htmlFor="isPublic" className="font-medium">
                                                        Public Session
                                                    </Label>
                                                    <p className="text-xs text-slate-600 dark:text-slate-400">
                                                        Allow anyone to discover and join this session
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Learning Objectives */}
                                    <div>
                                        <Label>Learning Objectives</Label>
                                        <div className="space-y-3 mt-2">
                                            <div className="flex space-x-2">
                                                <Input
                                                    value={newObjective}
                                                    onChange={(e) => setNewObjective(e.target.value)}
                                                    placeholder="Add a learning objective"
                                                    onKeyPress={(e) => e.key === 'Enter' && addObjective()}
                                                />
                                                <Button onClick={addObjective} size="sm">
                                                    Add
                                                </Button>
                                            </div>
                                            {editForm.objectives.length > 0 && (
                                                <div className="space-y-2">
                                                    {editForm.objectives.map((objective, index) => (
                                                        <div key={index} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                                            <span className="text-sm">{objective}</span>
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                onClick={() => removeObjective(index)}
                                                                className="text-red-600 hover:text-red-700"
                                                            >
                                                                <X className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex justify-end space-x-3">
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                setEditForm({
                                                    topic: session.topic || '',
                                                    description: session.description || '',
                                                    date: session.date || '',
                                                    timeSlot: session.timeSlot || '',
                                                    duration: session.duration || 60,
                                                    link: session.link || '',
                                                    maxParticipants: session.maxParticipants || 10,
                                                    isPublic: session.isPublic ?? true,
                                                    objectives: session.objectives || []
                                                });
                                            }}
                                        >
                                            Reset
                                        </Button>
                                        <Button
                                            onClick={handleUpdateSession}
                                            disabled={isUpdating}
                                            className="bg-indigo-600 hover:bg-indigo-700 text-white"
                                        >
                                            {isUpdating ? (
                                                <>
                                                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                                    Updating...
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="h-4 w-4 mr-2" />
                                                    Save Changes
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </TabsContent>

                                {/* ENHANCED Settings/Actions Tab with START functionality */}
                                <TabsContent value="settings" className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Session Actions */}
                                        <Card className="border-emerald-200 dark:border-emerald-800/30">
                                            <CardHeader className="pb-3">
                                                <CardTitle className="text-lg flex items-center text-emerald-700 dark:text-emerald-400">
                                                    <CheckCircle2 className="h-5 w-5 mr-2" />
                                                    Session Management
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-3">
                                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                                                    Manage the lifecycle of your session.
                                                </p>

                                                {/* START SESSION - for open sessions */}
                                                {session.status === 'open' && (
                                                    <Button
                                                        onClick={() => setShowStartDialog(true)}
                                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white mb-2"
                                                    >
                                                        <Play className="h-4 w-4 mr-2" />
                                                        Start Session
                                                    </Button>
                                                )}

                                                {/* COMPLETE SESSION - for open or in_progress sessions */}
                                                {(session.status === 'open' || session.status === 'in_progress') && (
                                                    <Button
                                                        onClick={() => setShowCompleteDialog(true)}
                                                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                                                    >
                                                        <Award className="h-4 w-4 mr-2" />
                                                        Mark as Completed
                                                    </Button>
                                                )}

                                                <Button
                                                    variant="outline"
                                                    className="w-full"
                                                    onClick={() => window.open(session.link, '_blank')}
                                                    disabled={!session.link}
                                                >
                                                    <ExternalLink className="h-4 w-4 mr-2" />
                                                    Join Session Now
                                                </Button>
                                            </CardContent>
                                        </Card>

                                        {/* Danger Zone */}
                                        <Card className="border-red-200 dark:border-red-800/30">
                                            <CardHeader className="pb-3">
                                                <CardTitle className="text-lg flex items-center text-red-700 dark:text-red-400">
                                                    <AlertTriangle className="h-5 w-5 mr-2" />
                                                    Danger Zone
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-3">
                                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                                                    These actions cannot be undone. Proceed with caution.
                                                </p>

                                                <Button
                                                    variant="outline"
                                                    onClick={() => setShowDeleteDialog(true)}
                                                    className="w-full border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800/30 dark:text-red-400 dark:hover:bg-red-950/20"
                                                >
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                    Cancel Session
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    </div>

                                    {/* Session Statistics */}
                                    <Card className="bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700">
                                        <CardHeader className="pb-3">
                                            <CardTitle className="text-lg">Session Statistics</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                <div className="text-center">
                                                    <div className="text-2xl font-bold text-slate-900 dark:text-white">{session.currentParticipants}</div>
                                                    <div className="text-sm text-slate-600 dark:text-slate-400">Registered</div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-2xl font-bold text-slate-900 dark:text-white">{spotsLeft}</div>
                                                    <div className="text-sm text-slate-600 dark:text-slate-400">Spots Left</div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-2xl font-bold text-slate-900 dark:text-white">{Math.round(progressPercentage)}%</div>
                                                    <div className="text-sm text-slate-600 dark:text-slate-400">Filled</div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-2xl font-bold text-slate-900 dark:text-white">{session.duration}</div>
                                                    <div className="text-sm text-slate-600 dark:text-slate-400">Minutes</div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* ALL DIALOGS */}

                {/* Delete/Cancel Session Dialog */}
                <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle className="flex items-center text-red-600">
                                <AlertTriangle className="h-5 w-5 mr-2" />
                                Cancel Session
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                Are you sure you want to cancel this session? This action cannot be undone.
                                All participants will be notified about the cancellation.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <div className="my-4">
                            <Label htmlFor="deleteReason" className="text-sm font-medium">
                                Reason for cancellation (optional)
                            </Label>
                            <Textarea
                                id="deleteReason"
                                value={deleteReason}
                                onChange={(e) => setDeleteReason(e.target.value)}
                                placeholder="Provide a reason for cancelling this session..."
                                className="mt-2"
                                rows={3}
                            />
                        </div>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Keep Session</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleCancelSession}
                                disabled={isCancelling}
                                className="bg-red-600 hover:bg-red-700 text-white"
                            >
                                {isCancelling ? (
                                    <>
                                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                        Cancelling...
                                    </>
                                ) : (
                                    <>
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Cancel Session
                                    </>
                                )}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                {/* Complete Session Dialog */}
                <AlertDialog open={showCompleteDialog} onOpenChange={setShowCompleteDialog}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle className="flex items-center text-emerald-600">
                                <Award className="h-5 w-5 mr-2" />
                                Mark Session as Completed
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                Mark this session as completed. This will close registration and update the session status.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <div className="my-4">
                            <Label htmlFor="completionNotes" className="text-sm font-medium">
                                Session notes (optional)
                            </Label>
                            <Textarea
                                id="completionNotes"
                                value={completionNotes}
                                onChange={(e) => setCompletionNotes(e.target.value)}
                                placeholder="Add any notes about how the session went..."
                                className="mt-2"
                                rows={3}
                            />
                        </div>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleCompleteSession}
                                disabled={isCompleting}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                            >
                                {isCompleting ? (
                                    <>
                                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                        Completing...
                                    </>
                                ) : (
                                    <>
                                        <Award className="h-4 w-4 mr-2" />
                                        Mark as Completed
                                    </>
                                )}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                {/* NEW: Start Session Dialog */}
                <AlertDialog open={showStartDialog} onOpenChange={setShowStartDialog}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle className="flex items-center text-blue-600">
                                <Play className="h-5 w-5 mr-2" />
                                Start Session
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                Start this session now. All participants will be notified that the session has begun.
                                The session status will change to "In Progress".
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleStartSession}
                                disabled={isStarting}
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                {isStarting ? (
                                    <>
                                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                        Starting...
                                    </>
                                ) : (
                                    <>
                                        <Play className="h-4 w-4 mr-2" />
                                        Start Session
                                    </>
                                )}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                {/* NEW: Bulk Remove Participants Dialog */}
                <AlertDialog open={showBulkDeleteDialog} onOpenChange={setShowBulkDeleteDialog}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle className="flex items-center text-red-600">
                                <UserX className="h-5 w-5 mr-2" />
                                Remove Selected Participants
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                Are you sure you want to remove {selectedParticipants.length} selected participants from this session?
                                They will be notified about their removal.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleBulkRemoveParticipants}
                                disabled={isBulkRemoving}
                                className="bg-red-600 hover:bg-red-700 text-white"
                            >
                                {isBulkRemoving ? (
                                    <>
                                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                        Removing...
                                    </>
                                ) : (
                                    <>
                                        <UserX className="h-4 w-4 mr-2" />
                                        Remove {selectedParticipants.length} Participants
                                    </>
                                )}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </AnimatePresence>
    );
};

export default OpenSessionManagementModal;




// import React, { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import {
//     X,
//     Calendar,
//     User,
//     Users,
//     Edit3,
//     Trash2,
//     UserMinus,
//     Globe,
//     Lock,
//     Target,
//     ExternalLink,
//     Save,
//     AlertTriangle,
//     CheckCircle2,
//     Copy,
//     Settings,
//     MoreHorizontal,
//     RefreshCw,
//     Award
// } from 'lucide-react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
// import { Label } from '@/components/ui/label';
// import { Switch } from '@/components/ui/switch';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import {
//     AlertDialog,
//     AlertDialogAction,
//     AlertDialogCancel,
//     AlertDialogContent,
//     AlertDialogDescription,
//     AlertDialogFooter,
//     AlertDialogHeader,
//     AlertDialogTitle,
// } from '@/components/ui/alert-dialog';
// import {
//     DropdownMenu,
//     DropdownMenuContent,
//     DropdownMenuItem,
//     DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu';
// import { OpenSessionData } from '@/Redux/types/Sessions/session';
// import { cn } from '@/lib/utils';
// import { formatDistanceToNow } from 'date-fns';

// import {
//     useGetSessionParticipantsQuery,
//     useRemoveSessionParticipantMutation,
//     useUpdateOpenSessionMutation,
//     useCancelOpenSessionMutation,
// } from '@/Redux/apiSlices/Sessions/sessionApi';


// interface OpenSessionManagementModalProps {
//     session: OpenSessionData;
//     isOpen: boolean;
//     onClose: () => void;
//     onUpdate?: () => void;
// }

// const OpenSessionManagementModal: React.FC<OpenSessionManagementModalProps> = ({
//     session,
//     isOpen,
//     onClose,
//     onUpdate
// }) => {
//     const [activeTab, setActiveTab] = useState<'overview' | 'participants' | 'edit' | 'settings'>('overview');
//     const [linkCopied, setLinkCopied] = useState(false);
//     const [showDeleteDialog, setShowDeleteDialog] = useState(false);
//     const [showCompleteDialog, setShowCompleteDialog] = useState(false);
//     const [deleteReason, setDeleteReason] = useState('');
//     const [completionNotes, setCompletionNotes] = useState('');
//     const [isEditing, setIsEditing] = useState(false);

//     // Edit form state
//     const [editForm, setEditForm] = useState({
//         topic: session.topic || '',
//         description: session.description || '',
//         date: session.date || '',
//         timeSlot: session.timeSlot || '',
//         duration: session.duration || 60,
//         link: session.link || '',
//         maxParticipants: session.maxParticipants || 10,
//         isPublic: session.isPublic ?? true,
//         objectives: session.objectives || []
//     });
//     const [newObjective, setNewObjective] = useState('');

//     // API hooks
//     const { data: participantsData, isLoading: isLoadingParticipants, refetch: refetchParticipants } = useGetSessionParticipantsQuery(session.id!, {
//         skip: !isOpen || !session.id
//     });
//     const [removeParticipant] = useRemoveSessionParticipantMutation();
//     const [updateSession, { isLoading: isUpdating }] = useUpdateOpenSessionMutation();
//     const [cancelSession, { isLoading: isCancelling }] = useCancelOpenSessionMutation();

//     const participants = participantsData?.data || [];

//     useEffect(() => {
//         if (isOpen) {
//             setEditForm({
//                 topic: session.topic || '',
//                 description: session.description || '',
//                 date: session.date || '',
//                 timeSlot: session.timeSlot || '',
//                 duration: session.duration || 60,
//                 link: session.link || '',
//                 maxParticipants: session.maxParticipants || 10,
//                 isPublic: session.isPublic ?? true,
//                 objectives: session.objectives || []
//             });
//         }
//     }, [session, isOpen]);

//     const formatDate = (dateString: string) => {
//         try {
//             return new Date(dateString).toLocaleDateString('en-US', {
//                 weekday: 'long',
//                 year: 'numeric',
//                 month: 'long',
//                 day: 'numeric'
//             });
//         } catch {
//             return 'Invalid date';
//         }
//     };

//     const formatTime = (dateString: string) => {
//         try {
//             return formatDistanceToNow(new Date(dateString), { addSuffix: true });
//         } catch {
//             return 'Unknown time';
//         }
//     };

//     const getStatusBadge = (status: string) => {
//         const baseClasses = "px-3 py-1.5 text-sm font-medium rounded-full border";
//         switch (status) {
//             case 'open':
//                 return <Badge className={`${baseClasses} bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-800/30`}>Open for Registration</Badge>;
//             case 'in_progress':
//                 return <Badge className={`${baseClasses} bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-800/30`}>In Progress</Badge>;
//             case 'completed':
//                 return <Badge className={`${baseClasses} bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-900/50 dark:text-slate-400 dark:border-slate-700/50`}>Completed</Badge>;
//             case 'cancelled':
//                 return <Badge className={`${baseClasses} bg-red-50 text-red-600 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-800/30`}>Cancelled</Badge>;
//             default:
//                 return <Badge className={`${baseClasses} bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700`}>{status}</Badge>;
//         }
//     };

//     const copySessionLink = async () => {
//         if (session.link) {
//             try {
//                 await navigator.clipboard.writeText(session.link);
//                 setLinkCopied(true);
//                 setTimeout(() => setLinkCopied(false), 2000);
//             } catch (err) {
//                 console.error('Failed to copy link:', err);
//             }
//         }
//     };

//     const handleRemoveParticipant = async (participantId: string) => {
//         try {
//             await removeParticipant({
//                 sessionId: session.id!,
//                 participantId
//             }).unwrap();
//             refetchParticipants();
//             onUpdate?.();
//         } catch (error) {
//             console.error('Failed to remove participant:', error);
//         }
//     };

//     const handleUpdateSession = async () => {
//         try {
//             await updateSession({
//                 id: session.id!,
//                 updates: editForm
//             }).unwrap();
//             setIsEditing(false);
//             onUpdate?.();
//         } catch (error) {
//             console.error('Failed to update session:', error);
//         }
//     };

//     const handleCancelSession = async () => {
//         try {
//             await cancelSession({
//                 id: session.id!,
//                 reason: deleteReason || 'Session cancelled by creator'
//             }).unwrap();
//             setShowDeleteDialog(false);
//             onUpdate?.();
//             onClose();
//         } catch (error) {
//             console.error('Failed to cancel session:', error);
//         }
//     };

//     const handleCompleteSession = async () => {
//         try {
//             // This would need to be implemented in your API
//             await completeSession({ id: session.id!, notes: completionNotes }).unwrap();
//             setShowCompleteDialog(false);
//             onUpdate?.();
//             onClose();
//         } catch (error) {
//             console.error('Failed to complete session:', error);
//         }
//     };

//     const addObjective = () => {
//         if (newObjective.trim() && !editForm.objectives.includes(newObjective.trim())) {
//             setEditForm(prev => ({
//                 ...prev,
//                 objectives: [...prev.objectives, newObjective.trim()]
//             }));
//             setNewObjective('');
//         }
//     };

//     const removeObjective = (index: number) => {
//         setEditForm(prev => ({
//             ...prev,
//             objectives: prev.objectives.filter((_, i) => i !== index)
//         }));
//     };

//     const isUpcoming = new Date(session.date) > new Date();
//     const spotsLeft = session.maxParticipants - session.currentParticipants;
//     const progressPercentage = (session.currentParticipants / session.maxParticipants) * 100;

//     if (!isOpen) return null;

//     return (
//         <AnimatePresence>
//             <div className="fixed inset-0 z-50 flex items-center justify-center">
//                 {/* Backdrop */}
//                 <motion.div
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     exit={{ opacity: 0 }}
//                     onClick={onClose}
//                     className="absolute inset-0 bg-black/50 backdrop-blur-sm"
//                 />

//                 {/* Modal */}
//                 <motion.div
//                     initial={{ opacity: 0, scale: 0.95, y: 20 }}
//                     animate={{ opacity: 1, scale: 1, y: 0 }}
//                     exit={{ opacity: 0, scale: 0.95, y: 20 }}
//                     transition={{ duration: 0.3 }}
//                     className="relative w-full max-w-6xl mx-4 max-h-[90vh] overflow-auto rounded-xl"
//                 >
//                     <Card className="border-0 bg-white dark:bg-slate-900 shadow-2xl">
//                         {/* Header */}
//                         <CardHeader className="pb-6 border-b border-slate-200 dark:border-slate-700">
//                             <div className="flex items-start justify-between">
//                                 <div className="flex items-start space-x-4 flex-1">
//                                     <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-lg">
//                                         <Settings className="h-8 w-8" />
//                                     </div>
//                                     <div className="flex-1 min-w-0">
//                                         <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
//                                             Manage Session
//                                         </CardTitle>
//                                         <p className="text-lg text-slate-700 dark:text-slate-300 mb-3">
//                                             {session.topic}
//                                         </p>
//                                         <div className="flex items-center space-x-4">
//                                             {getStatusBadge(session.status)}
//                                             <Badge variant="outline" className="flex items-center space-x-1">
//                                                 {session.sessionType === 'group' ? <Users className="h-3 w-3" /> : <User className="h-3 w-3" />}
//                                                 <span className="capitalize">{session.sessionType} Session</span>
//                                             </Badge>
//                                             <Badge variant="outline" className="flex items-center space-x-1">
//                                                 {session.isPublic ? (
//                                                     <>
//                                                         <Globe className="h-3 w-3" />
//                                                         <span>Public</span>
//                                                     </>
//                                                 ) : (
//                                                     <>
//                                                         <Lock className="h-3 w-3" />
//                                                         <span>Private</span>
//                                                     </>
//                                                 )}
//                                             </Badge>
//                                         </div>
//                                     </div>
//                                 </div>
//                                 <Button
//                                     variant="ghost"
//                                     size="sm"
//                                     onClick={onClose}
//                                     className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
//                                 >
//                                     <X className="h-5 w-5" />
//                                 </Button>
//                             </div>
//                         </CardHeader>

//                         <CardContent className="p-6">
//                             <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
//                                 <TabsList className="grid w-full grid-cols-4 mb-6">
//                                     <TabsTrigger value="overview" className="flex items-center space-x-2">
//                                         <Target className="h-4 w-4" />
//                                         <span>Overview</span>
//                                     </TabsTrigger>
//                                     <TabsTrigger value="participants" className="flex items-center space-x-2">
//                                         <Users className="h-4 w-4" />
//                                         <span>Participants ({participants.length})</span>
//                                     </TabsTrigger>
//                                     <TabsTrigger value="edit" className="flex items-center space-x-2">
//                                         <Edit3 className="h-4 w-4" />
//                                         <span>Edit Session</span>
//                                     </TabsTrigger>
//                                     <TabsTrigger value="settings" className="flex items-center space-x-2">
//                                         <Settings className="h-4 w-4" />
//                                         <span>Actions</span>
//                                     </TabsTrigger>
//                                 </TabsList>

//                                 {/* Overview Tab */}
//                                 <TabsContent value="overview" className="space-y-6">
//                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                         {/* Session Details */}
//                                         <Card className="bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700">
//                                             <CardContent className="p-4">
//                                                 <h5 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center">
//                                                     <Calendar className="h-4 w-4 mr-2" />
//                                                     Schedule & Details
//                                                 </h5>
//                                                 <div className="space-y-2">
//                                                     <div className="flex justify-between">
//                                                         <span className="text-slate-600 dark:text-slate-400">Date:</span>
//                                                         <span className="font-medium text-slate-900 dark:text-white">{formatDate(session.date)}</span>
//                                                     </div>
//                                                     <div className="flex justify-between">
//                                                         <span className="text-slate-600 dark:text-slate-400">Time:</span>
//                                                         <span className="font-medium text-slate-900 dark:text-white">{session.timeSlot}</span>
//                                                     </div>
//                                                     <div className="flex justify-between">
//                                                         <span className="text-slate-600 dark:text-slate-400">Duration:</span>
//                                                         <span className="font-medium text-slate-900 dark:text-white">{session.duration} minutes</span>
//                                                     </div>
//                                                     <div className="flex justify-between">
//                                                         <span className="text-slate-600 dark:text-slate-400">Type:</span>
//                                                         <span className="font-medium text-slate-900 dark:text-white capitalize">{session.sessionType}</span>
//                                                     </div>
//                                                     <div className="pt-2 border-t border-slate-200 dark:border-slate-600">
//                                                         <span className="text-xs text-slate-500 dark:text-slate-400">
//                                                             {isUpcoming ? `Starts ${formatTime(session.date)}` : formatTime(session.date)}
//                                                         </span>
//                                                     </div>
//                                                 </div>
//                                             </CardContent>
//                                         </Card>

//                                         {/* Participants Stats */}
//                                         <Card className="bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700">
//                                             <CardContent className="p-4">
//                                                 <h5 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center">
//                                                     <Users className="h-4 w-4 mr-2" />
//                                                     Registration Status
//                                                 </h5>
//                                                 <div className="space-y-3">
//                                                     <div className="flex justify-between items-center">
//                                                         <span className="text-slate-600 dark:text-slate-400">Registered:</span>
//                                                         <span className="font-bold text-lg text-slate-900 dark:text-white">
//                                                             {session.currentParticipants}/{session.maxParticipants}
//                                                         </span>
//                                                     </div>
//                                                     <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
//                                                         <div
//                                                             className={cn(
//                                                                 "h-2 rounded-full transition-all duration-300",
//                                                                 progressPercentage < 70 ? "bg-emerald-500" :
//                                                                     progressPercentage < 90 ? "bg-amber-500" : "bg-red-500"
//                                                             )}
//                                                             style={{ width: `${Math.min(progressPercentage, 100)}%` }}
//                                                         />
//                                                     </div>
//                                                     <div className="flex justify-between text-xs">
//                                                         <span className="text-slate-500 dark:text-slate-400">
//                                                             {spotsLeft > 0 ? `${spotsLeft} spots available` : 'Session full'}
//                                                         </span>
//                                                         <span className="text-slate-500 dark:text-slate-400">
//                                                             {Math.round(progressPercentage)}% filled
//                                                         </span>
//                                                     </div>
//                                                 </div>
//                                             </CardContent>
//                                         </Card>
//                                     </div>

//                                     {/* Description */}
//                                     {session.description && (
//                                         <div>
//                                             <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Description</h4>
//                                             <p className="text-slate-600 dark:text-slate-400 leading-relaxed p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
//                                                 {session.description}
//                                             </p>
//                                         </div>
//                                     )}

//                                     {/* Learning Objectives */}
//                                     {session.objectives && session.objectives.length > 0 && (
//                                         <div>
//                                             <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-3 flex items-center">
//                                                 <Target className="h-5 w-5 mr-2" />
//                                                 Learning Objectives
//                                             </h4>
//                                             <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//                                                 {session.objectives.map((objective, index) => (
//                                                     <div key={index} className="flex items-start space-x-2 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
//                                                         <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
//                                                         <span className="text-sm text-slate-600 dark:text-slate-400">{objective}</span>
//                                                     </div>
//                                                 ))}
//                                             </div>
//                                         </div>
//                                     )}

//                                     {/* Session Link */}
//                                     {session.link && (
//                                         <div>
//                                             <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-3 flex items-center">
//                                                 <ExternalLink className="h-5 w-5 mr-2" />
//                                                 Meeting Link
//                                             </h4>
//                                             <div className="flex items-center space-x-3 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800/30">
//                                                 <div className="flex-1">
//                                                     <p className="text-sm text-blue-700 dark:text-blue-400 font-medium mb-1">Session Meeting Link</p>
//                                                     <p className="text-xs text-blue-600 dark:text-blue-500 truncate">{session.link}</p>
//                                                 </div>
//                                                 <div className="flex space-x-2">
//                                                     <Button
//                                                         size="sm"
//                                                         variant="outline"
//                                                         onClick={copySessionLink}
//                                                         className="border-blue-200 text-blue-600 hover:bg-blue-100 dark:border-blue-700 dark:text-blue-400"
//                                                     >
//                                                         {linkCopied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
//                                                     </Button>
//                                                     <Button
//                                                         size="sm"
//                                                         onClick={() => window.open(session.link, '_blank')}
//                                                         className="bg-blue-600 hover:bg-blue-700 text-white"
//                                                     >
//                                                         <ExternalLink className="h-4 w-4 mr-2" />
//                                                         Open
//                                                     </Button>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     )}
//                                 </TabsContent>

//                                 {/* Participants Tab */}
//                                 <TabsContent value="participants" className="space-y-6">
//                                     <div className="flex items-center justify-between">
//                                         <h4 className="text-lg font-semibold text-slate-900 dark:text-white">
//                                             Session Participants ({participants.length})
//                                         </h4>
//                                         <Button
//                                             size="sm"
//                                             variant="outline"
//                                             onClick={() => refetchParticipants()}
//                                             disabled={isLoadingParticipants}
//                                         >
//                                             <RefreshCw className={cn("h-4 w-4 mr-2", isLoadingParticipants && "animate-spin")} />
//                                             Refresh
//                                         </Button>
//                                     </div>

//                                     {isLoadingParticipants ? (
//                                         <div className="text-center py-8">
//                                             <div className="animate-spin w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full mx-auto"></div>
//                                             <p className="text-slate-600 dark:text-slate-400 mt-2">Loading participants...</p>
//                                         </div>
//                                     ) : participants.length > 0 ? (
//                                         <div className="space-y-4">
//                                             {participants.map((participant) => (
//                                                 <Card key={participant.id} className="bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700">
//                                                     <CardContent className="p-4">
//                                                         <div className="flex items-center justify-between">
//                                                             <div className="flex items-center space-x-4">
//                                                                 <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-medium">
//                                                                     {participant.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
//                                                                 </div>
//                                                                 <div>
//                                                                     <h5 className="font-medium text-slate-900 dark:text-white">{participant.name}</h5>
//                                                                     <p className="text-sm text-slate-600 dark:text-slate-400">{participant.email}</p>
//                                                                     <p className="text-xs text-slate-500 dark:text-slate-500">
//                                                                         Joined {formatTime(participant.joinedAt)}
//                                                                     </p>
//                                                                 </div>
//                                                             </div>
//                                                             <DropdownMenu>
//                                                                 <DropdownMenuTrigger asChild>
//                                                                     <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
//                                                                         <MoreHorizontal className="h-4 w-4" />
//                                                                     </Button>
//                                                                 </DropdownMenuTrigger>
//                                                                 <DropdownMenuContent align="end">
//                                                                     <DropdownMenuItem
//                                                                         onClick={() => handleRemoveParticipant(participant.id)}
//                                                                         className="text-red-600 focus:text-red-600"
//                                                                     >
//                                                                         <UserMinus className="h-4 w-4 mr-2" />
//                                                                         Remove from session
//                                                                     </DropdownMenuItem>
//                                                                 </DropdownMenuContent>
//                                                             </DropdownMenu>
//                                                         </div>
//                                                     </CardContent>
//                                                 </Card>
//                                             ))}
//                                         </div>
//                                     ) : (
//                                         <div className="text-center py-12">
//                                             <div className="w-24 h-24 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center mx-auto mb-6">
//                                                 <Users className="h-12 w-12 text-slate-400" />
//                                             </div>
//                                             <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
//                                                 No participants yet
//                                             </h3>
//                                             <p className="text-slate-600 dark:text-slate-400">
//                                                 Participants will appear here once they join your session.
//                                             </p>
//                                         </div>
//                                     )}
//                                 </TabsContent>

//                                 {/* Edit Tab */}
//                                 <TabsContent value="edit" className="space-y-6">
//                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                         <div className="space-y-4">
//                                             <div>
//                                                 <Label htmlFor="topic">Session Topic</Label>
//                                                 <Input
//                                                     id="topic"
//                                                     value={editForm.topic}
//                                                     onChange={(e) => setEditForm(prev => ({ ...prev, topic: e.target.value }))}
//                                                     placeholder="Enter session topic"
//                                                 />
//                                             </div>

//                                             <div>
//                                                 <Label htmlFor="description">Description</Label>
//                                                 <Textarea
//                                                     id="description"
//                                                     value={editForm.description}
//                                                     onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
//                                                     placeholder="Describe your session"
//                                                     rows={4}
//                                                 />
//                                             </div>

//                                             <div>
//                                                 <Label htmlFor="date">Date</Label>
//                                                 <Input
//                                                     id="date"
//                                                     type="date"
//                                                     value={editForm.date?.split('T')[0]}
//                                                     onChange={(e) => setEditForm(prev => ({ ...prev, date: e.target.value }))}
//                                                 />
//                                             </div>

//                                             <div>
//                                                 <Label htmlFor="timeSlot">Time Slot</Label>
//                                                 <Input
//                                                     id="timeSlot"
//                                                     value={editForm.timeSlot}
//                                                     onChange={(e) => setEditForm(prev => ({ ...prev, timeSlot: e.target.value }))}
//                                                     placeholder="e.g., 10:00 AM - 11:00 AM"
//                                                 />
//                                             </div>
//                                         </div>

//                                         <div className="space-y-4">
//                                             <div>
//                                                 <Label htmlFor="duration">Duration (minutes)</Label>
//                                                 <Input
//                                                     id="duration"
//                                                     type="number"
//                                                     value={editForm.duration}
//                                                     onChange={(e) => setEditForm(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
//                                                     min="15"
//                                                     step="15"
//                                                 />
//                                             </div>

//                                             <div>
//                                                 <Label htmlFor="maxParticipants">Max Participants</Label>
//                                                 <Input
//                                                     id="maxParticipants"
//                                                     type="number"
//                                                     value={editForm.maxParticipants}
//                                                     onChange={(e) => setEditForm(prev => ({ ...prev, maxParticipants: parseInt(e.target.value) }))}
//                                                     min="1"
//                                                     max="100"
//                                                 />
//                                             </div>

//                                             <div>
//                                                 <Label htmlFor="link">Meeting Link</Label>
//                                                 <Input
//                                                     id="link"
//                                                     value={editForm.link}
//                                                     onChange={(e) => setEditForm(prev => ({ ...prev, link: e.target.value }))}
//                                                     placeholder="https://zoom.us/j/..."
//                                                 />
//                                             </div>

//                                             <div className="flex items-center space-x-3">
//                                                 <Switch
//                                                     id="isPublic"
//                                                     checked={editForm.isPublic}
//                                                     onCheckedChange={(checked) => setEditForm(prev => ({ ...prev, isPublic: checked }))}
//                                                 />
//                                                 <div>
//                                                     <Label htmlFor="isPublic" className="font-medium">
//                                                         Public Session
//                                                     </Label>
//                                                     <p className="text-xs text-slate-600 dark:text-slate-400">
//                                                         Allow anyone to discover and join this session
//                                                     </p>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>

//                                     {/* Learning Objectives */}
//                                     <div>
//                                         <Label>Learning Objectives</Label>
//                                         <div className="space-y-3 mt-2">
//                                             <div className="flex space-x-2">
//                                                 <Input
//                                                     value={newObjective}
//                                                     onChange={(e) => setNewObjective(e.target.value)}
//                                                     placeholder="Add a learning objective"
//                                                     onKeyPress={(e) => e.key === 'Enter' && addObjective()}
//                                                 />
//                                                 <Button onClick={addObjective} size="sm">
//                                                     Add
//                                                 </Button>
//                                             </div>
//                                             {editForm.objectives.length > 0 && (
//                                                 <div className="space-y-2">
//                                                     {editForm.objectives.map((objective, index) => (
//                                                         <div key={index} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
//                                                             <span className="text-sm">{objective}</span>
//                                                             <Button
//                                                                 size="sm"
//                                                                 variant="ghost"
//                                                                 onClick={() => removeObjective(index)}
//                                                                 className="text-red-600 hover:text-red-700"
//                                                             >
//                                                                 <X className="h-4 w-4" />
//                                                             </Button>
//                                                         </div>
//                                                     ))}
//                                                 </div>
//                                             )}
//                                         </div>
//                                     </div>

//                                     <div className="flex justify-end space-x-3">
//                                         <Button
//                                             variant="outline"
//                                             onClick={() => {
//                                                 setEditForm({
//                                                     topic: session.topic || '',
//                                                     description: session.description || '',
//                                                     date: session.date || '',
//                                                     timeSlot: session.timeSlot || '',
//                                                     duration: session.duration || 60,
//                                                     link: session.link || '',
//                                                     maxParticipants: session.maxParticipants || 10,
//                                                     isPublic: session.isPublic ?? true,
//                                                     objectives: session.objectives || []
//                                                 });
//                                             }}
//                                         >
//                                             Reset
//                                         </Button>
//                                         <Button
//                                             onClick={handleUpdateSession}
//                                             disabled={isUpdating}
//                                             className="bg-indigo-600 hover:bg-indigo-700 text-white"
//                                         >
//                                             {isUpdating ? (
//                                                 <>
//                                                     <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
//                                                     Updating...
//                                                 </>
//                                             ) : (
//                                                 <>
//                                                     <Save className="h-4 w-4 mr-2" />
//                                                     Save Changes
//                                                 </>
//                                             )}
//                                         </Button>
//                                     </div>
//                                 </TabsContent>

//                                 {/* Settings/Actions Tab */}
//                                 <TabsContent value="settings" className="space-y-6">
//                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                         {/* Session Actions */}
//                                         <Card className="border-emerald-200 dark:border-emerald-800/30">
//                                             <CardHeader className="pb-3">
//                                                 <CardTitle className="text-lg flex items-center text-emerald-700 dark:text-emerald-400">
//                                                     <CheckCircle2 className="h-5 w-5 mr-2" />
//                                                     Session Management
//                                                 </CardTitle>
//                                             </CardHeader>
//                                             <CardContent className="space-y-3">
//                                                 <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
//                                                     Manage the lifecycle of your session.
//                                                 </p>

//                                                 {session.status === 'open' && (
//                                                     <Button
//                                                         onClick={() => setShowCompleteDialog(true)}
//                                                         className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
//                                                     >
//                                                         <Award className="h-4 w-4 mr-2" />
//                                                         Mark as Completed
//                                                     </Button>
//                                                 )}

//                                                 <Button
//                                                     variant="outline"
//                                                     className="w-full"
//                                                     onClick={() => window.open(session.link, '_blank')}
//                                                     disabled={!session.link}
//                                                 >
//                                                     <ExternalLink className="h-4 w-4 mr-2" />
//                                                     Join Session Now
//                                                 </Button>
//                                             </CardContent>
//                                         </Card>

//                                         {/* Danger Zone */}
//                                         <Card className="border-red-200 dark:border-red-800/30">
//                                             <CardHeader className="pb-3">
//                                                 <CardTitle className="text-lg flex items-center text-red-700 dark:text-red-400">
//                                                     <AlertTriangle className="h-5 w-5 mr-2" />
//                                                     Danger Zone
//                                                 </CardTitle>
//                                             </CardHeader>
//                                             <CardContent className="space-y-3">
//                                                 <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
//                                                     These actions cannot be undone. Proceed with caution.
//                                                 </p>

//                                                 <Button
//                                                     variant="outline"
//                                                     onClick={() => setShowDeleteDialog(true)}
//                                                     className="w-full border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800/30 dark:text-red-400 dark:hover:bg-red-950/20"
//                                                 >
//                                                     <Trash2 className="h-4 w-4 mr-2" />
//                                                     Cancel Session
//                                                 </Button>
//                                             </CardContent>
//                                         </Card>
//                                     </div>

//                                     {/* Session Statistics */}
//                                     <Card className="bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700">
//                                         <CardHeader className="pb-3">
//                                             <CardTitle className="text-lg">Session Statistics</CardTitle>
//                                         </CardHeader>
//                                         <CardContent>
//                                             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                                                 <div className="text-center">
//                                                     <div className="text-2xl font-bold text-slate-900 dark:text-white">{session.currentParticipants}</div>
//                                                     <div className="text-sm text-slate-600 dark:text-slate-400">Registered</div>
//                                                 </div>
//                                                 <div className="text-center">
//                                                     <div className="text-2xl font-bold text-slate-900 dark:text-white">{spotsLeft}</div>
//                                                     <div className="text-sm text-slate-600 dark:text-slate-400">Spots Left</div>
//                                                 </div>
//                                                 <div className="text-center">
//                                                     <div className="text-2xl font-bold text-slate-900 dark:text-white">{Math.round(progressPercentage)}%</div>
//                                                     <div className="text-sm text-slate-600 dark:text-slate-400">Filled</div>
//                                                 </div>
//                                                 <div className="text-center">
//                                                     <div className="text-2xl font-bold text-slate-900 dark:text-white">{session.duration}</div>
//                                                     <div className="text-sm text-slate-600 dark:text-slate-400">Minutes</div>
//                                                 </div>
//                                             </div>
//                                         </CardContent>
//                                     </Card>
//                                 </TabsContent>
//                             </Tabs>
//                         </CardContent>
//                     </Card>
//                 </motion.div>

//                 {/* Delete Confirmation Dialog */}
//                 <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
//                     <AlertDialogContent>
//                         <AlertDialogHeader>
//                             <AlertDialogTitle className="flex items-center text-red-600">
//                                 <AlertTriangle className="h-5 w-5 mr-2" />
//                                 Cancel Session
//                             </AlertDialogTitle>
//                             <AlertDialogDescription>
//                                 Are you sure you want to cancel this session? This action cannot be undone.
//                                 All participants will be notified about the cancellation.
//                             </AlertDialogDescription>
//                         </AlertDialogHeader>
//                         <div className="my-4">
//                             <Label htmlFor="deleteReason" className="text-sm font-medium">
//                                 Reason for cancellation (optional)
//                             </Label>
//                             <Textarea
//                                 id="deleteReason"
//                                 value={deleteReason}
//                                 onChange={(e) => setDeleteReason(e.target.value)}
//                                 placeholder="Provide a reason for cancelling this session..."
//                                 className="mt-2"
//                                 rows={3}
//                             />
//                         </div>
//                         <AlertDialogFooter>
//                             <AlertDialogCancel>Keep Session</AlertDialogCancel>
//                             <AlertDialogAction
//                                 onClick={handleCancelSession}
//                                 disabled={isCancelling}
//                                 className="bg-red-600 hover:bg-red-700 text-white"
//                             >
//                                 {isCancelling ? (
//                                     <>
//                                         <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
//                                         Cancelling...
//                                     </>
//                                 ) : (
//                                     <>
//                                         <Trash2 className="h-4 w-4 mr-2" />
//                                         Cancel Session
//                                     </>
//                                 )}
//                             </AlertDialogAction>
//                         </AlertDialogFooter>
//                     </AlertDialogContent>
//                 </AlertDialog>

//                 {/* Complete Session Dialog */}
//                 <AlertDialog open={showCompleteDialog} onOpenChange={setShowCompleteDialog}>
//                     <AlertDialogContent>
//                         <AlertDialogHeader>
//                             <AlertDialogTitle className="flex items-center text-emerald-600">
//                                 <Award className="h-5 w-5 mr-2" />
//                                 Mark Session as Completed
//                             </AlertDialogTitle>
//                             <AlertDialogDescription>
//                                 Mark this session as completed. This will close registration and update the session status.
//                             </AlertDialogDescription>
//                         </AlertDialogHeader>
//                         <div className="my-4">
//                             <Label htmlFor="completionNotes" className="text-sm font-medium">
//                                 Session notes (optional)
//                             </Label>
//                             <Textarea
//                                 id="completionNotes"
//                                 value={completionNotes}
//                                 onChange={(e) => setCompletionNotes(e.target.value)}
//                                 placeholder="Add any notes about how the session went..."
//                                 className="mt-2"
//                                 rows={3}
//                             />
//                         </div>
//                         <AlertDialogFooter>
//                             <AlertDialogCancel>Cancel</AlertDialogCancel>
//                             <AlertDialogAction
//                                 onClick={handleCompleteSession}
//                                 className="bg-emerald-600 hover:bg-emerald-700 text-white"
//                             >
//                                 <Award className="h-4 w-4 mr-2" />
//                                 Mark as Completed
//                             </AlertDialogAction>
//                         </AlertDialogFooter>
//                     </AlertDialogContent>
//                 </AlertDialog>
//             </div>
//         </AnimatePresence>
//     );
// };

// export default OpenSessionManagementModal;