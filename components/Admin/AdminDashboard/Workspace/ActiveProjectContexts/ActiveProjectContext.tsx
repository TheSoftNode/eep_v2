"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';
import { ProjectSummary } from '@/Redux/types/Workspace/project-summary';
import { Workspace } from '@/Redux/types/Workspace/workspace';
import {
    transformProjectData,
    transformWorkspaceData,
    saveToStorage,
    loadFromStorage,
    updateStoredProject,
    updateStoredWorkspace,
    clearStorage,
    isStorageExpired
} from './activeProjectUtils';
import { useRefreshActiveProject } from './useActiveProjectApi';
import { ActiveProjectContextType, ActiveProjectData, ActiveProjectProviderProps, ActiveWorkspaceData } from './ActiveProjectTypes';

// Create context
const ActiveProjectContext = createContext<ActiveProjectContextType | null>(null);

// Main context provider component
export function ActiveProjectProvider({
    children,
    autoExpireHours = 24,
    enablePersistence = true,
    enableNotifications = true
}: ActiveProjectProviderProps) {
    const [activeProject, setActiveProject] = useState<ActiveProjectData | null>(null);
    const [activeWorkspace, setActiveWorkspace] = useState<ActiveWorkspaceData | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Use the refresh hook
    const { refreshActiveProject: apiRefreshActiveProject, isRefreshing } = useRefreshActiveProject(
        activeProject,
        activeWorkspace,
        enableNotifications
    );

    // Enhanced set active project with context
    const setActiveProjectWithContext = useCallback((
        project: ProjectSummary | ActiveProjectData,
        workspace: Workspace | ActiveWorkspaceData
    ) => {
        try {
            const transformedProject = transformProjectData(project);
            const transformedWorkspace = transformWorkspaceData(workspace);

            setActiveProject(transformedProject);
            setActiveWorkspace(transformedWorkspace);

            // Save to localStorage with expiration
            if (enablePersistence) {
                saveToStorage(transformedProject, transformedWorkspace, autoExpireHours);
            }

            // Show success notification
            if (enableNotifications) {
                toast({
                    title: "Project Activated",
                    description: `Now working on "${transformedProject.name}" in ${transformedWorkspace.name}`,
                    variant: "default",
                });
            }
        } catch (error) {
            console.error('Error setting active project context:', error);
            if (enableNotifications) {
                toast({
                    title: "Error",
                    description: "Failed to set active project",
                    variant: "destructive",
                });
            }
        }
    }, [autoExpireHours, enablePersistence, enableNotifications]);

    // Update active project data
    const updateActiveProject = useCallback((updates: Partial<ActiveProjectData>) => {
        if (!activeProject) return;

        const updatedProject = { ...activeProject, ...updates };
        setActiveProject(updatedProject);

        // Update localStorage if persistence is enabled
        if (enablePersistence) {
            updateStoredProject(updates);
        }
    }, [activeProject, enablePersistence]);

    // Update active workspace data
    const updateActiveWorkspace = useCallback((updates: Partial<ActiveWorkspaceData>) => {
        if (!activeWorkspace) return;

        const updatedWorkspace = { ...activeWorkspace, ...updates };
        setActiveWorkspace(updatedWorkspace);

        // Update localStorage if persistence is enabled
        if (enablePersistence) {
            updateStoredWorkspace(updates);
        }
    }, [activeWorkspace, enablePersistence]);

    // Clear active project
    const clearActiveProject = useCallback(() => {
        const projectName = activeProject?.name;

        setActiveProject(null);
        setActiveWorkspace(null);

        if (enablePersistence) {
            clearStorage();
        }

        if (enableNotifications && projectName) {
            toast({
                title: "Project Cleared",
                description: `No longer working on "${projectName}"`,
                variant: "default",
            });
        }
    }, [activeProject?.name, enablePersistence, enableNotifications]);

    // Refresh active project using API
    const refreshActiveProject = useCallback(async () => {
        if (!activeProject || !activeWorkspace) return;

        setIsLoading(true);
        try {
            const result = await apiRefreshActiveProject();

            if (result.success && result.project && result.workspace) {
                setActiveProject(result.project);
                setActiveWorkspace(result.workspace);

                // Update storage
                if (enablePersistence) {
                    saveToStorage(result.project, result.workspace, autoExpireHours);
                }
            } else if (!result.success) {
                // Project no longer exists, clear it
                clearActiveProject();
            }
        } catch (error) {
            console.error('Error in refreshActiveProject:', error);
        } finally {
            setIsLoading(false);
        }
    }, [apiRefreshActiveProject, activeProject, activeWorkspace, enablePersistence, autoExpireHours, clearActiveProject]);

    // Utility functions
    const isProjectActive = useCallback((projectId: string): boolean => {
        return activeProject?.id === projectId;
    }, [activeProject?.id]);

    const isWorkspaceActive = useCallback((workspaceId: string): boolean => {
        return activeWorkspace?.id === workspaceId;
    }, [activeWorkspace?.id]);

    const getActiveProjectUrl = useCallback((): string | null => {
        if (!activeProject || !activeWorkspace) return null;
        return `/workspaces/${activeWorkspace.id}/projects/${activeProject.id}`;
    }, [activeProject, activeWorkspace]);

    const hasActiveContext = useCallback((): boolean => {
        return !!(activeProject && activeWorkspace);
    }, [activeProject, activeWorkspace]);

    // Load from localStorage on initial render
    useEffect(() => {
        if (!enablePersistence) return;

        const { project, workspace } = loadFromStorage();
        if (project && workspace) {
            setActiveProject(project);
            setActiveWorkspace(workspace);
        }
    }, [enablePersistence]);

    // Cleanup expired data periodically
    useEffect(() => {
        if (!enablePersistence) return;

        const cleanupInterval = setInterval(() => {
            if (isStorageExpired()) {
                clearActiveProject();
            }
        }, 60000); // Check every minute

        return () => clearInterval(cleanupInterval);
    }, [enablePersistence, clearActiveProject]);

    // Enhanced value object to provide through context
    const value: ActiveProjectContextType = {
        // State
        activeProject,
        activeWorkspace,
        isLoading: isLoading || isRefreshing,

        // Actions
        setActiveProjectWithContext,
        updateActiveProject,
        updateActiveWorkspace,
        clearActiveProject,
        refreshActiveProject,

        // Utilities
        isProjectActive,
        isWorkspaceActive,
        getActiveProjectUrl,
        hasActiveContext
    };

    return (
        <ActiveProjectContext.Provider value={value}>
            {children}
        </ActiveProjectContext.Provider>
    );
}

// Enhanced custom hook for using the context
export function useActiveProject(): ActiveProjectContextType {
    const context = useContext(ActiveProjectContext);
    if (!context) {
        throw new Error('useActiveProject must be used within an ActiveProjectProvider');
    }
    return context;
}