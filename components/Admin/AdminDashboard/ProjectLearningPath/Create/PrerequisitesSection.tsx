import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    Users,
    Plus,
    X,
    Target,
    BookOpen,
    AlertCircle,
    Search,
    FolderOpen,
    Calendar,
    BarChart3,
    Tag
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Project } from "@/Redux/types/Projects";

interface Prerequisites {
    skills?: string[];
    projects?: string[];
    courses?: string[]; // Keep this for API compatibility but won't use it
}

interface PrerequisitesSectionProps {
    prerequisites: Prerequisites;
    onPrerequisitesChange: (prerequisites: Prerequisites) => void;
    availableProjects: Project[];
}

const COMMON_SKILLS = [
    // Programming Languages
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'Go', 'Rust', 'PHP', 'Swift', 'Kotlin',
    // Web Technologies
    'HTML/CSS', 'React', 'Vue.js', 'Angular', 'Node.js', 'Express.js', 'Next.js', 'Nuxt.js',
    // Mobile Development
    'React Native', 'Flutter', 'iOS Development', 'Android Development', 'Xamarin',
    // Database
    'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Firebase', 'SQLite',
    // DevOps & Cloud
    'Docker', 'Kubernetes', 'AWS', 'Azure', 'Google Cloud', 'Git', 'CI/CD', 'Jenkins',
    // Data & ML
    'Data Analysis', 'Machine Learning', 'TensorFlow', 'PyTorch', 'Pandas', 'NumPy',
    // Design & UX
    'UI/UX Design', 'Figma', 'Adobe XD', 'Prototyping', 'User Research',
    // Other
    'API Development', 'Testing', 'Agile Methodology', 'Project Management'
];

const getLevelBadgeColor = (level: string) => {
    switch (level) {
        case 'beginner':
            return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400';
        case 'intermediate':
            return 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400';
        case 'advanced':
            return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400';
        default:
            return 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400';
    }
};

const getCategoryLabel = (category: string) => {
    return category.split('-').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
};

export const PrerequisitesSection: React.FC<PrerequisitesSectionProps> = ({
    prerequisites,
    onPrerequisitesChange,
    availableProjects
}) => {
    const [isSkillDialogOpen, setIsSkillDialogOpen] = useState(false);
    const [newSkill, setNewSkill] = useState('');
    const [skillSearchTerm, setSkillSearchTerm] = useState('');
    const [projectSearchTerm, setProjectSearchTerm] = useState('');

    // Filter skills based on search
    const filteredSkills = COMMON_SKILLS.filter(skill =>
        skill.toLowerCase().includes(skillSearchTerm.toLowerCase()) &&
        !prerequisites.skills?.includes(skill)
    );

    // Filter projects based on search and exclude already selected
    const filteredProjects = availableProjects.filter(project =>
        project.name.toLowerCase().includes(projectSearchTerm.toLowerCase()) &&
        !prerequisites.projects?.includes(project.id)
    );

    const handleAddSkill = (skillName: string) => {
        const updatedSkills = [...(prerequisites.skills || []), skillName];
        onPrerequisitesChange({
            ...prerequisites,
            skills: updatedSkills
        });
        setNewSkill('');
        setSkillSearchTerm('');
    };

    const handleAddCustomSkill = () => {
        if (newSkill.trim() && !prerequisites.skills?.includes(newSkill.trim())) {
            handleAddSkill(newSkill.trim());
            setIsSkillDialogOpen(false);
            setNewSkill('');
        }
    };

    const handleRemoveSkill = (skillToRemove: string) => {
        const updatedSkills = prerequisites.skills?.filter(skill => skill !== skillToRemove) || [];
        onPrerequisitesChange({
            ...prerequisites,
            skills: updatedSkills
        });
    };

    const handleAddProject = (projectId: string) => {
        const updatedProjects = [...(prerequisites.projects || []), projectId];
        onPrerequisitesChange({
            ...prerequisites,
            projects: updatedProjects
        });
        setProjectSearchTerm('');
    };

    const handleRemoveProject = (projectIdToRemove: string) => {
        const updatedProjects = prerequisites.projects?.filter(id => id !== projectIdToRemove) || [];
        onPrerequisitesChange({
            ...prerequisites,
            projects: updatedProjects
        });
    };

    const getProjectById = (projectId: string) => {
        return availableProjects.find(project => project.id === projectId);
    };

    const totalPrerequisites = (prerequisites.skills?.length || 0) + (prerequisites.projects?.length || 0);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                            <Users className="h-4 w-4" />
                        </div>
                        Prerequisites & Requirements
                    </CardTitle>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Define the skills and completed projects learners need before starting this learning path
                    </p>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Prerequisites Summary */}
                    <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                        <h4 className="text-sm font-medium text-orange-900 dark:text-orange-100 mb-2 flex items-center gap-2">
                            <AlertCircle className="h-4 w-4" />
                            Prerequisites Summary
                        </h4>
                        <div className="grid grid-cols-2 gap-4 text-xs">
                            <div>
                                <span className="text-orange-600 dark:text-orange-400 font-medium">Required Skills:</span>
                                <span className="ml-1 text-orange-800 dark:text-orange-200">{prerequisites.skills?.length || 0}</span>
                            </div>
                            <div>
                                <span className="text-orange-600 dark:text-orange-400 font-medium">Required Projects:</span>
                                <span className="ml-1 text-orange-800 dark:text-orange-200">{prerequisites.projects?.length || 0}</span>
                            </div>
                        </div>
                        {totalPrerequisites === 0 && (
                            <p className="text-xs text-orange-700 dark:text-orange-300 mt-2">
                                No prerequisites set - this learning path will be accessible to all learners
                            </p>
                        )}
                    </div>

                    {/* Required Skills Section */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                    <Target className="h-4 w-4 text-blue-600" />
                                    Required Skills ({prerequisites.skills?.length || 0})
                                </Label>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                    Skills learners must have before starting this learning path
                                </p>
                            </div>
                            <Dialog open={isSkillDialogOpen} onOpenChange={setIsSkillDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-blue-600 border-blue-200 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-800 dark:hover:bg-blue-900/20"
                                    >
                                        <Plus className="h-4 w-4 mr-1" />
                                        Add Skill
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-md">
                                    <DialogHeader>
                                        <DialogTitle>Add Required Skill</DialogTitle>
                                        <DialogDescription>
                                            Add a skill that learners must have before starting this learning path
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
                                        <div className="space-y-2">
                                            <Label>Search Common Skills</Label>
                                            <div className="relative">
                                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                                                <Input
                                                    placeholder="Search skills..."
                                                    value={skillSearchTerm}
                                                    onChange={(e) => setSkillSearchTerm(e.target.value)}
                                                    className="pl-10"
                                                />
                                            </div>
                                            {skillSearchTerm && (
                                                <div className="max-h-32 overflow-y-auto space-y-1">
                                                    {filteredSkills.slice(0, 5).map((skill) => (
                                                        <Button
                                                            key={skill}
                                                            variant="ghost"
                                                            size="sm"
                                                            className="w-full justify-start text-left h-8"
                                                            onClick={() => {
                                                                handleAddSkill(skill);
                                                                setIsSkillDialogOpen(false);
                                                            }}
                                                        >
                                                            {skill}
                                                        </Button>
                                                    ))}
                                                    {filteredSkills.length === 0 && (
                                                        <p className="text-sm text-slate-500 p-2">No matching skills found</p>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                        <div className="relative">
                                            <div className="absolute inset-0 flex items-center">
                                                <span className="w-full border-t border-slate-300 dark:border-slate-600" />
                                            </div>
                                            <div className="relative flex justify-center text-xs uppercase">
                                                <span className="bg-white dark:bg-slate-900 px-2 text-slate-500">Or</span>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Add Custom Skill</Label>
                                            <Input
                                                placeholder="Enter custom skill name"
                                                value={newSkill}
                                                onChange={(e) => setNewSkill(e.target.value)}
                                                onKeyPress={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        handleAddCustomSkill();
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button variant="outline" onClick={() => setIsSkillDialogOpen(false)}>
                                            Cancel
                                        </Button>
                                        <Button
                                            onClick={handleAddCustomSkill}
                                            disabled={!newSkill.trim()}
                                        >
                                            Add Skill
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>

                        {/* Skills List */}
                        {prerequisites.skills && prerequisites.skills.length > 0 ? (
                            <div className="space-y-2">
                                {prerequisites.skills.map((skill, index) => (
                                    <motion.div
                                        key={skill}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
                                    >
                                        <div className="flex items-center gap-2">
                                            <Target className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                            <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                                                {skill}
                                            </span>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6 text-blue-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                                            onClick={() => handleRemoveSkill(skill)}
                                        >
                                            <X className="h-3 w-3" />
                                        </Button>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-6 bg-slate-50 dark:bg-slate-800/50 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600">
                                <Target className="h-8 w-8 mx-auto mb-2 text-slate-400" />
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    No required skills added yet
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                    Add skills that learners must have before starting
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Required Projects Section */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                    <BookOpen className="h-4 w-4 text-purple-600" />
                                    Required Projects ({prerequisites.projects?.length || 0})
                                </Label>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                    Projects learners must complete before starting this learning path
                                </p>
                            </div>
                        </div>

                        {/* Project Search */}
                        <div className="space-y-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input
                                    placeholder="Search available projects..."
                                    value={projectSearchTerm}
                                    onChange={(e) => setProjectSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>

                            {/* Available Projects */}
                            {projectSearchTerm && (
                                <div className="max-h-48 overflow-y-auto space-y-2 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                                    {filteredProjects.slice(0, 5).map((project) => (
                                        <div
                                            key={project.id}
                                            className="flex items-center justify-between p-2 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-600 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700"
                                            onClick={() => handleAddProject(project.id)}
                                        >
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h4 className="text-sm font-medium text-slate-900 dark:text-white truncate">
                                                        {project.name}
                                                    </h4>
                                                    <Badge className={cn("text-xs border", getLevelBadgeColor(project.level))}>
                                                        {project.level}
                                                    </Badge>
                                                </div>
                                                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                                                    <span className="flex items-center gap-1">
                                                        <Tag className="h-3 w-3" />
                                                        {getCategoryLabel(project.category)}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="h-3 w-3" />
                                                        {new Date(project.startDate as any).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                            <Plus className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                        </div>
                                    ))}
                                    {filteredProjects.length === 0 && (
                                        <p className="text-sm text-slate-500 text-center py-4">
                                            No matching projects found
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Selected Projects List */}
                        {prerequisites.projects && prerequisites.projects.length > 0 ? (
                            <div className="space-y-3">
                                {prerequisites.projects.map((projectId) => {
                                    const project = getProjectById(projectId);
                                    if (!project) return null;

                                    return (
                                        <motion.div
                                            key={projectId}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-start gap-3 flex-1">
                                                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                                                        <BookOpen className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h4 className="font-medium text-purple-900 dark:text-purple-100">
                                                                {project.name}
                                                            </h4>
                                                            <Badge className={cn("text-xs border", getLevelBadgeColor(project.level))}>
                                                                {project.level}
                                                            </Badge>
                                                        </div>
                                                        <p className="text-sm text-purple-700 dark:text-purple-300 mb-2 line-clamp-2">
                                                            {project.description}
                                                        </p>
                                                        <div className="flex items-center gap-4 text-xs text-purple-600 dark:text-purple-400">
                                                            <span className="flex items-center gap-1">
                                                                <Tag className="h-3 w-3" />
                                                                {getCategoryLabel(project.category)}
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <Calendar className="h-3 w-3" />
                                                                {new Date(project.startDate as any).toLocaleDateString()}
                                                            </span>
                                                            {project.progress !== undefined && (
                                                                <span className="flex items-center gap-1">
                                                                    <BarChart3 className="h-3 w-3" />
                                                                    {project.progress}% complete
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-purple-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                    onClick={() => handleRemoveProject(projectId)}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-6 bg-slate-50 dark:bg-slate-800/50 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600">
                                <FolderOpen className="h-8 w-8 mx-auto mb-2 text-slate-400" />
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    No required projects added yet
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                    Search and add projects that learners must complete first
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Prerequisites Impact Notice */}
                    {totalPrerequisites > 0 && (
                        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="text-sm font-medium text-amber-900 dark:text-amber-100 mb-1">
                                        Prerequisites Impact
                                    </h4>
                                    <p className="text-sm text-amber-700 dark:text-amber-300">
                                        Learners will need to demonstrate these {totalPrerequisites} prerequisite{totalPrerequisites > 1 ? 's' : ''} before accessing this learning path.
                                        This helps ensure they have the foundation needed for success.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
};