/*
 * Kill switch for the service worker the old React site installed.
 *
 * Anyone who visited the previous site has that worker registered in their
 * browser, and it will keep serving them the old cached pages after this site
 * deploys — a hard refresh does not reliably clear it. Shipping this file at
 * the same URL lets the browser replace the old worker with one whose only job
 * is to uninstall itself, empty the caches, and reload the open tabs.
 *
 * Safe to delete once you are confident returning visitors have all been
 * through it — realistically, leave it.
 */
self.addEventListener('install', () => {
	self.skipWaiting();
});

self.addEventListener('activate', (event) => {
	event.waitUntil(
		(async () => {
			const keys = await caches.keys();
			await Promise.all(keys.map((key) => caches.delete(key)));

			await self.registration.unregister();

			const clients = await self.clients.matchAll({ type: 'window' });
			for (const client of clients) {
				client.navigate(client.url);
			}
		})(),
	);
});
