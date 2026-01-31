import type { APIRoute } from 'astro';
import fs from 'node:fs/promises';
import path from 'node:path';

export const POST: APIRoute = async ({ request }) => {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return new Response(JSON.stringify({ error: 'No file uploaded' }), { status: 400 });
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            return new Response(JSON.stringify({ error: 'Invalid file type' }), { status: 400 });
        }

        // Prepare directory
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'avatars');
        try {
            await fs.access(uploadDir);
        } catch {
            await fs.mkdir(uploadDir, { recursive: true });
        }

        // Generate unique filename
        const timestamp = Date.now();
        const ext = path.extname(file.name);
        const filename = `avatar-${timestamp}${ext}`;
        const filepath = path.join(uploadDir, filename);

        // Write file
        const buffer = Buffer.from(await file.arrayBuffer());
        await fs.writeFile(filepath, buffer);

        // Return URL
        const publicUrl = `/uploads/avatars/${filename}`;

        return new Response(JSON.stringify({
            success: true,
            url: publicUrl
        }), { status: 200 });

    } catch (error) {
        console.error('Upload error:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}
