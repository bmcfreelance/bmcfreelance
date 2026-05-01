<!-- src/routes/forgot-password/+page.svelte -->
<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { zod4 as zod } from 'sveltekit-superforms/adapters';
	import { z } from 'zod';
	import { getLocale, localizeHref } from '$lib/paraglide/runtime';
	import { animate } from 'motion';
	import { onMount, untrack } from 'svelte';

	const locale = $derived(getLocale());
	const isFr = $derived(locale.startsWith('fr'));

	const forgotPasswordSchema = $derived(
		z.object({
			email: z.string().email(isFr ? 'Adresse email invalide' : 'Invalid email address')
		})
	);

	let { data } = $props();

	const { form, errors, enhance, submitting, message } = superForm(
		untrack(() => data.form),
		{
			validators: zod(untrack(() => forgotPasswordSchema)),
			invalidateAll: false
		}
	);

	let success = $state(false);
	let cardEl: HTMLElement;
	let successEl: HTMLElement;
	let formEl: HTMLElement;

	onMount(() => {
		animate(
			cardEl,
			{ opacity: [0, 1], y: [24, 0] },
			{ type: 'spring', stiffness: 200, damping: 22 }
		);
	});

	async function handleSuccess() {
		await animate(formEl, { opacity: [1, 0], y: [0, -12] }, { duration: 0.3 }).finished;
		success = true;
		await new Promise((r) => requestAnimationFrame(r));
		animate(
			successEl,
			{ opacity: [0, 1], y: [16, 0] },
			{ type: 'spring', stiffness: 220, damping: 20 }
		);
	}

	$effect(() => {
		if ($message === 'success') handleSuccess();
	});
</script>

<div class="flex min-h-screen items-center justify-center bg-zinc-50 px-4 dark:bg-zinc-950">
	<div
		bind:this={cardEl}
		style="opacity: 0;"
		class="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-10 dark:border-zinc-800 dark:bg-zinc-900"
	>
		<!-- Logo -->
		<div class="mb-8 flex items-center gap-3">
			<a href={localizeHref('/')} class="flex space-x-2">
				<div
					class="flex h-9 w-9 items-center justify-center rounded-lg bg-black text-sm font-medium text-white dark:bg-white dark:text-black"
				>
					B
				</div>
				<div>
					<p class="text-sm font-medium">BMC Freelance</p>
					<p class="text-xs text-zinc-400">
						{isFr ? 'Réinitialisation du mot de passe' : 'Password reset'}
					</p>
				</div>
			</a>
		</div>

		{#if !success}
			<div bind:this={formEl}>
				<h1 class="mb-1 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
					{isFr ? 'Mot de passe oublié ?' : 'Forgot your password?'}
				</h1>
				<p class="mb-6 text-sm text-zinc-400">
					{isFr
						? 'Entrez votre email et nous vous enverrons un lien de réinitialisation.'
						: "Enter your email and we'll send you a reset link."}
				</p>

				{#if $message && $message !== 'success'}
					<p
						class="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-center text-xs text-red-500 dark:border-red-900 dark:bg-red-950"
					>
						{$message}
					</p>
				{/if}

				<form method="POST" use:enhance class="space-y-4">
					<div>
						<label
							for="email"
							class="mb-1.5 block text-xs font-medium tracking-wider text-zinc-400 uppercase"
						>
							{isFr ? 'Adresse email' : 'Email address'}
						</label>
						<input
							id="email"
							name="email"
							type="email"
							autocomplete="email"
							placeholder="you@example.com"
							bind:value={$form.email}
							aria-describedby={$errors.email ? 'email-error' : undefined}
							aria-invalid={!!$errors.email}
							class="w-full rounded-lg border px-3 py-2 text-sm transition-colors focus:outline-none
								{$errors.email
								? 'border-red-400 focus:border-red-500'
								: 'border-zinc-200 focus:border-zinc-400 dark:border-zinc-700 dark:focus:border-zinc-500'}
								bg-white dark:bg-zinc-800 dark:text-zinc-100"
						/>
						{#if $errors.email}
							<p id="email-error" class="mt-1 text-xs text-red-500" role="alert">
								{$errors.email?.[0]}
							</p>
						{/if}
					</div>

					<button
						type="submit"
						disabled={$submitting}
						class="w-full rounded-lg bg-black py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-85 disabled:opacity-50 dark:bg-white dark:text-black"
					>
						{#if $submitting}
							{isFr ? 'Envoi en cours…' : 'Sending…'}
						{:else}
							{isFr ? 'Envoyer le lien' : 'Send reset link'}
						{/if}
					</button>
				</form>

				<div class="mt-5 text-center">
					<a
						href={localizeHref('/auth')}
						class="text-xs text-zinc-400 transition-colors hover:text-zinc-600 dark:hover:text-zinc-200"
					>
						← {isFr ? 'Retour à la connexion' : 'Back to sign in'}
					</a>
				</div>
			</div>
		{:else}
			<div
				bind:this={successEl}
				style="opacity: 0;"
				class="flex flex-col items-center gap-3 py-2 text-center"
			>
				<div
					class="flex h-14 w-14 items-center justify-center rounded-full border border-green-200 bg-green-50 text-green-700 dark:border-green-900 dark:bg-green-950 dark:text-green-400"
				>
					<svg width="26" height="26" viewBox="0 0 28 28" fill="none" aria-hidden="true">
						<circle cx="14" cy="14" r="13" stroke="currentColor" stroke-width="1.5" />
						<path
							d="M8.5 14.5l4 4 7-8"
							stroke="currentColor"
							stroke-width="1.75"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				</div>

				<div>
					<p class="font-semibold text-zinc-900 dark:text-zinc-100">
						{isFr ? 'Vérifiez votre boîte mail' : 'Check your inbox'}
					</p>
					<p class="mt-1 text-sm leading-relaxed text-zinc-400">
						{isFr ? 'Si' : 'If'}
						<span class="font-medium text-zinc-700 dark:text-zinc-300">{$form.email}</span>
						{isFr
							? 'est associé à un compte, un lien de réinitialisation a été envoyé. Vérifiez aussi vos spams.'
							: 'has an account, a reset link is on its way. Check your spam folder too.'}
					</p>
				</div>

				<a
					href={localizeHref('/auth')}
					class="mt-2 w-full rounded-lg border border-zinc-200 py-2.5 text-center text-sm transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
				>
					← {isFr ? 'Retour à la connexion' : 'Back to sign in'}
				</a>
			</div>
		{/if}
	</div>
</div>
