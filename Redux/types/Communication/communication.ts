import { FirebaseDate } from "@/components/Types/common";

export interface BaseEntity {
    id: string;
    createdAt: FirebaseDate
    updatedAt?: string;
    updatedBy?: string;
}

// Application interfaces
export interface CVAttachment {
    filename: string;
    storedFilename: string;
    mimetype: string;
    size: number;
    gcpPath: string;
    publicUrl: string | null;
    uploadedAt: string;
}

export interface LearnerApplication extends BaseEntity {
    type: 'learner_application';
    fullName: string;
    email: string;
    phone: string | null;
    interests: string;
    cvAttachment: CVAttachment | null;
    status: 'pending' | 'reviewing' | 'approved' | 'rejected' | 'on_hold';
    submittedAt: string;
    notes?: string;
}

export interface BusinessApplication extends BaseEntity {
    type: 'business_application';
    fullName: string;
    email: string;
    phone: string | null;
    companyName: string;
    website?: string | null;
    industry: string;
    employeeSize: string;
    aiRequirements: string;
    businessProposal: CVAttachment | null;
    acceptedTerms: boolean;
    acceptedConfidentiality: boolean;
    acceptedDataPolicy: boolean;
    status: 'pending' | 'reviewing' | 'approved' | 'rejected' | 'on_hold';
    submittedAt: string;
    notes?: string;
}

export type Application = LearnerApplication | BusinessApplication;

// Contact interfaces
export interface LearnerContact extends BaseEntity {
    type: 'learner_contact';
    fullName: string;
    email: string;
    phone: string | null;
    programInterest: string;
    message: string;
    status: 'new' | 'in_progress' | 'resolved' | 'closed';
    submittedAt: string;
    notes?: string;
}

export interface BusinessContact extends BaseEntity {
    type: 'business_contact';
    fullName: string;
    email: string;
    phone?: string;
    company: string;
    projectType: string | null;
    projectStatus: string | null;
    projectDetails: string;
    status: 'new' | 'in_progress' | 'resolved' | 'closed';
    submittedAt: string;
    notes?: string;
}

export type Contact = LearnerContact | BusinessContact;

// Newsletter interface
export interface NewsletterSubscription extends BaseEntity {
    email: string;
    status: 'active' | 'inactive' | 'unsubscribed';
    subscribedAt: string;
}

// Request/Response interfaces
export interface PaginationParams {
    page?: number;
    limit?: number;
    search?: string;
}

export interface ApplicationQueryParams extends PaginationParams {
    type?: 'all' | 'learner_application' | 'business_application';
    status?: 'all' | 'pending' | 'reviewing' | 'approved' | 'rejected' | 'on_hold';
}

export interface ContactQueryParams extends PaginationParams {
    type?: 'all' | 'learner_contact' | 'business_contact';
    status?: 'all' | 'new' | 'in_progress' | 'resolved' | 'closed';
}

export interface NewsletterQueryParams extends PaginationParams {
    status?: 'all' | 'active' | 'inactive' | 'unsubscribed';
}

export interface PaginatedResponse<T> {
    success: boolean;
    data: T[];
    count: number;
    page: number;
    totalPages: number;
    totalCount: number;
}

export interface StatusUpdateRequest {
    status: string;
    notes?: string;
}

export interface BulkUpdateRequest {
    ids: string[];
    status: string;
    notes?: string;
}

// Statistics interfaces
export interface ApplicationStats {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    recentWeek: number;
    recentMonth: number;
}

export interface ContactStats {
    total: number;
    new: number;
    inProgress: number;
    resolved: number;
    recentWeek: number;
    recentMonth: number;
}

export interface NewsletterStats {
    total: number;
    active: number;
    unsubscribed: number;
    recentWeek: number;
    recentMonth: number;
}

export interface CommunicationsStats {
    applications: ApplicationStats;
    contacts: ContactStats;
    newsletter: NewsletterStats;
    overview: {
        totalCommunications: number;
        weeklyActivity: number;
        monthlyActivity: number;
    };
}

export interface CommunicationsStatsResponse {
    success: boolean;
    data: CommunicationsStats;
}

// Form submission interfaces
export interface LearnerApplicationForm {
    fullName: string;
    email: string;
    phone?: string;
    interests: string;
}

export interface BusinessApplicationForm {
    fullName: string;
    email: string;
    phone?: string;
    companyName: string;
    position: string;
    companySize?: string;
    industry: string;
    projectType?: string;
    projectStatus?: string;
    requirements?: string;
    acceptedTerms: boolean;
}

export interface LearnerContactForm {
    fullName: string;
    email: string;
    phone?: string;
    programInterest: string;
    message: string;
}

export interface BusinessContactForm {
    fullName: string;
    email: string;
    company: string;
    projectType?: string;
    projectStatus?: string;
    projectDetails: string;
}

export interface NewsletterSubscriptionForm {
    email: string;
}

// Success response interfaces
export interface SubmissionResponse {
    status: 'success' | 'error';
    message: string;
    data?: {
        applicationId?: string;
        contactId?: string;
        subscriptionId?: string;
        cvUploaded?: boolean;
    };
}