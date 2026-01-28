import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, MapPin, ExternalLink } from 'lucide-react';
import { festivals as festivalData } from '../../data/festivals';

const MONTHS_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const MONTHS_DE = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAYS_DE = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];

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

interface EventCalendarProps {
    lang?: 'en' | 'de';
}

// Parse festival dates
function parseFestivalDate(dateStr: string): Date | null {
    const match = dateStr.match(/(\w+)\s+(\d+),?\s*(\d+)?/);
    if (match) {
        // Always parse English month names from data (assuming data is in English format)
        const month = MONTHS_EN.indexOf(match[1]);
        const day = parseInt(match[2]);
        const year = match[3] ? parseInt(match[3]) : new Date().getFullYear();
        if (month >= 0) {
            return new Date(year, month, day);
        }
    }
    return null;
}

export default function EventCalendar({ lang = 'en' }: EventCalendarProps) {
    const [currentDate, setCurrentDate] = useState(new Date(2026, 5, 1)); // Start at June 2026
    const [selectedEvent, setSelectedEvent] = useState<FestivalEvent | null>(null);

    const months = lang === 'de' ? MONTHS_DE : MONTHS_EN;
    const daysOfWeek = lang === 'de' ? DAYS_DE : DAYS;

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
        <div className="space-y-6">
            {/* Calendar Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-bold text-white">
                        {months[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </h2>
                    <button
                        onClick={goToToday}
                        className="px-3 py-1 text-sm bg-[#262626] text-gray-300 rounded-lg hover:bg-[#333] transition-colors border border-[#333]"
                    >
                        {lang === 'de' ? 'Zum Festival-Start' : 'Go to Festivals'}
                    </button>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => navigateMonth(-1)}
                        className="p-2 bg-[#262626] text-white rounded-lg hover:bg-[#333] transition-colors border border-[#333]"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => navigateMonth(1)}
                        className="p-2 bg-[#262626] text-white rounded-lg hover:bg-[#333] transition-colors border border-[#333]"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="bg-[#1a1a1a] border border-[#333] rounded-xl overflow-hidden">
                {/* Day Headers */}
                <div className="grid grid-cols-7 bg-[#262626]">
                    {daysOfWeek.map(day => (
                        <div key={day} className="p-3 text-center text-sm font-medium text-gray-400">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Calendar Days */}
                <div className="grid grid-cols-7">
                    {calendarData.map((day, index) => (
                        <div
                            key={index}
                            className={`min-h-[80px] sm:min-h-[120px] p-1 sm:p-2 border-t border-r border-[#333] ${!day.isCurrentMonth ? 'bg-[#151515]' : ''
                                } ${day.events.length > 0 ? 'cursor-pointer hover:bg-[#262626]' : ''}`}
                            onClick={() => day.events.length > 0 && setSelectedEvent(day.events[0])}
                        >
                            <span className={`text-sm ${day.isCurrentMonth ? 'text-white' : 'text-gray-600'
                                }`}>
                                {day.date.getDate()}
                            </span>
                            <div className="mt-1 space-y-1">
                                {day.events.slice(0, 2).map(event => (
                                    <div
                                        key={event.id}
                                        className={`text-[10px] sm:text-xs px-1.5 py-0.5 rounded truncate text-white ${getEventColor(event.type)}`}
                                        title={event.name}
                                    >
                                        <span className="hidden sm:inline">{event.name}</span>
                                        <span className="sm:hidden">•</span>
                                    </div>
                                ))}
                                {day.events.length > 2 && (
                                    <div className="text-[10px] sm:text-xs text-gray-500 pl-1">
                                        +{day.events.length - 2}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Event Detail Panel */}
            {selectedEvent && (
                <div className="bg-[#1a1a1a] border border-[#333] rounded-xl p-6 shadow-xl animate-fade-in">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h3 className="text-xl font-bold text-white mb-2">{selectedEvent.name}</h3>
                            <div className="space-y-2 text-sm text-gray-400">
                                <div className="flex items-center gap-2">
                                    <CalendarIcon className="w-4 h-4 text-[#ff0700]" />
                                    {selectedEvent.startDate.toLocaleDateString(lang === 'de' ? 'de-DE' : 'en-US', {
                                        month: 'long',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })}
                                    {selectedEvent.endDate && (
                                        <span>
                                            — {selectedEvent.endDate.toLocaleDateString(lang === 'de' ? 'de-DE' : 'en-US', {
                                                month: 'long',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-[#ff0700]" />
                                    {selectedEvent.location}, {selectedEvent.country}
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => setSelectedEvent(null)}
                            className="text-gray-400 hover:text-white p-1"
                        >
                            ✕
                        </button>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                        <span className={`inline-block px-2 py-1 text-xs rounded text-white ${getEventColor(selectedEvent.type)}`}>
                            {selectedEvent.type}
                        </span>

                        {/* 
                          Ideally this would link to a festival detail page, e.g. /festivals/{slug}. 
                          Assuming that exists or will exist.
                        */}
                        <a
                            href="/festivals"
                            className="text-sm text-[#ff0700] hover:underline flex items-center gap-1"
                        >
                            {lang === 'de' ? 'Mehr Details' : 'More Details'} <ExternalLink className="w-3 h-3" />
                        </a>
                    </div>
                </div>
            )}

            {/* Legend */}
            <div className="flex flex-wrap gap-4 text-sm text-gray-400">
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
                    <div className="w-3 h-3 rounded bg-[#ff0700]"></div>
                    <span>Other</span>
                </div>
            </div>
        </div>
    );
}
