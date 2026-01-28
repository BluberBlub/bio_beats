import { useState, useEffect, useRef } from 'react';
import { User, Bell, Camera, Save, Loader2, Check, Shield, Lock, Trash2, AlertTriangle } from 'lucide-react';
import { userStore, updateUser } from '../../stores/userStore';
import { useStore } from '@nanostores/react';

type Tab = 'profile' | 'security' | 'notifications';

export default function UserProfileSettings() {
    const $user = useStore(userStore);
    const [activeTab, setActiveTab] = useState<Tab>('profile');
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Local state for forms
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        bio: 'Techno enthusiast and platform administrator.',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        emailNotifications: true,
        pushNotifications: false,
        marketingEmails: false
    });

    // Load initial data from user store on mount and updates
    useEffect(() => {
        if ($user) {
            setFormData(prev => ({
                ...prev,
                fullName: $user.full_name || '',
                email: $user.email || '',
            }));
        }
    }, [$user]);

    const handleSave = async () => {
        setLoading(true);

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));

        // Update global store
        updateUser({
            full_name: formData.fullName,
            email: formData.email,
        });

        setLoading(false);
        setSuccessMessage('Einstellungen erfolgreich gespeichert.');
        setTimeout(() => setSuccessMessage(''), 3000);
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

        setLoading(true);
        try {
            let fileToUpload: File | Blob = file;

            // If file is larger than 500KB, resize it
            if (file.size > 500 * 1024) {
                try {
                    const resizedBlob = await resizeImage(file);
                    fileToUpload = resizedBlob;
                } catch (resizeError) {
                    console.warn('Image resizing failed, trying original', resizeError);
                }
            }

            const formData = new FormData();
            formData.append('file', fileToUpload);

            const res = await fetch('/api/upload-avatar', {
                method: 'POST',
                body: formData
            });
            const data = await res.json();

            if (data.success && data.url) {
                // Update local User Store
                updateUser({ avatar_url: data.url });
                setSuccessMessage('Profilbild erfolgreich aktualisiert.');
                setTimeout(() => setSuccessMessage(''), 3000);
            } else {
                throw new Error(data.error || 'Upload failed');
            }
        } catch (err) {
            console.error(err);
            alert('Fehler beim Upload des Profilbildes.');
        } finally {
            setLoading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const tabs = [
        { id: 'profile', label: 'Profil', icon: User },
        { id: 'security', label: 'Sicherheit', icon: Lock },
        { id: 'notifications', label: 'Benachrichtigungen', icon: Bell },
    ];

    if (!$user) return null;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-white">Profile Settings</h1>
                <div className="px-3 py-1 rounded-full bg-bio-accent/20 border border-bio-accent/30 text-bio-accent text-sm font-medium flex items-center gap-2 capitalize">
                    <Shield className="w-3.5 h-3.5" />
                    {$user.role || 'User'}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                {/* Sidebar / Tabs */}
                <div className="md:col-span-3">
                    <div className="bg-[#171717] rounded-xl border border-[#262626] overflow-hidden">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as Tab)}
                                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${activeTab === tab.id
                                    ? 'bg-bio-accent text-white'
                                    : 'text-gray-400 hover:bg-[#262626] hover:text-white'
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

                    {/* Profile Tab */}
                    {activeTab === 'profile' && (
                        <div className="bg-[#171717] rounded-xl border border-[#262626] p-6 space-y-6">
                            <div className="flex items-center gap-6 pb-6 border-b border-[#262626]">
                                <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                    <div className="w-24 h-24 rounded-full bg-[#262626] flex items-center justify-center text-gray-400 text-3xl font-bold overflow-hidden border-2 border-[#262626] group-hover:border-bio-accent transition-colors">
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
                                    <h3 className="text-xl font-bold text-white">Profilbild</h3>
                                    <p className="text-gray-400 text-sm mt-1">
                                        Klicken zum Ändern.<br />
                                        JPG, GIF oder PNG. Max. 1MB.
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Voller Name</label>
                                    <input
                                        type="text"
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                        className="w-full bg-black border border-[#262626] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-bio-accent"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Email Adresse</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full bg-black border border-[#262626] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-bio-accent"
                                    />
                                </div>
                                <div className="col-span-1 md:col-span-2 space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Bio</label>
                                    <textarea
                                        rows={4}
                                        value={formData.bio}
                                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                        className="w-full bg-black border border-[#262626] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-bio-accent resize-none"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Security Tab */}
                    {activeTab === 'security' && (
                        <div className="space-y-6">
                            <div className="bg-[#171717] rounded-xl border border-[#262626] p-6 space-y-6">
                                <h2 className="text-xl font-bold text-white mb-4">Passwort ändern</h2>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300">Aktuelles Passwort</label>
                                        <input
                                            type="password"
                                            value={formData.currentPassword}
                                            onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                                            className="w-full bg-black border border-[#262626] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-bio-accent"
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-300">Neues Passwort</label>
                                            <input
                                                type="password"
                                                value={formData.newPassword}
                                                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                                                className="w-full bg-black border border-[#262626] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-bio-accent"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-300">Passwort bestätigen</label>
                                            <input
                                                type="password"
                                                value={formData.confirmPassword}
                                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                                className="w-full bg-black border border-[#262626] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-bio-accent"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-red-500/5 rounded-xl border border-red-500/20 p-6">
                                <h3 className="text-red-400 font-bold mb-2 flex items-center gap-2">
                                    <AlertTriangle className="w-5 h-5" />
                                    Account löschen
                                </h3>
                                <p className="text-gray-400 text-sm mb-4">
                                    Wenn Sie Ihren Account löschen, werden alle Ihre Daten unwiderruflich entfernt. Diese Aktion kann nicht rückgängig gemacht werden.
                                </p>
                                <button className="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-colors flex items-center gap-2 cursor-pointer">
                                    <Trash2 className="w-4 h-4" />
                                    Account löschen
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Notifications Tab */}
                    {activeTab === 'notifications' && (
                        <div className="bg-[#171717] rounded-xl border border-[#262626] p-6 space-y-6">
                            <h2 className="text-xl font-bold text-white mb-4">Benachrichtigungen</h2>
                            <div className="space-y-4">
                                {[
                                    { id: 'emailNotifications', label: 'Email Benachrichtigungen', desc: 'Erhalten Sie Emails über Updates und Aktivitäten.' },
                                    { id: 'pushNotifications', label: 'Push Benachrichtigungen', desc: 'Erhalten Sie Push-Nachrichten auf Ihrem Gerät.' },
                                    { id: 'marketingEmails', label: 'Marketing Emails', desc: 'Erhalten Sie Emails über neue Features und Angebote.' }
                                ].map((item) => (
                                    <div key={item.id} className="flex items-center justify-between p-4 bg-black/50 rounded-lg border border-[#262626]">
                                        <div>
                                            <h4 className="text-white font-medium">{item.label}</h4>
                                            <p className="text-gray-400 text-sm">{item.desc}</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={formData[item.id as keyof typeof formData] as boolean}
                                                onChange={(e) => setFormData({ ...formData, [item.id]: e.target.checked })}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-bio-accent"></div>
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
                                    Speichern...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    Änderungen speichern
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
