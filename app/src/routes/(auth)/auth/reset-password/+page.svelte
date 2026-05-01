<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { zod4 as zod } from 'sveltekit-superforms/adapters';
	import { z } from 'zod';
	import { getLocale, localizeHref } from '$lib/paraglide/runtime';
	import { animate } from 'motion';
	import { onMount, untrack } from 'svelte';
	import { m } from '$lib/paraglide/messages.js';

	const locale = $derived(getLocale());
	const isFr = $derived(locale.startsWith('fr'));
	let { data } = $props();

	console.log('data reset password', data);

	const resetPasswordSchema = $derived(
		z.object({
			password: z
				.string()
				.min(8, isFr ? 'Au moins 8 caractères' : 'At least 8 characters')
				.regex(/[A-Z]/, isFr ? 'Doit contenir une majuscule' : 'Must contain an uppercase letter')
				.regex(/[0-9]/, isFr ? 'Doit contenir un chiffre' : 'Must contain a number'),
			confirm: z
				.string()
				.min(8, isFr ? 'Au moins 8 caractères' : 'At least 8 characters')
				.regex(/[A-Z]/, isFr ? 'Doit contenir une majuscule' : 'Must contain an uppercase letter')
				.regex(/[0-9]/, isFr ? 'Doit contenir un chiffre' : 'Must contain a number'),

			locale: z.string().default(locale)
		})
	);

	const { form, errors, enhance, submitting, message } = superForm(
		untrack(() => data.form),
		{
			validators: zod(untrack(() => resetPasswordSchema)),
			invalidateAll: false
		}
	);
</script>

<div class="flex min-h-screen items-center justify-center">
	<div class="w-full max-w-md rounded-2xl border p-6 shadow-xl">
		<div class="mb-8 flex items-center gap-3">
			<a href={localizeHref('/')} class="flex space-x-2">
				<div
					class="flex h-9 w-9 items-center justify-center rounded-lg bg-black text-sm font-medium dark:text-white"
				>
					B
				</div>
				<div>
					<p class="text-sm font-medium">BMC Freelance</p>
					<p class="text-xs text-zinc-400">{m.Welcome_back()}</p>
				</div>
			</a>
		</div>
		<h1 class="mb-2 text-2xl font-semibold">
			{m.reset_password()}
		</h1>

		<p class="mb-6 text-sm text-gray-500">
			{m.Enter_your_new_password()}
		</p>

		<form method="POST" use:enhance class="space-y-4">
			<input type="hidden" name="locale" value={locale} />
			<input type="hidden" name="token" value={data.token} />

			<div>
				<label
					for="password"
					class="mb-1.5 block text-xs font-medium tracking-wider text-zinc-400 uppercase"
					>{m.password()}</label
				>
				<input
					type="password"
					name="password"
					bind:value={$form.password}
					placeholder="••••••••"
					class="w-full rounded-lg border px-3 py-2 text-sm transition-colors focus:outline-none
              {$errors.password
						? 'border-red-400 focus:border-red-500'
						: 'border-zinc-200 focus:border-zinc-400 dark:border-zinc-700 dark:focus:border-zinc-500'}
              bg-white dark:bg-zinc-800"
				/>
				{#if $errors.password}
					<p class="mt-1 text-xs text-red-500">{$errors.password?.[0]}</p>
				{/if}
			</div>

			<!-- Confirm -->
			<div class="space-y-1">
				<label
					for="confirm"
					class="mb-1.5 block text-xs font-medium tracking-wider text-zinc-400 uppercase"
				>
					{m.confirm_password()}
				</label>

				<input
					type="password"
					name="confirm"
					bind:value={$form.confirm}
					placeholder="••••••••"
					class="w-full rounded-lg border px-3 py-2 text-sm transition-colors focus:outline-none
              {$errors.password
						? 'border-red-400 focus:border-red-500'
						: 'border-zinc-200 focus:border-zinc-400 dark:border-zinc-700 dark:focus:border-zinc-500'}
              bg-white dark:bg-zinc-800"
				/>
				{#if $errors.confirm}
					<p class="mt-1 text-xs text-red-500">{$errors.confirm?.[0]}</p>
				{/if}
			</div>

			<button
				type="submit"
				disabled={$submitting}
				class="w-full rounded-lg bg-black py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-85 disabled:opacity-50 dark:bg-white dark:text-black"
			>
				{$submitting ? 'Traitement…' : 'Reset password'}
			</button>
		</form>

		{#if $message}
			<p class="text-center text-xs text-red-500">{$message}</p>
		{/if}
	</div>
</div>
