<script lang="ts">
	import { setLocale, getLocale } from '$lib/paraglide/runtime';
	import { m } from '$lib/paraglide/messages.js';
	import { page } from '$app/state';
	import { locales, localizeHref } from '$lib/paraglide/runtime';
</script>

<h1>{m.hello_world({ name: 'SvelteKit User' })}</h1>

about page

<!-- <div class="p-4">
	<h1>about</h1>
	<div>{page.url.pathname}</div>
	<div>{page.url.search}</div>
	<div>{getLocale()}</div>
</div> -->
