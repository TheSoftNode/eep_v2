import { LucideIcon } from 'lucide-react';

export type CloudProvider = 'AWS' | 'Azure' | 'GCP';
export type ServiceCategory = 'databases' | 'backend' | 'frontend';

export interface ServiceFeature
{
    name: string;
    description: string;
}

export interface CloudService
{
    name: string;
    description: string;
    features: string[];
    icon?: LucideIcon;
}

export interface ServiceCategoryInfo
{
    icon: LucideIcon;
    label: string;
    description: string;
}

export interface CloudServiceConfig
{
    [key: string]: {
        databases: CloudService[];
        backend: CloudService[];
        frontend: CloudService[];
    };
}

export interface SidebarProps
{
    selectedCloud: CloudProvider;
    selectedService: ServiceCategory;
    onServiceSelect: (service: ServiceCategory) => void;
}

export interface CloudSelectorProps
{
    selectedCloud: CloudProvider;
    onCloudSelect: (cloud: CloudProvider) => void;
}

export interface ServiceIntegrationPanelProps
{
    selectedService: CloudService;
    selectedCloud: CloudProvider;
}

export interface ServiceCardProps
{
    service: CloudService;
    isSelected: boolean;
    onSelect: (service: CloudService) => void;
}