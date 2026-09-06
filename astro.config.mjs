// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	// User site — serves from the domain root, so no `base` is needed.
	// A project site at github.com/user/repo would need base: '/repo'.
	site: 'https://eltabre.github.io',
});
