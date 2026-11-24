import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

/**
 * Adds the tags that need the site's absolute address (canonical link, og:url and the social
 * preview image) when VITE_SITE_URL is set to the deployed https address. Without it they are
 * simply left out, rather than guessing a domain.
 */
function siteMeta(siteUrl: string | undefined): Plugin {
  const base = siteUrl?.trim().replace(/\/+$/, '')
  const valid = base && base.startsWith('https://')
  if (base && !valid)
    console.warn('[site-meta] VITE_SITE_URL must start with https://, so it was ignored.')

  return {
    name: 'site-meta',
    transformIndexHtml(html) {
      const tags = valid
        ? [
            `<link rel="canonical" href="${base}/" />`,
            `<meta property="og:url" content="${base}/" />`,
            `<meta property="og:image" content="${base}/og-image.png" />`,
            `<meta name="twitter:image" content="${base}/og-image.png" />`,
          ].join('\n    ')
        : ''
      return html.replace('<!-- site-meta -->', tags)
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  return {
    plugins: [react(), tailwindcss(), siteMeta(env.VITE_SITE_URL)],
    resolve: {
      alias: { '@': path.resolve(import.meta.dirname, 'src') },
    },
  }
})
