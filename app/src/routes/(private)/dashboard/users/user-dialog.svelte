<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { enhance } from '$app/forms';
	import { Loader2, Trash2, Mail, Phone, MapPin, Shield, CircleDot } from 'lucide-svelte';
	import type { User } from '$lib/types/user';
	import { toast } from 'svelte-sonner';

	let {
		open = $bindable(false),
		mode = 'view',
		user,
		onSuccess
	}: {
		open: boolean;
		mode: 'view' | 'delete';
		user: User | null;
		onSuccess: () => void;
	} = $props();

	let deleting = $state(false);

	const statusColor: Record<string, string> = {
		active: 'text-emerald-600 bg-emerald-500/10',
		inactive: 'text-red-500 bg-red-500/10',
		pending: 'text-amber-600 bg-amber-500/10'
	};

	const roleColor: Record<string, string> = {
		admin: 'text-violet-600 bg-violet-500/10',
		employee: 'text-blue-600 bg-blue-500/10',
		client: 'text-slate-600 bg-slate-500/10'
	};

	function initials(name: string) {
		return name
			.split(' ')
			.map((n) => n[0])
			.join('')
			.slice(0, 2)
			.toUpperCase();
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="sm:max-w-md">
		{#if mode === 'view' && user}
			<Dialog.Header>
				<Dialog.Title class="font-display font-semibold">User details</Dialog.Title>
			</Dialog.Header>

			<div class="flex flex-col items-center gap-3 py-4">
				<Avatar.Root class="h-16 w-16">
					<Avatar.Image src={user.image ?? ''} alt={user.name} />
					<Avatar.Fallback class="bg-primary/10 font-display text-lg font-semibold text-primary">
						{initials(user.name)}
					</Avatar.Fallback>
				</Avatar.Root>
				<div class="text-center">
					<p class="font-display text-base font-semibold">{user.name}</p>
					<div class="mt-1.5 flex items-center justify-center gap-2">
						<span
							class="rounded-full px-2 py-0.5 text-[11px] font-medium capitalize {roleColor[
								user.role
							]}"
						>
							{user.role}
						</span>
						<span
							class="rounded-full px-2 py-0.5 text-[11px] font-medium capitalize {statusColor[
								user.status
							]}"
						>
							{user.status}
						</span>
					</div>
				</div>
			</div>

			<div class="space-y-3 rounded-lg border bg-muted/30 p-4 text-sm">
				<div class="flex items-center gap-3 text-muted-foreground">
					<Mail class="h-4 w-4 shrink-0" />
					<span>{user.email}</span>
				</div>
				<div class="flex items-center gap-3 text-muted-foreground">
					<Phone class="h-4 w-4 shrink-0" />
					<span>{user.phone}</span>
				</div>
				<div class="flex items-center gap-3 text-muted-foreground">
					<MapPin class="h-4 w-4 shrink-0" />
					<span>{user.address}</span>
				</div>
			</div>

			<Dialog.Footer class="mt-2">
				<Button variant="outline" class="w-full" onclick={() => (open = false)}>Close</Button>
			</Dialog.Footer>
		{:else if mode === 'delete' && user}
			<Dialog.Header>
				<Dialog.Title class="font-display font-semibold text-destructive">Delete user</Dialog.Title>
				<Dialog.Description>
					Are you sure you want to delete <strong>{user.name}</strong>? This action cannot be
					undone.
				</Dialog.Description>
			</Dialog.Header>

			<form
				method="post"
				action="?/delete"
				use:enhance={() => {
					deleting = true;
					return async ({ result, update }) => {
						deleting = false;
						if (result.type === 'success') {
							toast.success('User deleted');
							open = false;
							onSuccess();
						} else {
							toast.error('Failed to delete user');
						}
						await update();
					};
				}}
			>
				<input type="hidden" name="id" value={user.id} />
				<Dialog.Footer class="mt-4 gap-2">
					<Button type="button" variant="outline" onclick={() => (open = false)}>Cancel</Button>
					<Button type="submit" variant="destructive" class="gap-2" disabled={deleting}>
						{#if deleting}
							<Loader2 class="h-4 w-4 animate-spin" />
						{:else}
							<Trash2 class="h-4 w-4" />
						{/if}
						Delete
					</Button>
				</Dialog.Footer>
			</form>
		{/if}
	</Dialog.Content>
</Dialog.Root>
