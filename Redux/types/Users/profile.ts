import { User } from "./user";

export interface ProjectSummary {
    id: string;
    name: string;
    status: string;
    updatedAt: string;
}

export interface WorkspaceSummary {
    id: string;
    name: string;
    memberCount: number;
    projectCount: number;
}

export interface UserProfileResponse extends User {
    projectDetails?: ProjectSummary[];
    workspaceDetails?: WorkspaceSummary[];
}

export interface UpdateProfileRequest {
    fullName?: string;
    bio?: string;
    company?: string;
    website?: string;
    github?: string;
}

export interface ProfileResponse {
    success: boolean;
    message?: string;
    user: UserProfileResponse;
}

export interface ProfilePictureResponse {
    success: boolean;
    message: string;
    profilePicture: string | null;
}

export interface DeleteResponse {
    success: boolean;
    message: string;
}

// Interface for update profile picture request
export interface UpdateProfilePictureRequest {
    file: File;
}