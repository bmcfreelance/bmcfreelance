// src/routes/forgot-password/+page.server.ts
import { superValidate, message } from 'sveltekit-superforms';
import { zod4 as zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import { fail } from '@sveltejs/kit';
import { auth } from '$lib/server/auth';
import type { Actions, PageServerLoad } from './$types';

// Bare schema — no locale-aware messages needed server-side,
// Zod errors from the client validator take precedence
const forgotPasswordSchema = z.object({
	email: z.string().email()
});

export const load: PageServerLoad = async () => {
	return { form: await superValidate(zod(forgotPasswordSchema)) };
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event.request, zod(forgotPasswordSchema));

		if (!form.valid) return fail(400, { form });

		try {
			await auth.api.requestPasswordReset({
				body: {
					email: form.data.email,
					redirectTo: `${event.url.origin}/auth/reset-password`
				}
			});
		} catch (err) {
			console.error('❌ error:', err);
			// Silent — don't reveal whether the email exists
		}

		return message(form, 'success');
	}
};
