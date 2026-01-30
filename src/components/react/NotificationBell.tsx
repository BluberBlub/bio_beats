import { useStore } from '@nanostores/react';
import {
    notificationsStore,
    unreadCount,
    markAsRead,
    markAllAsRead,
    notificationMeta
} from '../../stores/notificationStore';
import { Bell, Check } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useTranslation } from '../../i18n/useTranslation';

interface Props {
    currentLang?: 'en' | 'de';
}

export default function NotificationBell({ currentLang = 'en' }: Props) {
    const notifications = useStore(notificationsStore);
    const $unreadCount = useStore(unreadCount);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { t } = useTranslation(currentLang);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleNotificationClick = (id: string, link?: string) => {
        markAsRead(id);
        if (link) {
            window.location.href = link;
        }
    };

    const formatTimeAgo = (timestamp: string): string => {
        const now = new Date();
        const date = new Date(timestamp);
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return t.profile.time.justNow;
        if (diffMins < 60) return t.profile.time.minAgo.replace('{min}', diffMins.toString());
        if (diffHours < 24) return t.profile.time.hourAgo.replace('{hour}', diffHours.toString());
        return t.profile.time.dayAgo.replace('{day}', diffDays.toString());
    };

    const recentNotifications = notifications.slice(0, 5);

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell Button */}
            <button
                onClick={toggleDropdown}
                className="relative p-2 rounded-full hover:bg-bio-gray-800/50 transition-colors"
                aria-label={t.profile.notificationsTitle}
            >
                <Bell className="w-5 h-5 text-bio-gray-300" />
                {$unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-bio-accent text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                        {$unreadCount > 9 ? '9+' : $unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-bio-gray-900 border border-bio-gray-800 rounded-xl shadow-2xl z-[100] overflow-hidden">
                    {/* Header */}
                    <div className="px-4 py-3 border-b border-bio-gray-800 flex items-center justify-between">
                        <h3 className="font-semibold text-bio-white">{t.profile.notificationsTitle}</h3>
                        {$unreadCount > 0 && (
                            <button
                                onClick={() => markAllAsRead()}
                                className="text-xs text-bio-accent hover:text-bio-accent/80 flex items-center gap-1"
                            >
                                <Check className="w-3 h-3" />
                                {t.profile.markAllRead}
                            </button>
                        )}
                    </div>

                    {/* Notifications List */}
                    <div className="max-h-80 overflow-y-auto">
                        {recentNotifications.length === 0 ? (
                            <div className="px-4 py-8 text-center">
                                <Bell className="w-10 h-10 text-bio-gray-700 mx-auto mb-2" />
                                <p className="text-bio-gray-400 text-sm">{t.profile.empty}</p>
                                <p className="text-bio-gray-600 text-xs mt-1">{t.profile.emptyDesc}</p>
                            </div>
                        ) : (
                            recentNotifications.map((notification) => (
                                <button
                                    key={notification.id}
                                    onClick={() => handleNotificationClick(notification.id, notification.link)}
                                    className={`w-full text-left px-4 py-3 hover:bg-bio-gray-800/50 transition-colors border-b border-bio-gray-800/50 last:border-0 ${!notification.isRead ? 'bg-bio-accent/5' : ''
                                        }`}
                                >
                                    <div className="flex gap-3">
                                        {/* Icon */}
                                        <span className="text-lg flex-shrink-0">
                                            {notificationMeta[notification.type].icon}
                                        </span>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm ${!notification.isRead ? 'text-bio-white font-medium' : 'text-bio-gray-300'}`}>
                                                {notification.message}
                                            </p>
                                            <p className="text-xs text-bio-gray-500 mt-1">
                                                {formatTimeAgo(notification.timestamp)}
                                            </p>
                                        </div>

                                        {/* Unread indicator */}
                                        {!notification.isRead && (
                                            <span className="w-2 h-2 bg-bio-accent rounded-full flex-shrink-0 mt-1.5" />
                                        )}
                                    </div>
                                </button>
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                        <a
                            href={currentLang === 'de' ? '/de/notifications' : '/notifications'}
                            className="block px-4 py-3 text-center text-sm text-bio-accent hover:bg-bio-gray-800/50 border-t border-bio-gray-800"
                        >
                            {t.profile.viewAll}
                        </a>
                    )}
                </div>
            )}
        </div>
    );
}
