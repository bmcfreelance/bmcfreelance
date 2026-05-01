<script lang="ts">
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Loader2, Upload, X } from 'lucide-svelte';
	import { superForm } from 'sveltekit-superforms';
	import { zod4 as zod } from 'sveltekit-superforms/adapters';
	import { userSchema, editUserSchema } from '$lib/schemas/user';
	import type { User } from '$lib/types/user';
	import { toast } from 'svelte-sonner';

	let {
		open = $bindable(false),
		mode = 'create',
		user = null,
		createFormData,
		editFormData,
		onSuccess
	}: {
		open: boolean;
		mode: 'create' | 'edit';
		user: User | null;
		createFormData: any;
		editFormData: any;
		onSuccess: () => void;
	} = $props();

	// ── Image preview state ──────────────────────────────────────
	let imagePreview = $state<string | null>(null);
	let imageFile = $state<File | null>(null);
	let fileInput = $state<HTMLInputElement | null>(null);

	// svelte-ignore state_referenced_locally
	const createSF = superForm(createFormData, {
		validators: zod(userSchema),
		onResult({ result }) {
			if (result.type === 'success') {
				toast.success('User created!');
				open = false;
				resetImage();
				onSuccess();
			}
		}
	});

	// svelte-ignore state_referenced_locally
	const editSF = superForm(editFormData, {
		validators: zod(editUserSchema),
		onResult({ result }) {
			if (result.type === 'success') {
				toast.success('User updated!');
				open = false;
				resetImage();
				onSuccess();
			}
		}
	});

	const sf = $derived(mode === 'create' ? createSF : editSF);
	const { form, errors, enhance, submitting } = $derived(sf);

	$effect(() => {
		if (mode === 'edit' && user) {
			$form.id = user.id;
			$form.name = user.name;
			$form.email = user.email;
			$form.phone = user.phone ?? '';
			$form.address = user.address ?? '';
			$form.role = user.role;
			$form.status = user.status;
			imagePreview = user.image ?? null;
			imageFile = null;
		} else if (mode === 'create') {
			resetImage();
		}
	});

	function onFileChange(e: Event) {
		const target = e.target as HTMLInputElement;
		const file = target.files?.[0];
		if (!file) return;

		// Validate client-side
		if (!file.type.startsWith('image/')) {
			toast.error('Please select an image file');
			return;
		}
		if (file.size > 2 * 1024 * 1024) {
			toast.error('Image must be under 2MB');
			return;
		}

		imageFile = file;
		imagePreview = URL.createObjectURL(file);
	}

	function resetImage() {
		imagePreview = null;
		imageFile = null;
		if (fileInput) fileInput.value = '';
	}

	function initials(name: string) {
		return name
			.split(' ')
			.map((n) => n[0])
			.join('')
			.slice(0, 2)
			.toUpperCase();
	}
</script>

<Sheet.Root bind:open>
	<Sheet.Content class="w-full overflow-y-auto sm:max-w-lg">
		<Sheet.Header class="mb-2">
			<Sheet.Title class="font-(family-name:	--font-display) text-lg font-semibold">
				{mode === 'create' ? 'Create new user' : 'Edit user'}
			</Sheet.Title>
			<Sheet.Description class="text-sm text-muted-foreground">
				{mode === 'create'
					? 'Fill in the details to add a new user.'
					: 'Update the user information below.'}
			</Sheet.Description>
		</Sheet.Header>

		<form
			method="post"
			action={mode === 'create' ? '?/create' : '?/edit'}
			enctype="multipart/form-data"
			use:enhance
			class="space-y-4 p-3"
		>
			{#if mode === 'edit'}
				<input type="hidden" name="id" bind:value={$form.id} />
			{/if}

			<!-- Avatar picker -->
			<div class="flex flex-col items-center gap-3 py-1">
				<div class="relative">
					<Avatar.Root class="h-20 w-20">
						{#if imagePreview}
							<Avatar.Image src={imagePreview} alt="Preview" />
						{/if}
						<Avatar.Fallback class="bg-primary/10 font-display text-xl font-semibold text-primary">
							{$form.name ? initials($form.name) : '?'}
						</Avatar.Fallback>
					</Avatar.Root>

					{#if imagePreview}
						<button
							type="button"
							onclick={resetImage}
							class="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-white shadow"
						>
							<X class="h-3 w-3" />
						</button>
					{/if}
				</div>

				<Button
					type="button"
					variant="outline"
					size="sm"
					class="gap-2"
					onclick={() => fileInput?.click()}
				>
					<Upload class="h-3.5 w-3.5" />
					{imagePreview ? 'Change photo' : 'Upload photo'}
				</Button>

				<!-- Hidden file input — named "imageFile" to match server -->
				<input
					bind:this={fileInput}
					type="file"
					name="imageFile"
					accept="image/jpeg,image/png,image/webp,image/gif"
					class="hidden"
					onchange={onFileChange}
				/>
				<p class="text-xs text-muted-foreground">JPEG, PNG, WebP or GIF — max 2MB</p>
			</div>

			<!-- Name -->
			<Form.Field form={sf} name="name">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Full name</Form.Label>
						<Input {...props} bind:value={$form.name} placeholder="Alice Martin" />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<!-- Email -->
			<Form.Field form={sf} name="email">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Email</Form.Label>
						<Input
							{...props}
							type="email"
							bind:value={$form.email}
							placeholder="alice@example.com"
						/>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<!-- Phone -->
			<Form.Field form={sf} name="phone">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Phone</Form.Label>
						<Input {...props} bind:value={$form.phone} placeholder="+1 555 000 0000" />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<!-- Address -->
			<Form.Field form={sf} name="address">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Address</Form.Label>
						<Input {...props} bind:value={$form.address} placeholder="123 Main St" />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<!-- Role -->
			<Form.Field form={sf} name="role">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Role</Form.Label>
						<Select.Root type="single" bind:value={$form.role} name={props.name}>
							<Select.Trigger class="w-full">
								{$form.role ?? 'Select role'}
							</Select.Trigger>
							<Select.Content>
								<Select.Item value="admin">Admin</Select.Item>
								<Select.Item value="employee">Employee</Select.Item>
								<Select.Item value="client">Client</Select.Item>
							</Select.Content>
						</Select.Root>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<!-- Status -->
			<Form.Field form={sf} name="status">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Status</Form.Label>
						<Select.Root type="single" bind:value={$form.status} name={props.name}>
							<Select.Trigger class="w-full">
								{$form.status ?? 'Select status'}
							</Select.Trigger>
							<Select.Content>
								<Select.Item value="active">Active</Select.Item>
								<Select.Item value="inactive">Inactive</Select.Item>
								<Select.Item value="pending">Pending</Select.Item>
							</Select.Content>
						</Select.Root>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<div class="flex gap-2 pt-2">
				<Button type="submit" class="flex-1 gap-2" disabled={$submitting}>
					{#if $submitting}
						<Loader2 class="h-4 w-4 animate-spin" />
					{/if}
					{mode === 'create' ? 'Create user' : 'Save changes'}
				</Button>
				<Button type="button" variant="outline" onclick={() => (open = false)}>Cancel</Button>
			</div>
		</form>
	</Sheet.Content>
</Sheet.Root>
