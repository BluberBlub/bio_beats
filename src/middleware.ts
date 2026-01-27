import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async ({ locals, request, redirect }, next) => {
    const url = new URL(request.url);

    // Basic protection for /admin routes
    if (url.pathname.startsWith("/admin") && !url.pathname.startsWith("/admin/login")) {
        const cookie = request.headers.get("cookie");
        const hasAuth = cookie?.includes("bio-auth=true");

        // In a real app with Supabase:
        // const { data: { session } } = await supabase.auth.getSession();
        // if (!session) return redirect('/admin/login');

        if (!hasAuth) {
            return redirect("/admin/login");
        }
    }

    return next();
});
