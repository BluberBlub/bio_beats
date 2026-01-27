import { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown } from 'lucide-react';

interface LanguageSwitcherProps {
    currentLang: string;
    currentPath: string;
}

const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
];

export default function LanguageSwitcher({ currentLang, currentPath }: LanguageSwitcherProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const currentLanguage = languages.find(l => l.code === currentLang) || languages[0];

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Generate localized path
    function getLocalizedPath(targetLang: string): string {
        // Remove leading slash
        let path = currentPath.startsWith('/') ? currentPath.slice(1) : currentPath;

        // Check if path starts with a language code
        const parts = path.split('/');
        const firstPart = parts[0];

        if (firstPart === 'en' || firstPart === 'de') {
            parts.shift(); // Remove existing language prefix
        }

        const cleanPath = parts.join('/');

        // Default lang (en) doesn't need prefix
        if (targetLang === 'en') {
            return '/' + cleanPath || '/';
        }

        return '/' + targetLang + (cleanPath ? '/' + cleanPath : '');
    }

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                aria-label="Select language"
                aria-expanded={isOpen}
            >
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline">{currentLanguage.flag} {currentLanguage.code.toUpperCase()}</span>
                <span className="sm:hidden">{currentLanguage.flag}</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-40 py-2 bg-[#1a1a1a] border border-[#333] rounded-lg shadow-xl z-50">
                    {languages.map((lang) => (
                        <a
                            key={lang.code}
                            href={getLocalizedPath(lang.code)}
                            className={`flex items-center gap-3 px-4 py-2 text-sm transition-colors ${lang.code === currentLang
                                    ? 'text-[#ff0700] bg-[#ff0700]/10'
                                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                                }`}
                            onClick={() => setIsOpen(false)}
                        >
                            <span>{lang.flag}</span>
                            <span>{lang.name}</span>
                            {lang.code === currentLang && (
                                <span className="ml-auto text-xs">✓</span>
                            )}
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
}
