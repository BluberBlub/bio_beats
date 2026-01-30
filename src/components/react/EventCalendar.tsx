import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, MapPin, ExternalLink, List, Grid } from 'lucide-react';
import { festivals as festivalData } from '../../data/festivals';
import { bookings as bookingData } from '../../data/bookings';

const MONTHS_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const MONTHS_DE = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAYS_DE = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];

interface CalendarEvent {
    id: string;
    name: string;
    slug?: string; // Only festivals have slugs
    startDate: Date;
    endDate?: Date;
    location: string;
    city?: string;
    country: string;
    type: 'festival' | 'gig'; // Differentiate types
    subType?: string; // Techno, House, etc.
    artistId?: string; // For gigs
}

interface EventCalendarProps {
    lang?: 'en' | 'de';
    viewMode?: 'public' | 'admin' | 'artist';
    artistId?: string; // Required if viewMode is 'artist'
}

// Parse festival dates
function parseDate(dateStr: string): Date | null {
    // Try Parsing "Month DD, YYYY" (Festival format)
    const match = dateStr.match(/(\w+)\s+(\d+),?\s*(\d+)?/);
    if (match) {
        const month = MONTHS_EN.indexOf(match[1]);
        const day = parseInt(match[2]);
        const year = match[3] ? parseInt(match[3]) : new Date().getFullYear();
        if (month >= 0) return new Date(year, month, day);
    }

    // Try Parsing "YYYY-MM-DD" (Booking format)
    const isoMatch = dateStr.match(/^\d{4}-\d{2}-\d{2}$/);
    if (isoMatch) {
        return new Date(dateStr);
    }

    return null;
}

export default function EventCalendar({ lang = 'en', viewMode = 'public', artistId }: EventCalendarProps) {
    const [currentDate, setCurrentDate] = useState(new Date(2026, 5, 1)); // Start at June 2026
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
    const [viewType, setViewType] = useState<'grid' | 'list'>('grid'); // Toggle between Grid and Agenda

    const months = lang === 'de' ? MONTHS_DE : MONTHS_EN;
    const daysOfWeek = lang === 'de' ? DAYS_DE : DAYS;

    // 1. Process Data
    const events: CalendarEvent[] = useMemo(() => {
        // Process Festivals
        const festivals: CalendarEvent[] = festivalData.map(f => ({
            id: f.id,
            name: f.name,
            slug: f.slug,
            startDate: parseDate(f.date) || new Date(),
            endDate: f.dateEnd ? parseDate(f.dateEnd) || undefined : undefined,
            location: f.location,
            country: f.country,
            type: 'festival' as const,
            subType: f.type
        })).filter(e => e.startDate);

        // Process Bookings
        const bookings: CalendarEvent[] = bookingData.map(b => ({
            id: b.id,
            name: `${b.eventName} (${bookingsArtistName(b.artistId)})`, // Helper to show who is playing
            startDate: parseDate(b.date) || new Date(),
            location: b.location,
            city: b.city,
            country: b.country,
            type: 'gig' as const,
            artistId: b.artistId,
            subType: 'Live / DJ Set'
        })).filter(e => e.startDate);

        // Filter based on View Mode
        let allEvents = [...festivals];

        if (viewMode === 'admin') {
            allEvents = [...festivals, ...bookings]; // Admin sees everything
        } else if (viewMode === 'artist') {
            const myBookings = bookings.filter(b => b.artistId === artistId);
            allEvents = [...festivals, ...myBookings]; // Artist sees festivals + own gigs
        } else {
            // Public View: Festivals + All Public Bookings
            allEvents = [...festivals, ...bookings];
        }

        return allEvents.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
    }, [viewMode, artistId]);

    // Helper to get artist name (Mock lookup)
    const bookingsArtistName = (id: string) => {
        if (id === '1') return 'Rad.Lez';
        if (id === '2') return 'Deep Circuit';
        if (id === '4') return 'Roz';
        return 'Artist';
    };

    // 2. Calendar Logic
    const calendarData = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startPadding = firstDay.getDay();
        const totalDays = lastDay.getDate();

        const days: { date: Date; events: CalendarEvent[]; isCurrentMonth: boolean }[] = [];

        // Previous
        for (let i = startPadding - 1; i >= 0; i--) {
            const date = new Date(year, month, -i);
            days.push({ date, events: [], isCurrentMonth: false });
        }
        // Current
        for (let i = 1; i <= totalDays; i++) {
            const date = new Date(year, month, i);
            const dayEvents = events.filter(e => {
                const d = new Date(e.startDate);
                if (e.endDate) {
                    return date >= new Date(d.getFullYear(), d.getMonth(), d.getDate()) &&
                        date <= new Date(e.endDate.getFullYear(), e.endDate.getMonth(), e.endDate.getDate())
                }
                return d.getDate() === date.getDate() && d.getMonth() === date.getMonth() && d.getFullYear() === date.getFullYear();
            });
            days.push({ date, events: dayEvents, isCurrentMonth: true });
        }
        // Next
        const endPadding = 42 - days.length;
        for (let i = 1; i <= endPadding; i++) {
            const date = new Date(year, month + 1, i);
            days.push({ date, events: [], isCurrentMonth: false });
        }
        return days;
    }, [currentDate, events]);


    const navigateMonth = (direction: number) => {
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + direction, 1));
    };

    const goToToday = () => {
        setCurrentDate(new Date(2026, 5, 1));
    };

    // Styling
    const getEventColor = (event: CalendarEvent) => {
        if (event.type === 'gig') return 'bg-bio-accent text-white'; // Keep white text on accent background

        // Festivals
        if (event.subType?.includes('Techno')) return 'bg-purple-600 text-white';
        if (event.subType?.includes('Electronic')) return 'bg-blue-600 text-white';
        if (event.subType?.includes('Multi')) return 'bg-emerald-600 text-white';
        return 'bg-bio-gray-600 text-white';
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-bold text-bio-white">
                        {months[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </h2>
                    <div className="flex gap-2">
                        <button onClick={goToToday} className="px-3 py-1 text-sm bg-bio-gray-800 text-bio-gray-300 rounded-lg hover:bg-bio-gray-700 transition-colors border border-bio-gray-700">
                            {lang === 'de' ? 'Start' : 'Start'}
                        </button>
                        {/* View Toggle */}
                        <div className="flex bg-bio-gray-800 rounded-lg border border-bio-gray-700 p-1">
                            <button
                                onClick={() => setViewType('grid')}
                                className={`p-1.5 rounded ${viewType === 'grid' ? 'bg-bio-gray-700 text-bio-white' : 'text-bio-gray-400 hover:text-bio-white'}`}
                                title="Grid View"
                            >
                                <Grid className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setViewType('list')}
                                className={`p-1.5 rounded ${viewType === 'list' ? 'bg-bio-gray-700 text-bio-white' : 'text-bio-gray-400 hover:text-bio-white'}`}
                                title="List View"
                            >
                                <List className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => navigateMonth(-1)} className="p-2 bg-bio-gray-800 text-bio-white rounded-lg hover:bg-bio-gray-700 transition-colors border border-bio-gray-700">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button onClick={() => navigateMonth(1)} className="p-2 bg-bio-gray-800 text-bio-white rounded-lg hover:bg-bio-gray-700 transition-colors border border-bio-gray-700">
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Content Switch: Grid vs List */}
            {viewType === 'grid' ? (
                <div className="bg-bio-gray-900 border border-bio-gray-700 rounded-xl overflow-hidden">
                    {/* Day Headers */}
                    <div className="grid grid-cols-7 bg-bio-gray-800">
                        {daysOfWeek.map(day => (
                            <div key={day} className="p-3 text-center text-sm font-medium text-bio-gray-400">
                                {day}
                            </div>
                        ))}
                    </div>
                    {/* Calendar Days */}
                    <div className="grid grid-cols-7">
                        {calendarData.map((day, index) => (
                            <div
                                key={index}
                                className={`min-h-[80px] sm:min-h-[120px] p-1 sm:p-2 border-t border-r border-bio-gray-700 ${!day.isCurrentMonth ? 'bg-bio-black' : ''
                                    } ${day.events.length > 0 ? 'cursor-pointer hover:bg-bio-gray-800' : ''}`}
                                onClick={() => day.events.length > 0 && setSelectedEvent(day.events[0])}
                            >
                                <span className={`text-sm ${day.isCurrentMonth ? 'text-bio-white' : 'text-bio-gray-600'}`}>{day.date.getDate()}</span>
                                <div className="mt-1 space-y-1">
                                    {day.events.slice(0, 3).map(event => (
                                        <div
                                            key={event.id}
                                            className={`text-[10px] sm:text-xs px-1.5 py-0.5 rounded truncate ${getEventColor(event)}`}
                                            title={event.name}
                                        >
                                            <span className="hidden sm:inline">{event.name}</span>
                                            <span className="sm:hidden">•</span>
                                        </div>
                                    ))}
                                    {day.events.length > 3 && (
                                        <div className="text-[10px] sm:text-xs text-bio-gray-500 pl-1">+{day.events.length - 3}</div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                /* list / Agenda View */
                <div className="bg-bio-gray-900 border border-bio-gray-700 rounded-xl overflow-hidden divide-y divide-bio-gray-700">
                    {events
                        .filter(e => e.startDate.getMonth() === currentDate.getMonth() && e.startDate.getFullYear() === currentDate.getFullYear())
                        .map(event => (
                            <div key={event.id} className="p-4 hover:bg-bio-gray-800 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    {/* Date Box */}
                                    <div className="flex-shrink-0 w-16 text-center">
                                        <div className="text-sm text-bio-gray-400 uppercase font-bold">{months[event.startDate.getMonth()].substring(0, 3)}</div>
                                        <div className="text-2xl font-bold text-bio-white">{event.startDate.getDate()}</div>
                                    </div>
                                    {/* Event Info */}
                                    <div>
                                        <h3 className="text-lg font-bold text-bio-white hover:text-bio-accent cursor-pointer" onClick={() => setSelectedEvent(event)}>
                                            {event.name}
                                        </h3>
                                        <div className="flex items-center gap-2 text-sm text-bio-gray-400 mt-1">
                                            <span className={`px-2 py-0.5 rounded text-[10px] text-white uppercase tracking-wider ${getEventColor(event)}`}>
                                                {event.type === 'festival' ? 'Festival' : 'Gig'}
                                            </span>
                                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {event.location}, {event.city || event.country}</span>
                                        </div>
                                    </div>
                                </div>
                                {/* Action */}
                                <button onClick={() => setSelectedEvent(event)} className="px-3 py-1.5 text-sm bg-bio-gray-800 hover:bg-bio-gray-700 text-bio-white rounded-lg border border-bio-gray-700">
                                    Details
                                </button>
                            </div>
                        ))}
                    {events.filter(e => e.startDate.getMonth() === currentDate.getMonth()).length === 0 && (
                        <div className="p-8 text-center text-bio-gray-400">No events found for this month.</div>
                    )}
                </div>
            )}

            {/* Legend */}
            <div className="flex flex-wrap gap-4 text-sm text-bio-gray-400 border-t border-bio-gray-700 pt-4">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-bio-accent"></div>
                    <span>Artist Gig</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-purple-600"></div>
                    <span>Techno Festival</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-blue-600"></div>
                    <span>Electronic Festival</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-emerald-600"></div>
                    <span>Multi-Genre</span>
                </div>
            </div>

            {/* Modal */}
            {selectedEvent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedEvent(null)}>
                    <div className="bg-bio-gray-900 border border-bio-gray-700 rounded-xl p-6 shadow-2xl w-full max-w-md animate-fade-in relative" onClick={e => e.stopPropagation()}>
                        <button className="absolute top-4 right-4 text-bio-gray-400 hover:text-bio-white" onClick={() => setSelectedEvent(null)}>✕</button>

                        <div className={`inline-block px-2 py-1 rounded text-xs text-white mb-4 ${getEventColor(selectedEvent)}`}>
                            {selectedEvent.type === 'festival' ? 'Festival' : 'Artist Booking'}
                        </div>

                        <h3 className="text-2xl font-bold text-bio-white mb-2">{selectedEvent.name}</h3>

                        <div className="space-y-4 mb-6">
                            <div className="flex items-center gap-3 text-bio-gray-300">
                                <CalendarIcon className="w-5 h-5 text-bio-accent" />
                                <div>
                                    <div className="font-medium">
                                        {selectedEvent.startDate.toLocaleDateString(lang === 'de' ? 'de-DE' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                    </div>
                                    {selectedEvent.endDate && (
                                        <div className="text-sm text-bio-gray-500">
                                            to {selectedEvent.endDate.toLocaleDateString(lang === 'de' ? 'de-DE' : 'en-US', { month: 'long', day: 'numeric' })}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-3 text-bio-gray-300">
                                <MapPin className="w-5 h-5 text-bio-accent" />
                                <span>{selectedEvent.location}, {selectedEvent.city ? `${selectedEvent.city}, ` : ''}{selectedEvent.country}</span>
                            </div>
                        </div>

                        {selectedEvent.type === 'festival' && selectedEvent.slug ? (
                            <a href={`/festivals`} className="btn-primary w-full text-center block">
                                View Festival Details
                            </a>
                        ) : (
                            <div className="p-3 bg-bio-gray-900 rounded-lg text-sm text-bio-gray-400 text-center border border-bio-gray-800">
                                Contact agent for guestlist or booking inquiries.
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
