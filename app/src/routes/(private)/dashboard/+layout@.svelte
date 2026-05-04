<script lang="ts">
	import { page } from '$app/state';
	import { localizeHref, setLocale, getLocale } from '$lib/paraglide/runtime';
	import './../../layout.css';

	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import AppSidebar from '$lib/components/app-sidebar.svelte';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { onMount } from 'svelte';
	import { enhance } from '$app/forms';
	import { Sun, Moon, User, LogOut, Languages } from 'lucide-svelte';
	import type { NavItem } from '$lib/types/nav';

	import {
		House,
		Settings,
		Inbox,
		Calendar,
		Search,
		Users,
		UserKey,
		UserRoundPlus,
		VectorSquare,
		Network,
		ShieldCog,
		BriefcaseBusiness,
		MailCheck,
		UserStar
	} from '@lucide/svelte/icons';

	let { children, data } = $props();
	//console.log('data', data);

	let isDark = $state(false);
	const locale = $derived(getLocale());

	onMount(() => {
		isDark =
			localStorage.getItem('theme') === 'dark' ||
			(!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
		document.documentElement.classList.toggle('dark', isDark);
	});

	function toggleTheme() {
		isDark = !isDark;
		document.documentElement.classList.toggle('dark', isDark);
		localStorage.setItem('theme', isDark ? 'dark' : 'light');
	}

	function toggleLocale() {
		setLocale(locale === 'en' ? 'fr' : 'en');
	}

	const items: NavItem[] = [
		{ title: 'Accueil', url: '/dashboard', icon: House },
		{ title: 'Roles', url: '/dashboard/roles', icon: UserRoundPlus },
		{ title: 'Users', url: '/dashboard/users', icon: Users },
		{ title: 'Categories', url: '/dashboard/categories', icon: VectorSquare },
		{ title: 'Projects', url: '/dashboard/projects', icon: Network },
		{ title: 'Profile', url: '/dashboard/profile', icon: UserStar },
		{ title: 'Commercial', url: '/dashboard/commercial', icon: Inbox },
		{ title: 'Works', url: '/dashboard/works', icon: BriefcaseBusiness },
		{ title: 'Support', url: '/dashboard/support', icon: MailCheck },
		{ title: 'Campaigns', url: '/dashboard/campaigns', icon: ShieldCog },
		{ title: 'Settings', url: '/dashboard/settings', icon: Settings }
	];

	const currentPage = $derived(page.url.pathname.split('/').filter(Boolean).at(-1) ?? 'Dashboard');
</script>

<Sidebar.Provider>
	<AppSidebar {items} />

	<Sidebar.Inset>
		<!-- Header -->
		<header
			class="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background/95 px-5 backdrop-blur supports-backdrop-filter:bg-background/60"
		>
			<!-- Left: trigger + breadcrumb -->
			<Sidebar.Trigger class="-ml-1 shrink-0" />

			<div class="hidden sm:block">
				<Breadcrumb.Root>
					<Breadcrumb.List>
						<Breadcrumb.Item>
							<Breadcrumb.Link href="/dashboard" class="font-display text-sm font-medium">
								Accueil
							</Breadcrumb.Link>
						</Breadcrumb.Item>
						<Breadcrumb.Separator />
						<Breadcrumb.Item>
							<Breadcrumb.Page class="font-display text-sm font-semibold capitalize">
								{currentPage}
							</Breadcrumb.Page>
						</Breadcrumb.Item>
					</Breadcrumb.List>
				</Breadcrumb.Root>
			</div>

			<!-- svelte-ignore element_invalid_self_closing_tag -->
			<div class="flex-1" />

			<!-- Right actions -->
			<div class="flex items-center gap-2">
				<!-- Language toggle -->
				<button
					onclick={toggleLocale}
					class="inline-flex h-9 items-center gap-1.5 rounded-md border border-input bg-background px-3
                           font-display text-sm font-medium text-muted-foreground
                           shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
					aria-label="Switch language"
				>
					<Languages class="h-4 w-4" />
					<span class="uppercase">{locale === 'en' ? 'FR' : 'EN'}</span>
				</button>

				<!-- Theme toggle -->
				<Button variant="ghost" size="icon" onclick={toggleTheme} class="shrink-0">
					{#if isDark}
						<Sun class="h-4 w-4" />
					{:else}
						<Moon class="h-4 w-4" />
					{/if}
					<span class="sr-only">Toggle theme</span>
				</Button>

				<!-- User dropdown -->
				<DropdownMenu.Root>
					<DropdownMenu.Trigger>
						<Avatar.Root
							class="h-9 w-9 cursor-pointer ring-2 ring-transparent transition hover:ring-primary"
						>
							<Avatar.Image src={data?.user?.image ?? ''} alt={data?.user?.name ?? 'User'} />
							<Avatar.Fallback
								class="bg-primary font-display text-xs font-semibold text-primary-foreground"
							>
								{(data?.user?.name ?? 'U').slice(0, 2).toUpperCase()}
							</Avatar.Fallback>
						</Avatar.Root>
					</DropdownMenu.Trigger>

					<DropdownMenu.Content align="end" class="w-60">
						<!-- User info header -->
						<div class="px-3 py-3">
							<p class="font-display text-sm leading-none font-semibold">
								{data?.user?.name ?? 'User'}
							</p>
							<p class="mt-1 text-xs text-muted-foreground">
								{data?.user?.email ?? ''}
							</p>
							{#if data?.user?.role}
								<span
									class="mt-2 inline-block rounded-full bg-primary/10 px-2 py-0.5 font-display text-[10px] font-semibold tracking-wide text-primary uppercase"
								>
									{data.user.role}
								</span>
							{/if}
						</div>

						<DropdownMenu.Separator />

						<DropdownMenu.Item>
							<a href={localizeHref('/dashboard/profile')} class="flex items-center gap-2">
								<User class="h-4 w-4" />
								<span class="font-display text-sm">Profile</span>
							</a>
						</DropdownMenu.Item>

						<DropdownMenu.Item>
							<a href={localizeHref('/dashboard/settings')} class="flex items-center gap-2">
								<Settings class="h-4 w-4" />
								<span class="font-display text-sm">Settings</span>
							</a>
						</DropdownMenu.Item>

						<DropdownMenu.Separator />

						<form method="post" action="?/signOut" use:enhance>
							<DropdownMenu.Item>
								<button
									type="submit"
									class="flex w-full items-center gap-2 text-destructive focus:text-destructive"
								>
									<LogOut class="h-4 w-4" />
									<span class="font-display text-sm">Sign out</span>
								</button>
							</DropdownMenu.Item>
						</form>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</div>
		</header>

		<!-- Page content -->
		<div class="flex flex-1 flex-col gap-4 p-6">
			{@render children?.()}
		</div>
	</Sidebar.Inset>
</Sidebar.Provider>
