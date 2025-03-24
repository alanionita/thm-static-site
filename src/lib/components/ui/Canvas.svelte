<script lang="ts">
	import { onMount } from 'svelte';

    interface Props {
		progress: number
	}

    let { progress = 0}: Props = $props(); // Percentage (0-100)
	let asset: { color?: string; radius?: number } = {
		color: '#FF3B30',
		radius: 20
	};

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;

	// Define the path points (quadratic curve)
	const path = {
		start: { x: 50, y: 300 },
		control: { x: 250, y: 50 },
		end: { x: 450, y: 300 }
	};

	function draw() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		// Draw path
		ctx.beginPath();
		ctx.moveTo(path.start.x, path.start.y);
		ctx.quadraticCurveTo(path.control.x, path.control.y, path.end.x, path.end.y);
		ctx.strokeStyle = '#666';
		ctx.lineWidth = 2;
		ctx.stroke();

		// Draw asset at current percentage
		const point = getPointOnPath(progress);
		ctx.beginPath();
		ctx.arc(point.x, point.y, asset.radius || 20, 0, Math.PI * 2);
		ctx.fillStyle = asset.color || '#FF3B30';
		ctx.fill();
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
        if (progress) draw()
	});
</script>

<canvas bind:this={canvas} width={500} height={350} style="border: 1px solid #ddd;"></canvas>

<style>
	canvas {
		touch-action: none;
	}
</style>
