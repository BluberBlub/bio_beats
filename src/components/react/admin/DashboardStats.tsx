import { useState, useEffect } from 'react';
import {
    Users,
    Calendar,
    Music,
    TrendingUp,
    Clock,
    ArrowUpRight,
    CheckCircle,
    AlertCircle
} from 'lucide-react';

// Import data for statistics
import { supabase } from '../../../lib/supabase';

export default function DashboardStats() {
    const [timeRange] = useState<'today' | 'week' | 'month'>('week');
    const [stats, setStats] = useState({
        totalUsers: 0,
        newUsersThisWeek: 0,
        totalFestivals: 0,
        upcomingFestivals: 0,
        totalArtists: 0,
        verifiedArtists: 0,
        pendingVerifications: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, [timeRange]);

    const fetchStats = async () => {
        try {
            setLoading(true);

            // 1. Users Stats
            const { count: totalUsers } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
            const { count: totalArtists } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).in('role', ['artist', 'performer', 'creative']);
            const { count: verifiedArtists } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).in('role', ['artist', 'performer', 'creative']).eq('is_verified', true);
            const { count: pendingVerifications } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).in('role', ['artist', 'performer', 'creative']).eq('is_verified', false);

            // New users last 7 days
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            const { count: newUsersThisWeek } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).gte('created_at', weekAgo.toISOString());

            // 2. Festivals Stats
            const { count: totalFestivals } = await supabase.from('festivals').select('*', { count: 'exact', head: true });
            const { count: upcomingFestivals } = await supabase.from('festivals').select('*', { count: 'exact', head: true }).gte('date', new Date().toISOString());

            setStats({
                totalUsers: totalUsers || 0,
                newUsersThisWeek: newUsersThisWeek || 0,
                totalFestivals: totalFestivals || 0,
                upcomingFestivals: upcomingFestivals || 0,
                totalArtists: totalArtists || 0,
                verifiedArtists: verifiedArtists || 0,
                pendingVerifications: pendingVerifications || 0,
            });

        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
        } finally {
            setLoading(false);
        }
    };

    // Recent activity mock data
    const recentActivity = [
        { type: 'user', action: 'New artist registered', name: 'DJ Nova', time: '2 hours ago', icon: Users },
        { type: 'festival', action: 'Festival updated', name: 'Fusion Festival', time: '4 hours ago', icon: Calendar },
        { type: 'verification', action: 'Artist verified', name: 'Aurora Waves', time: '1 day ago', icon: CheckCircle },
        { type: 'booking', action: 'Booking request', name: 'Dekmantel → Rad Lez', time: '1 day ago', icon: Music },
        { type: 'user', action: 'New booker joined', name: 'Berlin Events GmbH', time: '2 days ago', icon: Users },
    ];

    return (
        <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Users */}
                <div className="bg-bio-gray-900 border border-bio-gray-800 rounded-xl p-5">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                            <Users className="w-5 h-5 text-blue-500" />
                        </div>
                        <span className="text-xs text-green-400 flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            +{stats.newUsersThisWeek}
                        </span>
                    </div>
                    <p className="text-2xl font-bold text-white">{stats.totalUsers}</p>
                    <p className="text-sm text-bio-gray-400">Total Users</p>
                </div>

                {/* Festivals */}
                <div className="bg-bio-gray-900 border border-bio-gray-800 rounded-xl p-5">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-purple-500" />
                        </div>
                        <span className="text-xs text-bio-gray-400">
                            {stats.upcomingFestivals} upcoming
                        </span>
                    </div>
                    <p className="text-2xl font-bold text-white">{stats.totalFestivals}</p>
                    <p className="text-sm text-bio-gray-400">Total Festivals</p>
                </div>

                {/* Artists */}
                <div className="bg-bio-gray-900 border border-bio-gray-800 rounded-xl p-5">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-lg bg-bio-accent/10 flex items-center justify-center">
                            <Music className="w-5 h-5 text-bio-accent" />
                        </div>
                        <span className="text-xs text-bio-gray-400">
                            {stats.verifiedArtists} verified
                        </span>
                    </div>
                    <p className="text-2xl font-bold text-white">{stats.totalArtists}</p>
                    <p className="text-sm text-bio-gray-400">Total Artists</p>
                </div>

                {/* Pending */}
                <div className="bg-bio-gray-900 border border-bio-gray-800 rounded-xl p-5">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                            <AlertCircle className="w-5 h-5 text-orange-500" />
                        </div>
                        <a href="/admin/users" className="text-xs text-bio-accent flex items-center gap-1 hover:underline">
                            View <ArrowUpRight className="w-3 h-3" />
                        </a>
                    </div>
                    <p className="text-2xl font-bold text-white">{stats.pendingVerifications}</p>
                    <p className="text-sm text-bio-gray-400">Pending Verifications</p>
                </div>
            </div>

            {/* Quick Actions & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Quick Actions */}
                <div className="bg-bio-gray-900 border border-bio-gray-800 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <a
                            href="/admin/users"
                            className="flex items-center gap-3 p-4 bg-bio-gray-800/50 rounded-lg hover:bg-bio-gray-800 transition-colors"
                        >
                            <Users className="w-5 h-5 text-blue-400" />
                            <span className="text-sm text-white">Manage Users</span>
                        </a>
                        <a
                            href="/admin/festivals"
                            className="flex items-center gap-3 p-4 bg-bio-gray-800/50 rounded-lg hover:bg-bio-gray-800 transition-colors"
                        >
                            <Calendar className="w-5 h-5 text-purple-400" />
                            <span className="text-sm text-white">Manage Festivals</span>
                        </a>
                        <a
                            href="/admin/artists"
                            className="flex items-center gap-3 p-4 bg-bio-gray-800/50 rounded-lg hover:bg-bio-gray-800 transition-colors"
                        >
                            <Music className="w-5 h-5 text-bio-accent" />
                            <span className="text-sm text-white">Manage Artists</span>
                        </a>
                        <a
                            href="/admin/calendar"
                            className="flex items-center gap-3 p-4 bg-bio-gray-800/50 rounded-lg hover:bg-bio-gray-800 transition-colors"
                        >
                            <Calendar className="w-5 h-5 text-green-400" />
                            <span className="text-sm text-white">View Calendar</span>
                        </a>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-bio-gray-900 border border-bio-gray-800 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
                    <div className="space-y-3">
                        {recentActivity.map((activity, index) => (
                            <div key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-bio-gray-800/50 transition-colors">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${activity.type === 'user' ? 'bg-blue-500/10' :
                                    activity.type === 'festival' ? 'bg-purple-500/10' :
                                        activity.type === 'verification' ? 'bg-green-500/10' :
                                            'bg-bio-accent/10'
                                    }`}>
                                    <activity.icon className={`w-4 h-4 ${activity.type === 'user' ? 'text-blue-500' :
                                        activity.type === 'festival' ? 'text-purple-500' :
                                            activity.type === 'verification' ? 'text-green-500' :
                                                'text-bio-accent'
                                        }`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-white truncate">{activity.action}</p>
                                    <p className="text-xs text-bio-gray-400 truncate">{activity.name}</p>
                                </div>
                                <div className="flex items-center gap-1 text-xs text-bio-gray-500">
                                    <Clock className="w-3 h-3" />
                                    {activity.time}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
