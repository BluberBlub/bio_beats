import type { FAQItem } from '../types/types';

export const faqItems: FAQItem[] = [
    // General
    {
        id: '1',
        question: 'What is BIO BEATS?',
        answer: 'BIO BEATS is a management and booking platform designed specifically for electronic music culture. We connect artists, labels, bookers, festivals, and creative professionals to streamline the booking process and build sustainable careers in electronic music.',
        category: 'General',
    },
    {
        id: '2',
        question: 'Who can use BIO BEATS?',
        answer: 'BIO BEATS is designed for everyone in the electronic music ecosystem: DJs, live acts, producers, labels, managers, booking agents, festival organizers, club bookers, VJs, designers, and even fans who want to discover new music and events.',
        category: 'General',
    },
    {
        id: '3',
        question: 'Is BIO BEATS available worldwide?',
        answer: 'Yes! BIO BEATS is a global platform. We have users from over 50 countries, with particularly strong communities in Germany, Netherlands, UK, Spain, and the USA.',
        category: 'General',
    },
    {
        id: '4',
        question: 'How is BIO BEATS different from other platforms?',
        answer: 'BIO BEATS is built by people from the electronic music industry, for the industry. We understand the specific needs of DJs, live acts, and bookers. Our platform focuses on verified profiles, streamlined communication, and modular services that grow with you.',
        category: 'General',
    },

    // For Artists
    {
        id: '5',
        question: 'How do I create an artist profile?',
        answer: 'Click "Join" and select your role (Artist/DJ/Live Act). Fill in your details, upload photos, add your music links, and specify your genres and availability. Your profile will be reviewed and you can start receiving booking inquiries.',
        category: 'For Artists',
    },
    {
        id: '6',
        question: 'What does verification mean for artists?',
        answer: 'Verified artists have been reviewed by our team to confirm their identity and professional status. Verified profiles appear higher in search results and bookers know they are dealing with legitimate artists.',
        category: 'For Artists',
    },
    {
        id: '7',
        question: 'Can I set my own booking fees?',
        answer: 'Yes, you have full control over your fee structure. You can set different rates for different types of events, locations, or set lengths. This information can be visible to bookers or shared upon request.',
        category: 'For Artists',
    },
    {
        id: '8',
        question: 'How do I manage my availability?',
        answer: 'Your dashboard includes a booking calendar where you can mark dates as available, tentatively held, or booked. Bookers can see your general availability when considering you for events.',
        category: 'For Artists',
    },
    {
        id: '9',
        question: 'Can I work with a manager on BIO BEATS?',
        answer: 'Absolutely. Managers can create agency accounts and link multiple artist profiles. This allows them to handle bookings on behalf of their roster while artists maintain control of their profiles.',
        category: 'For Artists',
    },

    // For Bookers
    {
        id: '10',
        question: 'How do I find artists for my event?',
        answer: 'Use our search and filter tools to browse artists by genre, location, BPM range, availability, and type (DJ/Live/Hybrid). You can save favorites, compare artists, and send booking inquiries directly through the platform.',
        category: 'For Bookers',
    },
    {
        id: '11',
        question: 'What information do I need to send a booking inquiry?',
        answer: 'To send an inquiry, provide the event name, date, venue, location, expected capacity, set time, and any additional context. The more details you provide, the faster artists can respond with accurate quotes.',
        category: 'For Bookers',
    },
    {
        id: '12',
        question: 'Can I book multiple artists at once?',
        answer: 'Yes! Festival and event organizers can use our multi-artist booking tools to coordinate lineups. Send inquiries to multiple artists, compare availability, and manage all communications in one place.',
        category: 'For Bookers',
    },
    {
        id: '13',
        question: 'How do I become a verified booker?',
        answer: 'Verified booker status is available for established venues, festivals, and agencies. Apply through your profile settings with documentation of your events. Verified bookers get priority responses from artists.',
        category: 'For Bookers',
    },

    // Pricing
    {
        id: '14',
        question: 'Is BIO BEATS free to use?',
        answer: 'Basic profiles are free for artists and bookers. This includes creating a profile, appearing in search results, and sending/receiving booking inquiries. Premium features and services are available for additional fees.',
        category: 'Pricing',
    },
    {
        id: '15',
        question: 'What are the premium features?',
        answer: 'Premium features include advanced analytics, priority placement in search, booking management tools, financial reporting, marketing support, and access to our modular services like brand consulting and international expansion support.',
        category: 'Pricing',
    },
    {
        id: '16',
        question: 'Does BIO BEATS take a commission on bookings?',
        answer: 'BIO BEATS does not take a commission on bookings made through the platform. Our revenue comes from premium subscriptions and optional services, not from your booking fees.',
        category: 'Pricing',
    },
    {
        id: '17',
        question: 'Can I cancel my premium subscription?',
        answer: 'Yes, you can cancel your premium subscription at any time. Your account will remain active with basic features, and you won\'t be charged for the next billing period.',
        category: 'Pricing',
    },

    // Platform
    {
        id: '18',
        question: 'Is my data secure on BIO BEATS?',
        answer: 'Yes, we take data security seriously. All data is encrypted, we use secure payment processing through Stripe, and we never share your personal information with third parties without consent.',
        category: 'Platform',
    },
    {
        id: '19',
        question: 'Can I export my data?',
        answer: 'Yes, you can export your booking history, financial reports, and profile data at any time through your dashboard settings. We believe you should own your data.',
        category: 'Platform',
    },
    {
        id: '20',
        question: 'How do I report a problem or get support?',
        answer: 'You can reach our support team through the Contact page, or email us directly at support@biobeats.io. Premium users have access to priority support with faster response times.',
        category: 'Platform',
    },
    {
        id: '21',
        question: 'Is there a mobile app?',
        answer: 'We are currently developing native mobile apps for iOS and Android. In the meantime, our website is fully responsive and works great on mobile devices.',
        category: 'Platform',
    },
];
