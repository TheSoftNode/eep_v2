import { useState } from "react";
import { motion } from 'framer-motion';
import {
    CheckCircle2,
    Clock,
    AlertCircle,
    ChevronRight,
    FileText,
    Users,
    Calendar,
    MessageSquare
} from 'lucide-react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";

const ApplicationStatus = () => {
    // Mock data - in production this would come from your API
    const applications = [
        {
            id: "APP-2025-001",
            projectName: "E-Commerce Platform",
            submittedDate: "March 5, 2025",
            status: "review",
            type: "Web Development",
            messages: 2,
            nextStep: "Technical review scheduled for March 12"
        }
    ];

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "approved":
                return <CheckCircle2 className="h-5 w-5 text-green-500" />;
            case "review":
                return <Clock className="h-5 w-5 text-amber-500" />;
            case "rejected":
                return <AlertCircle className="h-5 w-5 text-red-500" />;
            default:
                return <Clock className="h-5 w-5 text-gray-500" />;
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case "approved":
                return "Approved";
            case "review":
                return "Under Review";
            case "rejected":
                return "Not Approved";
            default:
                return "Processing";
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto px-4 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-3xl font-bold mb-2">Application Status</h1>
                    <p className="text-gray-600 mb-8">
                        Track the progress of your project applications
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {/* Sidebar */}
                        <div className="md:col-span-1">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Actions</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <Button variant="ghost" className="w-full justify-start" onClick={() => window.location.href = "/EEP/dashboard"}>
                                        <FileText className="mr-2 h-4 w-4" />
                                        Dashboard
                                    </Button>
                                    <Button variant="ghost" className="w-full justify-start" onClick={() => window.location.href = "/EEP/messages"}>
                                        <MessageSquare className="mr-2 h-4 w-4" />
                                        Messages
                                    </Button>
                                    <Button variant="ghost" className="w-full justify-start" onClick={() => window.location.href = "/EEP/create-application"}>
                                        <FileText className="mr-2 h-4 w-4" />
                                        New Application
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Main Content */}
                        <div className="md:col-span-3">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Your Applications</CardTitle>
                                    <CardDescription>
                                        Track the status of your submitted applications
                                    </CardDescription>
                                </CardHeader>

                                <CardContent>
                                    <Tabs defaultValue="active" className="w-full">
                                        <TabsList className="mb-4">
                                            <TabsTrigger value="active">Active</TabsTrigger>
                                            <TabsTrigger value="archived">Archived</TabsTrigger>
                                        </TabsList>

                                        <TabsContent value="active">
                                            {applications.length > 0 ? (
                                                <div className="space-y-4">
                                                    {applications.map((app) => (
                                                        <div key={app.id} className="border rounded-lg bg-white p-4">
                                                            <div className="flex justify-between items-center mb-4">
                                                                <div>
                                                                    <h3 className="font-semibold text-lg">{app.projectName}</h3>
                                                                    <p className="text-sm text-gray-500">
                                                                        Application ID: {app.id} | Submitted: {app.submittedDate}
                                                                    </p>
                                                                </div>
                                                                <div className="flex items-center">
                                                                    {getStatusIcon(app.status)}
                                                                    <span className="ml-2 font-medium">
                                                                        {getStatusText(app.status)}
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            <div className="flex flex-wrap gap-4 mb-4">
                                                                <div className="flex items-center">
                                                                    <FileText className="h-4 w-4 text-gray-500 mr-2" />
                                                                    <span className="text-sm">{app.type}</span>
                                                                </div>
                                                                <div className="flex items-center">
                                                                    <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                                                                    <span className="text-sm">{app.submittedDate}</span>
                                                                </div>
                                                                <div className="flex items-center">
                                                                    <MessageSquare className="h-4 w-4 text-gray-500 mr-2" />
                                                                    <span className="text-sm">{app.messages} Messages</span>
                                                                </div>
                                                            </div>

                                                            {app.nextStep && (
                                                                <div className="bg-blue-50 border border-blue-100 rounded-md p-3 text-sm">
                                                                    <strong>Next Step:</strong> {app.nextStep}
                                                                </div>
                                                            )}

                                                            <div className="mt-4 flex justify-end">
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => window.location.href = `/EEP/application/${app.id}`}
                                                                    className="flex items-center"
                                                                >
                                                                    View Details
                                                                    <ChevronRight className="ml-1 h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-center p-8 border rounded-lg">
                                                    <div className="mb-4">
                                                        <FileText className="mx-auto h-12 w-12 text-gray-300" />
                                                    </div>
                                                    <h3 className="text-lg font-medium mb-2">No Applications Found</h3>
                                                    <p className="text-gray-500 mb-4">You haven't submitted any applications yet.</p>
                                                    <Button
                                                        onClick={() => window.location.href = "/EEP/create-application"}
                                                    >
                                                        Create New Application
                                                    </Button>
                                                </div>
                                            )}
                                        </TabsContent>

                                        <TabsContent value="archived">
                                            <div className="text-center p-8 border rounded-lg">
                                                <div className="mb-4">
                                                    <FileText className="mx-auto h-12 w-12 text-gray-300" />
                                                </div>
                                                <h3 className="text-lg font-medium mb-2">No Archived Applications</h3>
                                                <p className="text-gray-500">You don't have any archived applications.</p>
                                            </div>
                                        </TabsContent>
                                    </Tabs>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ApplicationStatus;