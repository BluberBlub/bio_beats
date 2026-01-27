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
}

export function logout() {
    userStore.set(null);
    if (typeof window !== 'undefined') {
        document.cookie = "bio-auth=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
        window.location.href = '/admin/login';
    }
}
