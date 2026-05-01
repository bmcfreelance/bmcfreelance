<script lang="ts">
	import type { PageData } from './$types';
	import type { User } from '$lib/types/user';
	import * as Table from '$lib/components/ui/table/index.js';
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import {
		Loader2,
		Plus,
		Search,
		Eye,
		Pencil,
		Trash2,
		ChevronLeft,
		ChevronRight
	} from 'lucide-svelte';
	import { Toaster } from 'svelte-sonner';
	import UserSheet from './user-sheet.svelte';
	import UserDialog from './user-dialog.svelte';
	import { invalidateAll } from '$app/navigation';

	let { data }: { data: PageData } = $props();

	// ── State ────────────────────────────────────────────────────
	let search = $state('');
	let page = $state(1);
	const perPage = 8;

	let sheetOpen = $state(false);
	let sheetMode = $state<'create' | 'edit'>('create');

	let dialogOpen = $state(false);
	let dialogMode = $state<'view' | 'delete'>('view');

	let selectedUser = $state<User | null>(null);
	let loading = $state(false);

	// ── Filtering + pagination ───────────────────────────────────
	const filtered = $derived(
		(data.users as User[]).filter(
			(u) =>
				u.name.toLowerCase().includes(search.toLowerCase()) ||
				u.email.toLowerCase().includes(search.toLowerCase()) ||
				u.role.toLowerCase().includes(search.toLowerCase())
		)
	);

	const totalPages = $derived(Math.max(1, Math.ceil(filtered.length / perPage)));
	const paginated = $derived(filtered.slice((page - 1) * perPage, page * perPage));

	// Reset to page 1 on search
	$effect(() => {
		search;
		page = 1;
	});

	// ── Helpers ──────────────────────────────────────────────────
	function initials(name: string) {
		return name
			.split(' ')
			.map((n) => n[0])
			.join('')
			.slice(0, 2)
			.toUpperCase();
	}

	function openCreate() {
		selectedUser = null;
		sheetMode = 'create';
		sheetOpen = true;
	}

	function openEdit(user: User) {
		selectedUser = user;
		sheetMode = 'edit';
		sheetOpen = true;
	}

	function openView(user: User) {
		selectedUser = user;
		dialogMode = 'view';
		dialogOpen = true;
	}

	function openDelete(user: User) {
		selectedUser = user;
		dialogMode = 'delete';
		dialogOpen = true;
	}

	async function onSuccess() {
		loading = true;
		await invalidateAll();
		loading = false;
	}

	const statusColor: Record<string, string> = {
		active: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
		inactive: 'bg-red-500/10 text-red-500',
		pending: 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
	};

	const roleColor: Record<string, string> = {
		admin: 'bg-violet-500/10 text-violet-600',
		employee: 'bg-blue-500/10 text-blue-600',
		client: 'bg-slate-500/10 text-slate-600'
	};
</script>

<Toaster richColors position="top-right" />

<div class="space-y-5">
	<!-- Page heading -->
	<div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
		<div>
			<h1 class="font-display text-2xl font-semibold tracking-tight">Users</h1>
			<p class="mt-0.5 text-sm text-muted-foreground">
				{data.users.length} total users
			</p>
		</div>
		<Button onclick={openCreate} class="gap-2 self-start sm:self-auto">
			<Plus class="h-4 w-4" />
			New user
		</Button>
	</div>

	<!-- Search + table card -->
	<div class="rounded-lg border bg-card shadow-none">
		<!-- Search bar -->
		<div class="flex items-center gap-3 border-b px-4 py-3">
			<Search class="h-4 w-4 shrink-0 text-muted-foreground" />
			<Input
				bind:value={search}
				placeholder="Search by name, email or role…"
				class="h-8 border-0 bg-transparent p-0 text-sm shadow-none focus-visible:ring-0"
			/>
			{#if loading}
				<Loader2 class="h-4 w-4 animate-spin text-muted-foreground" />
			{/if}
		</div>

		<!-- Table -->
		<Table.Root>
			<Table.Header>
				<Table.Row class="hover:bg-transparent">
					<Table.Head class="pl-5 text-xs font-medium tracking-wide uppercase">User</Table.Head>
					<Table.Head class="text-xs font-medium tracking-wide uppercase">Email</Table.Head>
					<Table.Head class="text-xs font-medium tracking-wide uppercase">Phone</Table.Head>
					<Table.Head class="text-xs font-medium tracking-wide uppercase">Role</Table.Head>
					<Table.Head class="text-xs font-medium tracking-wide uppercase">Status</Table.Head>
					<Table.Head class="pr-5 text-right text-xs font-medium tracking-wide uppercase"
						>Actions</Table.Head
					>
				</Table.Row>
			</Table.Header>

			<Table.Body>
				{#if paginated.length === 0}
					<Table.Row>
						<Table.Cell colspan={6} class="py-16 text-center text-sm text-muted-foreground">
							{search ? 'No users match your search.' : 'No users yet. Create your first one!'}
						</Table.Cell>
					</Table.Row>
				{:else}
					{#each paginated as user (user.id)}
						<Table.Row class="group transition-colors hover:bg-muted/40">
							<!-- User -->
							<Table.Cell class="pl-5">
								<div class="flex items-center gap-3">
									<Avatar.Root class="h-8 w-8 shrink-0">
										<Avatar.Image src={user.image ?? ''} alt={user.name} />
										<Avatar.Fallback
											class="bg-primary/10 font-display text-xs font-semibold text-primary"
										>
											{initials(user.name)}
										</Avatar.Fallback>
									</Avatar.Root>
									<span class="text-sm font-medium">{user.name}</span>
								</div>
							</Table.Cell>

							<Table.Cell class="text-sm text-muted-foreground">{user.email}</Table.Cell>
							<Table.Cell class="text-sm text-muted-foreground">{user.phone}</Table.Cell>

							<!-- Role -->
							<Table.Cell>
								<span
									class="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium capitalize {roleColor[
										user.role
									]}"
								>
									{user.role}
								</span>
							</Table.Cell>

							<!-- Status -->
							<Table.Cell>
								<span
									class="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium capitalize {statusColor[
										user.status
									]}"
								>
									{user.status}
								</span>
							</Table.Cell>

							<!-- Actions -->
							<Table.Cell class="pr-5 text-right">
								<div
									class="flex items-center justify-end gap-1 opacity-60 transition-opacity group-hover:opacity-100"
								>
									<Button
										variant="ghost"
										size="icon"
										class="h-7 w-7 text-muted-foreground hover:text-foreground"
										onclick={() => openView(user)}
										title="View"
									>
										<Eye class="h-3.5 w-3.5" />
									</Button>
									<Button
										variant="ghost"
										size="icon"
										class="h-7 w-7 text-muted-foreground hover:text-foreground"
										onclick={() => openEdit(user)}
										title="Edit"
									>
										<Pencil class="h-3.5 w-3.5" />
									</Button>
									<Button
										variant="ghost"
										size="icon"
										class="h-7 w-7 text-muted-foreground hover:text-destructive"
										onclick={() => openDelete(user)}
										title="Delete"
									>
										<Trash2 class="h-3.5 w-3.5" />
									</Button>
								</div>
							</Table.Cell>
						</Table.Row>
					{/each}
				{/if}
			</Table.Body>
		</Table.Root>

		<!-- Pagination -->
		<div class="flex items-center justify-between border-t px-5 py-3">
			<p class="text-xs text-muted-foreground">
				Showing {Math.min((page - 1) * perPage + 1, filtered.length)}–{Math.min(
					page * perPage,
					filtered.length
				)} of {filtered.length} users
			</p>
			<div class="flex items-center gap-1">
				<Button
					variant="outline"
					size="icon"
					class="h-7 w-7"
					disabled={page <= 1}
					onclick={() => page--}
				>
					<ChevronLeft class="h-3.5 w-3.5" />
				</Button>
				{#each Array.from({ length: totalPages }, (_, i) => i + 1) as p}
					<Button
						variant={p === page ? 'default' : 'outline'}
						size="icon"
						class="h-7 w-7 text-xs"
						onclick={() => (page = p)}
					>
						{p}
					</Button>
				{/each}
				<Button
					variant="outline"
					size="icon"
					class="h-7 w-7"
					disabled={page >= totalPages}
					onclick={() => page++}
				>
					<ChevronRight class="h-3.5 w-3.5" />
				</Button>
			</div>
		</div>
	</div>
</div>

<!-- Sheet: create / edit -->
<UserSheet
	bind:open={sheetOpen}
	mode={sheetMode}
	user={selectedUser}
	createFormData={data.createForm}
	editFormData={data.editForm}
	{onSuccess}
/>

<!-- Dialog: view / delete -->
<UserDialog bind:open={dialogOpen} mode={dialogMode} user={selectedUser} {onSuccess} />
