// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import node from '@astrojs/node';

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

  output: 'server',
  adapter: node({
    mode: 'standalone',
  }),

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

  // Prefetch links on hover - DISABLED temporarily to debug visibility issue
  prefetch: false,

  // Compress output
  compressHTML: true,
});