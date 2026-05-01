<script lang="ts">
	import { setLocale, getLocale } from '$lib/paraglide/runtime';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { m } from '$lib/paraglide/messages.js';
	import { locales, localizeHref } from '$lib/paraglide/runtime';
	// import { Canvas } from '@threlte/core';
	// import Scene from '$lib/components/motion/Scene.svelte';
</script>

<main class=" space-y-2">
	<section id="hero">
		<article class="p-2">
			this is hero

			<h1>{m.hello_world({ name: 'SvelteKit User' })}</h1>
		</article>
	</section>
	<section id="whoami">
		<article class="  h-screen bg-linear-150 from-indigo-500 to-purple-500 p-2">cv who ami</article>
	</section>
	<section id="projects" class="p-2">
		<article>projects</article>
	</section>
	<section id="cta1">
		<article class="p-2">this is cta1</article>
	</section>
	<section id="contact">
		<article class="p-2">newsletter</article>
	</section>
</main>
