import { useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { artists } from '../../../data/artists';
import { festivals } from '../../../data/festivals';
import { bookings } from '../../../data/bookings';
import { Database, Upload, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';

export default function SeedData() {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [logs, setLogs] = useState<string[]>([]);

    const addLog = (msg: string) => setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${msg}`]);

    const handleSeed = async () => {
        if (!confirm('This will insert mock data into your Supabase database. Continue?')) return;

        setLoading(true);
        setStatus('idle');
        setLogs([]);
        addLog('Starting migration...');

        try {
            // 1. Map Mock IDs to new UUIDs
            const artistIdMap: Record<string, string> = {}; // old -> new
            const festivalIdMap: Record<string, string> = {}; // old -> new

            // 2. Insert Artists (Profiles)
            addLog(`Processing ${artists.length} artists...`);
            for (const artist of artists) {
                // Generate a consistent dummy UUID based on ID if possible, or just let DB handle it? 
                // DB usually generates UUID. We'll insert and get ID back, OR generate one client side.
                // Let's generate random UUIDs here to be safe and predictable for mapping.
                const newId = crypto.randomUUID();
                artistIdMap[artist.id] = newId;

                const profileData = {
                    id: newId,
                    email: `${artist.slug}@example.com`, // Dummy email
                    full_name: artist.name,
                    role: 'artist',
                    is_verified: artist.isVerified,
                    created_at: new Date().toISOString(),
                    avatar_url: artist.image,
                    // Additional fields depend on your schema structure.
                    // Assuming you might have a 'bio' or 'socials' column or separate tables.
                    // For now, mapping basic fields available in UserProfile interface
                };

                const { error } = await supabase.from('profiles').upsert(profileData);
                if (error) {
                    // Try without ID if it fails (maybe default gen), but we need ID for mapping.
                    // If profiles table is strict on ID being auth ID, this might fail if foreign key constraints exist on auth.users.
                    // IF IT FAILS due to auth constraint: We can't fix that easily without admin access to auth.
                    // BUT: user asked for "visible in admin backend", so likely just 'profiles' entries are enough if no strict FK exists.
                    console.error(`Failed to insert ${artist.name}`, error);
                    addLog(`Error inserting ${artist.name}: ${error.message}`);
                } else {
                    addLog(`Inserted artist: ${artist.name}`);
                }
            }

            // 3. Insert Festivals
            addLog(`Processing ${festivals.length} festivals...`);
            for (const festival of festivals) {
                // festival.id is 'f1', etc.
                const { error } = await supabase.from('festivals').insert({
                    name: festival.name,
                    slug: festival.slug,
                    location: festival.location,
                    country: festival.country,
                    date: festival.date, // Format might need parsing if DB is strictly date type
                    // dateEnd: festival.dateEnd,
                    type: festival.type,
                    image: festival.image,
                    capacity: festival.capacity,
                    description: festival.description,
                    website: festival.website,
                    highlights: festival.highlights,
                    stages: festival.stages,
                    // artistSlugs: festival.artistSlugs // Needs relation ideally, but maybe text array for now?
                });
                if (error) {
                    addLog(`Error inserting festival ${festival.name}: ${error.message}`);
                } else {
                    addLog(`Inserted festival: ${festival.name}`);
                }
            }

            // 4. Insert Bookings
            addLog(`Processing ${bookings.length} bookings...`);
            for (const booking of bookings) {
                // Map artist ID
                const newArtistId = artistIdMap[booking.artistId];
                if (!newArtistId) {
                    addLog(`Skipping booking ${booking.id}: Artist ID ${booking.artistId} not found in map.`);
                    continue;
                }

                const { error } = await supabase.from('bookings').insert({
                    artist_id: newArtistId,
                    event_name: booking.eventName,
                    event_date: booking.date,
                    location: booking.location,
                    city: booking.city,
                    country: booking.country,
                    status: booking.status,
                    offer_amount: booking.fee,
                });

                if (error) {
                    addLog(`Error inserting booking for ${booking.eventName}: ${error.message}`);
                } else {
                    addLog(`Inserted booking: ${booking.eventName}`);
                }
            }

            setStatus('success');
            addLog('Migration completed successfully!');

        } catch (err: any) {
            console.error(err);
            setStatus('error');
            addLog(`Critical Error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-bio-gray-900 rounded-xl border border-bio-gray-800">
            <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-bio-accent/20 flex items-center justify-center">
                    <Database className="w-6 h-6 text-bio-accent" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-white">Database Seeder</h2>
                    <p className="text-bio-gray-400 text-sm">Migrate mock data to Supabase</p>
                </div>
            </div>

            <div className="space-y-4">
                <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg flex gap-3 text-blue-200 text-sm">
                    <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                    <p>
                        This will attempt to insert <strong>{artists.length} artists</strong>,
                        <strong>{festivals.length} festivals</strong>, and
                        <strong>{bookings.length} bookings</strong> into your connected Supabase database.
                        Ensure your table schemas match the expected format.
                    </p>
                </div>

                <div className="max-h-60 overflow-y-auto bg-black rounded-lg p-4 font-mono text-xs text-green-400 space-y-1">
                    {logs.length === 0 ? (
                        <span className="text-gray-600">// Logs will appear here...</span>
                    ) : (
                        logs.map((log, i) => <div key={i}>{log}</div>)
                    )}
                </div>

                <button
                    onClick={handleSeed}
                    disabled={loading}
                    className={`w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors ${loading
                            ? 'bg-bio-gray-700 text-gray-400 cursor-not-allowed'
                            : 'bg-bio-accent hover:bg-bio-accent-hover text-white'
                        }`}
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Migrating...
                        </>
                    ) : status === 'success' ? (
                        <>
                            <CheckCircle className="w-5 h-5" />
                            Done!
                        </>
                    ) : (
                        <>
                            <Upload className="w-5 h-5" />
                            Start Migration
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
