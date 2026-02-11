<script lang="ts">
	import type { Chord } from '$lib/chords/Chord';

	export let chord: Chord;
	export let baseHue: number = 0;
	export let size: string = '2rem';

	function getChordColor(chord: Chord, baseHue: number): { bg: string; text: string } {
		const bgColor = chord.getColor(baseHue);
		// Parse HSL to get hue value
		const hslMatch = bgColor.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
		if (hslMatch) {
			const [, h] = hslMatch;
			return {
				bg: `hsl(${h}, var(--chord-bg-saturation), var(--chord-bg-luminance))`,
				text: `hsl(${h}, var(--chord-text-saturation), var(--chord-text-luminance))`
			};
		}
		return { bg: bgColor, text: '#ffffff' };
	}

	$: colors = getChordColor(chord, baseHue);
</script>

<span 
	class="chord" 
	style="background-color: {colors.bg}; color: {colors.text}; font-size: {size};"
>
	{chord.toString()}
</span>

<style>
	.chord {
		display: inline-block;
		padding: 0.5rem 1rem;
		border-radius: 1rem;
		font-weight: bold;
		transition: transform 0.1s;
		white-space: nowrap;
	}

	.chord:hover {
		transform: scale(1.05);
	}
</style>
