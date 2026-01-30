import { useState, useEffect, useRef } from 'react';
import { User, Bell, Camera, Save, Loader2, Check, Shield, Lock, Trash2, AlertTriangle, Calendar, Sun, Moon } from 'lucide-react';
import EventCalendar from './EventCalendar';
import { userStore, updateUser } from '../../stores/userStore';
import { useStore } from '@nanostores/react';
import { useTranslation } from '../../i18n/useTranslation';

type Tab = 'profile' | 'security' | 'notifications' | 'calendar' | 'appearance';

interface UserProfileSettingsProps {
    lang?: 'en' | 'de';
}

export default function UserProfileSettings({ lang = 'en' }: UserProfileSettingsProps) {
    const { t: allTranslations } = useTranslation(lang);
    const t = allTranslations.profile;
    const $user = useStore(userStore);
    const [activeTab, setActiveTab] = useState<Tab>('profile');
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        bio: 'Techno enthusiast and platform administrator.',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        emailNotifications: true,
        pushNotifications: false,
        marketingEmails: false,
        artistAlerts: true, // New: Notifications for favorite artists
        // General Socials
        socials: {
            instagram: '',
            twitter: '',
            linkedin: '',
            website: ''
        },
        // Role specific data containers (initialized empty, populated from userStore)
        artistProfile: {
            alias: '',
            type: 'dj',
            location: '',
            genres: '',
            bpmMin: '',
            bpmMax: '',
            instagram: '',
            soundcloud: '',
            spotify: '',
            website: ''
        },
        bookerProfile: {
            organization: '',
            type: 'club',
            location: '',
            capacity: '',
            website: ''
        },
        industryProfile: {
            organization: '',
            website: '',
            contactEmail: '',
            demoDropUrl: ''
        },
        // Guest specific
        guestProfile: {
            preferredGenres: [] as string[]
        }
    });

    // Load initial data from user store on mount and updates
    useEffect(() => {
        if ($user) {
            setFormData(prev => ({
                ...prev,
                fullName: $user.full_name || '',
                email: $user.email || '',
                artistAlerts: true, // Default true for now, would come from DB
                socials: {
                    instagram: $user.socials?.instagram || '',
                    twitter: $user.socials?.twitter || '',
                    linkedin: $user.socials?.linkedin || '',
                    website: $user.socials?.website || '',
                },
                // Populate role data if available
                artistProfile: {
                    alias: $user.artist_profile?.alias || '',
                    type: $user.artist_profile?.type || 'dj',
                    location: $user.artist_profile?.location || '',
                    genres: $user.artist_profile?.genres?.join(', ') || '',
                    bpmMin: $user.artist_profile?.bpm_range?.min?.toString() || '',
                    bpmMax: $user.artist_profile?.bpm_range?.max?.toString() || '',
                    instagram: $user.artist_profile?.socials?.instagram || '',
                    soundcloud: $user.artist_profile?.socials?.soundcloud || '',
                    spotify: $user.artist_profile?.socials?.spotify || '',
                    website: $user.artist_profile?.socials?.website || '',
                },
                bookerProfile: {
                    organization: $user.booker_profile?.organization || '',
                    type: $user.booker_profile?.type || 'club',
                    location: $user.booker_profile?.location || '',
                    capacity: $user.booker_profile?.capacity?.toString() || '',
                    website: $user.booker_profile?.website || ''
                },
                industryProfile: {
                    organization: $user.industry_profile?.organization || '',
                    website: $user.industry_profile?.website || '',
                    contactEmail: $user.industry_profile?.contact_email || '',
                    demoDropUrl: $user.industry_profile?.demo_drop_url || ''
                },
                guestProfile: {
                    preferredGenres: $user.guest_profile?.preferred_genres || []
                }
            }));
        }
    }, [$user]);

    const handleSave = async () => {
        setLoading(true);

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));

        // Prepare updates based on role
        const updates: any = {
            full_name: formData.fullName,
            email: formData.email,
            socials: formData.socials,
            // In a real app, preferences like 'artistAlerts' would be stored too
        };

        if ($user?.role === 'artist' || $user?.role === 'creative' || $user?.role === 'performer') {
            updates.artist_profile = {
                alias: formData.artistProfile.alias,
                type: formData.artistProfile.type,
                location: formData.artistProfile.location,
                bio: formData.bio, // Using main bio field
                genres: formData.artistProfile.genres.split(',').map(g => g.trim()).filter(Boolean),
                bpm_range: {
                    min: parseInt(formData.artistProfile.bpmMin) || 0,
                    max: parseInt(formData.artistProfile.bpmMax) || 0
                },
                socials: {
                    instagram: formData.artistProfile.instagram,
                    soundcloud: formData.artistProfile.soundcloud,
                    spotify: formData.artistProfile.spotify,
                    website: formData.artistProfile.website
                }
            };
        } else if ($user?.role === 'booker') {
            updates.booker_profile = {
                organization: formData.bookerProfile.organization,
                type: formData.bookerProfile.type,
                location: formData.bookerProfile.location,
                capacity: parseInt(formData.bookerProfile.capacity) || 0,
                website: formData.bookerProfile.website
            };
        } else if (['label', 'manager', 'provider'].includes($user?.role || '')) {
            updates.industry_profile = {
                organization: formData.industryProfile.organization,
                website: formData.industryProfile.website,
                contact_email: formData.industryProfile.contactEmail,
                demo_drop_url: formData.industryProfile.demoDropUrl
            };
        } else if ($user?.role === 'guest') {
            updates.guest_profile = {
                preferred_genres: formData.guestProfile.preferredGenres
            };
        }

        // Update global store
        updateUser(updates);

        setLoading(false);
        setSuccessMessage(t.settingsSaved);
        setTimeout(() => setSuccessMessage(''), 3000);
    };

    // ... (rest of code)

    // Helper for Favorites (Mock display)
    const renderFavorites = () => {
        const hasFavorites = $user?.favorite_artists && $user.favorite_artists.length > 0;

        return (
            <div className="bg-bio-gray-900 rounded-xl border border-bio-gray-800 p-6 space-y-6">
                <h2 className="text-xl font-bold text-bio-white mb-4">{t.favoriteArtists}</h2>
                <div className="space-y-4">
                    <p className="text-gray-400 text-sm">
                        {t.favoritesDesc}
                    </p>

                    {hasFavorites ? (
                        <div className="flex flex-wrap gap-2">
                            {$user.favorite_artists?.map(slug => (
                                <div key={slug} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-bio-gray-800 text-sm text-bio-gray-300 border border-bio-gray-700">
                                    <span>{slug}</span> {/* In real app: fetch name */}
                                    <button className="text-gray-500 hover:text-red-400 transition-colors">
                                        <Trash2 className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-4 bg-bio-gray-800/30 rounded-lg text-center border border-dashed border-bio-gray-700">
                            <p className="text-gray-500 text-sm">{t.noFavorites}</p>
                            <a href="/artists" className="text-bio-accent text-sm hover:underline mt-2 inline-block">{t.discoverArtists}</a>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const resizeImage = (file: File): Promise<Blob> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target?.result as string;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;
                    const MAX_WIDTH = 800;
                    const MAX_HEIGHT = 800;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx?.drawImage(img, 0, 0, width, height);

                    canvas.toBlob((blob) => {
                        if (blob) resolve(blob);
                        else reject(new Error('Canvas to Blob failed'));
                    }, 'image/jpeg', 0.8);
                };
                img.onerror = (err) => reject(err);
            };
            reader.onerror = (err) => reject(err);
        });
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Check file size (10MB limit)
        if (file.size > 10 * 1024 * 1024) {
            alert(t.maxFileSize);
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);

            // Conditional Endpoint:
            // DEV (Localhost): Use Node.js API '/api/upload-avatar'
            // PROD (Server): Use PHP script '/upload-avatar.php'
            const uploadUrl = import.meta.env.DEV ? '/api/upload-avatar' : '/upload-avatar.php';

            const res = await fetch(uploadUrl, {
                method: 'POST',
                body: formData
            });

            let data;
            try {
                data = await res.json();
            } catch (e) {
                console.error("JSON Parse error:", e);
                // If the response isn't JSON, it might be a PHP error or 404
                throw new Error(
                    import.meta.env.DEV
                        ? 'Fehler bei der lokalen API. Server logs prüfen.'
                        : 'Server antwortete mit ungültigem Format. PHP Skript vorhanden?'
                );
            }

            if (data.success && data.url) {
                // Update local User Store
                updateUser({ avatar_url: data.url });
                setSuccessMessage(t.profileUpdated);
                setTimeout(() => setSuccessMessage(''), 3000);
            } else {
                throw new Error(data.error || 'Upload failed');
            }
        } catch (err: any) {
            console.error(err);
            alert(`Fehler beim Upload: ${err.message || 'Unbekannter Fehler'}`);
        } finally {
            setLoading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    if (!$user) return null;

    const tabs: { id: Tab, label: string, icon: any }[] = [
        { id: 'profile', label: t.tabs.profile, icon: User },
        ...($user.role === 'artist' || $user.role === 'creative' || $user.role === 'performer' || $user.role === 'booker' ? [{ id: 'calendar' as Tab, label: t.tabs.calendar, icon: Calendar }] : []),
        { id: 'appearance', label: t.tabs.appearance, icon: Sun },
        { id: 'security', label: t.tabs.security, icon: Lock },
        { id: 'notifications', label: t.tabs.notifications, icon: Bell },
    ];

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-bio-white">{t.title}</h1>
                <div className="px-3 py-1 rounded-full bg-bio-accent/20 border border-bio-accent/30 text-bio-accent text-sm font-medium flex items-center gap-2 capitalize">
                    <Shield className="w-3.5 h-3.5" />
                    {$user.role || 'User'}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                {/* Sidebar / Tabs */}
                <div className="md:col-span-3">
                    <div className="bg-bio-gray-900 rounded-xl border border-bio-gray-800 overflow-hidden">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as Tab)}
                                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${activeTab === tab.id
                                    ? 'bg-bio-accent text-white'
                                    : 'text-bio-gray-400 hover:bg-bio-gray-800 hover:text-bio-white'
                                    }`}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="md:col-span-9 space-y-6">
                    {/* Success Message */}
                    {successMessage && (
                        <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                            <Check className="w-4 h-4" />
                            {successMessage}
                        </div>
                    )}

                    {/* Appearance Tab */}
                    {activeTab === 'appearance' && (
                        <div className="bg-bio-gray-900 rounded-xl border border-bio-gray-800 p-6 space-y-6">
                            <h2 className="text-xl font-bold text-bio-white mb-4">{t.appearanceTitle}</h2>
                            <div className="space-y-6">
                                <div className="p-4 bg-bio-black/50 rounded-lg border border-bio-gray-800">
                                    <h4 className="text-bio-white font-medium mb-4">{t.designMode}</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            onClick={() => updateUser({ theme: 'dark' })}
                                            className={`flex items-center justify-center gap-3 p-4 rounded-lg border-2 transition-all ${(!$user.theme || $user.theme === 'dark')
                                                ? 'border-bio-accent bg-bio-accent/10 text-bio-accent'
                                                : 'border-bio-gray-800 hover:border-bio-gray-600 text-bio-gray-400'
                                                }`}
                                        >
                                            <Moon className="w-5 h-5" />
                                            <span>{t.darkMode}</span>
                                        </button>
                                        <button
                                            onClick={() => updateUser({ theme: 'light' })}
                                            className={`flex items-center justify-center gap-3 p-4 rounded-lg border-2 transition-all ${$user.theme === 'light'
                                                ? 'border-bio-accent bg-bio-accent/10 text-bio-accent'
                                                : 'border-bio-gray-800 hover:border-bio-gray-600 text-bio-gray-400'
                                                }`}
                                        >
                                            <Sun className="w-5 h-5" />
                                            <span>{t.lightMode}</span>
                                        </button>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-4">
                                        {t.themeDesc}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Profile Tab */}
                    {activeTab === 'profile' && (
                        <>
                            <div className="bg-bio-gray-900 rounded-xl border border-bio-gray-800 p-6 space-y-6">
                                <div className="flex items-center gap-6 pb-6 border-b border-bio-gray-800">
                                    <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                        <div className="w-24 h-24 rounded-full bg-bio-gray-800 flex items-center justify-center text-gray-400 text-3xl font-bold overflow-hidden border-2 border-bio-gray-800 group-hover:border-bio-accent transition-colors">
                                            {$user.avatar_url ? (
                                                <img src={$user.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                                            ) : (
                                                $user.full_name?.charAt(0) || 'U'
                                            )}
                                        </div>
                                        <button className="absolute bottom-0 right-0 p-2 bg-bio-accent rounded-full text-white hover:bg-red-600 transition-colors">
                                            <Camera className="w-4 h-4" />
                                        </button>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                        />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-bio-white">{t.profilePicture}</h3>
                                        <p className="text-bio-gray-400 text-sm mt-1">
                                            {t.clickToChange}<br />
                                            {t.maxFileSize}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-bio-gray-300">{t.fullName}</label>
                                        <input
                                            type="text"
                                            value={formData.fullName}
                                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                            className="w-full bg-bio-black border border-bio-gray-800 rounded-lg px-4 py-2 text-bio-white focus:outline-none focus:border-bio-accent"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-bio-gray-300">{t.emailAddress}</label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full bg-bio-black border border-bio-gray-800 rounded-lg px-4 py-2 text-bio-white focus:outline-none focus:border-bio-accent"
                                        />
                                    </div>
                                    <div className="col-span-1 md:col-span-2 space-y-2">
                                        <label className="text-sm font-medium text-bio-gray-300">{t.bio}</label>
                                        <textarea
                                            rows={4}
                                            value={formData.bio}
                                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                            className="w-full bg-bio-black border border-bio-gray-800 rounded-lg px-4 py-2 text-bio-white focus:outline-none focus:border-bio-accent resize-none"
                                        />
                                    </div>

                                    {/* --- ARTIST / CREATIVE FORM --- */}
                                    {($user.role === 'artist' || $user.role === 'creative' || $user.role === 'performer') && (
                                        <>
                                            <div className="col-span-1 md:col-span-2 pt-6 border-t border-bio-gray-800">
                                                <h3 className="text-lg font-bold text-bio-white mb-4">{t.artistDetails}</h3>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-bio-gray-300">{t.artistAlias}</label>
                                                <input
                                                    type="text"
                                                    value={formData.artistProfile.alias}
                                                    onChange={(e) => setFormData({ ...formData, artistProfile: { ...formData.artistProfile, alias: e.target.value } })}
                                                    className="w-full bg-bio-black border border-bio-gray-800 rounded-lg px-4 py-2 text-bio-white focus:outline-none focus:border-bio-accent"
                                                    placeholder="Stage Name"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-300">{t.artistType}</label>
                                                <select
                                                    value={formData.artistProfile.type}
                                                    onChange={(e) => setFormData({ ...formData, artistProfile: { ...formData.artistProfile, type: e.target.value as any } })}
                                                    className="w-full bg-bio-black border border-bio-gray-800 rounded-lg px-4 py-2 text-bio-white focus:outline-none focus:border-bio-accent"
                                                >
                                                    <option value="dj">DJ</option>
                                                    <option value="live">Live Act</option>
                                                    <option value="hybrid">Hybrid</option>
                                                    <option value="visual">Visual Artist</option>
                                                    <option value="performer">Performer</option>
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-300">{t.homebase}</label>
                                                <input
                                                    type="text"
                                                    value={formData.artistProfile.location}
                                                    onChange={(e) => setFormData({ ...formData, artistProfile: { ...formData.artistProfile, location: e.target.value } })}
                                                    className="w-full bg-bio-black border border-bio-gray-800 rounded-lg px-4 py-2 text-bio-white focus:outline-none focus:border-bio-accent"
                                                    placeholder="Berlin, Germany"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-300">{t.genresComma}</label>
                                                <input
                                                    type="text"
                                                    value={formData.artistProfile.genres}
                                                    onChange={(e) => setFormData({ ...formData, artistProfile: { ...formData.artistProfile, genres: e.target.value } })}
                                                    className="w-full bg-bio-black border border-bio-gray-800 rounded-lg px-4 py-2 text-bio-white focus:outline-none focus:border-bio-accent"
                                                    placeholder="Techno, House, Ambient"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-300">{t.bpmRange}</label>
                                                <div className="flex gap-2">
                                                    <input
                                                        type="number"
                                                        value={formData.artistProfile.bpmMin}
                                                        onChange={(e) => setFormData({ ...formData, artistProfile: { ...formData.artistProfile, bpmMin: e.target.value } })}
                                                        className="w-full bg-bio-black border border-bio-gray-800 rounded-lg px-4 py-2 text-bio-white focus:outline-none focus:border-bio-accent"
                                                        placeholder="120"
                                                    />
                                                    <input
                                                        type="number"
                                                        value={formData.artistProfile.bpmMax}
                                                        onChange={(e) => setFormData({ ...formData, artistProfile: { ...formData.artistProfile, bpmMax: e.target.value } })}
                                                        className="w-full bg-bio-black border border-bio-gray-800 rounded-lg px-4 py-2 text-bio-white focus:outline-none focus:border-bio-accent"
                                                        placeholder="140"
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-span-1 md:col-span-2 pt-4">
                                                <h4 className="text-md font-semibold text-gray-300 mb-3">{t.socialMedia}</h4>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <input
                                                        type="text"
                                                        value={formData.artistProfile.instagram}
                                                        onChange={(e) => setFormData({ ...formData, artistProfile: { ...formData.artistProfile, instagram: e.target.value } })}
                                                        className="bg-bio-black border border-bio-gray-800 rounded-lg px-4 py-2 text-bio-white focus:outline-none focus:border-bio-accent"
                                                        placeholder="Instagram URL"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={formData.artistProfile.soundcloud}
                                                        onChange={(e) => setFormData({ ...formData, artistProfile: { ...formData.artistProfile, soundcloud: e.target.value } })}
                                                        className="bg-bio-black border border-bio-gray-800 rounded-lg px-4 py-2 text-bio-white focus:outline-none focus:border-bio-accent"
                                                        placeholder="SoundCloud URL"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={formData.artistProfile.spotify}
                                                        onChange={(e) => setFormData({ ...formData, artistProfile: { ...formData.artistProfile, spotify: e.target.value } })}
                                                        className="bg-bio-black border border-bio-gray-800 rounded-lg px-4 py-2 text-bio-white focus:outline-none focus:border-bio-accent"
                                                        placeholder="Spotify URL"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={formData.artistProfile.website}
                                                        onChange={(e) => setFormData({ ...formData, artistProfile: { ...formData.artistProfile, website: e.target.value } })}
                                                        className="bg-bio-black border border-bio-gray-800 rounded-lg px-4 py-2 text-bio-white focus:outline-none focus:border-bio-accent"
                                                        placeholder="Website / RA URL"
                                                    />
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {/* --- BOOKER FORM --- */}
                                    {($user.role === 'booker') && (
                                        <>
                                            <div className="col-span-1 md:col-span-2 pt-6 border-t border-bio-gray-800">
                                                <h3 className="text-lg font-bold text-bio-white mb-4">{t.bookerDetails}</h3>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-300">{t.organization}</label>
                                                <input
                                                    type="text"
                                                    value={formData.bookerProfile.organization}
                                                    onChange={(e) => setFormData({ ...formData, bookerProfile: { ...formData.bookerProfile, organization: e.target.value } })}
                                                    className="w-full bg-bio-black border border-bio-gray-800 rounded-lg px-4 py-2 text-bio-white focus:outline-none focus:border-bio-accent"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-300">{t.venueType}</label>
                                                <select
                                                    value={formData.bookerProfile.type}
                                                    onChange={(e) => setFormData({ ...formData, bookerProfile: { ...formData.bookerProfile, type: e.target.value as any } })}
                                                    className="w-full bg-bio-black border border-bio-gray-800 rounded-lg px-4 py-2 text-bio-white focus:outline-none focus:border-bio-accent"
                                                >
                                                    <option value="club">Club</option>
                                                    <option value="festival">Festival</option>
                                                    <option value="promoter">Promoter</option>
                                                    <option value="agency">Agency</option>
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-300">{t.venueLocation}</label>
                                                <input
                                                    type="text"
                                                    value={formData.bookerProfile.location}
                                                    onChange={(e) => setFormData({ ...formData, bookerProfile: { ...formData.bookerProfile, location: e.target.value } })}
                                                    className="w-full bg-bio-black border border-bio-gray-800 rounded-lg px-4 py-2 text-bio-white focus:outline-none focus:border-bio-accent"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-300">{t.venueCapacity}</label>
                                                <input
                                                    type="number"
                                                    value={formData.bookerProfile.capacity}
                                                    onChange={(e) => setFormData({ ...formData, bookerProfile: { ...formData.bookerProfile, capacity: e.target.value } })}
                                                    className="w-full bg-bio-black border border-bio-gray-800 rounded-lg px-4 py-2 text-bio-white focus:outline-none focus:border-bio-accent"
                                                />
                                            </div>
                                            <div className="col-span-1 md:col-span-2 space-y-2">
                                                <label className="text-sm font-medium text-gray-300">{t.venueWebsite}</label>
                                                <input
                                                    type="text"
                                                    value={formData.bookerProfile.website}
                                                    onChange={(e) => setFormData({ ...formData, bookerProfile: { ...formData.bookerProfile, website: e.target.value } })}
                                                    className="w-full bg-bio-black border border-bio-gray-800 rounded-lg px-4 py-2 text-bio-white focus:outline-none focus:border-bio-accent"
                                                />
                                            </div>
                                        </>
                                    )}

                                    {/* --- INDUSTRY / LABEL FORM --- */}
                                    {(['label', 'manager', 'provider'].includes($user.role || '')) && (
                                        <>
                                            <div className="col-span-1 md:col-span-2 pt-6 border-t border-bio-gray-800">
                                                <h3 className="text-lg font-bold text-bio-white mb-4">{t.businessInfo}</h3>
                                            </div>
                                            <div className="col-span-1 md:col-span-2 space-y-2">
                                                <label className="text-sm font-medium text-gray-300">{t.companyName}</label>
                                                <input
                                                    type="text"
                                                    value={formData.industryProfile.organization}
                                                    onChange={(e) => setFormData({ ...formData, industryProfile: { ...formData.industryProfile, organization: e.target.value } })}
                                                    className="w-full bg-bio-black border border-bio-gray-800 rounded-lg px-4 py-2 text-bio-white focus:outline-none focus:border-bio-accent"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-300">{t.officialWebsite}</label>
                                                <input
                                                    type="text"
                                                    value={formData.industryProfile.website}
                                                    onChange={(e) => setFormData({ ...formData, industryProfile: { ...formData.industryProfile, website: e.target.value } })}
                                                    className="w-full bg-bio-black border border-bio-gray-800 rounded-lg px-4 py-2 text-bio-white focus:outline-none focus:border-bio-accent"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-300">{t.contactEmail}</label>
                                                <input
                                                    type="email"
                                                    value={formData.industryProfile.contactEmail}
                                                    onChange={(e) => setFormData({ ...formData, industryProfile: { ...formData.industryProfile, contactEmail: e.target.value } })}
                                                    className="w-full bg-bio-black border border-bio-gray-800 rounded-lg px-4 py-2 text-bio-white focus:outline-none focus:border-bio-accent"
                                                />
                                            </div>
                                            {$user.role === 'label' && (
                                                <div className="col-span-1 md:col-span-2 space-y-2">
                                                    <label className="text-sm font-medium text-gray-300">{t.demoDropUrl}</label>
                                                    <input
                                                        type="text"
                                                        value={formData.industryProfile.demoDropUrl}
                                                        onChange={(e) => setFormData({ ...formData, industryProfile: { ...formData.industryProfile, demoDropUrl: e.target.value } })}
                                                        className="w-full bg-bio-black border border-bio-gray-800 rounded-lg px-4 py-2 text-bio-white focus:outline-none focus:border-bio-accent"
                                                        placeholder="https://..."
                                                    />
                                                </div>
                                            )}
                                        </>
                                    )}

                                    {/* --- GENERAL SOCIALS (ALL USERS) --- */}
                                    <div className="col-span-1 md:col-span-2 pt-6 border-t border-bio-gray-800">
                                        <h3 className="text-lg font-bold text-bio-white mb-4">{t.myLinks}</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <input
                                                type="text"
                                                value={formData.socials.instagram}
                                                onChange={(e) => setFormData({ ...formData, socials: { ...formData.socials, instagram: e.target.value } })}
                                                className="bg-bio-black border border-bio-gray-800 rounded-lg px-4 py-2 text-bio-white focus:outline-none focus:border-bio-accent"
                                                placeholder="Instagram URL"
                                            />
                                            <input
                                                type="text"
                                                value={formData.socials.twitter}
                                                onChange={(e) => setFormData({ ...formData, socials: { ...formData.socials, twitter: e.target.value } })}
                                                className="bg-bio-black border border-bio-gray-800 rounded-lg px-4 py-2 text-bio-white focus:outline-none focus:border-bio-accent"
                                                placeholder="X / Twitter URL"
                                            />
                                            <input
                                                type="text"
                                                value={formData.socials.linkedin}
                                                onChange={(e) => setFormData({ ...formData, socials: { ...formData.socials, linkedin: e.target.value } })}
                                                className="bg-bio-black border border-bio-gray-800 rounded-lg px-4 py-2 text-bio-white focus:outline-none focus:border-bio-accent"
                                                placeholder="LinkedIn URL"
                                            />
                                            <input
                                                type="text"
                                                value={formData.socials.website}
                                                onChange={(e) => setFormData({ ...formData, socials: { ...formData.socials, website: e.target.value } })}
                                                className="bg-bio-black border border-bio-gray-800 rounded-lg px-4 py-2 text-bio-white focus:outline-none focus:border-bio-accent"
                                                placeholder="Andere Website"
                                            />
                                        </div>
                                    </div>

                                    {/* --- GUEST PREFERENCES --- */}
                                    {($user.role === 'guest') && (
                                        <div className="col-span-1 md:col-span-2 pt-6 border-t border-bio-gray-800">
                                            <h3 className="text-lg font-bold text-bio-white mb-4">{t.preferences}</h3>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-300">{t.preferredGenres}</label>
                                                <input
                                                    type="text"
                                                    value={formData.guestProfile.preferredGenres.join(', ')}
                                                    onChange={(e) => setFormData({
                                                        ...formData,
                                                        guestProfile: {
                                                            preferredGenres: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                                                        }
                                                    })}
                                                    className="w-full bg-bio-black border border-bio-gray-800 rounded-lg px-4 py-2 text-bio-white focus:outline-none focus:border-bio-accent"
                                                    placeholder="Techno, House, Ambient"
                                                />
                                                <p className="text-xs text-gray-500">{t.preferredGenresDesc}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Favorites Section (Any User may have favorites) */}
                            {renderFavorites()}
                        </>
                    )}

                    {/* Security Tab */}
                    {activeTab === 'security' && (
                        <>
                            <div className="space-y-6">
                                <div className="bg-bio-gray-900 rounded-xl border border-bio-gray-800 p-6 space-y-6">
                                    <h2 className="text-xl font-bold text-bio-white mb-4">{t.changePassword}</h2>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-300">{t.currentPassword}</label>
                                            <input
                                                type="password"
                                                value={formData.currentPassword}
                                                onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                                                className="w-full bg-bio-black border border-bio-gray-800 rounded-lg px-4 py-2 text-bio-white focus:outline-none focus:border-bio-accent"
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-300">{t.newPassword}</label>
                                                <input
                                                    type="password"
                                                    value={formData.newPassword}
                                                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                                                    className="w-full bg-bio-black border border-bio-gray-800 rounded-lg px-4 py-2 text-bio-white focus:outline-none focus:border-bio-accent"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-300">{t.confirmPassword}</label>
                                                <input
                                                    type="password"
                                                    value={formData.confirmPassword}
                                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                                    className="w-full bg-bio-black border border-bio-gray-800 rounded-lg px-4 py-2 text-bio-white focus:outline-none focus:border-bio-accent"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex justify-end">
                                            <button
                                                onClick={async () => {
                                                    if (!formData.currentPassword || !formData.newPassword) {
                                                        alert('Bitte alle Felder ausfüllen');
                                                        return;
                                                    }
                                                    if (formData.newPassword !== formData.confirmPassword) {
                                                        alert('Passwörter stimmen nicht überein');
                                                        return;
                                                    }
                                                    // Mock API call
                                                    setLoading(true);
                                                    await new Promise(r => setTimeout(r, 1000));
                                                    setLoading(false);
                                                    setSuccessMessage(t.passwordChanged);
                                                    setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
                                                    setTimeout(() => setSuccessMessage(''), 3000);
                                                }}
                                                className="px-4 py-2 bg-bio-gray-800 text-white rounded-lg hover:bg-bio-gray-700 transition-colors"
                                            >
                                                {t.changePassword}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-red-500/5 rounded-xl border border-red-500/20 p-6">
                                    <h3 className="text-red-400 font-bold mb-2 flex items-center gap-2">
                                        <AlertTriangle className="w-5 h-5" />
                                        {t.deleteAccount}
                                    </h3>
                                    <p className="text-bio-gray-400 text-sm mb-4">
                                        {t.deleteAccountDesc}
                                    </p>
                                    <button className="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-colors flex items-center gap-2 cursor-pointer">
                                        <Trash2 className="w-4 h-4" />
                                        {t.deleteAccountBtn}
                                    </button>
                                    {formData.currentPassword === 'DELETE' && (
                                        <div className="mt-4 p-4 border border-red-500/30 rounded bg-red-500/10">
                                            <p className="text-red-300 text-sm mb-4">{t.confirmDeleteDesc}</p>
                                            <button
                                                onClick={() => {
                                                    alert('Account wurde gelöscht (Simulation)');
                                                    window.location.href = '/';
                                                }}
                                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                                            >
                                                {t.confirmDelete}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}

                    {/* Calendar Tab */}
                    {activeTab === 'calendar' && (
                        <div className="bg-bio-gray-900 border border-bio-gray-800 rounded-xl p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-bio-white">{t.myCalendar}</h2>
                                <p className="text-sm text-bio-gray-400">{t.calendarDesc}</p>
                            </div>
                            <EventCalendar viewMode="artist" artistId={$user.id} lang={lang} />
                        </div>
                    )}

                    {/* Notifications Tab */}
                    {activeTab === 'notifications' && (
                        <div className="bg-bio-gray-900 rounded-xl border border-bio-gray-800 p-6 space-y-6">
                            <h2 className="text-xl font-bold text-bio-white mb-4">{t.notificationsTitle}</h2>
                            <div className="space-y-4">
                                {[
                                    { id: 'emailNotifications', label: t.emailNotifications, desc: t.emailNotificationsDesc },
                                    { id: 'pushNotifications', label: t.pushNotifications, desc: t.pushNotificationsDesc },
                                    { id: 'marketingEmails', label: t.marketingEmails, desc: t.marketingEmailsDesc },
                                    { id: 'artistAlerts', label: t.artistAlerts, desc: t.artistAlertsDesc }
                                ].map((item) => (
                                    <div key={item.id} className="flex items-center justify-between p-4 bg-bio-black/50 rounded-lg border border-bio-gray-800">
                                        <div>
                                            <h4 className="text-bio-white font-medium">{item.label}</h4>
                                            <p className="text-gray-400 text-sm">{item.desc}</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={formData[item.id as keyof typeof formData] as boolean} // Use simple boolean cast or fix typing if strict
                                                onChange={(e) => setFormData({ ...formData, [item.id]: e.target.checked })}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-bio-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-bio-accent"></div>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Save Button */}
                    <div className="flex justify-end pt-4">
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className="bg-bio-accent hover:bg-red-600 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    {t.saving}
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    {t.saveChanges}
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
