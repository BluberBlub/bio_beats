export interface Festival {
    id: string;
    name: string;
    slug: string;
    location: string;
    country: string;
    date: string;
    dateEnd?: string;
    type: string;
    image: string;
    capacity: string;
    description: string;
    website?: string;
    artistSlugs: string[]; // References to artists performing
    stages?: string[];
    highlights?: string[];
    coordinates: { lat: number; lng: number };
}

export const festivals: Festival[] = [
    {
        id: 'f1',
        name: 'Fusion Festival',
        slug: 'fusion-festival',
        location: 'Lärz',
        country: 'Germany',
        date: 'June 24, 2026',
        dateEnd: 'June 28, 2026',
        type: 'Multi-genre',
        image: '/festivals/fusion.png',
        capacity: '70,000',
        description: 'Fusion Festival is a non-commercial arts and music festival held annually in Lärz, Germany. Known for its anti-capitalist ethos, creative installations, and eclectic music program spanning electronic, experimental, and world music.',
        website: 'https://www.fusion-festival.de',
        artistSlugs: ['rad-lez', 'aurora-waves', 'deep-circuit'],
        stages: ['Turmbühne', 'Sonnendeck', 'Palast', 'Seebühne', 'Waldfrieden'],
        highlights: ['Art installations', 'No commercial sponsors', 'DIY culture', 'Lake swimming'],
        coordinates: { lat: 53.308, lng: 12.730 }
    },
    {
        id: 'f2',
        name: 'Dekmantel',
        slug: 'dekmantel',
        location: 'Amsterdam',
        country: 'Netherlands',
        date: 'August 5, 2026',
        dateEnd: 'August 9, 2026',
        type: 'Techno / House',
        image: '/festivals/dekmantel.png',
        capacity: '10,000',
        description: 'Dekmantel Festival is a five-day electronic music event held in Amsterdam\'s Amsterdamse Bos. Renowned for its carefully curated lineups, beautiful outdoor setting, and focus on quality over quantity.',
        website: 'https://www.dekmantelfestival.com',
        artistSlugs: ['roz', 'deep-circuit', 'pulse-maker'],
        stages: ['Main Stage', 'Greenhouse', 'UFO', 'Selectors Stage'],
        highlights: ['Forest setting', 'Day and night program', 'Record fair', 'Film screenings'],
        coordinates: { lat: 52.316, lng: 4.836 }
    },
    {
        id: 'f3',
        name: 'Warehouse Project',
        slug: 'warehouse-project',
        location: 'Manchester',
        country: 'UK',
        date: 'September 2026',
        dateEnd: 'December 2026',
        type: 'Techno',
        image: '/festivals/warehouse.png',
        capacity: '10,000',
        description: 'The Warehouse Project is a series of club events held in Manchester\'s Depot Mayfield. Running from September to New Year, it hosts the world\'s best electronic acts in a raw industrial setting.',
        website: 'https://www.thewarehouseproject.com',
        artistSlugs: ['synthetix', 'night-shift', 'vinyl-theory'],
        stages: ['Depot Main', 'Archive', 'Concourse'],
        highlights: ['Industrial venue', 'Extended season', 'Multi-room experience'],
        coordinates: { lat: 53.475, lng: -2.224 }
    },
    {
        id: 'f4',
        name: 'Awakenings',
        slug: 'awakenings',
        location: 'Amsterdam',
        country: 'Netherlands',
        date: 'July 11, 2026',
        dateEnd: 'July 12, 2026',
        type: 'Techno',
        image: '/festivals/awakenings.png',
        capacity: '40,000',
        description: 'Awakenings is the Netherlands\' biggest techno festival, held at the Amsterdamse Bos. With massive production and world-class lineups, it\'s a pilgrimage for techno lovers.',
        website: 'https://www.awakenings.com',
        artistSlugs: ['synthetix', 'rad-lez', 'night-shift', 'cosmos-audio'],
        stages: ['Area V', 'Area W', 'Area X', 'Area Y'],
        highlights: ['Massive production', 'All-star lineups', 'Open air', 'Extended sets'],
        coordinates: { lat: 52.389, lng: 4.750 }
    },
    {
        id: 'f5',
        name: 'Sonar',
        slug: 'sonar',
        location: 'Barcelona',
        country: 'Spain',
        date: 'June 18, 2026',
        dateEnd: 'June 20, 2026',
        type: 'Electronic / Experimental',
        image: '/festivals/sonar.png',
        capacity: '126,000',
        description: 'Sónar is a three-day festival of advanced music and multimedia art held in Barcelona. Split between Sónar by Day and Sónar by Night, it celebrates cutting-edge electronic music and digital creativity.',
        website: 'https://sonar.es',
        artistSlugs: ['aurora-waves', 'frequency-lab', 'cosmos-audio', 'deep-circuit'],
        stages: ['SonarClub', 'SonarHall', 'SonarPub', 'SonarVillage'],
        highlights: ['Avant-garde programming', 'Tech conference', 'Art exhibitions', 'Daytime showcases'],
        coordinates: { lat: 41.370, lng: 2.150 }
    },
    {
        id: 'f6',
        name: 'Movement',
        slug: 'movement',
        location: 'Detroit',
        country: 'USA',
        date: 'May 23, 2026',
        dateEnd: 'May 25, 2026',
        type: 'Techno / House',
        image: '/festivals/movement.png',
        capacity: '100,000',
        description: 'Movement is held in Detroit\'s Hart Plaza, the birthplace of techno. This Memorial Day weekend festival celebrates electronic music\'s roots with a mix of legendary pioneers and rising stars.',
        website: 'https://movement.us',
        artistSlugs: ['vinyl-theory', 'pulse-maker', 'rad-lez', 'roz'],
        stages: ['Movement Main', 'Underground Stage', 'Pyramid Stage', 'Red Bull Stage'],
        highlights: ['Birthplace of techno', 'Detroit legends', 'Riverfront location', 'Afterparties'],
        coordinates: { lat: 42.327, lng: -83.044 }
    },
];

export function getFestivalBySlug(slug: string): Festival | undefined {
    return festivals.find(f => f.slug === slug);
}
