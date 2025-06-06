import { ProjectSummary } from '@/Redux/types/Workspace/project-summary';
import { Workspace } from '@/Redux/types/Workspace/workspace';
import { firebaseFormatDate } from '@/components/utils/dateUtils';
import { ActiveProjectData, ActiveWorkspaceData, STORAGE_KEY, StoredActiveProject } from './ActiveProjectTypes';
import { Project } from '@/Redux/types/Projects';



export const transformProjectData = (
    project: Project | ProjectSummary | ActiveProjectData
): ActiveProjectData => {
    // Common properties across all types
    const baseData: ActiveProjectData = {
        id: project.id,
        name: project.name,
        description: project.description,
        status: project.status,
        progress: project.progress,
        technologies: project.technologies,
        createdAt: firebaseFormatDate(project.createdAt),
        updatedAt: firebaseFormatDate(project.updatedAt),
    };

    // Handle ProjectSummary specific properties
    if ('memberCount' in project) {
        baseData.memberCount = project.memberCount;
        baseData.lastActivityAt = firebaseFormatDate(project.lastActivityAt);
        baseData.category = project.category;
        baseData.thumbnailUrl = project.thumbnailUrl;
        baseData.visibility = project.visibility;
    }

    // Handle Project specific properties
    if ('memberIds' in project) {
        baseData.memberCount = project.memberIds?.length;
        baseData.lastActivityAt = firebaseFormatDate(project.lastActivityAt);
        baseData.category = project.category;
        baseData.workspaceId = project.workspaceId;
    }

    return baseData;
};

export const transformWorkspaceData = (workspace: Workspace | ActiveWorkspaceData): ActiveWorkspaceData => {
    return {
        id: workspace.id,
        name: workspace.name,
        description: workspace.description,
        status: workspace.status,
        visibility: workspace.visibility,
        memberCount: workspace.memberCount,
        projectCount: 'projectIds' in workspace ? workspace.projectIds?.length : workspace.projectCount,
        projectIds: 'projectIds' in workspace ? workspace.projectIds : undefined,
        tags: workspace.tags,
        createdAt: firebaseFormatDate(workspace.createdAt),
        updatedAt: firebaseFormatDate(workspace.updatedAt),
    };
};

// Storage utilities
export const saveToStorage = (
    project: ActiveProjectData,
    workspace: ActiveWorkspaceData,
    autoExpireHours: number
): void => {
    try {
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + autoExpireHours);

        const storageData: StoredActiveProject = {
            projectId: project.id,
            workspaceId: workspace.id,
            projectName: project.name,
            workspaceName: workspace.name,
            projectData: project,
            workspaceData: workspace,
            timestamp: new Date().toISOString(),
            expiresAt: expiresAt.toISOString()
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(storageData));
    } catch (error) {
        console.error('Error saving to storage:', error);
    }
};

export const loadFromStorage = (): {
    project: ActiveProjectData | null;
    workspace: ActiveWorkspaceData | null;
} => {
    try {
        const savedData = localStorage.getItem(STORAGE_KEY);
        if (!savedData) return { project: null, workspace: null };

        const parsed: StoredActiveProject = JSON.parse(savedData);

        // Check if data has expired
        const expiresAt = new Date(parsed.expiresAt);
        const now = new Date();

        if (now > expiresAt) {
            localStorage.removeItem(STORAGE_KEY);
            return { project: null, workspace: null };
        }

        // Return enhanced stored data if available
        if (parsed.projectData && parsed.workspaceData) {
            return {
                project: parsed.projectData as ActiveProjectData,
                workspace: parsed.workspaceData as ActiveWorkspaceData
            };
        } else {
            // Fallback to minimal data
            return {
                project: {
                    id: parsed.projectId,
                    name: parsed.projectName
                },
                workspace: {
                    id: parsed.workspaceId,
                    name: parsed.workspaceName
                }
            };
        }
    } catch (error) {
        console.error('Error loading from storage:', error);
        localStorage.removeItem(STORAGE_KEY);
        return { project: null, workspace: null };
    }
};

export const updateStoredProject = (updates: Partial<ActiveProjectData>): void => {
    try {
        const savedData = localStorage.getItem(STORAGE_KEY);
        if (!savedData) return;

        const parsed: StoredActiveProject = JSON.parse(savedData);
        if (parsed.projectData) {
            parsed.projectData = { ...parsed.projectData, ...updates };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
        }
    } catch (error) {
        console.error('Error updating stored project:', error);
    }
};

export const updateStoredWorkspace = (updates: Partial<ActiveWorkspaceData>): void => {
    try {
        const savedData = localStorage.getItem(STORAGE_KEY);
        if (!savedData) return;

        const parsed: StoredActiveProject = JSON.parse(savedData);
        if (parsed.workspaceData) {
            parsed.workspaceData = { ...parsed.workspaceData, ...updates };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
        }
    } catch (error) {
        console.error('Error updating stored workspace:', error);
    }
};

export const clearStorage = (): void => {
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
        console.error('Error clearing storage:', error);
    }
};

export const isStorageExpired = (): boolean => {
    try {
        const savedData = localStorage.getItem(STORAGE_KEY);
        if (!savedData) return true;

        const parsed: StoredActiveProject = JSON.parse(savedData);
        const expiresAt = new Date(parsed.expiresAt);
        const now = new Date();

        return now > expiresAt;
    } catch (error) {
        console.error('Error checking storage expiration:', error);
        return true;
    }
};