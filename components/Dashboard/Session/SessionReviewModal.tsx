import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, X, Plus, Minus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface SessionReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (reviewData: {
        rating: number;
        comment: string;
        strengths?: string[];
        improvements?: string[];
    }) => void;
    sessionId: string;
}

const SessionReviewModal: React.FC<SessionReviewModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    sessionId
}) => {
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [comment, setComment] = useState('');
    const [strengths, setStrengths] = useState<string[]>([]);
    const [improvements, setImprovements] = useState<string[]>([]);
    const [newStrength, setNewStrength] = useState('');
    const [newImprovement, setNewImprovement] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0 || !comment.trim()) return;

        setIsSubmitting(true);
        try {
            await onSubmit({
                rating,
                comment: comment.trim(),
                strengths: strengths.length > 0 ? strengths : undefined,
                improvements: improvements.length > 0 ? improvements : undefined,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const addStrength = () => {
        if (newStrength.trim() && !strengths.includes(newStrength.trim())) {
            setStrengths([...strengths, newStrength.trim()]);
            setNewStrength('');
        }
    };

    const removeStrength = (index: number) => {
        setStrengths(strengths.filter((_, i) => i !== index));
    };

    const addImprovement = () => {
        if (newImprovement.trim() && !improvements.includes(newImprovement.trim())) {
            setImprovements([...improvements, newImprovement.trim()]);
            setNewImprovement('');
        }
    };

    const removeImprovement = (index: number) => {
        setImprovements(improvements.filter((_, i) => i !== index));
    };

    const handleClose = () => {
        if (!isSubmitting) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={handleClose}
                    className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                />

                {/* Modal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ duration: 0.3 }}
                    className="relative w-full max-w-2xl mx-4 max-h-[90vh] overflow-auto rounded-xl"
                >
                    <Card className="border-0 bg-white dark:bg-slate-900 shadow-2xl">
                        {/* Header */}
                        <CardHeader className="pb-4 border-b border-slate-200 dark:border-slate-700">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">
                                    Rate Your Session Experience
                                </CardTitle>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleClose}
                                    disabled={isSubmitting}
                                    className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                                >
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                Help improve the mentoring experience by sharing your feedback
                            </p>
                        </CardHeader>

                        <CardContent className="p-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Rating */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                                        Overall Rating *
                                    </label>
                                    <div className="flex items-center space-x-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <motion.button
                                                key={star}
                                                type="button"
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onMouseEnter={() => setHoveredRating(star)}
                                                onMouseLeave={() => setHoveredRating(0)}
                                                onClick={() => setRating(star)}
                                                className="focus:outline-none focus:ring-2 focus:ring-amber-500 rounded-full p-1"
                                            >
                                                <Star
                                                    className={`h-8 w-8 transition-colors ${star <= (hoveredRating || rating)
                                                            ? 'text-amber-400 fill-amber-400'
                                                            : 'text-slate-300 dark:text-slate-600'
                                                        }`}
                                                />
                                            </motion.button>
                                        ))}
                                        {rating > 0 && (
                                            <span className="ml-2 text-sm text-slate-600 dark:text-slate-400">
                                                {rating === 1 && 'Poor'}
                                                {rating === 2 && 'Fair'}
                                                {rating === 3 && 'Good'}
                                                {rating === 4 && 'Very Good'}
                                                {rating === 5 && 'Excellent'}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Comment */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        Your Review *
                                    </label>
                                    <Textarea
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        placeholder="Share your experience with this session. What did you learn? How was the mentoring quality?"
                                        rows={4}
                                        required
                                        className="resize-none"
                                        disabled={isSubmitting}
                                    />
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                        {comment.length}/500 characters
                                    </p>
                                </div>

                                {/* Strengths */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        What were the session's strengths?
                                    </label>
                                    <div className="flex space-x-2 mb-2">
                                        <Input
                                            value={newStrength}
                                            onChange={(e) => setNewStrength(e.target.value)}
                                            placeholder="e.g., Clear explanations, Good examples"
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    addStrength();
                                                }
                                            }}
                                            disabled={isSubmitting}
                                        />
                                        <Button
                                            type="button"
                                            onClick={addStrength}
                                            size="sm"
                                            variant="outline"
                                            disabled={!newStrength.trim() || isSubmitting}
                                        >
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    {strengths.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {strengths.map((strength, index) => (
                                                <Badge
                                                    key={index}
                                                    variant="secondary"
                                                    className="bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 pr-1"
                                                >
                                                    {strength}
                                                    <button
                                                        type="button"
                                                        onClick={() => removeStrength(index)}
                                                        className="ml-1 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-200"
                                                        disabled={isSubmitting}
                                                    >
                                                        <Minus className="h-3 w-3" />
                                                    </button>
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Areas for Improvement */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        Areas for improvement (optional)
                                    </label>
                                    <div className="flex space-x-2 mb-2">
                                        <Input
                                            value={newImprovement}
                                            onChange={(e) => setNewImprovement(e.target.value)}
                                            placeholder="e.g., More hands-on practice, Better time management"
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    addImprovement();
                                                }
                                            }}
                                            disabled={isSubmitting}
                                        />
                                        <Button
                                            type="button"
                                            onClick={addImprovement}
                                            size="sm"
                                            variant="outline"
                                            disabled={!newImprovement.trim() || isSubmitting}
                                        >
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    {improvements.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {improvements.map((improvement, index) => (
                                                <Badge
                                                    key={index}
                                                    variant="secondary"
                                                    className="bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 pr-1"
                                                >
                                                    {improvement}
                                                    <button
                                                        type="button"
                                                        onClick={() => removeImprovement(index)}
                                                        className="ml-1 text-amber-600 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-200"
                                                        disabled={isSubmitting}
                                                    >
                                                        <Minus className="h-3 w-3" />
                                                    </button>
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleClose}
                                        disabled={isSubmitting}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={rating === 0 || !comment.trim() || isSubmitting}
                                        className="bg-amber-600 hover:bg-amber-700 text-white"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <motion.div
                                                    animate={{ rotate: 360 }}
                                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                                                />
                                                Submitting...
                                            </>
                                        ) : (
                                            <>
                                                <Star className="h-4 w-4 mr-2" />
                                                Submit Review
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default SessionReviewModal;