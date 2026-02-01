import { useState, useMemo } from 'react';
import { Search, Filter, MapPin, Music, ChevronDown, X, Building2 } from 'lucide-react';

interface Artist {
    id: string;
    name: string;
    slug: string;
    type: 'dj' | 'live' | 'hybrid';
    genres: string[];
    bpmRange: { min: number; max: number };
    location: string;
    shortBio: string;
    image: string;
    isVerified: boolean;
    availability: 'available' | 'limited' | 'unavailable';
}

interface Label {
    id: string;
    name: string;
    slug: string;
    location: string;
    shortBio: string;
    image: string;
    genres: string[];
    isVerified: boolean;
    artistCount: number;
    founded: number;
}

interface Props {
    artists: Artist[];
    labels: Label[];
    lang?: 'en' | 'de';
}

const ITEMS_PER_PAGE = 6;

const directoryTranslations = {
    en: {
        artists: 'Artists',
        labels: 'Labels',
        searchArtists: 'Search artists...',
        searchLabels: 'Search labels...',
        filters: 'Filters',
        type: 'Type',
        allTypes: 'All Types',
        dj: 'DJ',
        live: 'Live Act',
        hybrid: 'Hybrid',
        genre: 'Genre',
        allGenres: 'All Genres',
        clearFilters: 'Clear all filters',
        showing: 'Showing',
        of: 'of',
        verified: 'Verified',
        noArtists: 'No artists found matching your criteria.',
        noLabels: 'No labels found matching your criteria.',
        loadMore: 'Load More',
        artistCount: 'artists',
        since: 'Since',
        country: 'Country',
        allCountries: 'All Countries'
    },
    de: {
        artists: 'Künstler',
        labels: 'Labels',
        searchArtists: 'Künstler suchen...',
        searchLabels: 'Labels suchen...',
        filters: 'Filter',
        type: 'Typ',
        allTypes: 'Alle Typen',
        dj: 'DJ',
        live: 'Live Act',
        hybrid: 'Hybrid',
        genre: 'Genre',
        allGenres: 'Alle Genres',
        clearFilters: 'Filter zurücksetzen',
        showing: 'Zeige',
        of: 'von',
        verified: 'Verifiziert',
        noArtists: 'Keine Künstler gefunden.',
        noLabels: 'Keine Labels gefunden.',
        loadMore: 'Mehr laden',
        artistCount: 'Künstler',
        since: 'Seit',
        country: 'Land',
        allCountries: 'Alle Länder'
    }
};

export default function ArtistDirectory({ artists = [], labels = [], lang = 'en' }: Props) {
    const t = directoryTranslations[lang];

    // Ensure we have valid arrays
    const safeArtists = Array.isArray(artists) ? artists : [];
    const safeLabels = Array.isArray(labels) ? labels : [];

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedType, setSelectedType] = useState<string>('all');
    const [selectedGenre, setSelectedGenre] = useState<string>('all');
    const [selectedCountry, setSelectedCountry] = useState<string>('all');
    const [showFilters, setShowFilters] = useState(false);
    const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
    const [activeTab, setActiveTab] = useState<'artists' | 'labels'>('artists');

    // Helper to extract country
    const extractCountry = (loc: string) => {
        if (!loc) return null;
        const parts = loc.split(',');
        return parts.length > 1 ? parts[parts.length - 1].trim() : loc.trim();
    };

    // Helper to filter items (reusable for facets)
    const filterItems = (items: any[], criteria: { query?: string, type?: string, genre?: string, country?: string }) => {
        return items.filter(item => {
            const matchesSearch = !criteria.query ||
                item.name?.toLowerCase().includes(criteria.query.toLowerCase()) ||
                (item.location && item.location.toLowerCase().includes(criteria.query.toLowerCase())) ||
                item.genres?.some((g: string) => g.toLowerCase().includes(criteria.query!.toLowerCase()));

            const matchesType = !criteria.type || criteria.type === 'all' || item.type === criteria.type;
            const matchesGenre = !criteria.genre || criteria.genre === 'all' || item.genres?.includes(criteria.genre);

            let matchesCountry = true;
            if (criteria.country && criteria.country !== 'all') {
                matchesCountry = item.location && item.location.includes(criteria.country);
            }

            return matchesSearch && matchesType && matchesGenre && matchesCountry;
        });
    };

    // Derived Facets (Dynamic Options) - these depend on OTHER filters
    const availableGenres = useMemo(() => {
        const genres = new Set<string>();
        // Filter by everything EXCEPT Genre
        // We use the ACTIVE filters for Query, Type, Country to limit the Available Genres
        const artistsForGenres = filterItems(safeArtists, { query: searchQuery, type: selectedType, country: selectedCountry });
        const labelsForGenres = filterItems(safeLabels, { query: searchQuery, country: selectedCountry }); // Labels don't have type

        if (activeTab === 'artists') {
            artistsForGenres.forEach(a => a.genres?.forEach((g: string) => genres.add(g)));
        } else {
            labelsForGenres.forEach(l => l.genres?.forEach((g: string) => genres.add(g)));
        }
        return Array.from(genres).sort();
    }, [safeArtists, safeLabels, searchQuery, selectedType, selectedCountry, activeTab]);

    const availableCountries = useMemo(() => {
        const countries = new Set<string>();
        // Filter by everything EXCEPT Country
        const artistsForCountries = filterItems(safeArtists, { query: searchQuery, type: selectedType, genre: selectedGenre });
        const labelsForCountries = filterItems(safeLabels, { query: searchQuery, genre: selectedGenre });

        if (activeTab === 'artists') {
            artistsForCountries.forEach(a => {
                const c = extractCountry(a.location);
                if (c) countries.add(c);
            });
        } else {
            labelsForCountries.forEach(l => {
                const c = extractCountry(l.location);
                if (c) countries.add(c);
            });
        }
        return Array.from(countries).sort();
    }, [safeArtists, safeLabels, searchQuery, selectedType, selectedGenre, activeTab]);


    // Final Filtered Results (respecting ALL filters)
    const filteredArtists = useMemo(() => {
        return filterItems(safeArtists, {
            query: searchQuery,
            type: selectedType,
            genre: selectedGenre,
            country: selectedCountry
        });
    }, [safeArtists, searchQuery, selectedType, selectedGenre, selectedCountry]);

    const filteredLabels = useMemo(() => {
        return filterItems(safeLabels, {
            query: searchQuery,
            genre: selectedGenre,
            country: selectedCountry
        });
    }, [safeLabels, searchQuery, selectedGenre, selectedCountry]);

    const visibleArtists = filteredArtists.slice(0, visibleCount);
    const visibleLabels = filteredLabels.slice(0, visibleCount);
    const hasMoreArtists = visibleCount < filteredArtists.length;
    const hasMoreLabels = visibleCount < filteredLabels.length;

    const loadMore = () => {
        setVisibleCount(prev => prev + ITEMS_PER_PAGE);
    };

    const clearFilters = () => {
        setSearchQuery('');
        setSelectedType('all');
        setSelectedGenre('all');
        setSelectedCountry('all');
        setVisibleCount(ITEMS_PER_PAGE);
    };

    const hasActiveFilters = searchQuery || selectedType !== 'all' || selectedGenre !== 'all' || selectedCountry !== 'all';

    return (
        <div>
            {/* Top Bar: Tabs + Search + Filter */}
            <div className="flex flex-col lg:flex-row gap-4 mb-8">
                {/* Tabs */}
                <div className="flex gap-4 shrink-0">
                    <button
                        onClick={() => { setActiveTab('artists'); setVisibleCount(ITEMS_PER_PAGE); }}
                        className={`px-6 py-3 rounded-lg font-medium transition-colors ${activeTab === 'artists'
                            ? 'bg-bio-accent text-white'
                            : 'bg-bio-gray-800 text-bio-gray-400 hover:text-bio-white'
                            }`}
                    >
                        {t.artists} ({filteredArtists.length})
                    </button>
                    <button
                        onClick={() => { setActiveTab('labels'); setVisibleCount(ITEMS_PER_PAGE); }}
                        className={`px-6 py-3 rounded-lg font-medium transition-colors ${activeTab === 'labels'
                            ? 'bg-bio-accent text-white'
                            : 'bg-bio-gray-800 text-bio-gray-400 hover:text-bio-white'
                            }`}
                    >
                        {t.labels} ({filteredLabels.length})
                    </button>
                </div>

                {/* Search */}
                <div className="flex-1 relative min-w-[200px]">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-bio-gray-500" />
                    <input
                        type="text"
                        placeholder={activeTab === 'artists' ? t.searchArtists : t.searchLabels}
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
                    className={`shrink-0 flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${showFilters || hasActiveFilters
                        ? 'bg-bio-accent text-white'
                        : 'bg-bio-gray-800 text-bio-gray-400 hover:text-bio-white border border-bio-gray-700'
                        }`}
                >
                    <Filter className="w-5 h-5" />
                    {t.filters}
                    {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-white" />}
                </button>
            </div>

            {/* Expandable Filters */}
            {showFilters && (
                <div className="bg-bio-gray-900 border border-bio-gray-800 rounded-lg p-6 mb-8">
                    <div className="flex flex-wrap gap-6">
                        {/* Type Filter (Artists only) */}
                        {activeTab === 'artists' && (
                            <div>
                                <label className="block text-sm font-medium text-bio-gray-400 mb-2">{t.type}</label>
                                <select
                                    value={selectedType}
                                    onChange={(e) => { setSelectedType(e.target.value); setVisibleCount(ITEMS_PER_PAGE); }}
                                    className="px-4 py-2 bg-bio-gray-800 border border-bio-gray-700 rounded-lg text-bio-white focus:border-bio-accent outline-none cursor-pointer"
                                >
                                    <option value="all">{t.allTypes}</option>
                                    <option value="dj">{t.dj}</option>
                                    <option value="live">{t.live}</option>
                                    <option value="hybrid">{t.hybrid}</option>
                                </select>
                            </div>
                        )}

                        {/* Genre Filter */}
                        <div>
                            <label className="block text-sm font-medium text-bio-gray-400 mb-2">{t.genre}</label>
                            <select
                                value={selectedGenre}
                                onChange={(e) => { setSelectedGenre(e.target.value); setVisibleCount(ITEMS_PER_PAGE); }}
                                className="px-4 py-2 bg-bio-gray-800 border border-bio-gray-700 rounded-lg text-bio-white focus:border-bio-accent outline-none cursor-pointer"
                            >
                                <option value="all">{t.allGenres}</option>
                                {availableGenres.map(genre => (
                                    <option key={genre} value={genre}>{genre}</option>
                                ))}
                            </select>
                        </div>

                        {/* Country Filter */}
                        <div>
                            <label className="block text-sm font-medium text-bio-gray-400 mb-2">{t.country || 'Land'}</label>
                            <select
                                value={selectedCountry}
                                onChange={(e) => { setSelectedCountry(e.target.value); setVisibleCount(ITEMS_PER_PAGE); }}
                                className="px-4 py-2 bg-bio-gray-800 border border-bio-gray-700 rounded-lg text-bio-white focus:border-bio-accent outline-none cursor-pointer"
                            >
                                <option value="all">{t.allCountries || 'Alle Länder'}</option>
                                {availableCountries.map(country => (
                                    <option key={country} value={country}>{country}</option>
                                ))}
                            </select>
                        </div>

                        {/* Clear Filters */}
                        {hasActiveFilters && (
                            <div className="flex items-end">
                                <button
                                    onClick={clearFilters}
                                    className="text-[#ff0700] hover:underline text-sm"
                                >
                                    {t.clearFilters}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Results Count */}
            <p className="text-[#737373] text-sm mb-6">
                {t.showing} {activeTab === 'artists' ? visibleArtists.length : visibleLabels.length} {t.of} {activeTab === 'artists' ? filteredArtists.length : filteredLabels.length} {activeTab === 'artists' ? t.artists : t.labels}
            </p>

            {/* Artists Grid */}
            {activeTab === 'artists' && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {visibleArtists.map((artist) => (
                            <a
                                key={artist.id}
                                href={lang === 'de' ? `/de/artists/${artist.slug}` : `/artists/${artist.slug}`}
                                className="group bg-bio-gray-900 border border-bio-gray-800 rounded-xl overflow-hidden hover:border-bio-gray-700 transition-all hover:shadow-lg"
                            >
                                <div className="aspect-square relative overflow-hidden bg-bio-gray-800">
                                    <div className="absolute inset-0 bg-bio-gray-800 animate-pulse" />
                                    <img
                                        src={artist.image}
                                        alt={artist.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 relative z-10 opacity-0 transition-opacity duration-300"
                                        loading="lazy"
                                        onLoad={(e) => e.currentTarget.classList.remove('opacity-0')}
                                    />
                                    {artist.isVerified && (
                                        <div className="absolute top-3 right-3 px-2 py-1 bg-bio-accent/90 rounded text-white text-xs font-medium z-20">
                                            {t.verified}
                                        </div>
                                    )}
                                    <div className="absolute bottom-3 left-3 z-20">
                                        <span className="px-3 py-1 bg-bio-black/70 backdrop-blur-sm rounded-full text-white text-sm capitalize border border-white/10">
                                            {artist.type === 'dj' ? 'DJ' : artist.type}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-5">
                                    <h3 className="text-lg font-semibold text-bio-white mb-2 group-hover:text-bio-accent transition-colors">
                                        {artist.name}
                                    </h3>
                                    <div className="flex items-center gap-2 text-sm text-bio-gray-400 mb-3">
                                        <MapPin className="w-4 h-4" />
                                        {artist.location}
                                    </div>
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {artist.genres.slice(0, 2).map((genre: string) => (
                                            <span key={genre} className="px-2 py-1 bg-bio-gray-800 rounded-full text-xs text-bio-gray-400">
                                                {genre}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-bio-gray-500">
                                        <Music className="w-4 h-4" />
                                        {artist.bpmRange.min}–{artist.bpmRange.max} BPM
                                    </div>
                                </div>
                            </a>
                        ))}
                    </div>

                    {/* Load More / No Results */}
                    {visibleArtists.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-bio-gray-400 mb-4">{t.noArtists}</p>
                            <button onClick={clearFilters} className="text-bio-accent hover:underline">
                                {t.clearFilters}
                            </button>
                        </div>
                    ) : hasMoreArtists && (
                        <div className="text-center">
                            <button
                                onClick={loadMore}
                                className="inline-flex items-center gap-2 px-8 py-3 bg-bio-gray-800 border border-bio-gray-700 rounded-lg text-bio-white font-medium hover:bg-bio-gray-700 transition-colors"
                            >
                                {t.loadMore} {t.artists}
                                <ChevronDown className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </>
            )}

            {/* Labels Grid */}
            {activeTab === 'labels' && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {visibleLabels.map((label) => (
                            <div
                                key={label.id}
                                className="group bg-bio-gray-900 border border-bio-gray-800 rounded-xl overflow-hidden hover:border-bio-gray-700 transition-all hover:shadow-lg"
                            >
                                <div className="aspect-video relative overflow-hidden bg-bio-gray-800">
                                    <div className="absolute inset-0 bg-bio-gray-800 animate-pulse" />
                                    <img
                                        src={label.image}
                                        alt={label.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 relative z-10 opacity-0 transition-opacity duration-300"
                                        loading="lazy"
                                        onLoad={(e) => e.currentTarget.classList.remove('opacity-0')}
                                    />
                                    {label.isVerified && (
                                        <div className="absolute top-3 right-3 px-2 py-1 bg-bio-accent/90 rounded text-white text-xs font-medium z-20">
                                            {t.verified}
                                        </div>
                                    )}
                                </div>
                                <div className="p-5">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Building2 className="w-4 h-4 text-bio-accent" />
                                        <span className="text-xs text-bio-gray-500 uppercase tracking-wider">{t.labels}</span>
                                    </div>
                                    <h3 className="text-lg font-semibold text-bio-white mb-2 group-hover:text-bio-accent transition-colors">
                                        {label.name}
                                    </h3>
                                    <div className="flex items-center gap-2 text-sm text-bio-gray-400 mb-3">
                                        <MapPin className="w-4 h-4" />
                                        {label.location}
                                    </div>
                                    <p className="text-sm text-bio-gray-500 mb-3 line-clamp-2">{label.shortBio}</p>
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {label.genres.slice(0, 2).map((genre: string) => (
                                            <span key={genre} className="px-2 py-1 bg-bio-gray-800 rounded-full text-xs text-bio-gray-400">
                                                {genre}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="flex items-center justify-between text-sm text-bio-gray-500">
                                        <span>{label.artistCount} {t.artistCount}</span>
                                        <span>{t.since} {label.founded}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Load More / No Results */}
                    {visibleLabels.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-bio-gray-400 mb-4">{t.noLabels}</p>
                            <button onClick={clearFilters} className="text-bio-accent hover:underline">
                                {t.clearFilters}
                            </button>
                        </div>
                    ) : hasMoreLabels && (
                        <div className="text-center">
                            <button
                                onClick={loadMore}
                                className="inline-flex items-center gap-2 px-8 py-3 bg-bio-gray-800 border border-bio-gray-700 rounded-lg text-bio-white font-medium hover:bg-bio-gray-700 transition-colors"
                            >
                                {t.loadMore} {t.labels}
                                <ChevronDown className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
