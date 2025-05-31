import { useCallback, useMemo } from 'react';
import { useActiveProject } from './ActiveProjectContext';
import { useValidateActiveProject, useWorkspaceProjects } from './useActiveProjectApi';
import { ActiveProjectData } from './ActiveProjectTypes';

// Hook for getting just the active project ID
export function useActiveProjectId(): string | null {
    const { activeProject } = useActiveProject();
    return activeProject?.id || null;
}

// Hook for getting just the active workspace ID
export function useActiveWorkspaceId(): string | null {
    const { activeWorkspace } = useActiveProject();
    return activeWorkspace?.id || null;
}

// Hook for checking if a specific project is active
export function useIsProjectActive(projectId: string): boolean {
    const { isProjectActive } = useActiveProject();
    return isProjectActive(projectId);
}

// Hook for checking if a specific workspace is active
export function useIsWorkspaceActive(workspaceId: string): boolean {
    const { isWorkspaceActive } = useActiveProject();
    return isWorkspaceActive(workspaceId);
}

// Hook for getting active project status information
export function useActiveProjectStatus() {
    const { activeProject, activeWorkspace, isLoading } = useActiveProject();

    const status = useMemo(() => {
        if (isLoading) return 'loading';
        if (!activeProject || !activeWorkspace) return 'none';
        return 'active';
    }, [activeProject, activeWorkspace, isLoading]);

    const projectStatus = activeProject?.status || 'unknown';
    const workspaceStatus = activeWorkspace?.status || 'unknown';

    return {
        status,
        projectStatus,
        workspaceStatus,
        hasActiveProject: !!activeProject,
        hasActiveWorkspace: !!activeWorkspace,
        isLoading
    };
}

// Hook for getting active project progress information
export function useActiveProjectProgress() {
    const { activeProject } = useActiveProject();

    return useMemo(() => ({
        progress: activeProject?.progress || 0,
        hasProgress: typeof activeProject?.progress === 'number',
        isCompleted: activeProject?.status === 'completed',
        isActive: activeProject?.status === 'active',
        isOnHold: activeProject?.status === 'on-hold'
    }), [activeProject]);
}

// Hook for getting active project metadata
export function useActiveProjectMetadata() {
    const { activeProject, activeWorkspace } = useActiveProject();

    return useMemo(() => ({
        project: {
            id: activeProject?.id,
            name: activeProject?.name,
            description: activeProject?.description,
            category: activeProject?.category,
            technologies: activeProject?.technologies || [],
            memberCount: activeProject?.memberCount || 0,
            thumbnailUrl: activeProject?.thumbnailUrl,
            visibility: activeProject?.visibility,
            lastActivityAt: activeProject?.lastActivityAt,
            nextDeadline: activeProject?.nextDeadline,
            createdAt: activeProject?.createdAt,
            updatedAt: activeProject?.updatedAt
        },
        workspace: {
            id: activeWorkspace?.id,
            name: activeWorkspace?.name,
            description: activeWorkspace?.description,
            tags: activeWorkspace?.tags || [],
            memberCount: activeWorkspace?.memberCount || 0,
            projectCount: activeWorkspace?.projectCount || 0,
            visibility: activeWorkspace?.visibility,
            createdAt: activeWorkspace?.createdAt,
            updatedAt: activeWorkspace?.updatedAt
        }
    }), [activeProject, activeWorkspace]);
}

// Hook for active project navigation
export function useActiveProjectNavigation() {
    const { getActiveProjectUrl, activeProject, activeWorkspace } = useActiveProject();

    const urls = useMemo(() => {
        if (!activeProject || !activeWorkspace) {
            return {
                projectUrl: null,
                workspaceUrl: null,
                projectSettingsUrl: null,
                workspaceSettingsUrl: null
            };
        }

        return {
            projectUrl: `/workspaces/${activeWorkspace.id}/projects/${activeProject.id}`,
            workspaceUrl: `/workspaces/${activeWorkspace.id}`,
            projectSettingsUrl: `/workspaces/${activeWorkspace.id}/projects/${activeProject.id}/settings`,
            workspaceSettingsUrl: `/workspaces/${activeWorkspace.id}/settings`
        };
    }, [activeProject, activeWorkspace]);

    return {
        ...urls,
        getActiveProjectUrl,
        canNavigate: !!(activeProject && activeWorkspace)
    };
}

// Hook for active project validation and health check
export function useActiveProjectHealth() {
    const { activeProject, activeWorkspace } = useActiveProject();
    const { isProjectValid, isValidating } = useValidateActiveProject(activeProject, activeWorkspace);

    return {
        isValid: isProjectValid,
        isValidating,
        needsRefresh: !isProjectValid && !!activeProject,
        hasStaleData: false, // Could implement staleness detection
    };
}

// Hook for project switching within active workspace
export function useProjectSwitcher() {
    const {
        activeWorkspace,
        setActiveProjectWithContext,
        clearActiveProject
    } = useActiveProject();

    const { projects, isLoading, error } = useWorkspaceProjects(activeWorkspace?.id || null);

    const switchToProject = useCallback((projectId: string) => {
        if (!activeWorkspace) return false;

        const project = projects.find(p => p.id === projectId);
        if (!project) return false;

        setActiveProjectWithContext(project, activeWorkspace);
        return true;
    }, [activeWorkspace, projects, setActiveProjectWithContext]);

    const switchToNextProject = useCallback(() => {
        if (!activeWorkspace || projects.length === 0) return false;

        const currentIndex = projects.findIndex(p => p.id === activeWorkspace.id);
        const nextIndex = (currentIndex + 1) % projects.length;

        return switchToProject(projects[nextIndex].id);
    }, [activeWorkspace, projects, switchToProject]);

    const switchToPreviousProject = useCallback(() => {
        if (!activeWorkspace || projects.length === 0) return false;

        const currentIndex = projects.findIndex(p => p.id === activeWorkspace.id);
        const prevIndex = currentIndex === 0 ? projects.length - 1 : currentIndex - 1;

        return switchToProject(projects[prevIndex].id);
    }, [activeWorkspace, projects, switchToProject]);

    return {

        availableProjects: projects,
        isLoadingProjects: isLoading,
        projectsError: error,
        switchToProject,
        switchToNextProject,
        switchToPreviousProject,
        canSwitch: projects.length > 1,
        currentProjectIndex: projects.findIndex(p => p.id === activeWorkspace?.id) || 0,
        totalProjects: projects.length
    }
}

// Hook for active project updates and mutations
export function useActiveProjectUpdates() {
    const {
        updateActiveProject,
        updateActiveWorkspace,
        refreshActiveProject,
        isLoading
    } = useActiveProject();

    const updateProjectProgress = useCallback((progress: number) => {
        updateActiveProject({ progress: Math.max(0, Math.min(100, progress)) });
    }, [updateActiveProject]);

    const updateProjectStatus = useCallback((status: ActiveProjectData['status']) => {
        updateActiveProject({ status });
    }, [updateActiveProject]);

    const updateProjectMetadata = useCallback((metadata: {
        name?: string;
        description?: string;
        category?: string;
        technologies?: string[];
        memberCount?: number;
    }) => {
        updateActiveProject(metadata);
    }, [updateActiveProject]);

    const updateWorkspaceMetadata = useCallback((metadata: {
        name?: string;
        description?: string;
        tags?: string[];
        memberCount?: number;
        projectCount?: number;
    }) => {
        updateActiveWorkspace(metadata);
    }, [updateActiveWorkspace]);

    const markProjectActivity = useCallback(() => {
        updateActiveProject({ lastActivityAt: new Date().toISOString() });
    }, [updateActiveProject]);

    return {
        updateProjectProgress,
        updateProjectStatus,
        updateProjectMetadata,
        updateWorkspaceMetadata,
        markProjectActivity,
        refreshActiveProject,
        isUpdating: isLoading
    };
}

// Hook for active project time tracking
export function useActiveProjectTimeTracking() {
    const { activeProject, updateActiveProject } = useActiveProject();

    const startTime = useMemo(() => Date.now(), []);

    const getSessionDuration = useCallback(() => {
        return Date.now() - startTime;
    }, [startTime]);

    const getFormattedSessionDuration = useCallback(() => {
        const duration = getSessionDuration();
        const hours = Math.floor(duration / (1000 * 60 * 60));
        const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));

        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        }
        return `${minutes}m`;
    }, [getSessionDuration]);

    const updateLastActivity = useCallback(() => {
        updateActiveProject({ lastActivityAt: new Date().toISOString() });
    }, [updateActiveProject]);

    return {
        sessionDuration: getSessionDuration(),
        formattedSessionDuration: getFormattedSessionDuration(),
        lastActivity: activeProject?.lastActivityAt,
        updateLastActivity,
        hasActiveSession: !!activeProject
    };
}

// Hook for active project notifications and alerts
export function useActiveProjectNotifications() {
    const { activeProject, activeWorkspace } = useActiveProject();

    const getUpcomingDeadlines = useCallback(() => {
        if (!activeProject?.nextDeadline) return [];

        const deadline = new Date(activeProject.nextDeadline);
        const now = new Date();
        const timeDiff = deadline.getTime() - now.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

        if (daysDiff <= 7 && daysDiff > 0) {
            return [{
                type: 'deadline' as const,
                message: `Project deadline in ${daysDiff} day${daysDiff === 1 ? '' : 's'}`,
                severity: daysDiff <= 2 ? 'high' : daysDiff <= 5 ? 'medium' : 'low',
                deadline: activeProject.nextDeadline
            }];
        }

        return [];
    }, [activeProject?.nextDeadline]);

    const getProgressAlerts = useCallback(() => {
        if (!activeProject?.progress) return [];

        const alerts = [];

        if (activeProject.progress < 25 && activeProject.status === 'active') {
            alerts.push({
                type: 'progress' as const,
                message: 'Project progress is below 25%',
                severity: 'medium' as const,
                progress: activeProject.progress
            });
        }

        if (activeProject.progress >= 90 && activeProject.status !== 'completed') {
            alerts.push({
                type: 'completion' as const,
                message: 'Project is almost complete! Consider marking as completed.',
                severity: 'low' as const,
                progress: activeProject.progress
            });
        }

        return alerts;
    }, [activeProject?.progress, activeProject?.status]);

    const getAllNotifications = useCallback(() => {
        return [
            ...getUpcomingDeadlines(),
            ...getProgressAlerts()
        ];
    }, [getUpcomingDeadlines, getProgressAlerts]);

    return {
        upcomingDeadlines: getUpcomingDeadlines(),
        progressAlerts: getProgressAlerts(),
        allNotifications: getAllNotifications(),
        hasNotifications: getAllNotifications().length > 0,
        highPriorityCount: getAllNotifications().filter(n => n.severity === 'high').length
    };
}

// Comprehensive hook that combines commonly used functionality
export function useActiveProjectSummary() {
    const { activeProject, activeWorkspace, isLoading, hasActiveContext } = useActiveProject();
    const { status, projectStatus, workspaceStatus } = useActiveProjectStatus();
    const { progress, isCompleted, isActive } = useActiveProjectProgress();
    const { canNavigate, projectUrl, workspaceUrl } = useActiveProjectNavigation();
    const { isValid, needsRefresh } = useActiveProjectHealth();
    const { hasNotifications, highPriorityCount, allNotifications } = useActiveProjectNotifications();

    return {
        // Basic info
        project: activeProject,
        workspace: activeWorkspace,

        // Status
        isLoading,
        hasActiveContext,
        status,
        projectStatus,
        workspaceStatus,
        isValid,
        needsRefresh,

        // Progress
        progress,
        isCompleted,
        isActive,

        // Navigation
        canNavigate,
        projectUrl,
        workspaceUrl,

        // Notifications
        hasNotifications,
        highPriorityCount,
        notifications: allNotifications,

        // Quick actions
        projectId: activeProject?.id || null,
        workspaceId: activeWorkspace?.id || null,
        projectName: activeProject?.name || null,
        workspaceName: activeWorkspace?.name || null
    };
}