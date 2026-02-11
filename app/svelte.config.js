import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter({
			pages: 'docs',
			assets: 'docs',
			fallback: null,
			precompress: false,
			strict: false
		}),
		paths: {
			base: process.env.NODE_ENV === 'production' ? '' : ''
		},
		prerender: {
			handleHttpError: ({ status, path }) => {
				// Ignore 404s for favicon and apple-touch-icon
				if (status === 404 && (path.includes('favicon') || path.includes('apple-touch-icon'))) {
					return;
				}
			}
		}
	}
};

export default config;
