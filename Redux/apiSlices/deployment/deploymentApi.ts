import { apiSlice } from '@/Redux/services/api';

export interface DeploymentRequest {
    fileId: string;
    name: string;
}

export interface DeploymentResponse {
    success: boolean;
    message: string;
    data: {
        url: string;
        dashboard: string;
        message: string;
    };
}

export const deploymentApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Deploy to AWS
        deployToAws: builder.mutation<DeploymentResponse, DeploymentRequest>({
            query: (data) => ({
                url: '/deploy/aws',
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['Deployment']
        }),

        // Deploy to Azure
        deployToAzure: builder.mutation<DeploymentResponse, DeploymentRequest>({
            query: (data) => ({
                url: '/deploy/azure',
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['Deployment']
        }),

        // Deploy to GCP
        deployToGcp: builder.mutation<DeploymentResponse, DeploymentRequest>({
            query: (data) => ({
                url: '/deploy/gcp',
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['Deployment']
        }),

        // Deploy to Render
        deployToRender: builder.mutation<DeploymentResponse, DeploymentRequest>({
            query: (data) => ({
                url: '/deploy/render',
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['Deployment']
        }),

        // Get deployments
        getDeployments: builder.query<any, string>({
            query: (workspaceId) => ({
                url: `/workspaces/${workspaceId}/deployments`,
                method: 'GET'
            }),
            providesTags: ['Deployment']
        })
    })
});

export const {
    useDeployToAwsMutation,
    useDeployToAzureMutation,
    useDeployToGcpMutation,
    useDeployToRenderMutation,
    useGetDeploymentsQuery
} = deploymentApiSlice;