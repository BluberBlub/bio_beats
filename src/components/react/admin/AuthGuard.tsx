import { useEffect, useState } from 'react';

interface AuthGuardProps {
    children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        // Check both mechanisms
        const localAuth = localStorage.getItem('bio-admin-auth');
        const cookieAuth = document.cookie.split('; ').find(row => row.startsWith('bio-auth='));

        const isAuth = !!(localAuth || cookieAuth);

        if (!isAuth) {
            window.location.href = '/admin/login';
        } else {
            setIsAuthenticated(true);
        }
    }, []);

    if (isAuthenticated === null) {
        return (
            <div className="min-h-screen bg-bio-black flex items-center justify-center text-white">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 border-2 border-bio-accent border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-bio-gray-400">Loading...</span>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null; // Will redirect in useEffect
    }

    return <>{children}</>;
}
