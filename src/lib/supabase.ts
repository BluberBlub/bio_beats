import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.SUPABASE_URL;
const supabaseAnonKey = import.meta.env.SUPABASE_ANON_KEY;

// Warn if keys are missing (or use a mock/fallback logic here if desired)
if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase keys are missing in environment variables.');
}

export const supabase = createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder'
);

// Types for our Database
export type UserRole = 'admin' | 'artist' | 'booker' | 'label' | 'provider' | 'guest';

export interface UserProfile {
    id: string; // matches auth.users.id
    email: string;
    role: UserRole;
    full_name: string;
    is_verified: boolean;
    created_at: string;
    avatar_url?: string;
}
