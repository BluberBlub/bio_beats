import { useState, useEffect } from 'react';
import { MoreHorizontal, Check, X, Eye, Calendar, User, Mail, DollarSign } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

interface Booking {
    id: string;
    artistName: string;
    promoterName: string;
    promoterEmail: string;
    eventName: string;
    eventDate: string;
    offerAmount: number;
    status: 'pending' | 'approved' | 'rejected' | 'completed';
    createdAt: string;
}



export default function BookingTable() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('bookings')
                .select(`
                    *,
                    artist:artist_id(full_name),
                    promoter:promoter_id(full_name, email)
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;

            // Map DB result to Booking interface
            // Note: Adjust mapping based on actual DB schema.
            // Assuming artist_id and promoter_id links to profiles
            const mappedBookings: Booking[] = (data || []).map((b: any) => ({
                id: b.id,
                artistName: b.artist?.full_name || b.artist_name || 'Unknown Artist',
                promoterName: b.promoter?.full_name || b.promoter_name || 'Unknown Promoter',
                promoterEmail: b.promoter?.email || b.promoter_email || '',
                eventName: b.event_name,
                eventDate: b.event_date,
                offerAmount: b.offer_amount,
                status: b.status,
                createdAt: b.created_at
            }));

            setBookings(mappedBookings);
        } catch (error) {
            console.error('Error fetching bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id: string, newStatus: Booking['status']) => {
        try {
            const { error } = await supabase
                .from('bookings')
                .update({ status: newStatus })
                .eq('id', id);

            if (error) throw error;

            setBookings(prev => prev.map(booking =>
                booking.id === id ? { ...booking, status: newStatus } : booking
            ));
        } catch (error) {
            console.error('Error updating booking status:', error);
            alert('Failed to update booking status');
        }
    };

    const StatusBadge = ({ status }: { status: Booking['status'] }) => {
        const styles = {
            pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
            approved: 'bg-green-500/20 text-green-400 border-green-500/30',
            rejected: 'bg-red-500/20 text-red-400 border-red-500/30',
            completed: 'bg-bio-gray-500/20 text-bio-gray-400 border-bio-gray-500/30',
        };

        return (
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status]} capitalize`}>
                {status}
            </span>
        );
    };

    const filteredBookings = filter === 'all'
        ? bookings
        : bookings.filter(b => b.status === filter);

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex bg-[#1a1a1a] rounded-lg p-1 border border-[#333]">
                    {['all', 'pending', 'approved', 'rejected'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${filter === f
                                ? 'bg-[#262626] text-white shadow-sm'
                                : 'text-gray-400 hover:text-white'
                                } capitalize`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-[#1a1a1a] border border-[#333] rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#262626] text-gray-400 text-xs uppercase">
                            <tr>
                                <th className="px-6 py-4 font-medium">Event & Artist</th>
                                <th className="px-6 py-4 font-medium">Promoter</th>
                                <th className="px-6 py-4 font-medium">Date</th>
                                <th className="px-6 py-4 font-medium">Offer</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#333]">
                            {filteredBookings.map((booking) => (
                                <tr key={booking.id} className="hover:bg-[#262626]/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-white">{booking.eventName}</div>
                                        <div className="text-sm text-gray-500 flex items-center gap-1.5 mt-0.5">
                                            <User className="w-3 h-3" />
                                            {booking.artistName}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-gray-300">{booking.promoterName}</div>
                                        <div className="text-sm text-gray-500 flex items-center gap-1.5 mt-0.5">
                                            <Mail className="w-3 h-3" />
                                            {booking.promoterEmail}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-gray-300 flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-gray-500" />
                                            {booking.eventDate}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-gray-300 font-mono flex items-center gap-1">
                                            <DollarSign className="w-3 h-3 text-gray-500" />
                                            {booking.offerAmount.toLocaleString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <StatusBadge status={booking.status} />
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {booking.status === 'pending' && (
                                                <>
                                                    <button
                                                        onClick={() => handleStatusUpdate(booking.id, 'approved')}
                                                        className="p-1.5 hover:bg-green-500/20 text-gray-400 hover:text-green-500 rounded transition-colors"
                                                        title="Approve"
                                                    >
                                                        <Check className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusUpdate(booking.id, 'rejected')}
                                                        className="p-1.5 hover:bg-red-500/20 text-gray-400 hover:text-red-500 rounded transition-colors"
                                                        title="Reject"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </>
                                            )}
                                            <button className="p-1.5 hover:bg-[#333] text-gray-400 hover:text-white rounded transition-colors">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {loading && <div className="p-4 text-center text-gray-500">Loading bookings...</div>}
                    {!loading && filteredBookings.length === 0 && <div className="p-4 text-center text-gray-500">No bookings found.</div>}
                </div>
            </div>
        </div>
    );
}
