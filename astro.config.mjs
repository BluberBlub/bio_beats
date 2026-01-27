// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // Production URL for sitemap and canonical URLs
  site: 'https://biobeats.io',

  vite: {
    plugins: [tailwindcss()],
    build: {
      // Optimize chunks
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom'],
          },
        },
      },
    },
  },

  integrations: [
    react(),
    sitemap({
      filter: (page) => !page.includes('/api/'),
    }),
  ],

  // Image optimization
  image: {
    // Enable sharp for image optimization
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
  },

  // Prefetch links on hover
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },

  // Compress output
  compressHTML: true,
});