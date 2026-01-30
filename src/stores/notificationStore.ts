import { atom, computed } from 'nanostores';

// Notification Types
export type NotificationType = 'new_event' | 'availability' | 'new_track' | 'profile_update' | 'follow';

export interface Notification {
    id: string;
    type: NotificationType;
    artistSlug: string;
    artistName: string;
    message: string;
    timestamp: string;
    isRead: boolean;
    link?: string;
}

// Store
export const notificationsStore = atom<Notification[]>([]);

// Computed: unread count
export const unreadCount = computed(notificationsStore, (notifications) =>
    notifications.filter(n => !n.isRead).length
);

// Generate unique ID
function generateId(): string {
    return `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Add a notification
export function addNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) {
    const newNotification: Notification = {
        ...notification,
        id: generateId(),
        timestamp: new Date().toISOString(),
        isRead: false
    };

    const current = notificationsStore.get();
    const updated = [newNotification, ...current].slice(0, 50); // Keep last 50
    notificationsStore.set(updated);
    saveToStorage(updated);

    return newNotification;
}

// Mark single notification as read
export function markAsRead(id: string) {
    const current = notificationsStore.get();
    const updated = current.map(n =>
        n.id === id ? { ...n, isRead: true } : n
    );
    notificationsStore.set(updated);
    saveToStorage(updated);
}

// Mark all as read
export function markAllAsRead() {
    const current = notificationsStore.get();
    const updated = current.map(n => ({ ...n, isRead: true }));
    notificationsStore.set(updated);
    saveToStorage(updated);
}

// Clear all notifications
export function clearAllNotifications() {
    notificationsStore.set([]);
    saveToStorage([]);
}

// Delete single notification
export function deleteNotification(id: string) {
    const current = notificationsStore.get();
    const updated = current.filter(n => n.id !== id);
    notificationsStore.set(updated);
    saveToStorage(updated);
}

// Persistence
const STORAGE_KEY = 'bio-notifications';

function saveToStorage(notifications: Notification[]) {
    if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    }
}

function loadFromStorage(): Notification[] {
    if (typeof window !== 'undefined') {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error('Failed to parse notifications from localStorage', e);
            }
        }
    }
    return [];
}

// Initialize from localStorage
if (typeof window !== 'undefined') {
    const saved = loadFromStorage();
    if (saved.length > 0) {
        notificationsStore.set(saved);
    }
}

// Helper: Create follow notification
export function createFollowNotification(artistSlug: string, artistName: string) {
    return addNotification({
        type: 'follow',
        artistSlug,
        artistName,
        message: `Du folgst jetzt ${artistName}! Du wirst über Updates benachrichtigt.`,
        link: `/artists/${artistSlug}`
    });
}

// Helper: Notification type icons and labels
export const notificationMeta: Record<NotificationType, { icon: string; label: string; labelDe: string }> = {
    new_event: { icon: '📅', label: 'New Event', labelDe: 'Neues Event' },
    availability: { icon: '✅', label: 'Availability', labelDe: 'Verfügbarkeit' },
    new_track: { icon: '🎵', label: 'New Track', labelDe: 'Neuer Track' },
    profile_update: { icon: '👤', label: 'Profile Update', labelDe: 'Profil-Update' },
    follow: { icon: '❤️', label: 'Following', labelDe: 'Folge ich' }
};
