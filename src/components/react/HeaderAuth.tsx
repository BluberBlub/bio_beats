import { useStore } from '@nanostores/react';
import { userStore, logout } from '../../stores/userStore';
import { User, LogOut, ChevronDown, LayoutDashboard } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface Props {
    currentLang: 'en' | 'de';
}

export default function HeaderAuth({ currentLang }: Props) {
    const $user = useStore(userStore);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);

    const toggleDropdown = () => setIsOpen(!isOpen);

    if (!$user) {
        return (
            <>
                <a
                    href={currentLang === "de" ? "/de/login" : "/login"}
                    className="btn-ghost text-sm"
                >
                    {currentLang === "de" ? "Anmelden" : "Login"}
                </a>
                <a
                    href={currentLang === "de" ? "/de/join" : "/join"}
                    className="btn-primary text-sm"
                >
                    {currentLang === "de" ? "Beitreten" : "Join"}
                </a>
            </>
        );
    }

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={toggleDropdown}
                className="flex items-center gap-2 hover:bg-bio-gray-800/50 py-1.5 px-3 rounded-full transition-colors"
            >
                <div className="w-8 h-8 rounded-full bg-bio-accent flex items-center justify-center text-white font-bold text-sm">
                    {$user.full_name?.charAt(0) || 'U'}
                </div>
                <span className="text-sm font-medium text-white hidden md:block">
                    {$user.full_name?.split(' ')[0]}
                </span>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-[#171717] border border-[#262626] rounded-xl shadow-xl py-2 z-[100]">
                    <div className="px-4 py-3 border-b border-[#262626]">
                        <p className="text-sm font-medium text-white break-words">{$user.full_name}</p>
                        <p className="text-xs text-gray-400 truncate">{$user.email}</p>
                    </div>

                    <div className="py-2">
                        {$user.role === 'admin' && (
                            <a
                                href="/admin/dashboard"
                                className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 flex items-center gap-2"
                            >
                                <LayoutDashboard className="w-4 h-4" />
                                Admin Dashboard
                            </a>
                        )}
                        <a
                            href={currentLang === "de" ? "/de/profile" : "/profile"}
                            className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 flex items-center gap-2"
                        >
                            <User className="w-4 h-4" />
                            {currentLang === "de" ? "Mein Profil" : "My Profile"}
                        </a>
                    </div>

                    <div className="border-t border-[#262626] pt-2">
                        <button
                            onClick={() => logout()}
                            className="w-full text-left px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 flex items-center gap-2"
                        >
                            <LogOut className="w-4 h-4" />
                            {currentLang === "de" ? "Abmelden" : "Log out"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
