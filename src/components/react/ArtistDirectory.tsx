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
        since: 'Since'
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
        since: 'Seit'
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
    const [showFilters, setShowFilters] = useState(false);
    const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
    const [activeTab, setActiveTab] = useState<'artists' | 'labels'>('artists');

    // Get all unique genres
    const allGenres = useMemo(() => {
        const genres = new Set<string>();
        safeArtists.forEach(a => a.genres?.forEach(g => genres.add(g)));
        safeLabels.forEach(l => l.genres?.forEach(g => genres.add(g)));
        return Array.from(genres).sort();
    }, [safeArtists, safeLabels]);

    // Filter artists
    const filteredArtists = useMemo(() => {
        return safeArtists.filter(artist => {
            const matchesSearch = artist.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                artist.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                artist.genres?.some(g => g.toLowerCase().includes(searchQuery.toLowerCase()));

            const matchesType = selectedType === 'all' || artist.type === selectedType;
            const matchesGenre = selectedGenre === 'all' || artist.genres?.includes(selectedGenre);

            return matchesSearch && matchesType && matchesGenre;
        });
    }, [safeArtists, searchQuery, selectedType, selectedGenre]);

    // Filter labels
    const filteredLabels = useMemo(() => {
        return safeLabels.filter(label => {
            const matchesSearch = label.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                label.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                label.genres?.some(g => g.toLowerCase().includes(searchQuery.toLowerCase()));

            const matchesGenre = selectedGenre === 'all' || label.genres?.includes(selectedGenre);

            return matchesSearch && matchesGenre;
        });
    }, [safeLabels, searchQuery, selectedGenre]);

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
        setVisibleCount(ITEMS_PER_PAGE);
    };

    const hasActiveFilters = searchQuery || selectedType !== 'all' || selectedGenre !== 'all';

    return (
        <div>
            {/* Tabs */}
            <div className="flex gap-4 mb-8">
                <button
                    onClick={() => { setActiveTab('artists'); setVisibleCount(ITEMS_PER_PAGE); }}
                    className={`px-6 py-3 rounded-lg font-medium transition-colors ${activeTab === 'artists'
                        ? 'bg-[#ff0700] text-white'
                        : 'bg-[#262626] text-[#a3a3a3] hover:text-white'
                        }`}
                >
                    {t.artists} ({filteredArtists.length})
                </button>
                <button
                    onClick={() => { setActiveTab('labels'); setVisibleCount(ITEMS_PER_PAGE); }}
                    className={`px-6 py-3 rounded-lg font-medium transition-colors ${activeTab === 'labels'
                        ? 'bg-[#ff0700] text-white'
                        : 'bg-[#262626] text-[#a3a3a3] hover:text-white'
                        }`}
                >
                    {t.labels} ({filteredLabels.length})
                </button>
            </div>

            {/* Search and Filter Bar */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                {/* Search */}
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#737373]" />
                    <input
                        type="text"
                        placeholder={activeTab === 'artists' ? t.searchArtists : t.searchLabels}
                        value={searchQuery}
                        onChange={(e) => { setSearchQuery(e.target.value); setVisibleCount(ITEMS_PER_PAGE); }}
                        className="w-full pl-12 pr-4 py-3 bg-[#262626] border border-[#404040] rounded-lg text-white placeholder-[#737373] focus:border-[#ff0700] outline-none transition-colors"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#737373] hover:text-white"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {/* Filter Toggle */}
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${showFilters || hasActiveFilters
                        ? 'bg-[#ff0700] text-white'
                        : 'bg-[#262626] text-[#a3a3a3] hover:text-white border border-[#404040]'
                        }`}
                >
                    <Filter className="w-5 h-5" />
                    {t.filters}
                    {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-white" />}
                </button>
            </div>

            {/* Expanded Filters */}
            {showFilters && (
                <div className="bg-[#171717] border border-[#404040] rounded-lg p-6 mb-8">
                    <div className="flex flex-wrap gap-6">
                        {/* Type Filter (Artists only) */}
                        {activeTab === 'artists' && (
                            <div>
                                <label className="block text-sm font-medium text-[#a3a3a3] mb-2">{t.type}</label>
                                <select
                                    value={selectedType}
                                    onChange={(e) => { setSelectedType(e.target.value); setVisibleCount(ITEMS_PER_PAGE); }}
                                    className="px-4 py-2 bg-[#262626] border border-[#404040] rounded-lg text-white focus:border-[#ff0700] outline-none cursor-pointer"
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
                            <label className="block text-sm font-medium text-[#a3a3a3] mb-2">{t.genre}</label>
                            <select
                                value={selectedGenre}
                                onChange={(e) => { setSelectedGenre(e.target.value); setVisibleCount(ITEMS_PER_PAGE); }}
                                className="px-4 py-2 bg-[#262626] border border-[#404040] rounded-lg text-white focus:border-[#ff0700] outline-none cursor-pointer"
                            >
                                <option value="all">{t.allGenres}</option>
                                {allGenres.map(genre => (
                                    <option key={genre} value={genre}>{genre}</option>
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
                                className="group bg-[#171717] border border-[#262626] rounded-xl overflow-hidden hover:border-[#404040] transition-all"
                            >
                                <div className="aspect-square relative overflow-hidden bg-[#262626]">
                                    <img
                                        src={artist.image}
                                        alt={artist.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        loading="lazy"
                                    />
                                    {artist.isVerified && (
                                        <div className="absolute top-3 right-3 px-2 py-1 bg-[#ff0700]/90 rounded text-white text-xs font-medium">
                                            {t.verified}
                                        </div>
                                    )}
                                    <div className="absolute bottom-3 left-3">
                                        <span className="px-3 py-1 bg-black/70 backdrop-blur-sm rounded-full text-white text-sm capitalize">
                                            {artist.type === 'dj' ? 'DJ' : artist.type}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-5">
                                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-[#ff0700] transition-colors">
                                        {artist.name}
                                    </h3>
                                    <div className="flex items-center gap-2 text-sm text-[#a3a3a3] mb-3">
                                        <MapPin className="w-4 h-4" />
                                        {artist.location}
                                    </div>
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {artist.genres.slice(0, 2).map((genre) => (
                                            <span key={genre} className="px-2 py-1 bg-[#262626] rounded-full text-xs text-[#a3a3a3]">
                                                {genre}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-[#737373]">
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
                            <p className="text-[#a3a3a3] mb-4">{t.noArtists}</p>
                            <button onClick={clearFilters} className="text-[#ff0700] hover:underline">
                                {t.clearFilters}
                            </button>
                        </div>
                    ) : hasMoreArtists && (
                        <div className="text-center">
                            <button
                                onClick={loadMore}
                                className="inline-flex items-center gap-2 px-8 py-3 bg-[#262626] border border-[#404040] rounded-lg text-white font-medium hover:bg-[#404040] transition-colors"
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
                                className="group bg-[#171717] border border-[#262626] rounded-xl overflow-hidden hover:border-[#404040] transition-all"
                            >
                                <div className="aspect-video relative overflow-hidden bg-[#262626]">
                                    <img
                                        src={label.image}
                                        alt={label.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        loading="lazy"
                                    />
                                    {label.isVerified && (
                                        <div className="absolute top-3 right-3 px-2 py-1 bg-[#ff0700]/90 rounded text-white text-xs font-medium">
                                            {t.verified}
                                        </div>
                                    )}
                                </div>
                                <div className="p-5">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Building2 className="w-4 h-4 text-[#ff0700]" />
                                        <span className="text-xs text-[#737373] uppercase tracking-wider">{t.labels}</span>
                                    </div>
                                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-[#ff0700] transition-colors">
                                        {label.name}
                                    </h3>
                                    <div className="flex items-center gap-2 text-sm text-[#a3a3a3] mb-3">
                                        <MapPin className="w-4 h-4" />
                                        {label.location}
                                    </div>
                                    <p className="text-sm text-[#737373] mb-3">{label.shortBio}</p>
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {label.genres.slice(0, 2).map((genre) => (
                                            <span key={genre} className="px-2 py-1 bg-[#262626] rounded-full text-xs text-[#a3a3a3]">
                                                {genre}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="flex items-center justify-between text-sm text-[#737373]">
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
                            <p className="text-[#a3a3a3] mb-4">{t.noLabels}</p>
                            <button onClick={clearFilters} className="text-[#ff0700] hover:underline">
                                {t.clearFilters}
                            </button>
                        </div>
                    ) : hasMoreLabels && (
                        <div className="text-center">
                            <button
                                onClick={loadMore}
                                className="inline-flex items-center gap-2 px-8 py-3 bg-[#262626] border border-[#404040] rounded-lg text-white font-medium hover:bg-[#404040] transition-colors"
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
