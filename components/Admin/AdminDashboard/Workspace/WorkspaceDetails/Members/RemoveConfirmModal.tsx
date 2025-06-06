import { Button } from "@/components/ui/button";
import { WorkspaceMember } from "@/Redux/types/Workspace/workspace";
import { Loader2, UserMinus } from "lucide-react";

interface RemoveConfirmModalProps {
    member: WorkspaceMember | null;
    onConfirm: () => void;
    onCancel: () => void;
    isLoading: boolean;
}

export const RemoveConfirmModal: React.FC<RemoveConfirmModalProps> = ({ member, onConfirm, onCancel, isLoading }) => {
    if (!member) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black/50" onClick={onCancel} />
            <div className="relative bg-white dark:bg-slate-900 rounded-lg shadow-xl border border-slate-200 dark:border-slate-800 max-w-md w-full mx-4 p-6">
                <div className="flex items-center gap-2 mb-4">
                    <UserMinus className="h-5 w-5 text-red-600" />
                    <h3 className="text-lg font-semibold">Remove Team Member</h3>
                </div>

                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                    Are you sure you want to remove <span className="font-medium text-slate-900 dark:text-white">{member.fullName}</span> from this workspace?
                </p>

                <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800 mb-6">
                    <p className="text-sm text-red-700 dark:text-red-300">
                        <strong>This action cannot be undone.</strong> The user will lose access to all workspace resources.
                    </p>
                </div>

                <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={onCancel} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button onClick={onConfirm} disabled={isLoading} className="bg-red-600 hover:bg-red-700 text-white">
                        {isLoading ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Removing...
                            </>
                        ) : (
                            <>
                                <UserMinus className="h-4 w-4 mr-2" />
                                Remove Member
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
};