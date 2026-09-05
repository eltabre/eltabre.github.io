/**
 * Curvy connectors for the projects trail.
 *
 * Each leg draws inside its own SVG with viewBox "0 0 100 100", so coordinates
 * are percentages of that box and nothing ever measures the page. The SVG has
 * `overflow: visible` and negative margins in CSS, which means the path may
 * wander outside 0–100 and spill into the empty half beside the cards without
 * costing any layout height. That is what lets the cards sit close together
 * while the line still has room to misbehave.
 */

export type Leg = 'lr' | 'rl';

export function legDirection(index: number): Leg {
	return index % 2 === 0 ? 'lr' : 'rl';
}

/**
 * A leg of the trail. Endpoints are always pinned to the card anchors; only the
 * control points move. Roughly two in five legs are switchbacks — the control
 * points get thrown past the opposite anchor so the curve crosses itself and
 * doubles back, the way a real trail does on a steep section.
 */
export function legPath(leg: Leg, rand: () => number = Math.random): string {
	const startX = leg === 'lr' ? 32 : 68;
	const endX = leg === 'lr' ? 68 : 32;

	// Centred on zero, so the base curve is the average of all rolls.
	const jitter = (spread: number) => (rand() - 0.5) * spread;

	// Direction of travel: +1 running left-to-right, -1 running right-to-left.
	const dir = leg === 'lr' ? 1 : -1;

	let c1x: number, c1y: number, c2x: number, c2y: number;

	if (rand() < 0.4) {
		// Switchback: each control point overshoots past the *far* anchor, which
		// drags the curve back on itself and opens a loop in the middle.
		c1x = startX + dir * (58 + jitter(18));
		c1y = 12 + jitter(16);
		c2x = endX - dir * (58 + jitter(18));
		c2y = 88 + jitter(16);
	} else {
		// Plain wander: a lazy S with a bounded wobble.
		c1x = startX + jitter(26);
		c1y = 34 + jitter(22);
		c2x = endX + jitter(26);
		c2y = 66 + jitter(22);
	}

	const n = (v: number) => v.toFixed(1);
	return `M ${startX} 0 C ${n(c1x)} ${n(c1y)}, ${n(c2x)} ${n(c2y)}, ${endX} 100`;
}
