export interface Booking {
    id: string;
    artistId: string;
    eventName: string;
    date: string; // YYYY-MM-DD
    location: string;
    city: string;
    country: string;
    status: 'confirmed' | 'pending' | 'cancelled';
    fee?: number;
}

export const bookings: Booking[] = [
    // Rad.Lez Bookings (Techno)
    {
        id: 'b1',
        artistId: '1', // Rad.Lez
        eventName: 'Basement Club Night',
        date: '2026-06-05',
        location: 'Tresor',
        city: 'Berlin',
        country: 'Germany',
        status: 'confirmed',
        fee: 1500
    },
    {
        id: 'b2',
        artistId: '1',
        eventName: 'Summer Rave Open Air',
        date: '2026-06-20',
        location: 'Tempelhof Feld',
        city: 'Berlin',
        country: 'Germany',
        status: 'confirmed',
        fee: 2500
    },
    {
        id: 'b3',
        artistId: '1',
        eventName: 'Underground Showcase',
        date: '2026-07-10',
        location: 'Printworks',
        city: 'London',
        country: 'UK',
        status: 'pending',
        fee: 2000
    },

    // Deep Circuit Bookings (Minimal)
    {
        id: 'b4',
        artistId: '2', // Deep Circuit
        eventName: 'Electronic Sunday',
        date: '2026-06-12',
        location: 'Panorama Bar',
        city: 'Berlin',
        country: 'Germany',
        status: 'confirmed',
        fee: 1800
    },
    {
        id: 'b5',
        artistId: '2',
        eventName: 'Sonar Off-Week',
        date: '2026-06-18',
        location: 'Poble Espanyol',
        city: 'Barcelona',
        country: 'Spain',
        status: 'confirmed',
        fee: 3000
    },

    // Roz Bookings (House)
    {
        id: 'b6',
        artistId: '4', // Roz
        eventName: 'Sunset Sessions',
        date: '2026-07-02',
        location: 'Café del Mar',
        city: 'Ibiza',
        country: 'Spain',
        status: 'confirmed',
        fee: 4000
    },
    {
        id: 'b7',
        artistId: '4',
        eventName: 'Glitterbox',
        date: '2026-07-15',
        location: 'Hï Ibiza',
        city: 'Ibiza',
        country: 'Spain',
        status: 'confirmed',
        fee: 4500
    }
];
