import { useState, useEffect } from 'react';
import { User, Mail, Lock, Bell, Camera, Save, Loader2, Trash2, AlertTriangle } from 'lucide-react';
import { userStore } from '../../stores/userStore';
import { useStore } from '@nanostores/react';

type Tab = 'profile' | 'security' | 'notifications';

export default function UserProfileSettings() {
    const $user = useStore(userStore);
    const [activeTab, setActiveTab] = useState<Tab>('profile');
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    // Local state for forms
    const [formData, setFormData] = useState({
        fullName: 'Admin User',
        email: 'admin@biobeats.io',
        bio: 'Techno enthusiast and platform administrator.',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        emailNotifications: true,
        pushNotifications: false,
        marketingEmails: false
    });

    // Load initial data from user store on mount
    useEffect(() => {
        if ($user) {
            setFormData(prev => ({
                ...prev,
                fullName: $user.full_name || 'User',
                email: $user.email || '',
            }));
        }
    }, [$user]);

    const handleSave = () => {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            setSuccessMessage('Einstellungen erfolgreich gespeichert.');
            setTimeout(() => setSuccessMessage(''), 3000);
        }, 1000);
    };

    const tabs = [
        { id: 'profile', label: 'Profil', icon: User },
        { id: 'security', label: 'Sicherheit', icon: Lock },
        { id: 'notifications', label: 'Benachrichtigungen', icon: Bell },
    ];

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-8">Profile Settings</h1>

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
                        <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-lg flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            {successMessage}
                        </div>
                    )}

                    {/* Profile Tab */}
                    {activeTab === 'profile' && (
                        <div className="bg-[#171717] rounded-xl border border-[#262626] p-6 space-y-6">
                            <div className="flex items-center gap-6 pb-6 border-b border-[#262626]">
                                <div className="relative">
                                    <div className="w-24 h-24 rounded-full bg-[#262626] flex items-center justify-center text-gray-400 text-3xl font-bold overflow-hidden border-2 border-[#262626]">
                                        {$user?.full_name?.charAt(0) || 'U'}
                                    </div>
                                    <button className="absolute bottom-0 right-0 p-2 bg-bio-accent rounded-full text-white hover:bg-red-600 transition-colors">
                                        <Camera className="w-4 h-4" />
                                    </button>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">Profilbild</h3>
                                    <p className="text-gray-400 text-sm mt-1">
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
                                <button className="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-colors flex items-center gap-2">
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
