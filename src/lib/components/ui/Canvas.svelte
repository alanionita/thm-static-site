<script lang="ts">
	import { onMount } from 'svelte';

	interface Props {
		progress: number;
	}

	let { progress = 0 }: Props = $props(); // Percentage (0-100)
	let asset: { color?: string; radius?: number } = {
		color: '#FF3B30',
		radius: 20
	};

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;

	let innerWidth = $state(0);
	let innerHeight = $state(0);

	// Define the path points (quadratic curve)
	const path = $derived({
		start: { x: 100, y: innerHeight - 100 },
		control: { x: innerWidth / 2, y: 100 },
		end: { x: innerWidth - 50, y: innerHeight - 100 }
	});

	function draw() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		// Draw path
		ctx.beginPath();
		ctx.moveTo(path.start.x, path.start.y);
		ctx.quadraticCurveTo(path.control.x, path.control.y, path.end.x, path.end.y);
		ctx.strokeStyle = '#a3ea2a';
		ctx.lineWidth = 8;
		ctx.stroke();

		// Draw asset at current percentage
		const point = getPointOnPath(progress);
		ctx.beginPath();
	
		// Set up text styling
		ctx.font = '100px Arial';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';

		// Draw ufo emoji
		ctx.fillText('🛸', point.x, point.y);

		const end = getPointOnPath(100);
		// Draw coffee emoji
		ctx.fillText('☕', end.x, end.y);
	}

	function getPointOnPath(percentage: number) {
		// Convert percentage to 0-1 range and clamp
		const t = Math.min(1, Math.max(0, percentage / 100));

		// Quadratic Bezier curve calculation
		const x = (1 - t) ** 2 * path.start.x + 2 * (1 - t) * t * path.control.x + t ** 2 * path.end.x;

		const y = (1 - t) ** 2 * path.start.y + 2 * (1 - t) * t * path.control.y + t ** 2 * path.end.y;

		return { x, y };
	}

	onMount(() => {
		ctx = canvas.getContext('2d')!;
		draw();
	});

	$effect(() => {
		if (progress) draw();
	});
</script>

<svelte:window bind:innerWidth bind:innerHeight />
<div class="relative mx-auto w-full max-w-4xl bg-opacity-0">
	<div class="relative h-0 w-full pb-[46.25%] bg-opacity-0">
		<canvas
			bind:this={canvas}
			id="myCanvas"
			width={innerWidth}
			height={innerHeight}
			class="absolute left-0 top-0 h-full w-full rounded-lg bg-opacity-0"
		></canvas>
	</div>
</div>

<style>
	canvas {
		touch-action: none;
	}
</style>
