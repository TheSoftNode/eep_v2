import WorkspaceDetailPage from "@/components/Admin/AdminDashboard/Workspace/WorkspaceDetails/WorkspaceDetailPage";


export default function Page({
    params,
}: {
    params: { workspaceId: string };
}) {
    return <WorkspaceDetailPage workspaceId={params.workspaceId} />;
}