import { useState, useMemo } from 'react';
import { Search, Filter, MapPin, Calendar, Users, ChevronDown, X, ArrowRight } from 'lucide-react';


// Simplified festival type for display purposes
interface FestivalData {
    id: string;
    name: string;
    slug: string;
    location: string;
    country: string;
    date: string;
    type: string;
    image: string;
    capacity: string;
    artistSlugs?: string[];
    coordinates: { lat: number; lng: number };
}

interface Props {
    festivals: FestivalData[];
    lang?: 'en' | 'de';
}

const ITEMS_PER_PAGE = 6;

const translations = {
    // ... translations (unchanged)
    en: {
        search: 'Search festivals...',
        filters: 'Filters',
        country: 'Country',
        allCountries: 'All Countries',
        type: 'Type',
        allTypes: 'All Types',
        clearFilters: 'Clear all filters',
        showing: 'Showing',
        of: 'of',
        festivals: 'festivals',
        noFestivals: 'No festivals found matching your criteria.',
        loadMore: 'Load More',
        viewDetails: 'View Details',
        artists: 'BIO BEATS Artists'
    },
    de: {
        search: 'Festivals suchen...',
        filters: 'Filter',
        country: 'Land',
        allCountries: 'Alle Länder',
        type: 'Typ',
        allTypes: 'Alle Typen',
        clearFilters: 'Filter zurücksetzen',
        showing: 'Zeige',
        of: 'von',
        festivals: 'Festivals',
        noFestivals: 'Keine Festivals gefunden.',
        loadMore: 'Mehr laden',
        viewDetails: 'Details ansehen',
        artists: 'BIO BEATS Künstler'
    }
};

export default function FestivalDirectory({ festivals = [], lang = 'en' }: Props) {
    const t = translations[lang];

    // Ensure we have valid arrays
    const safeFestivals = Array.isArray(festivals) ? festivals : [];

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCountry, setSelectedCountry] = useState<string>('all');
    const [selectedType, setSelectedType] = useState<string>('all');
    const [showFilters, setShowFilters] = useState(false);
    const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

    // Helper to filter items (reusable for facets)
    const filterItems = (items: any[], criteria: { query?: string, country?: string, type?: string }) => {
        return items.filter(item => {
            const matchesSearch = !criteria.query ||
                item.name?.toLowerCase().includes(criteria.query.toLowerCase()) ||
                item.location?.toLowerCase().includes(criteria.query.toLowerCase()) ||
                item.country?.toLowerCase().includes(criteria.query.toLowerCase());

            const matchesCountry = !criteria.country || criteria.country === 'all' || item.country === criteria.country;
            const matchesType = !criteria.type || criteria.type === 'all' || item.type === criteria.type;

            return matchesSearch && matchesCountry && matchesType;
        });
    };

    // Derived Facets (Dynamic Options)
    const availableCountries = useMemo(() => {
        const set = new Set<string>();
        // Filter by everything EXCEPT Country to see which countries remain available
        const relevantFestivals = filterItems(safeFestivals, { query: searchQuery, type: selectedType });
        relevantFestivals.forEach(f => f.country && set.add(f.country));
        return Array.from(set).sort();
    }, [safeFestivals, searchQuery, selectedType]);

    const availableTypes = useMemo(() => {
        const set = new Set<string>();
        // Filter by everything EXCEPT Type to see which types remain available
        const relevantFestivals = filterItems(safeFestivals, { query: searchQuery, country: selectedCountry });
        relevantFestivals.forEach(f => f.type && set.add(f.type));
        return Array.from(set).sort();
    }, [safeFestivals, searchQuery, selectedCountry]);

    // Final Filtered List (respecting ALL filters)
    const filteredFestivals = useMemo(() => {
        return filterItems(safeFestivals, {
            query: searchQuery,
            country: selectedCountry,
            type: selectedType
        });
    }, [safeFestivals, searchQuery, selectedCountry, selectedType]);

    const visibleFestivals = filteredFestivals.slice(0, visibleCount);
    const hasMore = visibleCount < filteredFestivals.length;

    const loadMore = () => {
        setVisibleCount(prev => prev + ITEMS_PER_PAGE);
    };

    const clearFilters = () => {
        setSearchQuery('');
        setSelectedCountry('all');
        setSelectedType('all');
        setVisibleCount(ITEMS_PER_PAGE);
    };

    const hasActiveFilters = searchQuery || selectedCountry !== 'all' || selectedType !== 'all';

    return (
        <div>
            {/* Search and Filter Bar */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                {/* Search */}
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-bio-gray-500" />
                    <input
                        type="text"
                        placeholder={t.search}
                        value={searchQuery}
                        onChange={(e) => { setSearchQuery(e.target.value); setVisibleCount(ITEMS_PER_PAGE); }}
                        className="w-full pl-12 pr-4 py-3 bg-bio-gray-800 border border-bio-gray-700 rounded-lg text-bio-white placeholder-bio-gray-500 focus:border-bio-accent outline-none transition-colors"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-bio-gray-500 hover:text-bio-white"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {/* Filter Toggle */}
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${showFilters || hasActiveFilters
                        ? 'bg-bio-accent text-white'
                        : 'bg-bio-gray-800 text-bio-gray-400 hover:text-bio-white'
                        }`}
                >
                    <Filter className="w-5 h-5" />
                    {t.filters}
                    {hasActiveFilters && (
                        <span className="ml-1 px-2 py-0.5 bg-white/20 rounded-full text-xs text-white">
                            {[searchQuery, selectedCountry !== 'all', selectedType !== 'all'].filter(Boolean).length}
                        </span>
                    )}
                </button>
            </div>

            {/* Filter Panel */}
            {showFilters && (
                <div className="bg-bio-gray-900 border border-bio-gray-800 rounded-xl p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Country Filter */}
                        <div>
                            <label className="block text-sm font-medium text-bio-gray-400 mb-2">
                                {t.country}
                            </label>
                            <div className="relative">
                                <select
                                    value={selectedCountry}
                                    onChange={(e) => { setSelectedCountry(e.target.value); setVisibleCount(ITEMS_PER_PAGE); }}
                                    className="w-full appearance-none px-4 py-3 bg-bio-gray-800 border border-bio-gray-700 rounded-lg text-bio-white focus:border-bio-accent outline-none transition-colors"
                                >
                                    <option value="all">{t.allCountries}</option>
                                    {availableCountries.map(country => (
                                        <option key={country} value={country}>{country}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-bio-gray-500 pointer-events-none" />
                            </div>
                        </div>

                        {/* Type Filter */}
                        <div>
                            <label className="block text-sm font-medium text-bio-gray-400 mb-2">
                                {t.type}
                            </label>
                            <div className="relative">
                                <select
                                    value={selectedType}
                                    onChange={(e) => { setSelectedType(e.target.value); setVisibleCount(ITEMS_PER_PAGE); }}
                                    className="w-full appearance-none px-4 py-3 bg-bio-gray-800 border border-bio-gray-700 rounded-lg text-bio-white focus:border-bio-accent outline-none transition-colors"
                                >
                                    <option value="all">{t.allTypes}</option>
                                    {availableTypes.map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-bio-gray-500 pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    {/* Clear Filters */}
                    {hasActiveFilters && (
                        <div className="mt-4 pt-4 border-t border-bio-gray-800">
                            <button
                                onClick={clearFilters}
                                className="text-bio-accent hover:underline text-sm"
                            >
                                {t.clearFilters}
                            </button>
                        </div>
                    )}
                </div>
            )}



            {/* Results Count */}
            <p className="text-bio-gray-500 text-sm mb-6">
                {t.showing} {visibleFestivals.length} {t.of} {filteredFestivals.length} {t.festivals}
            </p>

            {/* Festivals Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {visibleFestivals.map((festival) => (
                    <a
                        key={festival.id}
                        href={lang === 'de' ? `/de/festivals/${festival.slug}` : `/festivals/${festival.slug}`}
                        className="group bg-bio-gray-900 border border-bio-gray-800 rounded-xl overflow-hidden hover:border-bio-gray-600 transition-all"
                    >
                        <div className="aspect-video relative overflow-hidden bg-bio-gray-800">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
                            <img
                                src={festival.image}
                                alt={festival.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                loading="lazy"
                            />
                            <div className="absolute bottom-3 left-3 z-20">
                                <span className="px-3 py-1 bg-bio-accent/90 rounded-full text-white text-xs font-medium">
                                    {festival.artistSlugs?.length || 0} {t.artists}
                                </span>
                            </div>
                        </div>
                        <div className="p-5">
                            <h3 className="text-lg font-semibold text-bio-white mb-3 group-hover:text-bio-accent transition-colors">
                                {festival.name}
                            </h3>
                            <div className="space-y-2 mb-4">
                                <div className="flex items-center gap-2 text-sm text-bio-gray-400">
                                    <MapPin className="w-4 h-4" />
                                    {festival.location}, {festival.country}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-bio-gray-400">
                                    <Calendar className="w-4 h-4" />
                                    {festival.date}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-bio-gray-400">
                                    <Users className="w-4 h-4" />
                                    {festival.capacity}
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="px-2 py-1 bg-bio-gray-800 rounded text-xs text-bio-gray-400">
                                    {festival.type}
                                </span>
                                <span className="text-bio-accent text-sm flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {t.viewDetails}
                                    <ArrowRight className="w-4 h-4" />
                                </span>
                            </div>
                        </div>
                    </a>
                ))}
            </div>

            {/* Load More / No Results */}
            {visibleFestivals.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-bio-gray-400 mb-4">{t.noFestivals}</p>
                    <button onClick={clearFilters} className="text-bio-accent hover:underline">
                        {t.clearFilters}
                    </button>
                </div>
            ) : hasMore && (
                <div className="text-center">
                    <button
                        onClick={loadMore}
                        className="inline-flex items-center gap-2 px-8 py-3 bg-bio-gray-800 border border-bio-gray-700 rounded-lg text-bio-white font-medium hover:bg-bio-gray-700 transition-colors"
                    >
                        {t.loadMore}
                        <ChevronDown className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
}
