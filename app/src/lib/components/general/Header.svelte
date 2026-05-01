<script>
	import { Languages, Moon, Sun, Menu, X } from 'lucide-svelte';
	import { setLocale, getLocale, localizeHref } from '$lib/paraglide/runtime';
	import { page } from '$app/state';
	import { m } from '$lib/paraglide/messages.js';
	import { onMount } from 'svelte';

	let mobileOpen = $state(false);
	let isDark = $state(false);

	const locale = $derived(getLocale());

	onMount(() => {
		isDark =
			localStorage.getItem('theme') === 'dark' ||
			(!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
		document.documentElement.classList.toggle('dark', isDark);
	});

	function toggleLocale() {
		setLocale(locale === 'en' ? 'fr' : 'en');
	}

	function toggleTheme() {
		isDark = !isDark;
		document.documentElement.classList.toggle('dark', isDark);
		localStorage.setItem('theme', isDark ? 'dark' : 'light');
	}

	const navLinks = [
		{ href: '/', label: () => m.nav_home() },
		{ href: '/projects', label: () => m.nav_projects() },
		{ href: '/about', label: () => m.nav_about() },
		{ href: '/contact', label: () => m.nav_contact() }
	];

	// @ts-ignore
	function isActive(href) {
		return page.url.pathname === href;
	}
</script>

<header class="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-sm">
	<div class="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
		<!-- Logo -->
		<a
			href={localizeHref('/')}
			class="flex items-center gap-2 font-semibold tracking-tight text-foreground"
		>
			<span class="text-lg">BMC</span>
			<span class="hidden text-muted-foreground sm:inline">Freelance</span>
		</a>

		<!-- Desktop nav -->
		<nav class="hidden items-center gap-1 md:flex">
			{#each navLinks as { href, label }}
				<a
					href={localizeHref(href)}
					class="rounded-md px-3 py-1.5 text-sm font-medium transition-colors
            {isActive(href)
						? 'bg-accent text-accent-foreground'
						: 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'}"
				>
					{label()}
				</a>
			{/each}
		</nav>

		<!-- Controls -->
		<div class="flex items-center gap-1">
			<!-- Language toggle -->
			<button
				onclick={toggleLocale}
				class="inline-flex h-9 items-center gap-1.5 rounded-md border border-input bg-background px-3 text-sm font-medium
               text-muted-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
				aria-label="Switch language"
			>
				<Languages class="h-4 w-4" />
				<span class="uppercase">{locale == 'en' ? 'FR' : 'EN'}</span>
			</button>

			<!-- Theme toggle -->
			<button
				onclick={toggleTheme}
				class="inline-flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background
               text-muted-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
				aria-label="Toggle theme"
			>
				{#if isDark}
					<Sun class="h-4 w-4" />
				{:else}
					<Moon class="h-4 w-4" />
				{/if}
			</button>
			<button>
				<a
					href={localizeHref('/auth')}
					class="inline-flex h-9 items-center gap-1.5 rounded-md border border-input bg-background px-3 text-sm font-medium
			   text-muted-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
				>
					{m.signin()}
				</a>
			</button>

			<!-- Mobile menu button -->
			<button
				onclick={() => (mobileOpen = !mobileOpen)}
				class="inline-flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background
               text-muted-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground md:hidden"
				aria-label="Toggle menu"
			>
				{#if mobileOpen}
					<X class="h-4 w-4" />
				{:else}
					<Menu class="h-4 w-4" />
				{/if}
			</button>
		</div>
	</div>

	<!-- Mobile nav -->
	{#if mobileOpen}
		<div class="border-t border-border bg-background px-4 py-3 md:hidden">
			<nav class="flex flex-col gap-1">
				{#each navLinks as { href, label }}
					<a
						{href}
						onclick={() => (mobileOpen = false)}
						class="rounded-md px-3 py-2 text-sm font-medium transition-colors
              {isActive(href)
							? 'bg-accent text-accent-foreground'
							: 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'}"
					>
						{label()}
					</a>
				{/each}
			</nav>
		</div>
	{/if}
</header>
