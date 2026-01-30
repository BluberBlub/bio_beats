/**
 * React hook for accessing translations in components
 * Provides type-safe access to all translation strings
 */
import { useMemo } from 'react';
import { languages, defaultLang, type Lang } from './index';

export type TranslationKeys = typeof languages.en;

/**
 * Hook to get translations for a given language
 * @param lang - The language code ('en' or 'de')
 * @returns Translation object with all strings
 */
export function useTranslation(lang: Lang = defaultLang) {
    return useMemo(() => {
        const translations = languages[lang] ?? languages[defaultLang];
        return {
            t: translations,
            lang,
            isDefault: lang === defaultLang
        };
    }, [lang]);
}

/**
 * Get a specific translation string with fallback
 * @param lang - The language code
 * @param key - Dot-notation key like 'nav.artists' or 'profile.tabs.security'
 * @returns The translated string or key if not found
 */
export function t(lang: Lang, key: string): string {
    const translations = languages[lang] ?? languages[defaultLang];
    const keys = key.split('.');

    let result: any = translations;
    for (const k of keys) {
        if (result && typeof result === 'object' && k in result) {
            result = result[k];
        } else {
            // Fallback to English
            result = languages[defaultLang];
            for (const fallbackKey of keys) {
                if (result && typeof result === 'object' && fallbackKey in result) {
                    result = result[fallbackKey];
                } else {
                    return key; // Return key if not found
                }
            }
            break;
        }
    }

    return typeof result === 'string' ? result : key;
}

/**
 * Helper to detect language from component props or default
 */
export function getLang(lang?: string): Lang {
    if (lang === 'de') return 'de';
    return 'en';
}
