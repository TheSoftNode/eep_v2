// import React, { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import { Layers, Plus, X, GripVertical, Calendar, User, Target, Settings, AlertCircle, Loader2 } from "lucide-react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Label } from "@/components/ui/label";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from "@/components/ui/select";
// import {
//     Dialog,
//     DialogContent,
//     DialogDescription,
//     DialogFooter,
//     DialogHeader,
//     DialogTitle,
//     DialogTrigger,
// } from "@/components/ui/dialog";
// import { cn } from "@/lib/utils";
// import { useToast } from "@/hooks/use-toast";
// import {
//     useAddProjectAreaMutation,
//     useGetProjectAreasQuery,
//     useDeleteProjectAreaMutation
// } from "@/Redux/apiSlices/Projects/projectAreaApiSlice";
// import { firebaseFormatDate } from "@/components/utils/dateUtils";

// interface ProjectArea {
//     id?: string;
//     name: string;
//     description: string;
//     status: 'planned' | 'in-progress' | 'completed' | 'blocked';
//     learningFocus: string[];
//     technologies: string[];
//     startDate?: string;
//     endDate?: string;
//     estimatedHours?: number;
//     assignedMentorId?: string;
//     order: number;
// }

// interface ProjectAreasSectionProps {
//     projectId?: string;
//     onAreasChange?: (areas: ProjectArea[]) => void;
// }

// const AREA_STATUS_OPTIONS = [
//     { value: 'planned', label: 'Planned', color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' },
//     { value: 'in-progress', label: 'In Progress', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' },
//     { value: 'completed', label: 'Completed', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' },
//     { value: 'blocked', label: 'Blocked', color: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400' }
// ];

// const getStatusColor = (status: string) => {
//     const statusOption = AREA_STATUS_OPTIONS.find(option => option.value === status);
//     return statusOption?.color || 'bg-slate-100 text-slate-700';
// };

// export const ProjectAreasSection: React.FC<ProjectAreasSectionProps> = ({
//     projectId,
//     onAreasChange
// }) => {
//     const { toast } = useToast();
//     const [addProjectArea, { isLoading: isAddingArea }] = useAddProjectAreaMutation();
//     const [deleteProjectArea, { isLoading: isDeletingArea }] = useDeleteProjectAreaMutation();

//     // Fetch existing areas if projectId exists (edit mode)
//     const {
//         data: areasResponse,
//         isLoading: isLoadingAreas,
//         error: areasError,
//         refetch: refetchAreas
//     } = useGetProjectAreasQuery(
//         { projectId: projectId! },
//         { skip: !projectId }
//     );

//     const [areas, setAreas] = useState<ProjectArea[]>([]);
//     const [isAreaDialogOpen, setIsAreaDialogOpen] = useState(false);
//     const [newArea, setNewArea] = useState<ProjectArea>({
//         name: '',
//         description: '',
//         status: 'planned',
//         learningFocus: [],
//         technologies: [],
//         estimatedHours: 0,
//         order: 0
//     });
//     const [newLearningFocus, setNewLearningFocus] = useState('');
//     const [newTechnology, setNewTechnology] = useState('');

//     // Update local areas when API data changes (edit mode)
//     useEffect(() => {
//         if (projectId && areasResponse?.data) {
//             const formattedAreas = areasResponse.data.map(area => ({
//                 id: area.id,
//                 name: area.name,
//                 description: area.description,
//                 status: area.status,
//                 learningFocus: area.learningFocus || [],
//                 technologies: area.technologies || [],
//                 startDate: area.startDate ? (typeof area.startDate === 'string' ? area.startDate : firebaseFormatDate(area.startDate).split('T')[0]) : undefined,
//                 endDate: area.endDate ? (typeof area.endDate === 'string' ? area.endDate : firebaseFormatDate(area.endDate).split('T')[0]) : undefined,
//                 estimatedHours: area.estimatedHours,
//                 assignedMentorId: area.assignedMentorId,
//                 order: area.order || 0
//             }));
//             setAreas(formattedAreas);
//             onAreasChange?.(formattedAreas);
//         }
//     }, [areasResponse, projectId, onAreasChange]);
//     // Handle API errors
//     useEffect(() => {
//         if (areasError) {
//             toast({
//                 title: "Error Loading Areas",
//                 description: "Failed to load project areas. Please try again.",
//                 variant: "destructive",
//             });
//         }
//     }, [areasError, toast]);

//     const handleAddLearningFocus = () => {
//         if (newLearningFocus.trim() && !newArea.learningFocus.includes(newLearningFocus.trim())) {
//             setNewArea(prev => ({
//                 ...prev,
//                 learningFocus: [...prev.learningFocus, newLearningFocus.trim()]
//             }));
//             setNewLearningFocus('');
//         }
//     };

//     const handleRemoveLearningFocus = (focus: string) => {
//         setNewArea(prev => ({
//             ...prev,
//             learningFocus: prev.learningFocus.filter(f => f !== focus)
//         }));
//     };

//     const handleAddTechnology = () => {
//         if (newTechnology.trim() && !newArea.technologies.includes(newTechnology.trim())) {
//             setNewArea(prev => ({
//                 ...prev,
//                 technologies: [...prev.technologies, newTechnology.trim()]
//             }));
//             setNewTechnology('');
//         }
//     };

//     const handleRemoveTechnology = (tech: string) => {
//         setNewArea(prev => ({
//             ...prev,
//             technologies: prev.technologies.filter(t => t !== tech)
//         }));
//     };

//     const handleAreaInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//         const { name, value } = e.target;
//         setNewArea(prev => ({ ...prev, [name]: value }));
//     };

//     const handleAddArea = async () => {
//         if (!newArea.name.trim()) {
//             toast({
//                 title: "Missing Fields",
//                 description: "Please enter an area name.",
//                 variant: "destructive",
//             });
//             return;
//         }

//         const areaToAdd = {
//             ...newArea,
//             order: areas.length
//         };

//         if (projectId) {
//             // If project exists, add to database
//             try {
//                 await addProjectArea({
//                     projectId,
//                     name: newArea.name,
//                     description: newArea.description,
//                     status: newArea.status,
//                     learningFocus: newArea.learningFocus,
//                     technologies: newArea.technologies,
//                     startDate: newArea.startDate,
//                     endDate: newArea.endDate,
//                     estimatedHours: newArea.estimatedHours,
//                     assignedMentorId: newArea.assignedMentorId,
//                     order: areaToAdd.order
//                 }).unwrap();

//                 toast({
//                     title: "Area Added",
//                     description: "Project area has been successfully created.",
//                 });

//                 // Refetch areas to get the latest data
//                 refetchAreas();
//             } catch (error: any) {
//                 toast({
//                     title: "Error",
//                     description: error?.data?.message || "Failed to add area. Please try again.",
//                     variant: "destructive",
//                 });
//                 return;
//             }
//         } else {
//             // If project doesn't exist yet, add to local state
//             const updatedAreas = [...areas, areaToAdd];
//             setAreas(updatedAreas);
//             onAreasChange?.(updatedAreas);
//         }

//         // Reset form
//         setNewArea({
//             name: '',
//             description: '',
//             status: 'planned',
//             learningFocus: [],
//             technologies: [],
//             estimatedHours: 0,
//             order: 0
//         });
//         setIsAreaDialogOpen(false);
//     };

//     const handleRemoveArea = async (index: number) => {
//         const areaToRemove = areas[index];

//         if (projectId && areaToRemove.id) {
//             // If project exists and area has ID, delete from database
//             try {
//                 await deleteProjectArea({
//                     projectId,
//                     areaId: areaToRemove.id
//                 }).unwrap();

//                 toast({
//                     title: "Area Deleted",
//                     description: "Project area has been successfully removed.",
//                 });

//                 // Refetch areas to get the latest data
//                 refetchAreas();
//             } catch (error: any) {
//                 toast({
//                     title: "Error",
//                     description: error?.data?.message || "Failed to delete area. Please try again.",
//                     variant: "destructive",
//                 });
//                 return;
//             }
//         } else {
//             // If project doesn't exist yet, remove from local state
//             const updatedAreas = areas.filter((_, i) => i !== index);
//             setAreas(updatedAreas);
//             onAreasChange?.(updatedAreas);
//         }
//     };

//     const resetAreaForm = () => {
//         setNewArea({
//             name: '',
//             description: '',
//             status: 'planned',
//             learningFocus: [],
//             technologies: [],
//             estimatedHours: 0,
//             order: 0
//         });
//         setNewLearningFocus('');
//         setNewTechnology('');
//     };

//     // Show loading state when fetching areas in edit mode
//     if (projectId && isLoadingAreas) {
//         return (
//             <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5, delay: 0.15 }}
//                 id="areas-section"
//             >
//                 <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg">
//                     <CardHeader>
//                         <CardTitle className="flex items-center gap-2">
//                             <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
//                                 <Layers className="h-4 w-4" />
//                             </div>
//                             Project Areas
//                         </CardTitle>
//                         <p className="text-sm text-slate-600 dark:text-slate-400">
//                             Organize your project into logical areas of work
//                         </p>
//                     </CardHeader>
//                     <CardContent className="space-y-4">
//                         <div className="flex items-center justify-center py-8">
//                             <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
//                             <span className="ml-3 text-slate-600 dark:text-slate-400">Loading project areas...</span>
//                         </div>
//                     </CardContent>
//                 </Card>
//             </motion.div>
//         );
//     }

//     return (
//         <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5, delay: 0.15 }}
//             id="areas-section"
//         >
//             <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg">
//                 <CardHeader>
//                     <CardTitle className="flex items-center gap-2">
//                         <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
//                             <Layers className="h-4 w-4" />
//                         </div>
//                         Project Areas
//                     </CardTitle>
//                     <p className="text-sm text-slate-600 dark:text-slate-400">
//                         Organize your project into logical areas of work
//                     </p>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                     {/* Add Area Button */}
//                     <div className="flex justify-between items-center">
//                         <div>
//                             <h4 className="text-sm font-medium text-slate-900 dark:text-white">
//                                 Project Areas ({areas.length})
//                             </h4>
//                             <p className="text-xs text-slate-500 dark:text-slate-400">
//                                 Break down your project into manageable sections
//                             </p>
//                         </div>
//                         <Dialog open={isAreaDialogOpen} onOpenChange={setIsAreaDialogOpen}>
//                             <DialogTrigger asChild>
//                                 <Button
//                                     type="button"
//                                     variant="outline"
//                                     size="sm"
//                                     className="text-purple-600 border-purple-200 hover:bg-purple-50 dark:text-purple-400 dark:border-purple-800 dark:hover:bg-purple-900/20"
//                                     onClick={() => {
//                                         resetAreaForm();
//                                         setIsAreaDialogOpen(true);
//                                     }}
//                                 >
//                                     <Plus className="h-4 w-4 mr-1" />
//                                     Add Area
//                                 </Button>
//                             </DialogTrigger>
//                             <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg">
//                                 <DialogHeader>
//                                     <DialogTitle>Add Project Area</DialogTitle>
//                                     <DialogDescription>
//                                         Define a new area of work for your project (e.g., Frontend, Backend, DevOps)
//                                     </DialogDescription>
//                                 </DialogHeader>
//                                 <div className="space-y-6 py-4">
//                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                         <div className="space-y-2">
//                                             <Label htmlFor="area-name">Area Name <span className="text-red-500">*</span></Label>
//                                             <Input
//                                                 id="area-name"
//                                                 name="name"
//                                                 value={newArea.name}
//                                                 onChange={handleAreaInputChange}
//                                                 placeholder="e.g., Frontend Development, API Integration"
//                                             />
//                                         </div>
//                                         <div className="space-y-2">
//                                             <Label htmlFor="area-status">Status</Label>
//                                             <Select value={newArea.status} onValueChange={(value) => setNewArea(prev => ({ ...prev, status: value as any }))}>
//                                                 <SelectTrigger>
//                                                     <SelectValue />
//                                                 </SelectTrigger>
//                                                 <SelectContent>
//                                                     {AREA_STATUS_OPTIONS.map((status) => (
//                                                         <SelectItem key={status.value} value={status.value}>
//                                                             <div className="flex items-center gap-2">
//                                                                 <div className={cn("w-2 h-2 rounded-full", status.color.split(' ')[0])}></div>
//                                                                 {status.label}
//                                                             </div>
//                                                         </SelectItem>
//                                                     ))}
//                                                 </SelectContent>
//                                             </Select>
//                                         </div>
//                                     </div>

//                                     <div className="space-y-2">
//                                         <Label htmlFor="area-description">Description</Label>
//                                         <Textarea
//                                             id="area-description"
//                                             name="description"
//                                             value={newArea.description}
//                                             onChange={handleAreaInputChange}
//                                             placeholder="Describe what this area covers and its main objectives..."
//                                             rows={3}
//                                         />
//                                     </div>

//                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                         <div className="space-y-2">
//                                             <Label htmlFor="area-start-date">Start Date</Label>
//                                             <Input
//                                                 id="area-start-date"
//                                                 name="startDate"
//                                                 type="date"
//                                                 value={newArea.startDate || ''}
//                                                 onChange={handleAreaInputChange}
//                                             />
//                                         </div>
//                                         <div className="space-y-2">
//                                             <Label htmlFor="area-end-date">End Date</Label>
//                                             <Input
//                                                 id="area-end-date"
//                                                 name="endDate"
//                                                 type="date"
//                                                 value={newArea.endDate || ''}
//                                                 onChange={handleAreaInputChange}
//                                                 min={newArea.startDate}
//                                             />
//                                         </div>
//                                     </div>

//                                     <div className="space-y-2">
//                                         <Label htmlFor="estimated-hours">Estimated Hours</Label>
//                                         <Input
//                                             id="estimated-hours"
//                                             name="estimatedHours"
//                                             type="number"
//                                             min="0"
//                                             value={newArea.estimatedHours || ''}
//                                             onChange={handleAreaInputChange}
//                                             placeholder="0"
//                                         />
//                                     </div>

//                                     <div className="space-y-3">
//                                         <Label>Learning Focus</Label>
//                                         <div className="flex gap-2">
//                                             <Input
//                                                 placeholder="e.g., React Hooks, API Design"
//                                                 value={newLearningFocus}
//                                                 onChange={(e) => setNewLearningFocus(e.target.value)}
//                                                 onKeyPress={(e) => {
//                                                     if (e.key === 'Enter') {
//                                                         e.preventDefault();
//                                                         handleAddLearningFocus();
//                                                     }
//                                                 }}
//                                                 className="flex-1"
//                                             />
//                                             <Button
//                                                 type="button"
//                                                 onClick={handleAddLearningFocus}
//                                                 variant="secondary"
//                                                 size="sm"
//                                             >
//                                                 Add
//                                             </Button>
//                                         </div>
//                                         <div className="flex flex-wrap gap-1">
//                                             {newArea.learningFocus.map((focus, index) => (
//                                                 <Badge key={index} variant="secondary" className="bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400">
//                                                     <Target className="h-3 w-3 mr-1" />
//                                                     {focus}
//                                                     <Button
//                                                         type="button"
//                                                         variant="ghost"
//                                                         size="icon"
//                                                         className="h-3 w-3 ml-1 hover:bg-red-100"
//                                                         onClick={() => handleRemoveLearningFocus(focus)}
//                                                     >
//                                                         <X className="h-2 w-2" />
//                                                     </Button>
//                                                 </Badge>
//                                             ))}
//                                         </div>
//                                     </div>

//                                     <div className="space-y-3">
//                                         <Label>Technologies</Label>
//                                         <div className="flex gap-2">
//                                             <Input
//                                                 placeholder="e.g., React, Node.js, PostgreSQL"
//                                                 value={newTechnology}
//                                                 onChange={(e) => setNewTechnology(e.target.value)}
//                                                 onKeyPress={(e) => {
//                                                     if (e.key === 'Enter') {
//                                                         e.preventDefault();
//                                                         handleAddTechnology();
//                                                     }
//                                                 }}
//                                                 className="flex-1"
//                                             />
//                                             <Button
//                                                 type="button"
//                                                 onClick={handleAddTechnology}
//                                                 variant="secondary"
//                                                 size="sm"
//                                             >
//                                                 Add
//                                             </Button>
//                                         </div>
//                                         <div className="flex flex-wrap gap-1">
//                                             {newArea.technologies.map((tech, index) => (
//                                                 <Badge key={index} variant="secondary" className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
//                                                     {tech}
//                                                     <Button
//                                                         type="button"
//                                                         variant="ghost"
//                                                         size="icon"
//                                                         className="h-3 w-3 ml-1 hover:bg-red-100"
//                                                         onClick={() => handleRemoveTechnology(tech)}
//                                                     >
//                                                         <X className="h-2 w-2" />
//                                                     </Button>
//                                                 </Badge>
//                                             ))}
//                                         </div>
//                                     </div>
//                                 </div>
//                                 <DialogFooter>
//                                     <Button variant="outline" onClick={() => setIsAreaDialogOpen(false)}>
//                                         Cancel
//                                     </Button>
//                                     <Button
//                                         onClick={handleAddArea}
//                                         disabled={!newArea.name.trim() || isAddingArea}
//                                     >
//                                         {isAddingArea ? (
//                                             <>
//                                                 <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                                                 Adding...
//                                             </>
//                                         ) : (
//                                             'Add Area'
//                                         )}
//                                     </Button>
//                                 </DialogFooter>
//                             </DialogContent>
//                         </Dialog>
//                     </div>

//                     {/* Areas List */}
//                     <div className="space-y-3">
//                         {areas.length === 0 ? (
//                             <div className="text-center py-8 bg-slate-50 dark:bg-slate-800/50 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600">
//                                 <Layers className="h-12 w-12 mx-auto mb-4 text-slate-400" />
//                                 <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-2">
//                                     No Areas Added Yet
//                                 </h4>
//                                 <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 max-w-sm mx-auto">
//                                     Break your project into logical areas like Frontend, Backend, Testing, etc. This helps organize work and assign responsibilities.
//                                 </p>
//                                 {!projectId && (
//                                     <div className="flex items-center justify-center gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg mx-4">
//                                         <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
//                                         <p className="text-xs text-amber-700 dark:text-amber-300">
//                                             You can add areas now or after creating the project
//                                         </p>
//                                     </div>
//                                 )}
//                             </div>
//                         ) : (
//                             areas.map((area, index) => (
//                                 <motion.div
//                                     key={area.id || index}
//                                     initial={{ opacity: 0, y: 10 }}
//                                     animate={{ opacity: 1, y: 0 }}
//                                     transition={{ duration: 0.2 }}
//                                     className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700"
//                                 >
//                                     <div className="flex items-start justify-between">
//                                         <div className="flex-1">
//                                             <div className="flex items-center gap-2 mb-2">
//                                                 <GripVertical className="h-4 w-4 text-slate-400 cursor-move" />
//                                                 <h4 className="font-medium text-slate-900 dark:text-white">
//                                                     {area.name}
//                                                 </h4>
//                                                 <Badge className={cn("text-xs", getStatusColor(area.status))}>
//                                                     {AREA_STATUS_OPTIONS.find(s => s.value === area.status)?.label}
//                                                 </Badge>
//                                                 <span className="text-xs text-slate-500">#{index + 1}</span>
//                                             </div>
//                                             {area.description && (
//                                                 <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
//                                                     {area.description}
//                                                 </p>
//                                             )}
//                                             <div className="flex flex-wrap gap-4 text-xs text-slate-500 dark:text-slate-400">
//                                                 {area.estimatedHours && area.estimatedHours > 0 && (
//                                                     <span className="flex items-center gap-1">
//                                                         <Settings className="h-3 w-3" />
//                                                         {area.estimatedHours}h estimated
//                                                     </span>
//                                                 )}
//                                                 {(area.startDate || area.endDate) && (
//                                                     <span className="flex items-center gap-1">
//                                                         <Calendar className="h-3 w-3" />
//                                                         {area.startDate && new Date(area.startDate).toLocaleDateString()}
//                                                         {area.startDate && area.endDate && ' - '}
//                                                         {area.endDate && new Date(area.endDate).toLocaleDateString()}
//                                                     </span>
//                                                 )}
//                                             </div>
//                                             {(area.learningFocus.length > 0 || area.technologies.length > 0) && (
//                                                 <div className="mt-3 space-y-2">
//                                                     {area.learningFocus.length > 0 && (
//                                                         <div className="flex flex-wrap gap-1">
//                                                             {area.learningFocus.map((focus, i) => (
//                                                                 <Badge key={i} variant="outline" className="text-xs">
//                                                                     <Target className="h-2 w-2 mr-1" />
//                                                                     {focus}
//                                                                 </Badge>
//                                                             ))}
//                                                         </div>
//                                                     )}
//                                                     {area.technologies.length > 0 && (
//                                                         <div className="flex flex-wrap gap-1">
//                                                             {area.technologies.map((tech, i) => (
//                                                                 <Badge key={i} variant="secondary" className="text-xs">
//                                                                     {tech}
//                                                                 </Badge>
//                                                             ))}
//                                                         </div>
//                                                     )}
//                                                 </div>
//                                             )}
//                                         </div>
//                                         <Button
//                                             type="button"
//                                             variant="ghost"
//                                             size="icon"
//                                             className="h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
//                                             onClick={() => handleRemoveArea(index)}
//                                             disabled={isDeletingArea}
//                                         >
//                                             {isDeletingArea ? (
//                                                 <Loader2 className="h-4 w-4 animate-spin" />
//                                             ) : (
//                                                 <X className="h-4 w-4" />
//                                             )}
//                                         </Button>
//                                     </div>
//                                 </motion.div>
//                             ))
//                         )}
//                     </div>

//                     {/* Areas Summary */}
//                     {areas.length > 0 && (
//                         <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
//                             <h4 className="text-sm font-medium text-purple-900 dark:text-purple-100 mb-2">
//                                 📋 Areas Summary
//                             </h4>
//                             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
//                                 <div>
//                                     <span className="text-purple-600 dark:text-purple-400 font-medium">Total Areas:</span>
//                                     <span className="ml-1 text-purple-800 dark:text-purple-200">{areas.length}</span>
//                                 </div>
//                                 <div>
//                                     <span className="text-purple-600 dark:text-purple-400 font-medium">Planned:</span>
//                                     <span className="ml-1 text-purple-800 dark:text-purple-200">
//                                         {areas.filter(a => a.status === 'planned').length}
//                                     </span>
//                                 </div>
//                                 <div>
//                                     <span className="text-purple-600 dark:text-purple-400 font-medium">Est. Hours:</span>
//                                     <span className="ml-1 text-purple-800 dark:text-purple-200">
//                                         {areas.reduce((total, area) => total + (area.estimatedHours || 0), 0)}h
//                                     </span>
//                                 </div>
//                                 <div>
//                                     <span className="text-purple-600 dark:text-purple-400 font-medium">Technologies:</span>
//                                     <span className="ml-1 text-purple-800 dark:text-purple-200">
//                                         {new Set(areas.flatMap(a => a.technologies)).size}
//                                     </span>
//                                 </div>
//                             </div>
//                         </div>
//                     )}
//                 </CardContent>
//             </Card>
//         </motion.div>
//     );
// };


import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Layers, Plus, X, GripVertical, Calendar, User, Target, Settings, AlertCircle, Loader2, Edit } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
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
import { useToast } from "@/hooks/use-toast";
import {
    useAddProjectAreaMutation,
    useGetProjectAreasQuery,
    useDeleteProjectAreaMutation,
    useUpdateProjectAreaMutation
} from "@/Redux/apiSlices/Projects/projectAreaApiSlice";
import { firebaseFormatDate } from "@/components/utils/dateUtils";

interface ProjectArea {
    id?: string;
    name: string;
    description: string;
    status: 'planned' | 'in-progress' | 'completed' | 'blocked';
    learningFocus: string[];
    technologies: string[];
    startDate?: string;
    endDate?: string;
    estimatedHours?: number;
    assignedMentorId?: string;
    order: number;
}

interface ProjectAreasSectionProps {
    projectId?: string;
    onAreasChange?: (areas: ProjectArea[]) => void;
}

const AREA_STATUS_OPTIONS = [
    { value: 'planned', label: 'Planned', color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' },
    { value: 'in-progress', label: 'In Progress', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' },
    { value: 'completed', label: 'Completed', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' },
    { value: 'blocked', label: 'Blocked', color: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400' }
];

const getStatusColor = (status: string) => {
    const statusOption = AREA_STATUS_OPTIONS.find(option => option.value === status);
    return statusOption?.color || 'bg-slate-100 text-slate-700';
};

export const ProjectAreasSection: React.FC<ProjectAreasSectionProps> = ({
    projectId,
    onAreasChange
}) => {
    const { toast } = useToast();
    const [addProjectArea, { isLoading: isAddingArea }] = useAddProjectAreaMutation();
    const [deleteProjectArea, { isLoading: isDeletingArea }] = useDeleteProjectAreaMutation();
    const [updateProjectArea, { isLoading: isUpdatingArea }] = useUpdateProjectAreaMutation();

    // Fetch existing areas if projectId exists (edit mode)
    const {
        data: areasResponse,
        isLoading: isLoadingAreas,
        error: areasError,
        refetch: refetchAreas
    } = useGetProjectAreasQuery(
        { projectId: projectId! },
        { skip: !projectId }
    );

    const [areas, setAreas] = useState<ProjectArea[]>([]);
    const [isAreaDialogOpen, setIsAreaDialogOpen] = useState(false);
    const [editingArea, setEditingArea] = useState<ProjectArea | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [newArea, setNewArea] = useState<ProjectArea>({
        name: '',
        description: '',
        status: 'planned',
        learningFocus: [],
        technologies: [],
        estimatedHours: 0,
        order: 0
    });
    const [newLearningFocus, setNewLearningFocus] = useState('');
    const [newTechnology, setNewTechnology] = useState('');

    // Update local areas when API data changes (edit mode)
    useEffect(() => {
        if (projectId && areasResponse?.data) {
            const formattedAreas = areasResponse.data.map(area => ({
                id: area.id,
                name: area.name,
                description: area.description,
                status: area.status,
                learningFocus: area.learningFocus || [],
                technologies: area.technologies || [],
                startDate: area.startDate ? (typeof area.startDate === 'string' ? area.startDate : firebaseFormatDate(area.startDate).split('T')[0]) : undefined,
                endDate: area.endDate ? (typeof area.endDate === 'string' ? area.endDate : firebaseFormatDate(area.endDate).split('T')[0]) : undefined,
                estimatedHours: area.estimatedHours,
                assignedMentorId: area.assignedMentorId,
                order: area.order || 0
            }));
            setAreas(formattedAreas);
            onAreasChange?.(formattedAreas);
        }
    }, [areasResponse, projectId, onAreasChange]);

    // Handle API errors
    useEffect(() => {
        if (areasError) {
            toast({
                title: "Error Loading Areas",
                description: "Failed to load project areas. Please try again.",
                variant: "destructive",
            });
        }
    }, [areasError, toast]);

    const handleAddLearningFocus = () => {
        if (newLearningFocus.trim() && !newArea.learningFocus.includes(newLearningFocus.trim())) {
            setNewArea(prev => ({
                ...prev,
                learningFocus: [...prev.learningFocus, newLearningFocus.trim()]
            }));
            setNewLearningFocus('');
        }
    };

    const handleRemoveLearningFocus = (focus: string) => {
        setNewArea(prev => ({
            ...prev,
            learningFocus: prev.learningFocus.filter(f => f !== focus)
        }));
    };

    const handleAddTechnology = () => {
        if (newTechnology.trim() && !newArea.technologies.includes(newTechnology.trim())) {
            setNewArea(prev => ({
                ...prev,
                technologies: [...prev.technologies, newTechnology.trim()]
            }));
            setNewTechnology('');
        }
    };

    const handleRemoveTechnology = (tech: string) => {
        setNewArea(prev => ({
            ...prev,
            technologies: prev.technologies.filter(t => t !== tech)
        }));
    };

    const handleAreaInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewArea(prev => ({ ...prev, [name]: value }));
    };

    const handleAddArea = async () => {
        if (!newArea.name.trim()) {
            toast({
                title: "Missing Fields",
                description: "Please enter an area name.",
                variant: "destructive",
            });
            return;
        }

        const areaToAdd = {
            ...newArea,
            order: areas.length
        };

        if (projectId) {
            // If project exists, add to database
            try {
                await addProjectArea({
                    projectId,
                    name: newArea.name,
                    description: newArea.description,
                    status: newArea.status,
                    learningFocus: newArea.learningFocus,
                    technologies: newArea.technologies,
                    startDate: newArea.startDate,
                    endDate: newArea.endDate,
                    estimatedHours: newArea.estimatedHours,
                    assignedMentorId: newArea.assignedMentorId,
                    order: areaToAdd.order
                }).unwrap();

                toast({
                    title: "Area Added",
                    description: "Project area has been successfully created.",
                });

                // Refetch areas to get the latest data
                refetchAreas();
            } catch (error: any) {
                toast({
                    title: "Error",
                    description: error?.data?.message || "Failed to add area. Please try again.",
                    variant: "destructive",
                });
                return;
            }
        } else {
            // If project doesn't exist yet, add to local state
            const updatedAreas = [...areas, areaToAdd];
            setAreas(updatedAreas);
            onAreasChange?.(updatedAreas);
        }

        // Reset form
        setNewArea({
            name: '',
            description: '',
            status: 'planned',
            learningFocus: [],
            technologies: [],
            estimatedHours: 0,
            order: 0
        });
        setIsAreaDialogOpen(false);
    };

    const handleRemoveArea = async (index: number) => {
        const areaToRemove = areas[index];

        if (projectId && areaToRemove.id) {
            // If project exists and area has ID, delete from database
            try {
                await deleteProjectArea({
                    projectId,
                    areaId: areaToRemove.id
                }).unwrap();

                toast({
                    title: "Area Deleted",
                    description: "Project area has been successfully removed.",
                });

                // Refetch areas to get the latest data
                refetchAreas();
            } catch (error: any) {
                toast({
                    title: "Error",
                    description: error?.data?.message || "Failed to delete area. Please try again.",
                    variant: "destructive",
                });
                return;
            }
        } else {
            // If project doesn't exist yet, remove from local state
            const updatedAreas = areas.filter((_, i) => i !== index);
            setAreas(updatedAreas);
            onAreasChange?.(updatedAreas);
        }
    };

    const resetAreaForm = () => {
        setNewArea({
            name: '',
            description: '',
            status: 'planned',
            learningFocus: [],
            technologies: [],
            estimatedHours: 0,
            order: 0
        });
        setNewLearningFocus('');
        setNewTechnology('');
        setEditingArea(null);
    };

    const handleEditArea = (area: ProjectArea) => {
        setEditingArea(area);
        setNewArea(area);
        setIsEditDialogOpen(true);
    };

    const handleUpdateArea = async () => {
        if (!editingArea || !editingArea.id || !newArea.name.trim()) {
            toast({
                title: "Missing Fields",
                description: "Please enter an area name.",
                variant: "destructive",
            });
            return;
        }

        try {
            await updateProjectArea({
                projectId: projectId!,
                areaId: editingArea.id,
                name: newArea.name,
                description: newArea.description,
                status: newArea.status,
                learningFocus: newArea.learningFocus,
                technologies: newArea.technologies,
                startDate: newArea.startDate,
                endDate: newArea.endDate,
                estimatedHours: newArea.estimatedHours,
                assignedMentorId: newArea.assignedMentorId
            }).unwrap();

            toast({
                title: "Area Updated",
                description: "Project area has been successfully updated.",
            });

            refetchAreas();
            setIsEditDialogOpen(false);
            setEditingArea(null);
        } catch (error: any) {
            toast({
                title: "Error",
                description: error?.data?.message || "Failed to update area. Please try again.",
                variant: "destructive",
            });
        }
    };

    // Show loading state when fetching areas in edit mode
    if (projectId && isLoadingAreas) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                id="areas-section"
            >
                <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                                <Layers className="h-4 w-4" />
                            </div>
                            Project Areas
                        </CardTitle>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Organize your project into logical areas of work
                        </p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
                            <span className="ml-3 text-slate-600 dark:text-slate-400">Loading project areas...</span>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            id="areas-section"
        >
            <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                            <Layers className="h-4 w-4" />
                        </div>
                        Project Areas
                    </CardTitle>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Organize your project into logical areas of work
                    </p>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Add Area Button */}
                    <div className="flex justify-between items-center">
                        <div>
                            <h4 className="text-sm font-medium text-slate-900 dark:text-white">
                                Project Areas ({areas.length})
                            </h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Break down your project into manageable sections
                            </p>
                        </div>
                        <Dialog open={isAreaDialogOpen || isEditDialogOpen} onOpenChange={(open) => {
                            setIsAreaDialogOpen(open);
                            setIsEditDialogOpen(open);
                            if (!open) {
                                setEditingArea(null);
                            }
                        }}>
                            <DialogTrigger asChild>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="text-purple-600 border-purple-200 hover:bg-purple-50 dark:text-purple-400 dark:border-purple-800 dark:hover:bg-purple-900/20"
                                    onClick={() => {
                                        resetAreaForm();
                                        setIsAreaDialogOpen(true);
                                    }}
                                >
                                    <Plus className="h-4 w-4 mr-1" />
                                    Add Area
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg">
                                <DialogHeader>
                                    <DialogTitle>{editingArea ? 'Edit Project Area' : 'Add Project Area'}</DialogTitle>
                                    <DialogDescription>
                                        Define a new area of work for your project (e.g., Frontend, Backend, DevOps)
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-6 py-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="area-name">Area Name <span className="text-red-500">*</span></Label>
                                            <Input
                                                id="area-name"
                                                name="name"
                                                value={newArea.name}
                                                onChange={handleAreaInputChange}
                                                placeholder="e.g., Frontend Development, API Integration"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="area-status">Status</Label>
                                            <Select value={newArea.status} onValueChange={(value) => setNewArea(prev => ({ ...prev, status: value as any }))}>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {AREA_STATUS_OPTIONS.map((status) => (
                                                        <SelectItem key={status.value} value={status.value}>
                                                            <div className="flex items-center gap-2">
                                                                <div className={cn("w-2 h-2 rounded-full", status.color.split(' ')[0])}></div>
                                                                {status.label}
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="area-description">Description</Label>
                                        <Textarea
                                            id="area-description"
                                            name="description"
                                            value={newArea.description}
                                            onChange={handleAreaInputChange}
                                            placeholder="Describe what this area covers and its main objectives..."
                                            rows={3}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="area-start-date">Start Date</Label>
                                            <Input
                                                id="area-start-date"
                                                name="startDate"
                                                type="date"
                                                value={newArea.startDate || ''}
                                                onChange={handleAreaInputChange}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="area-end-date">End Date</Label>
                                            <Input
                                                id="area-end-date"
                                                name="endDate"
                                                type="date"
                                                value={newArea.endDate || ''}
                                                onChange={handleAreaInputChange}
                                                min={newArea.startDate}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="estimated-hours">Estimated Hours</Label>
                                        <Input
                                            id="estimated-hours"
                                            name="estimatedHours"
                                            type="number"
                                            min="0"
                                            value={newArea.estimatedHours || ''}
                                            onChange={handleAreaInputChange}
                                            placeholder="0"
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <Label>Learning Focus</Label>
                                        <div className="flex gap-2">
                                            <Input
                                                placeholder="e.g., React Hooks, API Design"
                                                value={newLearningFocus}
                                                onChange={(e) => setNewLearningFocus(e.target.value)}
                                                onKeyPress={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        handleAddLearningFocus();
                                                    }
                                                }}
                                                className="flex-1"
                                            />
                                            <Button
                                                type="button"
                                                onClick={handleAddLearningFocus}
                                                variant="secondary"
                                                size="sm"
                                            >
                                                Add
                                            </Button>
                                        </div>
                                        <div className="flex flex-wrap gap-1">
                                            {newArea.learningFocus.map((focus, index) => (
                                                <Badge key={index} variant="secondary" className="bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400">
                                                    <Target className="h-3 w-3 mr-1" />
                                                    {focus}
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-3 w-3 ml-1 hover:bg-red-100"
                                                        onClick={() => handleRemoveLearningFocus(focus)}
                                                    >
                                                        <X className="h-2 w-2" />
                                                    </Button>
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <Label>Technologies</Label>
                                        <div className="flex gap-2">
                                            <Input
                                                placeholder="e.g., React, Node.js, PostgreSQL"
                                                value={newTechnology}
                                                onChange={(e) => setNewTechnology(e.target.value)}
                                                onKeyPress={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        handleAddTechnology();
                                                    }
                                                }}
                                                className="flex-1"
                                            />
                                            <Button
                                                type="button"
                                                onClick={handleAddTechnology}
                                                variant="secondary"
                                                size="sm"
                                            >
                                                Add
                                            </Button>
                                        </div>
                                        <div className="flex flex-wrap gap-1">
                                            {newArea.technologies.map((tech, index) => (
                                                <Badge key={index} variant="secondary" className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                                                    {tech}
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-3 w-3 ml-1 hover:bg-red-100"
                                                        onClick={() => handleRemoveTechnology(tech)}
                                                    >
                                                        <X className="h-2 w-2" />
                                                    </Button>
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => {
                                        setIsAreaDialogOpen(false);
                                        setIsEditDialogOpen(false);
                                        setEditingArea(null);
                                    }}>
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={editingArea ? handleUpdateArea : handleAddArea}
                                        disabled={!newArea.name.trim() || isAddingArea || isUpdatingArea}
                                    >
                                        {isAddingArea || isUpdatingArea ? (
                                            <>
                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                {editingArea ? 'Updating...' : 'Adding...'}
                                            </>
                                        ) : (
                                            editingArea ? 'Update Area' : 'Add Area'
                                        )}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>

                    {/* Areas List */}
                    <div className="space-y-3">
                        {areas.length === 0 ? (
                            <div className="text-center py-8 bg-slate-50 dark:bg-slate-800/50 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600">
                                <Layers className="h-12 w-12 mx-auto mb-4 text-slate-400" />
                                <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-2">
                                    No Areas Added Yet
                                </h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 max-w-sm mx-auto">
                                    Break your project into logical areas like Frontend, Backend, Testing, etc. This helps organize work and assign responsibilities.
                                </p>
                                {!projectId && (
                                    <div className="flex items-center justify-center gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg mx-4">
                                        <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                                        <p className="text-xs text-amber-700 dark:text-amber-300">
                                            You can add areas now or after creating the project
                                        </p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            areas.map((area, index) => (
                                <motion.div
                                    key={area.id || index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <GripVertical className="h-4 w-4 text-slate-400 cursor-move" />
                                                <h4 className="font-medium text-slate-900 dark:text-white">
                                                    {area.name}
                                                </h4>
                                                <Badge className={cn("text-xs", getStatusColor(area.status))}>
                                                    {AREA_STATUS_OPTIONS.find(s => s.value === area.status)?.label}
                                                </Badge>
                                                <span className="text-xs text-slate-500">#{index + 1}</span>
                                            </div>
                                            {area.description && (
                                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                                                    {area.description}
                                                </p>
                                            )}
                                            <div className="flex flex-wrap gap-4 text-xs text-slate-500 dark:text-slate-400">
                                                {area.estimatedHours && area.estimatedHours > 0 && (
                                                    <span className="flex items-center gap-1">
                                                        <Settings className="h-3 w-3" />
                                                        {area.estimatedHours}h estimated
                                                    </span>
                                                )}
                                                {(area.startDate || area.endDate) && (
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="h-3 w-3" />
                                                        {area.startDate && new Date(area.startDate).toLocaleDateString()}
                                                        {area.startDate && area.endDate && ' - '}
                                                        {area.endDate && new Date(area.endDate).toLocaleDateString()}
                                                    </span>
                                                )}
                                            </div>
                                            {(area.learningFocus.length > 0 || area.technologies.length > 0) && (
                                                <div className="mt-3 space-y-2">
                                                    {area.learningFocus.length > 0 && (
                                                        <div className="flex flex-wrap gap-1">
                                                            {area.learningFocus.map((focus, i) => (
                                                                <Badge key={i} variant="outline" className="text-xs">
                                                                    <Target className="h-2 w-2 mr-1" />
                                                                    {focus}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    )}
                                                    {area.technologies.length > 0 && (
                                                        <div className="flex flex-wrap gap-1">
                                                            {area.technologies.map((tech, i) => (
                                                                <Badge key={i} variant="secondary" className="text-xs">
                                                                    {tech}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex gap-1">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                                onClick={() => handleEditArea(area)}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                onClick={() => handleRemoveArea(index)}
                                                disabled={isDeletingArea}
                                            >
                                                {isDeletingArea ? (
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                ) : (
                                                    <X className="h-4 w-4" />
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>

                    {/* Areas Summary */}
                    {areas.length > 0 && (
                        <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                            <h4 className="text-sm font-medium text-purple-900 dark:text-purple-100 mb-2">
                                📋 Areas Summary
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                                <div>
                                    <span className="text-purple-600 dark:text-purple-400 font-medium">Total Areas:</span>
                                    <span className="ml-1 text-purple-800 dark:text-purple-200">{areas.length}</span>
                                </div>
                                <div>
                                    <span className="text-purple-600 dark:text-purple-400 font-medium">Planned:</span>
                                    <span className="ml-1 text-purple-800 dark:text-purple-200">
                                        {areas.filter(a => a.status === 'planned').length}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-purple-600 dark:text-purple-400 font-medium">Est. Hours:</span>
                                    <span className="ml-1 text-purple-800 dark:text-purple-200">
                                        {areas.reduce((total, area) => total + (area.estimatedHours || 0), 0)}h
                                    </span>
                                </div>
                                <div>
                                    <span className="text-purple-600 dark:text-purple-400 font-medium">Technologies:</span>
                                    <span className="ml-1 text-purple-800 dark:text-purple-200">
                                        {new Set(areas.flatMap(a => a.technologies)).size}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
};