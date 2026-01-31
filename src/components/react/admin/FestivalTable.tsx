import { useState, useRef, useEffect } from 'react';
import {
    Search,
    Plus,
    Trash2,
    Edit2,
    MapPin,
    Calendar,
    Users,
    XCircle,
    Upload,
    Image as ImageIcon
} from 'lucide-react';
import { type Festival } from '../../../data/festivals';
import { supabase } from '../../../lib/supabase';

// Use frontend data as initial state
// Initial state
const initialFestivals: Festival[] = [];

export default function FestivalTable() {
    const [festivals, setFestivals] = useState<Festival[]>(initialFestivals);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [countryFilter, setCountryFilter] = useState<string>('all');
    const [typeFilter, setTypeFilter] = useState<string>('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingFestival, setEditingFestival] = useState<Festival | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Fetch festivals on mount
    useEffect(() => {
        fetchFestivals();
    }, []);

    const fetchFestivals = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('festivals')
                .select('*')
                .order('date', { ascending: true });

            if (error) throw error;
            if (data) setFestivals(data as Festival[]);
        } catch (error) {
            console.error('Error fetching festivals:', error);
            setFestivals([]);
        } finally {
            setLoading(false);
        }
    };

    // Get unique countries and types for filter dropdowns
    const countries = [...new Set(festivals.map(f => f.country))].sort();
    const types = [...new Set(festivals.map(f => f.type))].sort();

    // Search and Filter
    const filteredFestivals = festivals.filter(f => {
        const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase()) ||
            f.location.toLowerCase().includes(search.toLowerCase());
        const matchesCountry = countryFilter === 'all' || f.country === countryFilter;
        const matchesType = typeFilter === 'all' || f.type === typeFilter;
        return matchesSearch && matchesCountry && matchesType;
    });

    // CRUD Operations
    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this festival?')) return;

        try {
            const { error } = await supabase
                .from('festivals') // Check table name
                .delete()
                .eq('id', id);

            if (error) throw error;
            setFestivals(festivals.filter(f => f.id !== id));
        } catch (error) {
            console.error('Error deleting festival:', error);
            alert('Failed to delete festival');
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const festivalData = {
            name: formData.get('name') as string,
            location: formData.get('location') as string,
            country: formData.get('country') as string,
            date: formData.get('date') as string,
            dateEnd: (formData.get('dateEnd') as string) || null,
            capacity: formData.get('capacity') as string,
            type: formData.get('type') as string,
            website: formData.get('website') as string,
            description: formData.get('description') as string,
            slug: (formData.get('name') as string).toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, ''),
            image: imagePreview || editingFestival?.image || '/festivals/default.png',
            // artistSlugs: editingFestival?.artistSlugs || [], // Handled separately or needs relational table
            stages: (formData.get('stages') as string)?.split(',').map(s => s.trim()).filter(Boolean) || [],
            highlights: (formData.get('highlights') as string)?.split(',').map(s => s.trim()).filter(Boolean) || [],
        };

        try {
            if (editingFestival) {
                const { error } = await supabase
                    .from('festivals')
                    .update(festivalData)
                    .eq('id', editingFestival.id);

                if (error) throw error;
                setFestivals(festivals.map(f => f.id === editingFestival.id ? { ...f, ...festivalData } as Festival : f));
            } else {
                const { data, error } = await supabase
                    .from('festivals')
                    .insert([festivalData])
                    .select()
                    .single();

                if (error) throw error;
                if (data) setFestivals([...festivals, data as Festival]);
            }
            closeModal();
        } catch (error) {
            console.error('Error saving festival:', error);
            alert('Failed to save festival');
        }
    };

    const openCreateModal = () => {
        setEditingFestival(null);
        setImagePreview(null);
        setIsModalOpen(true);
    };

    const openEditModal = (festival: Festival) => {
        setEditingFestival(festival);
        setImagePreview(festival.image.startsWith('/') ? null : festival.image);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingFestival(null);
        setImagePreview(null);
    };

    return (
        <div className="space-y-6">
            {/* Header Actions */}
            <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full sm:w-auto">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-bio-gray-400" />
                        <input
                            type="text"
                            placeholder="Search festivals..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full sm:w-64 pl-10 pr-4 py-2 bg-bio-gray-900 border border-bio-gray-800 rounded-lg text-white focus:border-bio-accent outline-none"
                        />
                    </div>
                    <button
                        onClick={openCreateModal}
                        className="btn-primary flex items-center gap-2 w-full sm:w-auto"
                    >
                        <Plus className="w-4 h-4" />
                        Add Festival
                    </button>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-3">
                    <select
                        value={countryFilter}
                        onChange={(e) => setCountryFilter(e.target.value)}
                        className="px-3 py-2 bg-bio-gray-900 border border-bio-gray-800 rounded-lg text-white text-sm focus:border-bio-accent outline-none"
                    >
                        <option value="all">All Countries</option>
                        {countries.map(country => (
                            <option key={country} value={country}>{country}</option>
                        ))}
                    </select>
                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="px-3 py-2 bg-bio-gray-900 border border-bio-gray-800 rounded-lg text-white text-sm focus:border-bio-accent outline-none"
                    >
                        <option value="all">All Types</option>
                        {types.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                    {(countryFilter !== 'all' || typeFilter !== 'all') && (
                        <button
                            onClick={() => { setCountryFilter('all'); setTypeFilter('all'); }}
                            className="px-3 py-2 text-sm text-bio-gray-400 hover:text-white transition-colors"
                        >
                            Clear Filters
                        </button>
                    )}
                    <span className="ml-auto text-sm text-bio-gray-500">
                        {filteredFestivals.length} of {festivals.length} festivals
                    </span>
                </div>
            </div>

            {/* List view (cards for better visual representation of festivals) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredFestivals.map(festival => (
                    <div key={festival.id} className="bg-bio-gray-900 border border-bio-gray-800 rounded-xl overflow-hidden group hover:border-bio-gray-700 transition-colors">
                        <div className="aspect-video bg-bio-gray-800 relative overflow-hidden">
                            {festival.image && !festival.image.includes('placeholder') ? (
                                <img
                                    src={festival.image}
                                    alt={festival.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-bio-gray-600">
                                    <MapPin className="w-8 h-8 opacity-20" />
                                </div>
                            )}
                            <div className="absolute top-4 right-4 flex gap-2">
                                <button
                                    onClick={() => openEditModal(festival)}
                                    className="p-2 bg-black/50 backdrop-blur-sm rounded-lg hover:bg-white text-white hover:text-black transition-colors"
                                >
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(festival.id)}
                                    className="p-2 bg-black/50 backdrop-blur-sm rounded-lg hover:bg-red-500 text-white transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <div className="p-5">
                            <h3 className="text-xl font-bold text-white mb-2">{festival.name}</h3>
                            <div className="space-y-2 text-sm text-bio-gray-400">
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-bio-accent" />
                                    {festival.location}, {festival.country}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-bio-accent" />
                                    {festival.date}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4 text-bio-accent" />
                                    {festival.capacity}
                                </div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-bio-gray-800 flex flex-wrap gap-2">
                                <span className="text-xs px-2 py-1 bg-bio-gray-800 rounded-full text-bio-gray-300 border border-bio-gray-700">
                                    {festival.type}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {loading && (
                <div className="p-8 text-center text-bio-gray-400">Loading festivals...</div>
            )}
            {!loading && filteredFestivals.length === 0 && (
                <div className="p-8 text-center text-bio-gray-400">No festivals found.</div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
                    <div className="bg-bio-gray-900 border border-bio-gray-800 rounded-xl w-full max-w-2xl my-8">
                        <div className="flex justify-between items-center p-6 border-b border-bio-gray-800">
                            <h3 className="text-xl font-bold text-white">
                                {editingFestival ? 'Edit Festival' : 'Add New Festival'}
                            </h3>
                            <button
                                onClick={closeModal}
                                className="text-bio-gray-400 hover:text-white"
                            >
                                <XCircle className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {/* Image Upload */}
                            <div>
                                <label className="block text-sm font-medium text-bio-gray-300 mb-2">Festival Image</label>
                                <div className="flex gap-4 items-start">
                                    <div
                                        className="w-32 h-20 bg-bio-gray-800 rounded-lg overflow-hidden flex items-center justify-center border border-bio-gray-700 cursor-pointer hover:border-bio-accent transition-colors"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        {imagePreview ? (
                                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                        ) : editingFestival?.image && !editingFestival.image.includes('placeholder') ? (
                                            <img src={editingFestival.image} alt="Current" className="w-full h-full object-cover" />
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
                                        <p className="text-xs text-bio-gray-500 mt-1">PNG, JPG up to 5MB</p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-bio-gray-300 mb-1">Name</label>
                                    <input
                                        name="name"
                                        defaultValue={editingFestival?.name}
                                        required
                                        className="w-full px-4 py-2 bg-bio-black border border-bio-gray-700 rounded-lg text-white focus:border-bio-accent outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-bio-gray-300 mb-1">Type/Genre</label>
                                    <input
                                        name="type"
                                        defaultValue={editingFestival?.type}
                                        placeholder="e.g. Techno"
                                        required
                                        className="w-full px-4 py-2 bg-bio-black border border-bio-gray-700 rounded-lg text-white focus:border-bio-accent outline-none"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-bio-gray-300 mb-1">Location (City)</label>
                                    <input
                                        name="location"
                                        defaultValue={editingFestival?.location}
                                        required
                                        className="w-full px-4 py-2 bg-bio-black border border-bio-gray-700 rounded-lg text-white focus:border-bio-accent outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-bio-gray-300 mb-1">Country</label>
                                    <input
                                        name="country"
                                        defaultValue={editingFestival?.country}
                                        required
                                        className="w-full px-4 py-2 bg-bio-black border border-bio-gray-700 rounded-lg text-white focus:border-bio-accent outline-none"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-bio-gray-300 mb-1">Date</label>
                                    <input
                                        name="date"
                                        defaultValue={editingFestival?.date}
                                        placeholder="e.g. June 24, 2026"
                                        required
                                        className="w-full px-4 py-2 bg-bio-black border border-bio-gray-700 rounded-lg text-white focus:border-bio-accent outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-bio-gray-300 mb-1">Capacity</label>
                                    <input
                                        name="capacity"
                                        defaultValue={editingFestival?.capacity}
                                        required
                                        className="w-full px-4 py-2 bg-bio-black border border-bio-gray-700 rounded-lg text-white focus:border-bio-accent outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-bio-gray-300 mb-1">Website</label>
                                <input
                                    type="url"
                                    name="website"
                                    defaultValue={editingFestival?.website}
                                    className="w-full px-4 py-2 bg-bio-black border border-bio-gray-700 rounded-lg text-white focus:border-bio-accent outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-bio-gray-300 mb-1">Description</label>
                                <textarea
                                    name="description"
                                    rows={3}
                                    defaultValue={editingFestival?.description}
                                    className="w-full px-4 py-2 bg-bio-black border border-bio-gray-700 rounded-lg text-white focus:border-bio-accent outline-none"
                                ></textarea>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-bio-gray-300 mb-1">End Date (optional)</label>
                                    <input
                                        name="dateEnd"
                                        defaultValue={editingFestival?.dateEnd}
                                        placeholder="e.g. June 28, 2026"
                                        className="w-full px-4 py-2 bg-bio-black border border-bio-gray-700 rounded-lg text-white focus:border-bio-accent outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-bio-gray-300 mb-1">Stages (comma-separated)</label>
                                    <input
                                        name="stages"
                                        defaultValue={editingFestival?.stages?.join(', ')}
                                        placeholder="e.g. Main Stage, Tent, Outdoor"
                                        className="w-full px-4 py-2 bg-bio-black border border-bio-gray-700 rounded-lg text-white focus:border-bio-accent outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-bio-gray-300 mb-1">Highlights (comma-separated)</label>
                                <input
                                    name="highlights"
                                    defaultValue={editingFestival?.highlights?.join(', ')}
                                    placeholder="e.g. Art installations, Food court, Camping"
                                    className="w-full px-4 py-2 bg-bio-black border border-bio-gray-700 rounded-lg text-white focus:border-bio-accent outline-none"
                                />
                            </div>

                            <div className="flex gap-3 pt-4 border-t border-bio-gray-800">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="btn-ghost flex-1"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn-primary flex-1"
                                >
                                    {editingFestival ? 'Save Changes' : 'Create Festival'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
