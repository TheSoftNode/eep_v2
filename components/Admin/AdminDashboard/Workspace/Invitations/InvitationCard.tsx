import { Button } from "@/components/ui/button";
import { Check, X, Users, Clock, Loader2, Mail, Crown, GraduationCap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { firebaseFormatDate } from "@/components/utils/dateUtils";

interface InvitationCardProps {
    invitation: any;
    onAccept: () => void;
    onDecline: () => void;
    isLoading?: boolean;
}

export default function InvitationCard({
    invitation,
    onAccept,
    onDecline,
    isLoading
}: InvitationCardProps) {
    const getRoleIcon = (role: string) => {
        switch (role) {
            case 'mentor':
                return <Crown className="h-3 w-3" />;
            case 'admin':
                return <Crown className="h-3 w-3" />;
            default:
                return <GraduationCap className="h-3 w-3" />;
        }
    };

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'mentor':
                return 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 border-indigo-200 dark:border-indigo-700';
            case 'admin':
                return 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-700';
            default:
                return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700';
        }
    };

    return (
        <div className="group bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg hover:border-indigo-200 dark:hover:border-indigo-700 transition-all duration-300 overflow-hidden">
            {/* Gradient header */}
            <div className="h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-500"></div>

            <div className="p-6">
                {/* Header section */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center mb-2">
                            <div className="rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 p-2 mr-3 flex-shrink-0">
                                <Mail className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 truncate">
                                    {invitation.workspace?.name || "Workspace Invitation"}
                                </h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    from {invitation.sender?.displayName || invitation.sender?.fullName || "a team member"}
                                </p>
                            </div>
                        </div>
                    </div>

                    <Badge
                        variant="outline"
                        className={`${getRoleBadge(invitation.role)} flex items-center gap-1 font-medium`}
                    >
                        {getRoleIcon(invitation.role)}
                        <span className="capitalize">{invitation.role}</span>
                    </Badge>
                </div>

                {/* Message section */}
                {invitation.message && (
                    <div className="mb-4 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                        <p className="text-sm text-slate-700 dark:text-slate-300 italic">
                            "{invitation.message}"
                        </p>
                    </div>
                )}

                {/* Default message if no custom message */}
                {!invitation.message && (
                    <div className="mb-4">
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            You have been invited to join this workspace as a{" "}
                            <span className="font-medium text-indigo-600 dark:text-indigo-400">
                                {invitation.role}
                            </span>
                            . Join to start collaborating with the team!
                        </p>
                    </div>
                )}

                {/* Specialty badge */}
                {invitation.specialty && (
                    <div className="mb-4">
                        <Badge
                            variant="outline"
                            className="bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-700"
                        >
                            <Users className="h-3 w-3 mr-1" />
                            {invitation.specialty}
                        </Badge>
                    </div>
                )}

                {/* Metadata */}
                <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 mb-6 space-x-4">
                    <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>Sent {firebaseFormatDate(invitation.createdAt?.toDate?.() || new Date())}</span>
                    </div>
                    {invitation.workspace?.memberCount && (
                        <div className="flex items-center">
                            <Users className="h-3 w-3 mr-1" />
                            <span>{invitation.workspace.memberCount} members</span>
                        </div>
                    )}
                </div>

                {/* Action buttons */}
                <div className="flex gap-3">
                    <Button
                        onClick={(e) => {
                            e.stopPropagation();
                            onAccept();
                        }}
                        className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                <Check className="h-4 w-4 mr-2" />
                                Accept Invitation
                            </>
                        )}
                    </Button>

                    <Button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDecline();
                        }}
                        variant="outline"
                        className="flex-1 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-200"
                        disabled={isLoading}
                    >
                        <X className="h-4 w-4 mr-2" />
                        Decline
                    </Button>
                </div>
            </div>
        </div>
    );
}