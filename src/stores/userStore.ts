import { atom } from 'nanostores';
import type { UserProfile } from '../lib/supabase';

export const userStore = atom<UserProfile | null>(null);

// Mock user for development without DB
export const mockAdminUser: UserProfile = {
    id: 'mock-admin-id',
    email: 'admin@biobeats.io',
    role: 'admin',
    full_name: 'Admin User',
    is_verified: true,
    created_at: new Date().toISOString()
};

export function setUser(user: UserProfile | null) {
    userStore.set(user);
    if (typeof window !== 'undefined') {
        if (user) {
            localStorage.setItem('bio-admin-user', JSON.stringify(user));
            localStorage.setItem('bio-admin-auth', 'true');
        } else {
            localStorage.removeItem('bio-admin-user');
            localStorage.removeItem('bio-admin-auth');
        }
    }
}

export function updateUser(updates: Partial<UserProfile>) {
    const currentUser = userStore.get();
    if (currentUser) {
        const newUser = { ...currentUser, ...updates };
        setUser(newUser);
    }
}

export function logout() {
    userStore.set(null);
    if (typeof window !== 'undefined') {
        localStorage.removeItem('bio-admin-user');
        localStorage.removeItem('bio-admin-auth');
        document.cookie = "bio-auth=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
        window.location.href = '/login';
    }
}

// Initialize from localStorage if available
if (typeof window !== 'undefined') {
    const savedUser = localStorage.getItem('bio-admin-user');
    if (savedUser) {
        try {
            const parsedUser = JSON.parse(savedUser);
            userStore.set(parsedUser);

            // Apply theme if saved in user profile
            if (parsedUser.theme) {
                document.documentElement.setAttribute('data-theme', parsedUser.theme);
            }
        } catch (e) {
            console.error('Failed to parse user from localStorage', e);
        }
    }
}

// Subscribe to user store changes to update theme
userStore.subscribe(user => {
    if (typeof window !== 'undefined' && user?.theme) {
        document.documentElement.setAttribute('data-theme', user.theme);
    } else if (typeof window !== 'undefined') {
        // Default to dark if no user or no theme set
        // But check if we want to support non-logged in theme persistence?
        // for now, let's strictly follow "user profile setting"
        // remove attribute if no theme (defaults to dark via CSS)
        if (!user) {
            document.documentElement.removeAttribute('data-theme');
        }
    }
});
