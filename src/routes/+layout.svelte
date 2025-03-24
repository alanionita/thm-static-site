<script lang="ts">
	import '../app.css';
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<nav class="nav">
	<h1 class="px-2 text-2xl text-gray-200 md:px-4 md:py-2 md:text-4xl">Ziltoid The Omniscient</h1>
</nav>

{@render children?.()}

<style>
	.nav {
		background-color: var(--color-main);
		position: sticky;
		top: 0;
		overflow: hidden;
		z-index: 1;
		height: 4rem;
	}
</style>
