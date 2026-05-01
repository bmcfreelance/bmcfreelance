<!-- src/lib/components/ScrollToTop.svelte -->
<script lang="ts">
	let visible = $state(false);

	function onScroll() {
		visible = window.scrollY > 300;
	}

	function scrollToTop() {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}
</script>

<svelte:window onscroll={onScroll} />

{#if visible}
	<button
		onclick={scrollToTop}
		class="fixed right-6 bottom-24 z-50 rounded-full bg-black p-3 shadow-lg transition-transform hover:scale-110 dark:bg-white"
		aria-label="Scroll to top"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="h-5 w-5 fill-none stroke-white dark:stroke-black"
			viewBox="0 0 24 24"
			stroke-width="2.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<path d="M18 15l-6-6-6 6" />
		</svg>
	</button>
{/if}
