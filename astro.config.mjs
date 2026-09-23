// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.limpik.cl',
  trailingSlash: 'never',
  integrations: [
    react(),
    sitemap({
      // Páginas de conversión/utilidad fuera del índice
      filter: (page) => !/\/(gracias|404)\/?$/.test(page),
    }),
  ],
  adapter: vercel()
});
