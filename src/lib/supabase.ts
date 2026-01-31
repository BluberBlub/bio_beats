import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL || import.meta.env.SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || import.meta.env.SUPABASE_ANON_KEY;

// Warn if keys are missing (or use a mock/fallback logic here if desired)
if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase keys are missing in environment variables.');
}

export const supabase = createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder'
);

// Types for our Database
// Types for our Database
export type UserRole = 'admin' | 'artist' | 'booker' | 'label' | 'provider' | 'guest' | 'performer' | 'creative' | 'manager';

// Artist & Performer & Creative (Shared traits)
export interface ArtistProfile {
    alias?: string;
    type: 'dj' | 'live' | 'hybrid' | 'performer' | 'visual' | 'designer';
    location: string;
    bio: string;
    genres: string[]; // or Skills for creatives
    bpm_range?: { min: number; max: number }; // Artist/DJ only
    socials: {
        instagram?: string;
        soundcloud?: string;
        spotify?: string;
        website?: string;
        behance?: string; // Creative specific
        bandcamp?: string;
    };
    tech_rider_url?: string;
}

// Booker (Promoter, Club, Festival)
export interface BookerProfile {
    organization: string;
    type: 'festival' | 'club' | 'agency' | 'promoter';
    location: string;
    capacity?: number;
    website?: string;
    genres_interest?: string[];
}

// Label & Manager & Provider
export interface IndustryProfile {
    organization: string; // Label Name or Agency Name
    website?: string;
    contact_email?: string;
    demo_drop_url?: string; // Label specific
}

// Guest / Fan
export interface GuestProfile {
    preferred_genres?: string[];
}

export interface UserProfile {
    id: string; // matches auth.users.id
    email: string;
    role: UserRole;
    full_name: string;
    is_verified: boolean;
    created_at: string;
    avatar_url?: string;
    theme?: 'light' | 'dark'; // User preference for UI theme

    // General user data (available for all roles)
    socials?: {
        instagram?: string;
        twitter?: string; // X
        linkedin?: string;
        website?: string;
    };
    favorite_artists?: string[]; // Array of artist slugs/IDs

    // Optional sub-profiles based on role
    artist_profile?: ArtistProfile;  // For: artist, performer, creative
    booker_profile?: BookerProfile;  // For: booker
    industry_profile?: IndustryProfile; // For: label, manager, provider
    guest_profile?: GuestProfile;    // For: guest
}
