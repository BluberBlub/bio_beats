import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Menu, X, User, LogOut, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@nanostores/react';
import { userStore, logout } from '../../stores/userStore';
import type { NavItem } from '../../types/types';

interface MobileNavProps {
    navigation: NavItem[];
}

export default function MobileNav({ navigation }: MobileNavProps) {
    const $user = useStore(userStore);
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Menu Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden p-2 text-bio-gray-300 hover:text-bio-white transition-colors"
                aria-label={isOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isOpen}
            >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Mobile Menu Overlay */}
            {isOpen && createPortal(
                <AnimatePresence mode="wait">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed top-0 left-0 w-full h-[100dvh] bg-[#0a0a0a]/95 backdrop-blur-md z-[9998] lg:hidden"
                        onClick={() => setIsOpen(false)}
                    >
                        {/* Menu Panel */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 h-[100dvh] w-80 max-w-[80vw] bg-bio-gray-900 border-l border-bio-gray-800 z-[9999] lg:hidden overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex flex-col min-h-full">
                                {/* Header */}
                                <div className="flex items-center justify-between p-6 border-b border-bio-gray-800 shrink-0">
                                    <span className="text-xl font-bold text-bio-white">Menu</span>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="p-2 text-bio-gray-400 hover:text-bio-white transition-colors"
                                        aria-label="Close menu"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Navigation Links */}
                                <nav className="flex-1 p-6">
                                    <ul className="space-y-2">
                                        {navigation.map((item, index) => (
                                            <motion.li
                                                key={item.href}
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                            >
                                                <a
                                                    href={item.href}
                                                    onClick={() => setIsOpen(false)}
                                                    className="block py-3 px-4 text-bio-gray-300 hover:text-bio-white hover:bg-bio-gray-800/50 rounded-lg transition-colors"
                                                >
                                                    {item.label}
                                                </a>
                                            </motion.li>
                                        ))}
                                    </ul>
                                </nav>

                                {/* Action Buttons */}
                                <div className="p-6 border-t border-bio-gray-800 space-y-3 shrink-0">
                                    {$user ? (
                                        <>
                                            <div className="flex items-center gap-3 px-2 py-2 mb-4">
                                                <div className="w-10 h-10 rounded-full bg-bio-accent flex items-center justify-center text-white font-bold overflow-hidden border border-red-500">
                                                    {$user.avatar_url ? (
                                                        <img
                                                            src={$user.avatar_url}
                                                            alt={$user.full_name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        $user.full_name?.charAt(0) || 'U'
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-white font-medium">{$user.full_name}</p>
                                                    <p className="text-sm text-gray-400 truncate max-w-[180px]">{$user.email}</p>
                                                </div>
                                            </div>

                                            {/* Admin Dashboard Link if admin */}
                                            {$user.role === 'admin' && (
                                                <a
                                                    href="/admin/dashboard"
                                                    onClick={() => setIsOpen(false)}
                                                    className="flex items-center gap-2 w-full px-4 py-3 bg-bio-gray-800 text-white rounded-lg hover:bg-bio-gray-700 transition-colors"
                                                >
                                                    <LayoutDashboard className="w-5 h-5" />
                                                    Admin Dashboard
                                                </a>
                                            )}

                                            <a
                                                href="/profile"
                                                onClick={() => setIsOpen(false)}
                                                className="btn-secondary w-full text-center flex items-center justify-center gap-2"
                                            >
                                                <User className="w-4 h-4" />
                                                My Profile
                                            </a>
                                            <button
                                                onClick={() => {
                                                    logout();
                                                    setIsOpen(false);
                                                }}
                                                className="btn-ghost w-full text-center text-red-500 hover:text-red-400 hover:bg-red-500/10 flex items-center justify-center gap-2"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                Logout
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <a
                                                href="/join"
                                                onClick={() => setIsOpen(false)}
                                                className="btn-primary w-full text-center"
                                            >
                                                Join BIO BEATS
                                            </a>
                                            <a
                                                href="/login"
                                                onClick={() => setIsOpen(false)}
                                                className="btn-secondary w-full text-center"
                                            >
                                                Login
                                            </a>
                                        </>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </AnimatePresence>,
                document.body
            )}
        </>
    );
}
