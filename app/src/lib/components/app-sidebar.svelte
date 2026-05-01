<script lang="ts">
	import { localizeHref, setLocale, getLocale } from '$lib/paraglide/runtime';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';

	import type { NavItem } from '$lib/types/nav';

	let { items }: { items: NavItem[] } = $props();
	import { page } from '$app/state';

	// active check per item
	function isActive(url: string) {
		const localized = localizeHref(url);
		const pathname = page.url.pathname;

		// Exact match only for the root dashboard
		if (url === '/dashboard') {
			return pathname === localized;
		}

		// Prefix match for all other routes
		return pathname === localized || pathname.startsWith(localized + '/');
	}
</script>

<Sidebar.Root>
	<div class="mb-5 p-2 font-display text-2xl font-bold text-black dark:text-amber-300">
		Bmc freelance
	</div>
	<Sidebar.Content>
		<Sidebar.Group>
			<!-- <Sidebar.GroupLabel>Manage</Sidebar.GroupLabel> -->
			<Sidebar.GroupContent>
				<Sidebar.Menu>
					{#each items as item (item.title)}
						<Sidebar.MenuItem>
							<Sidebar.MenuButton>
								{#snippet child({ props })}
									<a
										href={localizeHref(item.url)}
										{...props}
										class={[
											'mb-2 flex items-center gap-1.5 rounded-md p-2 font-(family-name:--font-display) text-sm transition-colors',
											isActive(item.url)
												? 'bg-amber-500/10 font-semibold text-amber-600 dark:bg-amber-500/15 dark:text-amber-400'
												: 'text-muted-foreground hover:bg-muted hover:text-amber-500 dark:hover:text-amber-400'
										].join(' ')}
									>
										<item.icon class="inline-block" />
										<span class=" inline-block">{item.title}</span>
									</a>
								{/snippet}
							</Sidebar.MenuButton>
						</Sidebar.MenuItem>
					{/each}
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>
	</Sidebar.Content>
</Sidebar.Root>
