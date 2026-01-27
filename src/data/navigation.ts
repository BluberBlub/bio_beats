import type { NavItem, RoleOption } from '../types/types';

export const mainNavigation: NavItem[] = [
    { label: 'Artists & Labels', href: '/artists' },
    { label: 'For Bookers', href: '/bookers' },
    { label: 'Festivals', href: '/festivals' },
    { label: 'Managers', href: '/managers' },
    { label: 'Services', href: '/services' },
    { label: 'Festival Guide', href: '/guide' },
    { label: 'About', href: '/about' },
];

export const secondaryNavigation: NavItem[] = [
    { label: 'Join', href: '/join', isButton: true },
    { label: 'Login', href: '/login' },
];

export const footerNavigation = {
    platform: [
        { label: 'Producers & Creatives', href: '/creatives' },
        { label: 'Sound of Science', href: '/science' },
    ],
    company: [
        { label: 'Mission', href: '/mission' },
        { label: 'Partners', href: '/partners' },
        { label: 'Contact', href: '/contact' },
    ],
    legal: [
        { label: 'Impressum', href: '/impressum' },
        { label: 'Privacy', href: '/privacy' },
        { label: 'Terms', href: '/terms' },
        { label: 'Cookies', href: '/cookies' },
    ],
};

export const roleOptions: RoleOption[] = [
    {
        id: 'artist',
        label: 'Artist / DJ / Live Act',
        description: 'Perform and get booked at events worldwide',
        icon: 'Music',
    },
    {
        id: 'performer',
        label: 'Performer / Stage Artist',
        description: 'Dance, perform, and bring stages to life',
        icon: 'Sparkles',
    },
    {
        id: 'creative',
        label: 'Creative (Visual, VJ, Designer)',
        description: 'Create visuals, designs, and experiences',
        icon: 'Palette',
    },
    {
        id: 'manager',
        label: 'Manager / Agency',
        description: 'Manage artists and coordinate bookings',
        icon: 'Briefcase',
    },
    {
        id: 'label',
        label: 'Label / Crew / Collective',
        description: 'Release music and build artist rosters',
        icon: 'Disc3',
    },
    {
        id: 'booker',
        label: 'Booker / Organizer / Festival',
        description: 'Book artists and organize events',
        icon: 'Calendar',
    },
    {
        id: 'provider',
        label: 'Services / Experiences',
        description: 'Provide services for the electronic music industry',
        icon: 'Settings',
    },
    {
        id: 'guest',
        label: 'Guest / Fan',
        description: 'Discover artists and events',
        icon: 'Heart',
    },
];
