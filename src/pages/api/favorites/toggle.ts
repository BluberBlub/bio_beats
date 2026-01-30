import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
    try {
        const data = await request.json();
        const { artistSlug, userId } = data;

        if (!artistSlug || !userId) {
            return new Response(
                JSON.stringify({ message: 'Missing artistSlug or userId' }),
                { status: 400 }
            );
        }

        // In production with real Supabase:
        // 1. Verify user auth token
        // 2. Get current favorite_artists from user profile
        // 3. Toggle the artistSlug in the array
        // 4. Update user profile in database

        // For now, we handle this client-side with localStorage
        // This endpoint serves as a placeholder for real DB integration

        return new Response(
            JSON.stringify({
                success: true,
                message: 'Favorite toggled successfully',
                artistSlug
            }),
            { status: 200 }
        );

    } catch (error) {
        console.error('Toggle favorite error:', error);
        return new Response(
            JSON.stringify({ message: 'Internal server error' }),
            { status: 500 }
        );
    }
};
