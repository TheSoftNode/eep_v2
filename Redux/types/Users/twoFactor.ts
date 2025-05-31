import { UserRole } from "./user";

export interface TwoFactorSetupResponse {
    success: boolean;
    message: string;
    qrCode: string;
    secret: string;
    recoveryCodes: string[];
}

export interface TwoFactorVerifyResponse {
    success: boolean;
    message: string;
    recoveryCodes?: string[];
}

export interface TwoFactorStatusResponse {
    success: boolean;
    twoFactorEnabled: boolean;
    twoFactorPending: boolean;
}

export interface TwoFactorLoginRequest {
    email: string;
    token?: string;
    recoveryCode?: string;
    rememberMe?: boolean;
}

export interface TwoFactorLoginResponse {
    success: boolean;
    message: string;
    token: string;
    user: {
        id: string;
        fullName: string;
        email: string;
        role: UserRole;
        emailVerified: boolean;
        profilePicture?: string | null;
    };
    rememberMe: boolean;
}

export interface RememberMeToken {
    userId: string;
    email: string;
    token: string;
    expiresAt: Date;
    createdAt: Date;
}
