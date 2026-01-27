import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Music, Sparkles, Palette, Briefcase, Disc3,
    Calendar, Settings, Heart, ArrowRight, X
} from 'lucide-react';
import type { UserRole } from '../../types/types';
import { roleOptions } from '../../data/navigation';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    Music,
    Sparkles,
    Palette,
    Briefcase,
    Disc3,
    Calendar,
    Settings,
    Heart,
};

interface OnboardingModalProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export default function OnboardingModal({ isOpen = false, onClose }: OnboardingModalProps) {
    const [showModal, setShowModal] = useState(isOpen);
    const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
    const [step, setStep] = useState(1);

    const handleClose = () => {
        setShowModal(false);
        onClose?.();
    };

    const handleRoleSelect = (role: UserRole) => {
        setSelectedRole(role);
        setStep(2);
    };

    const handleBack = () => {
        setStep(1);
        setSelectedRole(null);
    };

    if (!showModal) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-bio-black/95 backdrop-blur-lg"
            >
                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute top-6 right-6 p-2 text-bio-gray-400 hover:text-bio-white transition-colors"
                    aria-label="Close"
                >
                    <X className="w-6 h-6" />
                </button>

                <div className="w-full max-w-4xl mx-auto px-6">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                className="text-center"
                            >
                                {/* Header */}
                                <h1 className="text-4xl md:text-5xl font-bold text-bio-white mb-4">
                                    Who are you?
                                </h1>
                                <p className="text-xl text-bio-gray-400 mb-12 max-w-2xl mx-auto">
                                    Select your role to get started with BIO BEATS
                                </p>

                                {/* Role Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {roleOptions.map((role, index) => {
                                        const Icon = iconMap[role.icon];
                                        return (
                                            <motion.button
                                                key={role.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                onClick={() => handleRoleSelect(role.id)}
                                                className="group p-6 bg-bio-gray-900 border border-bio-gray-800 rounded-xl hover:border-bio-accent hover:bg-bio-gray-800/50 transition-all duration-300 text-left"
                                            >
                                                <Icon className="w-8 h-8 text-bio-gray-400 group-hover:text-bio-accent transition-colors mb-4" />
                                                <h3 className="font-semibold text-bio-white mb-2">
                                                    {role.label}
                                                </h3>
                                                <p className="text-sm text-bio-gray-500">
                                                    {role.description}
                                                </p>
                                            </motion.button>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && selectedRole && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                className="max-w-xl mx-auto"
                            >
                                {/* Back Button */}
                                <button
                                    onClick={handleBack}
                                    className="mb-8 text-bio-gray-400 hover:text-bio-white transition-colors flex items-center gap-2"
                                >
                                    <ArrowRight className="w-4 h-4 rotate-180" />
                                    Back
                                </button>

                                {/* Header */}
                                <h2 className="text-3xl font-bold text-bio-white mb-2">
                                    Welcome, {roleOptions.find(r => r.id === selectedRole)?.label}
                                </h2>
                                <p className="text-bio-gray-400 mb-8">
                                    Tell us a bit more about yourself to complete your profile.
                                </p>

                                {/* Form */}
                                <form className="space-y-6">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-bio-gray-300 mb-2">
                                            Name / Alias
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            className="w-full px-4 py-3 bg-bio-gray-900 border border-bio-gray-800 rounded-lg text-bio-white placeholder-bio-gray-500 focus:border-bio-accent focus:ring-1 focus:ring-bio-accent outline-none transition-colors"
                                            placeholder="Enter your name or artist alias"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-bio-gray-300 mb-2">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            className="w-full px-4 py-3 bg-bio-gray-900 border border-bio-gray-800 rounded-lg text-bio-white placeholder-bio-gray-500 focus:border-bio-accent focus:ring-1 focus:ring-bio-accent outline-none transition-colors"
                                            placeholder="your@email.com"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="location" className="block text-sm font-medium text-bio-gray-300 mb-2">
                                            Location
                                        </label>
                                        <input
                                            type="text"
                                            id="location"
                                            className="w-full px-4 py-3 bg-bio-gray-900 border border-bio-gray-800 rounded-lg text-bio-white placeholder-bio-gray-500 focus:border-bio-accent focus:ring-1 focus:ring-bio-accent outline-none transition-colors"
                                            placeholder="City, Country"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn-primary w-full"
                                    >
                                        Create Account
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </button>
                                </form>

                                <p className="mt-6 text-center text-sm text-bio-gray-500">
                                    Already have an account?{' '}
                                    <a href="/login" className="text-bio-accent hover:underline">
                                        Login
                                    </a>
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
