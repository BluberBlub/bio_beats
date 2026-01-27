import type { Artist } from '../types/types';

export interface Label {
    id: string;
    name: string;
    slug: string;
    location: string;
    bio: string;
    shortBio: string;
    image: string;
    genres: string[];
    isVerified: boolean;
    artistCount: number;
    founded: number;
    socials: {
        website?: string;
        instagram?: string;
        soundcloud?: string;
        bandcamp?: string;
    };
}

export const artists: Artist[] = [
    {
        id: '1',
        name: 'Rad.Lez',
        slug: 'rad-lez',
        type: 'live',
        genres: ['Progressive Techno', 'Melodic House'],
        bpmRange: { min: 120, max: 128 },
        location: 'Berlin, Germany',
        bio: 'Rad.Lez is a Berlin-based live act known for hypnotic progressive techno sets that blend organic textures with driving rhythms. With performances at renowned clubs and festivals across Europe, they bring a unique energy that bridges the gap between underground and mainstream electronic music.',
        shortBio: 'Berlin-based progressive techno live act',
        image: '/artists/rad-lez.png',
        socials: {
            instagram: 'https://instagram.com/rad.lez',
            soundcloud: 'https://soundcloud.com/rad-lez',
            spotify: 'https://spotify.com/artist/rad-lez',
        },
        isVerified: true,
        isFeatured: true,
        availability: 'available',
    },
    {
        id: '2',
        name: 'ROZ',
        slug: 'roz',
        type: 'live',
        genres: ['House', 'Deep House', 'Soulful'],
        bpmRange: { min: 118, max: 124 },
        location: 'Amsterdam, Netherlands',
        bio: 'ROZ brings a fresh perspective to the house music scene with soulful grooves and infectious rhythms. Based in Amsterdam, they have built a reputation for sets that make crowds move while maintaining musical depth and authenticity.',
        shortBio: 'Amsterdam-based soulful house live performer',
        image: '/artists/roz.png',
        socials: {
            instagram: 'https://instagram.com/roz_music',
            soundcloud: 'https://soundcloud.com/roz-music',
        },
        isVerified: true,
        isFeatured: true,
        availability: 'available',
    },
    {
        id: '3',
        name: 'SYNTHETIX',
        slug: 'synthetix',
        type: 'dj',
        genres: ['Industrial Techno', 'Hard Techno'],
        bpmRange: { min: 140, max: 155 },
        location: 'London, UK',
        bio: 'SYNTHETIX delivers uncompromising industrial techno that pushes the boundaries of the genre. Known for intense, high-energy sets that leave lasting impressions on warehouse parties and underground events.',
        shortBio: 'London-based industrial techno DJ',
        image: '/artists/synthetix.png',
        socials: {
            soundcloud: 'https://soundcloud.com/synthetix',
            bandcamp: 'https://synthetix.bandcamp.com',
        },
        isVerified: false,
        isFeatured: true,
        availability: 'limited',
    },
    {
        id: '4',
        name: 'Aurora Waves',
        slug: 'aurora-waves',
        type: 'hybrid',
        genres: ['Melodic Techno', 'Progressive House'],
        bpmRange: { min: 122, max: 130 },
        location: 'Barcelona, Spain',
        bio: 'Aurora Waves creates immersive sonic journeys that blend melodic techno with atmospheric progressive house. Their unique hybrid setup combines DJing with live synthesizers to create unforgettable performances.',
        shortBio: 'Barcelona-based melodic techno hybrid artist',
        image: '/artists/aurora-waves.png',
        socials: {
            instagram: 'https://instagram.com/aurora_waves',
            spotify: 'https://spotify.com/artist/aurora-waves',
            website: 'https://aurorawaves.com',
        },
        isVerified: true,
        isFeatured: false,
        availability: 'available',
    },
    {
        id: '5',
        name: 'Deep Circuit',
        slug: 'deep-circuit',
        type: 'dj',
        genres: ['Deep House', 'Minimal'],
        bpmRange: { min: 118, max: 125 },
        location: 'Paris, France',
        bio: 'Deep Circuit explores the deeper side of electronic music with carefully curated sets that weave through deep house and minimal territories. A resident at some of Paris\'s most respected venues.',
        shortBio: 'Paris-based deep house & minimal DJ',
        image: '/artists/deep-circuit.png',
        socials: {
            soundcloud: 'https://soundcloud.com/deep-circuit',
            instagram: 'https://instagram.com/deepcircuit',
        },
        isVerified: true,
        isFeatured: false,
        availability: 'available',
    },
    {
        id: '6',
        name: 'Vinyl Theory',
        slug: 'vinyl-theory',
        type: 'dj',
        genres: ['Acid Techno', 'Electro'],
        bpmRange: { min: 130, max: 140 },
        location: 'Detroit, USA',
        bio: 'Vinyl Theory pays homage to the roots of techno while pushing the genre forward. Known for vinyl-only sets that bridge classic Detroit sounds with contemporary acid-influenced productions.',
        shortBio: 'Detroit-based acid techno DJ',
        image: '/artists/vinyl-theory.png',
        socials: {
            soundcloud: 'https://soundcloud.com/vinyl-theory',
            bandcamp: 'https://vinyltheory.bandcamp.com',
        },
        isVerified: true,
        isFeatured: false,
        availability: 'available',
    },
    {
        id: '7',
        name: 'Pulse Maker',
        slug: 'pulse-maker',
        type: 'live',
        genres: ['Tech House', 'Tribal'],
        bpmRange: { min: 124, max: 130 },
        location: 'Ibiza, Spain',
        bio: 'Pulse Maker brings the energy of Ibiza to stages worldwide with infectious tech house grooves infused with tribal percussion and hypnotic rhythms.',
        shortBio: 'Ibiza-based tech house live act',
        image: '/artists/pulse-maker.png',
        socials: {
            instagram: 'https://instagram.com/pulsemaker',
            spotify: 'https://spotify.com/artist/pulse-maker',
        },
        isVerified: true,
        isFeatured: false,
        availability: 'limited',
    },
    {
        id: '8',
        name: 'Night Shift',
        slug: 'night-shift',
        type: 'dj',
        genres: ['Warehouse Techno', 'Dark Techno'],
        bpmRange: { min: 135, max: 145 },
        location: 'Manchester, UK',
        bio: 'Night Shift emerged from the Manchester warehouse scene with a sound that is unapologetically dark and driving. Regular headliner at the city\'s most respected underground events.',
        shortBio: 'Manchester-based warehouse techno DJ',
        image: '/artists/night-shift.png',
        socials: {
            soundcloud: 'https://soundcloud.com/night-shift',
        },
        isVerified: false,
        isFeatured: false,
        availability: 'available',
    },
    {
        id: '9',
        name: 'Cosmos Audio',
        slug: 'cosmos-audio',
        type: 'hybrid',
        genres: ['Ambient Techno', 'Downtempo'],
        bpmRange: { min: 100, max: 120 },
        location: 'Reykjavik, Iceland',
        bio: 'Cosmos Audio creates expansive sonic landscapes that draw from the stark beauty of Icelandic nature. Their live shows combine ambient textures with subtle techno rhythms.',
        shortBio: 'Reykjavik-based ambient techno artist',
        image: '/artists/cosmos-audio.png',
        socials: {
            bandcamp: 'https://cosmosaudio.bandcamp.com',
            website: 'https://cosmosaudio.is',
        },
        isVerified: true,
        isFeatured: false,
        availability: 'limited',
    },
    {
        id: '10',
        name: 'Frequency Lab',
        slug: 'frequency-lab',
        type: 'live',
        genres: ['Modular', 'Experimental'],
        bpmRange: { min: 110, max: 135 },
        location: 'Tokyo, Japan',
        bio: 'Frequency Lab pushes the boundaries of live electronic performance with a modular-focused setup. Each performance is unique, improvised, and never repeated.',
        shortBio: 'Tokyo-based modular live act',
        image: '/artists/frequency-lab.png',
        socials: {
            instagram: 'https://instagram.com/frequencylab',
            soundcloud: 'https://soundcloud.com/frequency-lab',
        },
        isVerified: true,
        isFeatured: false,
        availability: 'available',
    },
];

export const labels: Label[] = [
    {
        id: 'l1',
        name: 'Midnight Records',
        slug: 'midnight-records',
        location: 'Berlin, Germany',
        bio: 'Midnight Records has been a cornerstone of the Berlin techno scene since 2015. Known for releasing cutting-edge techno and supporting emerging artists.',
        shortBio: 'Berlin-based techno label',
        image: '/artists/synthetix.png',
        genres: ['Techno', 'Industrial'],
        isVerified: true,
        artistCount: 24,
        founded: 2015,
        socials: {
            website: 'https://midnight-records.de',
            soundcloud: 'https://soundcloud.com/midnight-records',
            bandcamp: 'https://midnightrecords.bandcamp.com',
        },
    },
    {
        id: 'l2',
        name: 'Analog Soul',
        slug: 'analog-soul',
        location: 'Amsterdam, Netherlands',
        bio: 'Analog Soul celebrates the warmth of analog sound with releases spanning deep house, disco, and soulful electronic music. Quality over quantity.',
        shortBio: 'Amsterdam-based house & disco label',
        image: '/artists/roz.png',
        genres: ['House', 'Disco', 'Deep House'],
        isVerified: true,
        artistCount: 18,
        founded: 2018,
        socials: {
            website: 'https://analogsoul.nl',
            instagram: 'https://instagram.com/analogsoul',
            bandcamp: 'https://analogsoul.bandcamp.com',
        },
    },
    {
        id: 'l3',
        name: 'Future Primitiv',
        slug: 'future-primitiv',
        location: 'London, UK',
        bio: 'Future Primitiv explores the intersection of technology and primal rhythm. Home to forward-thinking producers who push boundaries while respecting roots.',
        shortBio: 'London-based experimental electronic label',
        image: '/artists/deep-circuit.png',
        genres: ['Experimental', 'Breaks', 'Electro'],
        isVerified: true,
        artistCount: 12,
        founded: 2020,
        socials: {
            soundcloud: 'https://soundcloud.com/future-primitiv',
            bandcamp: 'https://futureprimitiv.bandcamp.com',
        },
    },
    {
        id: 'l4',
        name: 'Nacht Kollektiv',
        slug: 'nacht-kollektiv',
        location: 'Vienna, Austria',
        bio: 'Nacht Kollektiv is a collective of artists and a label dedicated to the darker side of electronic music. Events, releases, and community.',
        shortBio: 'Vienna-based dark electronic collective',
        image: '/artists/aurora-waves.png',
        genres: ['Dark Techno', 'EBM', 'Industrial'],
        isVerified: false,
        artistCount: 8,
        founded: 2021,
        socials: {
            instagram: 'https://instagram.com/nachtkollektiv',
            soundcloud: 'https://soundcloud.com/nacht-kollektiv',
        },
    },
];

export function getFeaturedArtists(): Artist[] {
    return artists.filter(artist => artist.isFeatured);
}

export function getArtistBySlug(slug: string): Artist | undefined {
    return artists.find(artist => artist.slug === slug);
}

export function getLabelBySlug(slug: string): Label | undefined {
    return labels.find(label => label.slug === slug);
}
