import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, MapPin, ExternalLink } from 'lucide-react';
import { festivals as festivalData } from '../../../data/festivals';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface FestivalEvent {
    id: string;
    name: string;
    slug: string;
    startDate: Date;
    endDate?: Date;
    location: string;
    country: string;
    type: string;
}

// Parse festival dates
function parseFestivalDate(dateStr: string): Date | null {
    const match = dateStr.match(/(\w+)\s+(\d+),?\s*(\d+)?/);
    if (match) {
        const month = MONTHS.indexOf(match[1]);
        const day = parseInt(match[2]);
        const year = match[3] ? parseInt(match[3]) : new Date().getFullYear();
        if (month >= 0) {
            return new Date(year, month, day);
        }
    }
    return null;
}

export default function CalendarView() {
    const [currentDate, setCurrentDate] = useState(new Date(2026, 5, 1)); // Start at June 2026
    const [selectedEvent, setSelectedEvent] = useState<FestivalEvent | null>(null);

    // Convert festivals to events with parsed dates
    const events: FestivalEvent[] = useMemo(() => {
        return festivalData.map(f => ({
            id: f.id,
            name: f.name,
            slug: f.slug,
            startDate: parseFestivalDate(f.date) || new Date(),
            endDate: f.dateEnd ? parseFestivalDate(f.dateEnd) || undefined : undefined,
            location: f.location,
            country: f.country,
            type: f.type,
        })).filter(e => e.startDate);
    }, []);

    // Get calendar data
    const calendarData = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startPadding = firstDay.getDay();
        const totalDays = lastDay.getDate();

        const days: { date: Date; events: FestivalEvent[]; isCurrentMonth: boolean }[] = [];

        // Previous month padding
        for (let i = startPadding - 1; i >= 0; i--) {
            const date = new Date(year, month, -i);
            days.push({ date, events: [], isCurrentMonth: false });
        }

        // Current month
        for (let i = 1; i <= totalDays; i++) {
            const date = new Date(year, month, i);
            const dayEvents = events.filter(e => {
                const start = e.startDate;
                const end = e.endDate || start;
                return date >= new Date(start.getFullYear(), start.getMonth(), start.getDate()) &&
                    date <= new Date(end.getFullYear(), end.getMonth(), end.getDate());
            });
            days.push({ date, events: dayEvents, isCurrentMonth: true });
        }

        // Next month padding
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
        setCurrentDate(new Date(2026, 5, 1)); // Go to June 2026 where festivals are
    };

    // Color coding by type
    const getEventColor = (type: string) => {
        if (type.includes('Techno')) return 'bg-purple-500';
        if (type.includes('Electronic')) return 'bg-blue-500';
        if (type.includes('Multi')) return 'bg-green-500';
        return 'bg-bio-accent';
    };

    return (
        <div className="space-y-4">
            {/* Calendar Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-bold text-white">
                        {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </h2>
                    <button
                        onClick={goToToday}
                        className="px-3 py-1 text-sm bg-bio-gray-800 text-bio-gray-300 rounded-lg hover:bg-bio-gray-700 transition-colors"
                    >
                        Go to Festivals
                    </button>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => navigateMonth(-1)}
                        className="p-2 bg-bio-gray-800 text-white rounded-lg hover:bg-bio-gray-700 transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => navigateMonth(1)}
                        className="p-2 bg-bio-gray-800 text-white rounded-lg hover:bg-bio-gray-700 transition-colors"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="bg-bio-gray-900 border border-bio-gray-800 rounded-xl overflow-hidden">
                {/* Day Headers */}
                <div className="grid grid-cols-7 bg-bio-gray-800">
                    {DAYS.map(day => (
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
                            className={`min-h-[100px] p-2 border-t border-r border-bio-gray-800 ${!day.isCurrentMonth ? 'bg-bio-gray-900/50' : ''
                                } ${day.events.length > 0 ? 'cursor-pointer hover:bg-bio-gray-800/50' : ''}`}
                            onClick={() => day.events.length > 0 && setSelectedEvent(day.events[0])}
                        >
                            <span className={`text-sm ${day.isCurrentMonth ? 'text-white' : 'text-bio-gray-600'
                                }`}>
                                {day.date.getDate()}
                            </span>
                            <div className="mt-1 space-y-1">
                                {day.events.slice(0, 2).map(event => (
                                    <div
                                        key={event.id}
                                        className={`text-xs px-1.5 py-0.5 rounded truncate text-white ${getEventColor(event.type)}`}
                                        title={event.name}
                                    >
                                        {event.name}
                                    </div>
                                ))}
                                {day.events.length > 2 && (
                                    <div className="text-xs text-bio-gray-400">
                                        +{day.events.length - 2} more
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Event Detail Panel */}
            {selectedEvent && (
                <div className="bg-bio-gray-900 border border-bio-gray-800 rounded-xl p-6">
                    <div className="flex items-start justify-between">
                        <div>
                            <h3 className="text-xl font-bold text-white mb-2">{selectedEvent.name}</h3>
                            <div className="space-y-2 text-sm text-bio-gray-400">
                                <div className="flex items-center gap-2">
                                    <CalendarIcon className="w-4 h-4 text-bio-accent" />
                                    {selectedEvent.startDate.toLocaleDateString('en-US', {
                                        month: 'long',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })}
                                    {selectedEvent.endDate && (
                                        <span>
                                            — {selectedEvent.endDate.toLocaleDateString('en-US', {
                                                month: 'long',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-bio-accent" />
                                    {selectedEvent.location}, {selectedEvent.country}
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <a
                                href={`/admin/festivals`}
                                className="btn-ghost text-sm flex items-center gap-1"
                            >
                                <ExternalLink className="w-4 h-4" />
                                Edit
                            </a>
                            <button
                                onClick={() => setSelectedEvent(null)}
                                className="text-bio-gray-400 hover:text-white"
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                    <span className={`inline-block mt-4 px-2 py-1 text-xs rounded text-white ${getEventColor(selectedEvent.type)}`}>
                        {selectedEvent.type}
                    </span>
                </div>
            )}

            {/* Legend */}
            <div className="flex flex-wrap gap-4 text-sm text-bio-gray-400">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-purple-500"></div>
                    <span>Techno</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-blue-500"></div>
                    <span>Electronic</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-green-500"></div>
                    <span>Multi-genre</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-bio-accent"></div>
                    <span>Other</span>
                </div>
            </div>
        </div>
    );
}
