import { useState, useRef } from 'react';
import {
    Search,
    Plus,
    Trash2,
    Edit2,
    MapPin,
    Music2,
    XCircle,
    Upload,
    Image as ImageIcon,
    CheckCircle,
    ExternalLink,
    Filter
} from 'lucide-react';
import { artists as frontendArtists } from '../../../data/artists';
import type { Artist } from '../../../types/types';

export default function ArtistTable() {
    const [artistList, setArtistList] = useState<Artist[]>(frontendArtists);
    const [search, setSearch] = useState('');
    const [genreFilter, setGenreFilter] = useState<string>('all');
    const [typeFilter, setTypeFilter] = useState<string>('all');
    const [verifiedFilter, setVerifiedFilter] = useState<string>('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingArtist, setEditingArtist] = useState<Artist | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Get unique genres and types
    const allGenres = [...new Set(artistList.flatMap(a => a.genres || []))].sort();
    const allTypes = [...new Set(artistList.map(a => a.type))].sort();

    // Filter artists
    const filteredArtists = artistList.filter(a => {
        const matchesSearch = a.name.toLowerCase().includes(search.toLowerCase()) ||
            a.location?.toLowerCase().includes(search.toLowerCase());
        const matchesGenre = genreFilter === 'all' || a.genres?.includes(genreFilter);
        const matchesType = typeFilter === 'all' || a.type === typeFilter;
        const matchesVerified = verifiedFilter === 'all' ||
            (verifiedFilter === 'verified' && a.isVerified !== false) ||
            (verifiedFilter === 'pending' && a.isVerified === false);
        return matchesSearch && matchesGenre && matchesType && matchesVerified;
    });

    const handleDelete = (slug: string) => {
        if (confirm('Are you sure you want to delete this artist?')) {
            setArtistList(artistList.filter(a => a.slug !== slug));
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const artistData: Partial<Artist> = {
            name: formData.get('name') as string,
            slug: (formData.get('name') as string).toLowerCase().replace(/\s+/g, '-'),
            type: formData.get('type') as 'dj' | 'live' | 'hybrid',
            genres: (formData.get('genres') as string).split(',').map(g => g.trim()).filter(Boolean),
            location: formData.get('location') as string,
            image: imagePreview || editingArtist?.image || '/artists/default.png',
            bio: formData.get('bio') as string,
            socials: {
                instagram: formData.get('instagram') as string || undefined,
                soundcloud: formData.get('soundcloud') as string || undefined,
                spotify: formData.get('spotify') as string || undefined,
            },
            isVerified: formData.get('isVerified') === 'true',
        };

        if (editingArtist) {
            setArtistList(artistList.map(a => a.slug === editingArtist.slug ? { ...a, ...artistData } as Artist : a));
        } else {
            setArtistList([...artistList, artistData as Artist]);
        }

        closeModal();
    };

    const openCreateModal = () => {
        setEditingArtist(null);
        setImagePreview(null);
        setIsModalOpen(true);
    };

    const openEditModal = (artist: Artist) => {
        setEditingArtist(artist);
        setImagePreview(null);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingArtist(null);
        setImagePreview(null);
    };

    const clearFilters = () => {
        setSearch('');
        setGenreFilter('all');
        setTypeFilter('all');
        setVerifiedFilter('all');
    };

    const hasFilters = search || genreFilter !== 'all' || typeFilter !== 'all' || verifiedFilter !== 'all';

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row gap-4 justify-between">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-bio-gray-500" />
                    <input
                        type="text"
                        placeholder="Search artists..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-bio-gray-900 border border-bio-gray-800 rounded-lg text-white placeholder-bio-gray-500 focus:border-bio-accent outline-none"
                    />
                </div>
                <button
                    onClick={openCreateModal}
                    className="flex items-center gap-2 px-6 py-3 bg-bio-accent text-white rounded-lg hover:bg-bio-accent-hover transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Add Artist
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 items-center">
                <Filter className="w-4 h-4 text-bio-gray-400" />
                <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="px-3 py-2 bg-bio-gray-900 border border-bio-gray-800 rounded-lg text-white text-sm"
                >
                    <option value="all">All Types</option>
                    {allTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                    ))}
                </select>
                <select
                    value={genreFilter}
                    onChange={(e) => setGenreFilter(e.target.value)}
                    className="px-3 py-2 bg-bio-gray-900 border border-bio-gray-800 rounded-lg text-white text-sm"
                >
                    <option value="all">All Genres</option>
                    {allGenres.map(genre => (
                        <option key={genre} value={genre}>{genre}</option>
                    ))}
                </select>
                <select
                    value={verifiedFilter}
                    onChange={(e) => setVerifiedFilter(e.target.value)}
                    className="px-3 py-2 bg-bio-gray-900 border border-bio-gray-800 rounded-lg text-white text-sm"
                >
                    <option value="all">All Status</option>
                    <option value="verified">Verified</option>
                    <option value="pending">Pending</option>
                </select>
                {hasFilters && (
                    <button onClick={clearFilters} className="text-bio-accent text-sm hover:underline">
                        Clear filters
                    </button>
                )}
                <span className="text-sm text-bio-gray-500 ml-auto">
                    {filteredArtists.length} of {artistList.length} artists
                </span>
            </div>

            {/* Artists Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredArtists.map((artist) => (
                    <div
                        key={artist.slug}
                        className="bg-bio-gray-900 border border-bio-gray-800 rounded-xl overflow-hidden hover:border-bio-gray-700 transition-all"
                    >
                        <div className="aspect-square relative bg-bio-gray-800">
                            {artist.image ? (
                                <img
                                    src={artist.image}
                                    alt={artist.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Music2 className="w-12 h-12 text-bio-gray-600" />
                                </div>
                            )}
                            {/* Verified Badge */}
                            {artist.isVerified !== false && (
                                <div className="absolute top-3 left-3">
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                </div>
                            )}
                            {/* Actions */}
                            <div className="absolute top-3 right-3 flex gap-2">
                                <button
                                    onClick={() => openEditModal(artist)}
                                    className="p-2 bg-black/50 backdrop-blur-sm rounded-lg hover:bg-white text-white hover:text-black transition-colors"
                                >
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(artist.slug)}
                                    className="p-2 bg-black/50 backdrop-blur-sm rounded-lg hover:bg-red-500 text-white transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <div className="p-4">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="font-bold text-white truncate">{artist.name}</h3>
                                <a
                                    href={`/artists/${artist.slug}`}
                                    target="_blank"
                                    className="text-bio-gray-500 hover:text-bio-accent"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-bio-gray-400 mb-2">
                                <MapPin className="w-3 h-3" />
                                {artist.location}
                            </div>
                            <div className="flex flex-wrap gap-1">
                                <span className="px-2 py-0.5 bg-bio-accent/10 text-bio-accent rounded text-xs">
                                    {artist.type}
                                </span>
                                {artist.genres?.slice(0, 2).map(genre => (
                                    <span key={genre} className="px-2 py-0.5 bg-bio-gray-800 text-bio-gray-400 rounded text-xs">
                                        {genre}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
                    <div className="bg-bio-gray-900 border border-bio-gray-800 rounded-xl w-full max-w-2xl my-8">
                        <div className="flex justify-between items-center p-6 border-b border-bio-gray-800">
                            <h3 className="text-xl font-bold text-white">
                                {editingArtist ? 'Edit Artist' : 'Add New Artist'}
                            </h3>
                            <button onClick={closeModal} className="text-bio-gray-400 hover:text-white">
                                <XCircle className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                            {/* Image Upload */}
                            <div>
                                <label className="block text-sm font-medium text-bio-gray-300 mb-2">Artist Image</label>
                                <div className="flex gap-4 items-start">
                                    <div
                                        className="w-24 h-24 bg-bio-gray-800 rounded-xl overflow-hidden flex items-center justify-center border border-bio-gray-700 cursor-pointer hover:border-bio-accent transition-colors"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        {imagePreview ? (
                                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                        ) : editingArtist?.image ? (
                                            <img src={editingArtist.image} alt="Current" className="w-full h-full object-cover" />
                                        ) : (
                                            <ImageIcon className="w-8 h-8 text-bio-gray-600" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="btn-ghost text-sm flex items-center gap-2"
                                        >
                                            <Upload className="w-4 h-4" />
                                            Upload Image
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-bio-gray-300 mb-1">Name</label>
                                    <input
                                        name="name"
                                        defaultValue={editingArtist?.name}
                                        required
                                        className="w-full px-4 py-2 bg-bio-black border border-bio-gray-700 rounded-lg text-white focus:border-bio-accent outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-bio-gray-300 mb-1">Type</label>
                                    <select
                                        name="type"
                                        defaultValue={editingArtist?.type || 'dj'}
                                        className="w-full px-4 py-2 bg-bio-black border border-bio-gray-700 rounded-lg text-white focus:border-bio-accent outline-none"
                                    >
                                        <option value="dj">DJ</option>
                                        <option value="live">Live Act</option>
                                        <option value="hybrid">Hybrid</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-bio-gray-300 mb-1">Location</label>
                                    <input
                                        name="location"
                                        defaultValue={editingArtist?.location}
                                        placeholder="e.g. Berlin, Germany"
                                        className="w-full px-4 py-2 bg-bio-black border border-bio-gray-700 rounded-lg text-white focus:border-bio-accent outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-bio-gray-300 mb-1">Genres (comma-separated)</label>
                                    <input
                                        name="genres"
                                        defaultValue={editingArtist?.genres?.join(', ')}
                                        placeholder="e.g. Techno, House"
                                        className="w-full px-4 py-2 bg-bio-black border border-bio-gray-700 rounded-lg text-white focus:border-bio-accent outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-bio-gray-300 mb-1">Bio</label>
                                <textarea
                                    name="bio"
                                    rows={3}
                                    defaultValue={editingArtist?.bio}
                                    className="w-full px-4 py-2 bg-bio-black border border-bio-gray-700 rounded-lg text-white focus:border-bio-accent outline-none"
                                ></textarea>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-bio-gray-300 mb-1">Instagram</label>
                                    <input
                                        name="instagram"
                                        defaultValue={editingArtist?.socials?.instagram}
                                        placeholder="@username"
                                        className="w-full px-4 py-2 bg-bio-black border border-bio-gray-700 rounded-lg text-white focus:border-bio-accent outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-bio-gray-300 mb-1">SoundCloud</label>
                                    <input
                                        name="soundcloud"
                                        defaultValue={editingArtist?.socials?.soundcloud}
                                        placeholder="URL"
                                        className="w-full px-4 py-2 bg-bio-black border border-bio-gray-700 rounded-lg text-white focus:border-bio-accent outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-bio-gray-300 mb-1">Spotify</label>
                                    <input
                                        name="spotify"
                                        defaultValue={editingArtist?.socials?.spotify}
                                        placeholder="URL"
                                        className="w-full px-4 py-2 bg-bio-black border border-bio-gray-700 rounded-lg text-white focus:border-bio-accent outline-none"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    name="isVerified"
                                    value="true"
                                    defaultChecked={editingArtist?.isVerified !== false}
                                    className="w-4 h-4 rounded bg-bio-gray-800 border-bio-gray-700"
                                />
                                <label className="text-sm text-bio-gray-300">Verified Artist</label>
                            </div>

                            <div className="flex gap-3 pt-4 border-t border-bio-gray-800">
                                <button type="button" onClick={closeModal} className="btn-ghost flex-1">
                                    Cancel
                                </button>
                                <button type="submit" className="btn-primary flex-1">
                                    {editingArtist ? 'Save Changes' : 'Create Artist'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
