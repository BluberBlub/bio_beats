import { useState } from 'react';
import { MoreHorizontal, Check, X, Eye, Calendar, User, Mail, DollarSign } from 'lucide-react';

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

const mockBookings: Booking[] = [
    {
        id: '1',
        artistName: 'Neon Pulse',
        promoterName: 'Techno Berlin',
        promoterEmail: 'booking@berlintechno.de',
        eventName: 'Summer Rave 2026',
        eventDate: '2026-07-24',
        offerAmount: 2500,
        status: 'pending',
        createdAt: '2026-01-28'
    },
    {
        id: '2',
        artistName: 'Solar Flare',
        promoterName: 'Ibiza Global',
        promoterEmail: 'events@ibiza.com',
        eventName: 'Sunset Sessions',
        eventDate: '2026-08-15',
        offerAmount: 4000,
        status: 'approved',
        createdAt: '2026-01-25'
    },
    {
        id: '3',
        artistName: 'Lunar Echo',
        promoterName: 'Underground Club',
        promoterEmail: 'info@underground.uk',
        eventName: 'Warehouse Project',
        eventDate: '2026-09-05',
        offerAmount: 1800,
        status: 'rejected',
        createdAt: '2026-01-20'
    }
];

export default function BookingTable() {
    const [bookings, setBookings] = useState<Booking[]>(mockBookings);
    const [filter, setFilter] = useState('all');

    const handleStatusUpdate = (id: string, newStatus: Booking['status']) => {
        setBookings(prev => prev.map(booking =>
            booking.id === id ? { ...booking, status: newStatus } : booking
        ));
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
                </div>
            </div>
        </div>
    );
}
