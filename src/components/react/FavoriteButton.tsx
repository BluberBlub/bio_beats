import { useStore } from '@nanostores/react';
import { userStore, updateUser } from '../../stores/userStore';
import { createFollowNotification } from '../../stores/notificationStore';
import { Heart } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Props {
    artistSlug: string;
    artistName: string;
    currentLang?: 'en' | 'de';
}

export default function FavoriteButton({ artistSlug, artistName, currentLang = 'en' }: Props) {
    const $user = useStore(userStore);
    const [isFavorite, setIsFavorite] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Check if artist is in favorites on mount and when user changes
    useEffect(() => {
        if ($user?.favorite_artists) {
            setIsFavorite($user.favorite_artists.includes(artistSlug));
        } else {
            setIsFavorite(false);
        }
    }, [$user, artistSlug]);

    const handleToggle = async () => {
        // Redirect to login if not authenticated
        if (!$user) {
            const loginPath = currentLang === 'de' ? '/de/login' : '/login';
            window.location.href = `${loginPath}?redirect=${encodeURIComponent(window.location.pathname)}`;
            return;
        }

        setIsLoading(true);

        try {
            const currentFavorites = $user.favorite_artists || [];
            let newFavorites: string[];
            const wasFollowing = isFavorite;

            if (isFavorite) {
                // Remove from favorites
                newFavorites = currentFavorites.filter(slug => slug !== artistSlug);
            } else {
                // Add to favorites
                newFavorites = [...currentFavorites, artistSlug];
            }

            // Update local state immediately for responsive UI
            setIsFavorite(!isFavorite);

            // Update user store (persists to localStorage)
            updateUser({ favorite_artists: newFavorites });

            // Create welcome notification when following
            if (!wasFollowing) {
                createFollowNotification(artistSlug, artistName);
            }

            // Call API for server-side persistence (when Supabase is connected)
            await fetch('/api/favorites/toggle', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ artistSlug, userId: $user.id })
            });

        } catch (error) {
            console.error('Failed to toggle favorite:', error);
            // Revert on error
            setIsFavorite(isFavorite);
        } finally {
            setIsLoading(false);
        }
    };

    const labels = {
        en: {
            add: 'Add to Favorites',
            remove: 'Remove from Favorites',
            added: 'Following'
        },
        de: {
            add: 'Zu Favoriten',
            remove: 'Aus Favoriten entfernen',
            added: 'Folge ich'
        }
    };

    const t = labels[currentLang];

    return (
        <button
            onClick={handleToggle}
            disabled={isLoading}
            className={`btn-secondary inline-flex items-center gap-2 transition-all duration-200 ${isFavorite
                ? 'bg-bio-accent/20 border-bio-accent text-bio-accent hover:bg-bio-accent/30'
                : ''
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            aria-label={isFavorite ? t.remove : t.add}
            title={isFavorite ? t.remove : t.add}
        >
            <Heart
                className={`w-4 h-4 transition-all duration-200 ${isFavorite ? 'fill-current' : ''
                    }`}
            />
            <span>{isFavorite ? t.added : t.add}</span>
        </button>
    );
}
