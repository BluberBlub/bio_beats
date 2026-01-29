import { useState } from 'react';

interface Festival {
    id: string;
    name: string;
    coordinates: { lat: number; lng: number };
    location: string;
    date: string;
}

interface Props {
    festivals: Festival[];
}

// Simple projection helper for Equirectangular (Plate Carrée) Image
const project = (lat: number, lng: number) => {
    // Equirectangular projection maps Lat/Lng directly to X/Y

    // X: Longitude -180 to 180 maps to 0% to 100%
    const x = (lng + 180) * (100 / 360);

    // Y: Latitude 90 to -90 maps to 0% to 100%
    const y = ((-1 * lat) + 90) * (100 / 180);

    return { x, y };
};

export default function FestivalMap({ festivals }: Props) {
    const [hoveredId, setHoveredId] = useState<string | null>(null);

    return (
        <div className="relative w-full aspect-[2/1] bg-[#111] rounded-xl overflow-hidden border border-[#262626] group/map">

            {/* Background Map Image */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-60 grayscale brightness-150 contrast-125">
                <img
                    src="/world_map_outline.png"
                    alt="World Map"
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Overlay Gradient for "Premium" look */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-[#111] opacity-40 pointer-events-none"></div>

            {/* Festival Dots Container - Overlaying the map */}
            <div className="absolute inset-0 w-full h-full">
                {festivals.map((festival) => {
                    if (!festival.coordinates) return null;
                    const { x, y } = project(festival.coordinates.lat, festival.coordinates.lng);

                    const top = `${y}%`;
                    const left = `${x}%`;

                    return (
                        <div
                            key={festival.id}
                            className="absolute group z-10"
                            style={{ top, left }}
                        >
                            {/* Dot */}
                            <div
                                className="w-3 h-3 -translate-x-1/2 -translate-y-1/2 bg-[#ff0700] rounded-full shadow-[0_0_10px_#ff0700] cursor-pointer hover:scale-150 transition-transform duration-300"
                                onMouseEnter={() => setHoveredId(festival.id)}
                                onMouseLeave={() => setHoveredId(null)}
                            >
                                <div className="absolute inset-0 bg-[#ff0700] rounded-full animate-ping opacity-75"></div>
                            </div>

                            {/* Tooltip */}
                            <div
                                className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-4 bg-[#1a1a1a]/95 backdrop-blur-md border border-[#404040] rounded-lg px-4 py-3 whitespace-nowrap z-50 shadow-2xl transition-all duration-300 transform origin-bottom ${hoveredId === festival.id
                                        ? 'opacity-100 translate-y-0 scale-100'
                                        : 'opacity-0 translate-y-2 scale-95 pointer-events-none'
                                    }`}
                            >
                                <div className="text-white font-bold text-sm mb-0.5">{festival.name}</div>
                                <div className="text-xs text-[#888] flex items-center gap-1">
                                    <span className="w-1 h-1 rounded-full bg-[#ff0700]"></span>
                                    {festival.location}
                                    <span className="opacity-50">|</span>
                                    {festival.date}
                                </div>
                                {/* Arrow */}
                                <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-[#1a1a1a]/95"></div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="absolute bottom-4 left-4 text-[#444] text-[10px] sm:text-xs font-mono tracking-widest uppercase select-none pointer-events-none">
                Bio Beats Global Network // {festivals.length} Active Partners
            </div>
        </div>
    );
}
