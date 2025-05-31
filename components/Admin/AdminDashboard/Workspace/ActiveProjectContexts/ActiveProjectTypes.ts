import { ProjectSummary } from '@/Redux/types/Workspace/project-summary';
import { Workspace } from '@/Redux/types/Workspace/workspace';

// Enhanced interfaces matching your data structure
export interface ActiveProjectData {
    id: string;
    name: string;
    description?: string;
    status?: 'draft' | 'active' | 'completed' | 'archived' | 'on-hold';
    progress?: number;
    workspaceId?: string;
    memberCount?: number;
    lastActivityAt?: string;
    nextDeadline?: string;
    category?: string;
    technologies?: string[];
    visibility?: 'public' | 'private' | 'workspace' | 'organization';
    thumbnailUrl?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface ActiveWorkspaceData {
    id: string;
    name: string;
    description?: string;
    status?: 'draft' | 'active' | 'paused' | 'completed' | 'archived';
    visibility?: 'public' | 'private' | 'organization';
    memberCount?: number;
    projectCount?: number;
    projectIds?: string[];
    tags?: string[];
    createdAt?: string;
    updatedAt?: string;
}

export interface StoredActiveProject {
    projectId: string;
    workspaceId: string;
    projectName: string;
    workspaceName: string;
    projectData?: Partial<ActiveProjectData>;
    workspaceData?: Partial<ActiveWorkspaceData>;
    timestamp: string;
    expiresAt: string;
}

export interface ActiveProjectContextType {
    // State
    activeProject: ActiveProjectData | null;
    activeWorkspace: ActiveWorkspaceData | null;
    isLoading: boolean;

    // Actions
    setActiveProjectWithContext: (project: ProjectSummary | ActiveProjectData, workspace: Workspace | ActiveWorkspaceData) => void;
    updateActiveProject: (updates: Partial<ActiveProjectData>) => void;
    updateActiveWorkspace: (updates: Partial<ActiveWorkspaceData>) => void;
    clearActiveProject: () => void;
    refreshActiveProject: () => Promise<void>;

    // Utilities
    isProjectActive: (projectId: string) => boolean;
    isWorkspaceActive: (workspaceId: string) => boolean;
    getActiveProjectUrl: () => string | null;
    hasActiveContext: () => boolean;
}

export interface ActiveProjectProviderProps {
    children: React.ReactNode;
    autoExpireHours?: number;
    enablePersistence?: boolean;
    enableNotifications?: boolean;
}

// Storage key constant
export const STORAGE_KEY = 'eep_active_project_context';