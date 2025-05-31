import { useState } from "react";
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const BusinessApplication = () => {
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Mock submission - would connect to backend in production
        setTimeout(() => {
            setIsLoading(false);
            // Redirect to application status page
            window.location.href = "/EEP/application-status";
        }, 2000);
    };

    return (
        <div className="min-h-screen relative bg-gradient-to-b from-blue-50 via-blue-100/50 to-white">
            {/* Background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[800px] opacity-30">
                    <div className="absolute inset-0 rotate-45 animate-pulse">
                        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
                        <div className="absolute top-0 right-0 w-96 h-96 bg-violet-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
                    </div>
                </div>
            </div>

            <div className="relative z-10 container max-w-2xl mx-auto pt-16 px-4 pb-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-3xl font-bold text-center mb-2">Business Application</h1>
                    <p className="text-gray-600 text-center mb-8">
                        Tell us about your project needs so we can connect you with the right developers
                    </p>

                    <Card className="backdrop-blur-sm bg-white/80">
                        <form onSubmit={handleSubmit}>
                            <CardHeader>
                                <CardTitle>Project Details</CardTitle>
                                <CardDescription>
                                    Provide information about your project requirements
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-5">
                                <div className="space-y-2">
                                    <Label htmlFor="projectName">Project Name</Label>
                                    <Input
                                        id="projectName"
                                        placeholder="Enter your project name"
                                        className="bg-white"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="projectType">Project Type</Label>
                                    <Select required>
                                        <SelectTrigger className="bg-white">
                                            <SelectValue placeholder="Select project type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="web">Web Development</SelectItem>
                                            <SelectItem value="mobile">Mobile App</SelectItem>
                                            <SelectItem value="data">Data Analysis</SelectItem>
                                            <SelectItem value="cloud">Cloud Solution</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="timeline">Expected Timeline</Label>
                                    <Select required>
                                        <SelectTrigger className="bg-white">
                                            <SelectValue placeholder="Select timeline" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1month">Less than 1 month</SelectItem>
                                            <SelectItem value="3months">1-3 months</SelectItem>
                                            <SelectItem value="6months">3-6 months</SelectItem>
                                            <SelectItem value="longer">6+ months</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="budget">Budget Range</Label>
                                    <Select required>
                                        <SelectTrigger className="bg-white">
                                            <SelectValue placeholder="Select budget range" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="small">$1,000 - $5,000</SelectItem>
                                            <SelectItem value="medium">$5,000 - $15,000</SelectItem>
                                            <SelectItem value="large">$15,000 - $50,000</SelectItem>
                                            <SelectItem value="enterprise">$50,000+</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Project Description</Label>
                                    <Textarea
                                        id="description"
                                        placeholder="Describe your project requirements, goals, and any specific technologies needed..."
                                        className="bg-white h-32"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="contactPreference">Preferred Contact Method</Label>
                                    <Select required>
                                        <SelectTrigger className="bg-white">
                                            <SelectValue placeholder="Select contact preference" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="email">Email</SelectItem>
                                            <SelectItem value="phone">Phone</SelectItem>
                                            <SelectItem value="video">Video Call</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>

                            <CardFooter className="flex justify-between flex-wrap gap-4">
                                <Button
                                    variant="outline"
                                    type="button"
                                    onClick={() => window.location.href = "/EEP/dashboard"}
                                >
                                    Save as Draft
                                </Button>
                                <Button
                                    type="submit"
                                    className="bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Submitting...
                                        </>
                                    ) : (
                                        'Submit Application'
                                    )}
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
};

export default BusinessApplication;