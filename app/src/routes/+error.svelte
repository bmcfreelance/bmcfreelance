<script lang="ts">
	import { page } from '$app/state';
	import './layout.css';
</script>

<div class="error-container">
	<h1>{page.status}</h1>

	{#if page.status === 404}
		<p>Page not found.</p>
		<a href="/" class="text-xl">Go home</a>
	{:else if page.status === 500}
		<p>Internal server error.</p>
		<p>{page.error?.message ?? 'Something went wrong.'}</p>
	{:else}
		<p>{page.error?.message ?? 'Something went wrong.'}</p>
	{/if}
</div>
