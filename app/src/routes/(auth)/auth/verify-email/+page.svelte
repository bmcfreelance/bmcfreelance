<!-- src/routes/verify-email/+page.svelte -->
<script lang="ts">
	import { enhance } from '$app/forms';
	type ActionData = { sent?: boolean; message?: string } | null;
	type PageData = { email: string };
	let { form, data }: { form: ActionData; data: PageData } = $props();
</script>

<h1>Verify your email</h1>
<p>We'll send a code to <strong>{data.email}</strong></p>

{#if form?.message}
	<p class="error">{form.message}</p>
{/if}

{#if !form?.sent}
	<!-- Step 1: request the code -->
	<form method="POST" action="?/sendOtp" use:enhance>
		<button type="submit">Send verification code</button>
	</form>
{:else}
	<!-- Step 2: enter the code -->
	<form method="POST" action="?/verifyOtp" use:enhance>
		<input name="code" placeholder="Enter 6-digit code" maxlength="6" required />
		<button type="submit">Verify</button>
	</form>
{/if}
