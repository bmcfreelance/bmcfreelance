<!-- src/routes/verify-email/+page.svelte -->
<script lang="ts">
	import { enhance } from '$app/forms';
	import { Mail, AlertCircle } from 'lucide-svelte';

	type ActionData = { sent?: boolean; message?: string } | null;
	type PageData = { email: string };
	let { form, data }: { form: ActionData; data: PageData } = $props();

	let code = $state('');
	$effect(() => {
		code = code.replace(/\D/g, '').slice(0, 6);
	});
</script>

<div class="flex min-h-screen items-center justify-center p-4">
	<div class="w-full max-w-sm rounded-xl border border-border bg-background p-8 shadow-sm">
		<!-- icon -->
		<div
			class="mb-5 flex h-11 w-11 items-center justify-center rounded-lg border border-border bg-muted"
		>
			<Mail class="h-5 w-5 text-foreground" />
		</div>

		{#if !form?.sent}
			<!-- Step 1 — request code -->
			<h1 class="mb-1 text-[17px] font-medium tracking-tight text-foreground">Verify your email</h1>
			<p class="mb-6 text-sm text-muted-foreground">
				We'll send a 6-digit code to
				<span class="font-medium text-foreground">{data.email}</span>
			</p>

			{#if form?.message}
				<div
					class="mb-4 flex items-center gap-2 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2.5 text-sm text-destructive"
				>
					<AlertCircle class="h-3.5 w-3.5 shrink-0" />
					{form.message}
				</div>
			{/if}

			<form method="POST" action="?/sendOtp" use:enhance>
				<button
					type="submit"
					class="w-full rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90 active:opacity-75"
				>
					Send verification code
				</button>
			</form>
			<p class="mt-3 text-center text-xs text-muted-foreground">
				Check your spam folder if it doesn't arrive
			</p>
		{:else}
			<!-- Step 2 — enter code -->
			<h1 class="mb-1 text-[17px] font-medium tracking-tight text-foreground">Check your inbox</h1>
			<p class="mb-5 text-sm text-muted-foreground">
				Enter the code we sent to
				<span class="font-medium text-foreground">{data.email}</span>. It expires in 10 minutes.
			</p>

			{#if form?.message}
				<div
					class="mb-4 flex items-center gap-2 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2.5 text-sm text-destructive"
				>
					<AlertCircle class="h-3.5 w-3.5 shrink-0" />
					{form.message}
				</div>
			{/if}

			<form method="POST" action="?/verifyOtp" use:enhance>
				<label for="code" class="mb-1.5 block text-sm font-medium text-foreground">
					Verification code
				</label>
				<input
					id="code"
					name="code"
					bind:value={code}
					type="text"
					inputmode="numeric"
					autocomplete="one-time-code"
					placeholder="000000"
					maxlength="6"
					required
					class="w-full rounded-lg border border-input bg-background px-3 py-2 text-center font-mono text-sm tracking-widest text-foreground placeholder:font-sans placeholder:tracking-normal focus:ring-2 focus:ring-ring focus:outline-none"
				/>

				<button
					type="submit"
					disabled={code.length < 6}
					class="mt-4 w-full rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90 active:opacity-75 disabled:cursor-not-allowed disabled:opacity-40"
				>
					Verify email
				</button>
			</form>

			<div class="my-4 flex items-center gap-2 text-xs text-muted-foreground">
				<span class="flex-1 border-t border-border"></span>or<span
					class="flex-1 border-t border-border"
				></span>
			</div>

			<form method="POST" action="?/sendOtp" use:enhance>
				<button
					type="submit"
					class="w-full rounded-lg border border-border bg-transparent px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
				>
					Resend code
				</button>
			</form>
		{/if}
	</div>
</div>
