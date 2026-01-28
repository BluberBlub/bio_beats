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
            userStore.set(JSON.parse(savedUser));
        } catch (e) {
            console.error('Failed to parse user from localStorage', e);
        }
    }
}
