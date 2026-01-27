// Core types for BIO BEATS platform

export type UserRole =
  | 'artist'
  | 'performer'
  | 'creative'
  | 'manager'
  | 'label'
  | 'booker'
  | 'provider'
  | 'guest';

export interface RoleOption {
  id: UserRole;
  label: string;
  description: string;
  icon: string;
}

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
  isButton?: boolean;
}

export interface Artist {
  id: string;
  slug: string;
  name: string;
  alias?: string;
  genres: string[];
  bpmRange: { min: number; max: number };
  type: 'dj' | 'live' | 'hybrid';
  location: string;
  bio: string;
  shortBio: string;
  image: string;
  coverImage?: string;
  socials: {
    instagram?: string;
    soundcloud?: string;
    spotify?: string;
    bandcamp?: string;
    website?: string;
  };
  availability: 'available' | 'limited' | 'unavailable';
  isVerified: boolean;
  isFeatured?: boolean;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'general' | 'artists' | 'bookers' | 'pricing' | 'platform';
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  tier: 'free' | 'premium' | 'enterprise';
  features: string[];
}

export interface Event {
  id: string;
  name: string;
  date: string;
  venue: string;
  location: string;
  artists: string[];
  type: 'club' | 'festival' | 'private';
  image?: string;
}

export interface Booker {
  id: string;
  name: string;
  organization: string;
  type: 'festival' | 'club' | 'agency' | 'promoter';
  location: string;
  isVerified: boolean;
}
