import { en, type Translations } from './en';
import { de } from './de';

export type { Translations };

export const languages = {
    en,
    de,
} as const;

export const defaultLang = 'en';
export type Lang = keyof typeof languages;

// Get language from URL path
export function getLangFromUrl(url: URL): Lang {
    const [, lang] = url.pathname.split('/');
    if (lang in languages) {
        return lang as Lang;
    }
    return defaultLang;
}

// Get translations for a language
export function getTranslations(lang: Lang) {
    return languages[lang] ?? languages[defaultLang];
}

// Get localized path
export function getLocalizedPath(path: string, lang: Lang): string {
    // Remove leading slash for processing
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;

    // Check if path already has a language prefix
    const [firstSegment, ...rest] = cleanPath.split('/');

    if (firstSegment in languages) {
        // Replace existing language
        if (lang === defaultLang) {
            return '/' + rest.join('/') || '/';
        }
        return '/' + lang + '/' + rest.join('/');
    }

    // Add language prefix (or not for default)
    if (lang === defaultLang) {
        return '/' + cleanPath || '/';
    }
    return '/' + lang + (cleanPath ? '/' + cleanPath : '');
}

// Get alternate language paths for hreflang
export function getAlternatePaths(currentPath: string): { lang: Lang; href: string }[] {
    return (Object.keys(languages) as Lang[]).map((lang) => ({
        lang,
        href: getLocalizedPath(currentPath, lang),
    }));
}

// Utility function to use in components
export function useTranslations(lang: Lang) {
    return getTranslations(lang);
}
