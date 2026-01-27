import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { NavItem } from '../../types/types';

interface MobileNavProps {
    navigation: NavItem[];
}

export default function MobileNav({ navigation }: MobileNavProps) {
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
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 bg-bio-black/90 backdrop-blur-sm z-40 lg:hidden"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Menu Panel */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 bottom-0 w-80 max-w-[80vw] bg-bio-gray-900 border-l border-bio-gray-800 z-50 lg:hidden"
                        >
                            <div className="flex flex-col h-full">
                                {/* Header */}
                                <div className="flex items-center justify-between p-6 border-b border-bio-gray-800">
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
                                <nav className="flex-1 overflow-y-auto p-6">
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
                                <div className="p-6 border-t border-bio-gray-800 space-y-3">
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
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
