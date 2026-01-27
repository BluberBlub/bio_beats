import { useState } from 'react';
import { Eye, EyeOff, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

interface AuthFormProps {
    mode: 'login' | 'register';
    role?: string;
    onSuccess?: () => void;
}

export default function AuthForm({ mode, role, onSuccess }: AuthFormProps) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        location: '',
        terms: false,
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    const validateEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const validatePassword = (password: string) => {
        return password.length >= 8;
    };

    const getFieldError = (field: string) => {
        if (!touched[field]) return null;

        switch (field) {
            case 'email':
                if (!formData.email) return 'Email is required';
                if (!validateEmail(formData.email)) return 'Invalid email format';
                break;
            case 'password':
                if (!formData.password) return 'Password is required';
                if (mode === 'register' && !validatePassword(formData.password))
                    return 'Password must be at least 8 characters';
                break;
            case 'name':
                if (mode === 'register' && !formData.name) return 'Name is required';
                break;
            case 'terms':
                if (mode === 'register' && !formData.terms) return 'You must agree to the terms';
                break;
        }
        return null;
    };

    const handleBlur = (field: string) => {
        setTouched(prev => ({ ...prev, [field]: true }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Mark all fields as touched
        const allTouched = { email: true, password: true, name: true, terms: true };
        setTouched(allTouched);

        // Validate
        const emailError = getFieldError('email');
        const passwordError = getFieldError('password');
        const nameError = mode === 'register' ? getFieldError('name') : null;
        const termsError = mode === 'register' ? getFieldError('terms') : null;

        if (emailError || passwordError || nameError || termsError) {
            return;
        }

        setLoading(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Demo: always succeed
        setSuccess(true);
        setLoading(false);

        // Redirect after success
        setTimeout(() => {
            if (mode === 'register') {
                window.location.href = '/verify-email';
            } else {
                window.location.href = '/';
            }
        }, 1000);
    };

    if (success) {
        return (
            <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                    <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                    {mode === 'register' ? 'Account created!' : 'Welcome back!'}
                </h3>
                <p className="text-gray-400">
                    {mode === 'register' ? 'Redirecting to email verification...' : 'Redirecting...'}
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-red-400 text-sm">{error}</p>
                </div>
            )}

            {mode === 'register' && (
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                        {role === 'artist' ? 'Artist Name / Alias' : 'Full Name'} *
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        onBlur={() => handleBlur('name')}
                        className={`w-full px-4 py-3 bg-[#262626] border rounded-lg text-white placeholder-gray-500 focus:border-[#ff0700] outline-none transition-colors ${getFieldError('name') ? 'border-red-500' : 'border-[#404040]'
                            }`}
                        placeholder={role === 'artist' ? 'Your artist name' : 'Your name'}
                    />
                    {getFieldError('name') && (
                        <p className="mt-1 text-sm text-red-400">{getFieldError('name')}</p>
                    )}
                </div>
            )}

            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email *
                </label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={() => handleBlur('email')}
                    className={`w-full px-4 py-3 bg-[#262626] border rounded-lg text-white placeholder-gray-500 focus:border-[#ff0700] outline-none transition-colors ${getFieldError('email') ? 'border-red-500' : 'border-[#404040]'
                        }`}
                    placeholder="your@email.com"
                />
                {getFieldError('email') && (
                    <p className="mt-1 text-sm text-red-400">{getFieldError('email')}</p>
                )}
            </div>

            <div>
                <div className="flex items-center justify-between mb-2">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                        Password *
                    </label>
                    {mode === 'login' && (
                        <a href="/forgot-password" className="text-sm text-[#ff0700] hover:underline">
                            Forgot password?
                        </a>
                    )}
                </div>
                <div className="relative">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        onBlur={() => handleBlur('password')}
                        className={`w-full px-4 py-3 pr-12 bg-[#262626] border rounded-lg text-white placeholder-gray-500 focus:border-[#ff0700] outline-none transition-colors ${getFieldError('password') ? 'border-red-500' : 'border-[#404040]'
                            }`}
                        placeholder="••••••••"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                </div>
                {getFieldError('password') && (
                    <p className="mt-1 text-sm text-red-400">{getFieldError('password')}</p>
                )}
                {mode === 'register' && !getFieldError('password') && (
                    <p className="mt-1 text-xs text-gray-500">Must be at least 8 characters</p>
                )}
            </div>

            {mode === 'register' && (
                <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-2">
                        Location
                    </label>
                    <input
                        type="text"
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-[#262626] border border-[#404040] rounded-lg text-white placeholder-gray-500 focus:border-[#ff0700] outline-none transition-colors"
                        placeholder="City, Country"
                    />
                </div>
            )}

            {mode === 'register' ? (
                <div>
                    <div className="flex items-start gap-3">
                        <input
                            type="checkbox"
                            id="terms"
                            name="terms"
                            checked={formData.terms}
                            onChange={handleChange}
                            className="mt-1 w-4 h-4 rounded border-[#404040] bg-[#262626] text-[#ff0700] focus:ring-[#ff0700]"
                        />
                        <label htmlFor="terms" className="text-sm text-gray-400">
                            I agree to the{' '}
                            <a href="/terms" className="text-[#ff0700] hover:underline">Terms of Service</a>
                            {' '}and{' '}
                            <a href="/privacy" className="text-[#ff0700] hover:underline">Privacy Policy</a>
                        </label>
                    </div>
                    {getFieldError('terms') && (
                        <p className="mt-1 text-sm text-red-400">{getFieldError('terms')}</p>
                    )}
                </div>
            ) : (
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="remember"
                        name="remember"
                        checked={formData.remember}
                        onChange={handleChange}
                        className="w-4 h-4 rounded border-[#404040] bg-[#262626] text-[#ff0700] focus:ring-[#ff0700]"
                    />
                    <label htmlFor="remember" className="text-sm text-gray-400">
                        Remember me
                    </label>
                </div>
            )}

            <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 bg-[#ff0700] text-white font-medium rounded-lg hover:bg-[#cc0600] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {loading ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        {mode === 'register' ? 'Creating account...' : 'Logging in...'}
                    </>
                ) : (
                    mode === 'register' ? 'Create Account' : 'Login'
                )}
            </button>
        </form>
    );
}
