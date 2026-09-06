/**
 * Generates contour-line SVGs from real elevation data, at build time.
 *
 * Source: AWS "terrarium" terrain tiles — public, free, no API key. Each tile is
 * a 256x256 PNG where elevation is encoded in the RGB channels:
 *
 *     elevation_metres = (R * 256 + G + B / 256) - 32768
 *
 * Pipeline: fetch a block of tiles -> decode to an elevation grid -> downsample
 * -> d3-contour (which runs marching squares) -> write one SVG per place.
 *
 * Run with: node scripts/generate-contours.mjs
 */

import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { contours } from 'd3-contour';

const TILE_SIZE = 256;
const BLOCK = 3;              // 3x3 tiles = 768x768 px of source data
const GRID = 320;             // downsampled grid the contours are traced on
const LEVELS = 26;            // number of contour lines
const INDEX_EVERY = 3;        // every Nth line drawn heavier, as on a real map
const SIMPLIFY = 0.55;         // Ramer-Douglas-Peucker tolerance, in grid units
const MIN_RING = 14;          // drop rings shorter than this — SRTM speckle
const OUT_DIR = 'public/contours';
const CACHE_DIR = 'node_modules/.cache/terrain-tiles';

/** Slippy-map tile coordinates for a lat/lon at a given zoom. */
function tileFor(lat, lon, zoom) {
	const n = 2 ** zoom;
	const latRad = (lat * Math.PI) / 180;
	return {
		x: Math.floor(((lon + 180) / 360) * n),
		y: Math.floor(((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n),
	};
}

/** Fetch one tile, caching on disk so reruns don't re-hit the network. */
async function fetchTile(z, x, y) {
	const cached = path.join(CACHE_DIR, `${z}-${x}-${y}.png`);
	if (existsSync(cached)) return readFile(cached);

	const url = `https://s3.amazonaws.com/elevation-tiles-prod/terrarium/${z}/${x}/${y}.png`;
	const response = await fetch(url);
	if (!response.ok) throw new Error(`tile ${z}/${x}/${y}: HTTP ${response.status}`);

	const buffer = Buffer.from(await response.arrayBuffer());
	await mkdir(CACHE_DIR, { recursive: true });
	await writeFile(cached, buffer);
	return buffer;
}

/** Stitch a BLOCK x BLOCK square of tiles into one elevation grid. */
async function elevationGrid(place) {
	const centre = tileFor(place.lat, place.lon, place.zoom);
	const half = Math.floor(BLOCK / 2);
	const width = TILE_SIZE * BLOCK;
	const grid = new Float32Array(width * width);

	for (let ty = 0; ty < BLOCK; ty++) {
		for (let tx = 0; tx < BLOCK; tx++) {
			const png = await fetchTile(place.zoom, centre.x - half + tx, centre.y - half + ty);
			const { data } = await sharp(png).raw().toBuffer({ resolveWithObject: true });

			for (let py = 0; py < TILE_SIZE; py++) {
				for (let px = 0; px < TILE_SIZE; px++) {
					const i = (py * TILE_SIZE + px) * 3;
					const elevation = data[i] * 256 + data[i + 1] + data[i + 2] / 256 - 32768;
					grid[(ty * TILE_SIZE + py) * width + (tx * TILE_SIZE + px)] = elevation;
				}
			}
		}
	}
	return { grid, width };
}

/** Box-downsample to GRID x GRID. Averaging also smooths out SRTM speckle. */
function downsample(grid, width) {
	const out = new Float32Array(GRID * GRID);
	const step = width / GRID;

	for (let y = 0; y < GRID; y++) {
		for (let x = 0; x < GRID; x++) {
			let sum = 0;
			let count = 0;
			for (let sy = Math.floor(y * step); sy < Math.floor((y + 1) * step); sy++) {
				for (let sx = Math.floor(x * step); sx < Math.floor((x + 1) * step); sx++) {
					sum += grid[sy * width + sx];
					count++;
				}
			}
			out[y * GRID + x] = sum / count;
		}
	}
	return out;
}

/**
 * Ramer-Douglas-Peucker. Keeps the point furthest from the line joining the
 * ends; if even that is closer than the tolerance, the whole span collapses to
 * a straight segment. Contour rings are mostly gentle curves, so this removes
 * the large majority of points without a visible change.
 */
function simplify(points, tolerance) {
	if (points.length < 3) return points;

	const [ax, ay] = points[0];
	const [bx, by] = points[points.length - 1];
	const dx = bx - ax;
	const dy = by - ay;
	const lengthSquared = dx * dx + dy * dy;

	let worst = 0;
	let index = 0;
	for (let i = 1; i < points.length - 1; i++) {
		const [px, py] = points[i];
		// Perpendicular distance from the point to the chord.
		const distance = lengthSquared === 0
			? Math.hypot(px - ax, py - ay)
			: Math.abs(dy * px - dx * py + bx * ay - by * ax) / Math.sqrt(lengthSquared);
		if (distance > worst) {
			worst = distance;
			index = i;
		}
	}

	if (worst <= tolerance) return [points[0], points[points.length - 1]];

	return [
		...simplify(points.slice(0, index + 1), tolerance).slice(0, -1),
		...simplify(points.slice(index), tolerance),
	];
}

/** MultiPolygon rings -> an SVG path string, simplified and rounded. */
function toPath(geometry) {
	const parts = [];
	for (const polygon of geometry.coordinates) {
		for (const ring of polygon) {
			if (ring.length < MIN_RING) continue;
			const thinned = simplify(ring, SIMPLIFY);
			if (thinned.length < 4) continue;
			parts.push(
				'M' + thinned.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join('L') + 'Z',
			);
		}
	}
	return parts.join('');
}

async function generate(place) {
	const { grid, width } = await elevationGrid(place);
	const small = downsample(grid, width);

	const min = Math.min(...small);
	const max = Math.max(...small);
	const thresholds = Array.from(
		{ length: LEVELS },
		(_, i) => min + ((max - min) * (i + 0.5)) / LEVELS,
	);

	const traced = contours().size([GRID, GRID]).thresholds(thresholds)(small);

	const paths = traced
		.map((geometry, i) => {
			const d = toPath(geometry);
			if (!d) return '';
			const index = i % INDEX_EVERY === 0;
			return `<path d="${d}" stroke-width="${index ? 0.22 : 0.12}" opacity="${index ? 0.9 : 0.55}"/>`;
		})
		.filter(Boolean)
		.join('');

	const svg =
		`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${GRID} ${GRID}" ` +
		`preserveAspectRatio="xMidYMid slice">` +
		`<g fill="none" stroke="#000" stroke-linejoin="round">${paths}</g></svg>`;

	await mkdir(OUT_DIR, { recursive: true });
	const file = path.join(OUT_DIR, `${place.slug}.svg`);
	await writeFile(file, svg);

	return {
		slug: place.slug,
		kb: (Buffer.byteLength(svg) / 1024).toFixed(1),
		relief: `${Math.round(min)}–${Math.round(max)} m`,
	};
}

// Read the place list out of the TypeScript module without needing a compiler.
const source = await readFile('src/lib/places.ts', 'utf8');
const body = source.slice(source.indexOf('export const PLACES'));
const places = [...body.matchAll(/\{[^{}]*?slug:\s*'([^']+)'[\s\S]*?lat:\s*(-?[\d.]+),\s*lon:\s*(-?[\d.]+),\s*zoom:\s*(\d+)/g)]
	.map((m) => ({ slug: m[1], lat: +m[2], lon: +m[3], zoom: +m[4] }));

for (const place of places) {
	const result = await generate(place);
	console.log(`  ${result.slug.padEnd(14)} ${result.kb.padStart(6)} KB   relief ${result.relief}`);
}

// Generated so adding a place means editing places.ts and rerunning this — the
// slug never has to be repeated by hand in a stylesheet.
const css =
	`/* Generated by scripts/generate-contours.mjs — do not edit by hand. */\n\n` +
	places
		.map(
			(p) =>
				`:root[data-field='${p.slug}'] {\n\t--contour-image: url('/contours/${p.slug}.svg');\n}\n\n` +
				`:root[data-field='${p.slug}'] .key [data-for='${p.slug}'] {\n\tdisplay: block;\n}`,
		)
		.join('\n\n') +
	'\n';
await writeFile('src/styles/contours.css', css);
console.log(`\n  wrote src/styles/contours.css (${places.length} places)`);
