<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { zod4 as zod } from 'sveltekit-superforms/adapters';
	import { z } from 'zod';
	import { getLocale, localizeHref } from '$lib/paraglide/runtime';
	import googleicon from '$lib/assets/google.png';
	import githubicon from '$lib/assets/github.png';
	import { untrack } from 'svelte';
	import { m } from '$lib/paraglide/messages.js';
	import { Eye, EyeOff } from 'lucide-svelte'; // ✅ added

	const locale = $derived(getLocale());
	const isFr = $derived(locale.startsWith('fr'));

	const loginSchema = $derived(
		z.object({
			email: z.string().email(isFr ? 'Adresse email invalide' : 'Invalid email address'),
			password: z.string().min(8, isFr ? 'Au moins 8 caractères' : 'At least 8 characters'),
			locale: z.string().default(locale)
		})
	);

	const registerSchema = $derived(
		z.object({
			name: z
				.string()
				.min(2, isFr ? 'Au moins 2 caractères' : 'At least 2 characters')
				.max(60),
			email: z.string().email(isFr ? 'Adresse email invalide' : 'Invalid email address'),
			password: z
				.string()
				.min(8, isFr ? 'Au moins 8 caractères' : 'At least 8 characters')
				.regex(/[A-Z]/, isFr ? 'Doit contenir une majuscule' : 'Must contain an uppercase letter')
				.regex(/[0-9]/, isFr ? 'Doit contenir un chiffre' : 'Must contain a number'),
			locale: z.string().default(locale)
		})
	);

	let { data } = $props();

	// ── SuperForms ────────────────────────────────────────────────────────────
	const {
		form: loginForm,
		errors: loginErrors,
		message: loginMessage,
		enhance: loginEnhance,
		submitting: loginSubmitting
	} = superForm(
		untrack(() => data.loginForm),
		{
			validators: zod(untrack(() => loginSchema)),
			invalidateAll: false
		}
	);

	const {
		form: registerForm,
		errors: registerErrors,
		message: registerMessage,
		enhance: registerEnhance,
		submitting: registerSubmitting
	} = superForm(
		untrack(() => data.registerForm),
		{
			validators: zod(untrack(() => registerSchema)),
			invalidateAll: false
		}
	);

	const providers = [
		{ provider: 'google', label: 'Google', icon: googleicon },
		{ provider: 'github', label: 'GitHub', icon: githubicon }
	] as const;

	let mode = $state<'login' | 'register'>('login');

	// ✅ Password visibility toggles
	let showLoginPassword = $state(false);
	let showRegisterPassword = $state(false);
</script>

<div class="flex min-h-screen items-center justify-center bg-zinc-50 px-4 dark:bg-zinc-950">
	<div
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
					<p class="text-xs text-zinc-400">Welcome back</p>
				</div>
			</a>
		</div>

		<!-- Tabs -->
		<div class="mb-6 flex gap-1 rounded-lg bg-zinc-100 p-1 dark:bg-zinc-800">
			<button
				onclick={() => (mode = 'login')}
				class="flex-1 rounded-md py-1.5 text-sm transition-all
          {mode === 'login' ? 'bg-white font-medium shadow-sm dark:bg-zinc-700' : 'text-zinc-500'}"
				>{m.signin()}</button
			>
			<button
				onclick={() => (mode = 'register')}
				class="flex-1 rounded-md py-1.5 text-sm transition-all
          {mode === 'register'
					? 'bg-white font-medium shadow-sm dark:bg-zinc-700'
					: 'text-zinc-500'}">{m.signup()}</button
			>
		</div>

		<!-- ── LOGIN FORM ── -->
		{#if mode === 'login'}
			<form method="post" action="?/signInEmail" use:loginEnhance class="space-y-4">
				<input type="hidden" name="locale" value={locale} />
				<div>
					<label
						for="login-email"
						class="mb-1.5 block text-xs font-medium tracking-wider text-zinc-400 uppercase"
						>{m.Your_email()}</label
					>
					<input
						type="email"
						name="email"
						bind:value={$loginForm.email}
						placeholder="you@example.com"
						class="w-full rounded-lg border px-3 py-2 text-sm transition-colors focus:outline-none
              {$loginErrors.email
							? 'border-red-400 focus:border-red-500'
							: 'border-zinc-200 focus:border-zinc-400 dark:border-zinc-700 dark:focus:border-zinc-500'}
              bg-white dark:bg-zinc-800"
					/>
					{#if $loginErrors.email}
						<p class="mt-1 text-xs text-red-500">{$loginErrors.email?.[0]}</p>
					{/if}
				</div>

				<div>
					<label
						for="login-password"
						class="mb-1.5 block text-xs font-medium tracking-wider text-zinc-400 uppercase"
						>{m.password()}</label
					>
					<!-- ✅ Wrapper for input + eye icon -->
					<div class="relative">
						<input
							type={showLoginPassword ? 'text' : 'password'}
							name="password"
							id="login-password"
							bind:value={$loginForm.password}
							placeholder="••••••••"
							class="w-full rounded-lg border px-3 py-2 pr-10 text-sm transition-colors focus:outline-none
                {$loginErrors.password
								? 'border-red-400 focus:border-red-500'
								: 'border-zinc-200 focus:border-zinc-400 dark:border-zinc-700 dark:focus:border-zinc-500'}
                bg-white dark:bg-zinc-800"
						/>
						<button
							type="button"
							onclick={() => (showLoginPassword = !showLoginPassword)}
							class="absolute top-1/2 right-3 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-400"
							aria-label={showLoginPassword ? 'Hide password' : 'Show password'}
						>
							{#if showLoginPassword}
								<EyeOff size={16} />
							{:else}
								<Eye size={16} />
							{/if}
						</button>
					</div>
					{#if $loginErrors.password}
						<p class="mt-1 text-xs text-red-500">{$loginErrors.password?.[0]}</p>
					{/if}
				</div>

				<div class="text-right">
					<a
						href={localizeHref('/auth/forgot-password')}
						class="text-xs text-zinc-400 transition-colors hover:text-zinc-600 dark:hover:text-zinc-200"
					>
						{m.Forgot_password()}?
					</a>
				</div>

				{#if $loginMessage}
					<p class="text-center text-xs text-red-500">{$loginMessage}</p>
				{/if}

				<button
					type="submit"
					disabled={$loginSubmitting}
					class="w-full rounded-lg bg-black py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-85 disabled:opacity-50 dark:bg-white dark:text-black"
				>
					{$loginSubmitting ? 'Signing in…' : 'Sign in'}
				</button>
			</form>

			<!-- ── REGISTER FORM ── -->
		{:else}
			<form method="post" action="?/signUpEmail" use:registerEnhance class="space-y-4">
				<input type="hidden" name="locale" value={locale} />
				<div>
					<label
						for="name"
						class="mb-1.5 block text-xs font-medium tracking-wider text-zinc-400 uppercase"
						>{m.Full_name()}</label
					>
					<input
						type="text"
						name="name"
						bind:value={$registerForm.name}
						placeholder="Your name"
						class="w-full rounded-lg border px-3 py-2 text-sm transition-colors focus:outline-none
              {$registerErrors.name
							? 'border-red-400 focus:border-red-500'
							: 'border-zinc-200 focus:border-zinc-400 dark:border-zinc-700 dark:focus:border-zinc-500'}
              bg-white dark:bg-zinc-800"
					/>
					{#if $registerErrors.name}
						<p class="mt-1 text-xs text-red-500">{$registerErrors.name?.[0]}</p>
					{/if}
				</div>

				<div>
					<label
						for="register-email"
						class="mb-1.5 block text-xs font-medium tracking-wider text-zinc-400 uppercase"
						>{m.Your_email()}</label
					>
					<input
						type="email"
						name="email"
						id="register-email"
						bind:value={$registerForm.email}
						placeholder="you@example.com"
						class="w-full rounded-lg border px-3 py-2 text-sm transition-colors focus:outline-none
              {$registerErrors.email
							? 'border-red-400 focus:border-red-500'
							: 'border-zinc-200 focus:border-zinc-400 dark:border-zinc-700 dark:focus:border-zinc-500'}
              bg-white dark:bg-zinc-800"
					/>
					{#if $registerErrors.email}
						<p class="mt-1 text-xs text-red-500">{$registerErrors.email?.[0]}</p>
					{/if}
				</div>

				<div>
					<label
						for="register-password"
						class="mb-1.5 block text-xs font-medium tracking-wider text-zinc-400 uppercase"
						>{m.password()}</label
					>
					<!-- ✅ Wrapper for input + eye icon -->
					<div class="relative">
						<input
							type={showRegisterPassword ? 'text' : 'password'}
							name="password"
							id="register-password"
							bind:value={$registerForm.password}
							placeholder="••••••••"
							class="w-full rounded-lg border px-3 py-2 pr-10 text-sm transition-colors focus:outline-none
                {$registerErrors.password
								? 'border-red-400 focus:border-red-500'
								: 'border-zinc-200 focus:border-zinc-400 dark:border-zinc-700 dark:focus:border-zinc-500'}
                bg-white dark:bg-zinc-800"
						/>
						<button
							type="button"
							onclick={() => (showRegisterPassword = !showRegisterPassword)}
							class="absolute top-1/2 right-3 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-400"
							aria-label={showRegisterPassword ? 'Hide password' : 'Show password'}
						>
							{#if showRegisterPassword}
								<EyeOff size={16} />
							{:else}
								<Eye size={16} />
							{/if}
						</button>
					</div>
					{#if $registerErrors.password}
						<p class="mt-1 text-xs text-red-500">{$registerErrors.password?.[0]}</p>
					{/if}
				</div>

				{#if $registerMessage}
					<p class="text-center text-xs text-red-500">{$registerMessage}</p>
				{/if}

				<button
					type="submit"
					disabled={$registerSubmitting}
					class="w-full rounded-lg bg-black py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-85 disabled:opacity-50 dark:bg-white dark:text-black"
				>
					{$registerSubmitting ? 'Creating account…' : 'Create account'}
				</button>
			</form>
		{/if}

		<!-- Divider -->
		<div class="my-5 flex items-center gap-3">
			<div class="h-px flex-1 bg-zinc-200 dark:bg-zinc-800"></div>
			<span class="text-xs text-zinc-400">{m.or_continue_with()}</span>
			<div class="h-px flex-1 bg-zinc-200 dark:bg-zinc-800"></div>
		</div>

		<!-- Social buttons -->
		<div class="grid grid-cols-2 gap-2">
			{#each providers as { provider, label, icon }}
				<form method="post" action="?/signInSocial">
					<input type="hidden" name="provider" value={provider} />
					<input type="hidden" name="callbackURL" value="/dashboard" />
					<button
						type="submit"
						class="flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-200 px-3 py-2 text-sm transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
					>
						<img src={icon} alt={label} class="h-4 w-4" />
						{label}
					</button>
				</form>
			{/each}
		</div>
	</div>
</div>
