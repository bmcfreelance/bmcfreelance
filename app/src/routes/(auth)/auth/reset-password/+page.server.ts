// src/routes/auth/reset-password/+page.server.ts

import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { auth } from '$lib/server/auth';
import { APIError } from 'better-auth/api';
import { superValidate, message } from 'sveltekit-superforms';
import { zod4 as zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import { RateLimiter } from 'sveltekit-rate-limiter/server';

// ─── Schemas ────────────────────────────────────────────────────────────────

const resetPasswordSchema = z.object({
	password: z.string().min(8, 'Password must be at least 8 characters'),
	confirm: z.string().min(8, 'Password must be at least 8 characters'),
	token: z.string(),
	locale: z.string().default('en')
});

export type ResetPasswordSchema = typeof resetPasswordSchema;
// ─── Rate Limiter ────────────────────────────────────────────────────────────

const limiter = new RateLimiter({
	IP: [5, '15m']
});

const reserErrors: Record<string, Record<string, string>> = {
	en: {
		email_not_found: 'No account found with this email.',
		invalid_password: 'Incorrect password.',
		user_already_exists: 'An account with this email already exists.',
		email_not_verified: 'Please verify your email before signing in.',
		too_many_requests: 'Too many attempts. Please wait 15 minutes.',
		sign_in_failed: 'Sign in failed. Please try again.',
		registration_failed: 'Registration failed. Please try again.',
		unexpected: 'Unexpected error. Please try again.'
	},
	fr: {
		email_not_found: 'Aucun compte trouvé avec cet email.',
		invalid_password: 'Mot de passe incorrect.',
		user_already_exists: 'Un compte avec cet email existe déjà.',
		email_not_verified: 'Veuillez vérifier votre email avant de vous connecter.',
		too_many_requests: 'Trop de tentatives. Veuillez patienter 15 minutes.',
		sign_in_failed: 'Échec de la connexion. Veuillez réessayer.',
		registration_failed: "Échec de l'inscription. Veuillez réessayer.",
		unexpected: 'Erreur inattendue. Veuillez réessayer.'
	}
};

function t(key: string, locale: string = 'en'): string {
	const lang = locale.startsWith('fr') ? 'fr' : 'en';
	return reserErrors[lang][key] ?? reserErrors[lang]['unexpected'];
}

export const load: PageServerLoad = async (event) => {
	const token = event.url.searchParams.get('token');
	if (!token) redirect(302, '/auth/forgot-password');
	return { token, form: await superValidate(zod(resetPasswordSchema)) };
};

export const actions: Actions = {
	default: async (event) => {
		const formData = await event.request.formData();
		const password = formData.get('password') as string;
		const confirm = formData.get('confirm') as string;
		const token = formData.get('token') as string;

		if (!password || password !== confirm) {
			return fail(400, { message: 'Passwords do not match' });
		}

		try {
			await auth.api.resetPassword({
				body: { token, newPassword: password }
			});
		} catch (err) {
			console.error('❌ reset error:', err);
			return fail(400, { message: 'Invalid or expired reset link' });
		}

		redirect(302, '/auth');
	}
};
