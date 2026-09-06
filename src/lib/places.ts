/**
 * The places whose terrain is drawn behind the site.
 *
 * A topographic map and a loss landscape are the same object — level sets of a
 * function of two variables. These are the real version: actual elevation data
 * from places worth walking, rather than a texture.
 */

export interface Place {
	/** Used as the `data-field` value and the generated SVG's filename. */
	slug: string;
	name: string;
	region: string;
	/** Centre of the area to render. */
	lat: number;
	lon: number;
	/** Slippy-map zoom. Higher is a smaller area in more detail. */
	zoom: number;
	/** One line for the corner key. */
	note: string;
}

export const PLACES: Place[] = [
	{
		slug: 'yosemite',
		name: 'Yosemite Valley',
		region: 'California',
		lat: 37.745,
		lon: -119.593,
		zoom: 11,
		note: '',
	},
	{
		slug: 'rmnp',
		name: 'Rocky Mountain National Park',
		region: 'Colorado',
		lat: 40.343,
		lon: -105.688,
		zoom: 11,
		note: '',
	},
	{
		slug: 'grand-canyon',
		name: 'Grand Canyon',
		region: 'Arizona',
		lat: 36.075,
		lon: -112.115,
		zoom: 11,
		note: '',
	},
	{
		slug: 'grand-teton',
		name: 'Grand Teton',
		region: 'Wyoming',
		lat: 43.741,
		lon: -110.802,
		zoom: 11,
		note: '',
	},
];
