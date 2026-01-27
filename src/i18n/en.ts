// English translations
export const en = {
    // Meta
    lang: 'en',
    langName: 'English',

    // Navigation
    nav: {
        artists: 'Artists',
        forBookers: 'For Bookers',
        forManagers: 'For Managers',
        festivalGuide: 'Festival Guide',
        services: 'Services',
        about: 'About',
        mission: 'Mission',
        partners: 'Partners',
        faq: 'FAQ',
        contact: 'Contact',
        login: 'Login',
        join: 'Join BIO BEATS',
    },

    // Home Page
    home: {
        heroTitle: 'The management platform for electronic culture.',
        heroSubtitle: 'BIO BEATS connects artists, labels, bookers, and festivals – creating structure, reducing chaos, enabling sustainable careers.',
        ctaPrimary: 'Join BIO BEATS',
        ctaSecondary: 'Learn More',
        featuredArtists: 'Featured Artists',
        viewAll: 'View All',
        seeProfile: 'See Profile',
    },

    // Common
    common: {
        backTo: 'Back to',
        learnMore: 'Learn More',
        getStarted: 'Get Started',
        contactUs: 'Contact Us',
        viewAll: 'View All',
        verified: 'Verified',
        location: 'Location',
        date: 'Date',
        capacity: 'Capacity',
        genre: 'Genre',
        genres: 'Genres',
        bpm: 'BPM',
        highlights: 'Highlights',
        stages: 'Stages',
    },

    // Artists
    artists: {
        title: 'Artists Directory',
        subtitle: 'Discover verified electronic music artists available for booking',
        searchPlaceholder: 'Search artists...',
        filterGenre: 'Filter by genre',
        allGenres: 'All Genres',
        bookNow: 'Book Now',
        viewProfile: 'View Profile',
    },

    // Festivals
    festivals: {
        title: 'Festival Guide',
        subtitle: 'Electronic music festivals featuring BIO BEATS artists',
        aboutFestival: 'About the Festival',
        artistsAt: 'BIO BEATS Artists at',
        noArtists: 'No BIO BEATS artists confirmed yet.',
        festivalInfo: 'Festival Info',
        bookArtists: 'Book Artists for This Festival',
        officialWebsite: 'Official Website',
    },

    // Contact
    contact: {
        title: 'Contact Us',
        subtitle: "Have a question or want to partner with us? We'd love to hear from you.",
        getInTouch: 'Get in Touch',
        name: 'Name',
        email: 'Email',
        subject: 'Subject',
        message: 'Message',
        selectTopic: 'Select a topic',
        generalInquiry: 'General Inquiry',
        partnership: 'Partnership',
        support: 'Support',
        press: 'Press',
        other: 'Other',
        send: 'Send Message',
        yourName: 'Your name',
        yourEmail: 'your@email.com',
        yourMessage: 'Your message...',
    },

    // About
    about: {
        title: "We're building the infrastructure electronic music deserves.",
        subtitle: 'BIO BEATS is more than a booking platform. It\'s a professional ecosystem designed to reduce chaos, create clarity, and enable sustainable careers in electronic music.',
        missionTitle: 'Our Mission',
        missionSubtitle: 'Less chaos. More focus. More bookings.',
        values: 'Our Values',
        valuesSubtitle: 'The principles that guide everything we build.',
        readyToJoin: 'Ready to join us?',
        joinSubtitle: 'Be part of the future of electronic music management. Join BIO BEATS today.',
    },

    // Auth
    auth: {
        login: 'Login',
        welcomeBack: 'Welcome back',
        loginToAccount: 'Login to your account',
        email: 'Email',
        password: 'Password',
        forgotPassword: 'Forgot password?',
        rememberMe: 'Remember me',
        noAccount: "Don't have an account?",
        createOne: 'Create one',
        hasAccount: 'Already have an account?',
        createAccount: 'Create Account',
        joinAs: 'Join as',
    },

    // Footer
    footer: {
        tagline: 'The management platform for electronic culture.',
        platform: 'Platform',
        company: 'Company',
        legal: 'Legal',
        followUs: 'Follow Us',
        allRightsReserved: 'All rights reserved.',
        impressum: 'Impressum',
        privacy: 'Privacy',
        terms: 'Terms',
        cookies: 'Cookies',
    },
} as const;

// Create a flexible type that allows different string values per language
export type Translations = {
    [K in keyof typeof en]: typeof en[K] extends string
    ? string
    : { [P in keyof typeof en[K]]: string };
};
