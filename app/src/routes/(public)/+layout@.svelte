<script lang="ts">
	import './../layout.css';
	import favicon from '$lib/assets/favicon.ico';
	import Header from '$lib/components/general/Header.svelte';
	import Footer from '$lib/components/general/Footer.svelte';
	import WhatsappButton from '$lib/components/general/whatsappButton.svelte';
	import Escalator from '$lib/components/general/Escalator.svelte';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<Header />
{@render children()}
<WhatsappButton />
<Escalator />
<Footer />
