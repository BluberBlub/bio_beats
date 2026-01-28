import { useState } from 'react';
import { Loader2, Eye, EyeOff } from 'lucide-react';

export default function AdminLogin() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const formData = new FormData(e.currentTarget);
        const username = formData.get('username') as string;
        const password = formData.get('password') as string;

        // Validate against provided credentials
        if (username === 'Administrator' && password === 'Start001$') {
            setTimeout(() => {
                // Store auth in both localStorage and cookie
                localStorage.setItem('bio-admin-auth', 'true');
                localStorage.setItem('bio-admin-user', JSON.stringify({
                    id: 'admin-1',
                    email: 'admin@biobeats.io',
                    role: 'admin',
                    name: 'Administrator'
                }));
                document.cookie = "bio-auth=true; path=/; max-age=3600";
                window.location.href = '/admin/dashboard';
            }, 1000);
        } else {
            setTimeout(() => {
                setLoading(false);
                setError('Ungültige Zugangsdaten');
            }, 500);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-[#171717] border border-[#262626] rounded-xl p-8">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-white mb-2">Admin Access</h1>
                    <p className="text-gray-400">Zugangsdaten eingeben</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg text-center">
                            {error}
                        </div>
                    )}
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">
                            Benutzername
                        </label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            autoComplete="username"
                            required
                            className="w-full px-4 py-2 bg-black border border-[#262626] rounded-lg text-white focus:border-[#ff0700] outline-none"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                            Passwort
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                autoComplete="current-password"
                                required
                                className="w-full px-4 py-2 pr-10 bg-black border border-[#262626] rounded-lg text-white focus:border-[#ff0700] outline-none"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                aria-label={showPassword ? "Passwort verbergen" : "Passwort anzeigen"}
                            >
                                {showPassword ? (
                                    <EyeOff className="w-4 h-4" />
                                ) : (
                                    <Eye className="w-4 h-4" />
                                )}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn-primary flex items-center justify-center gap-2 mt-4"
                    >
                        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                        Anmelden
                    </button>
                </form>
            </div>
        </div>
    );
}
