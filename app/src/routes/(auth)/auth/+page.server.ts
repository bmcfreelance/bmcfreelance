import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { auth } from '$lib/server/auth';
import { APIError } from 'better-auth/api';
import { superValidate, message } from 'sveltekit-superforms';
import { zod4 as zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import { RateLimiter } from 'sveltekit-rate-limiter/server';

// ─── Schemas ────────────────────────────────────────────────────────────────

const loginSchema = z.object({
	email: z.string().email('Invalid email address'),
	password: z.string().min(8, 'Password must be at least 8 characters'),
	locale: z.string().default('en')
});

const registerSchema = z.object({
	name: z.string().min(2, 'Name must be at least 2 characters').max(60),
	email: z.string().email('Invalid email address'),
	password: z
		.string()
		.min(8, 'Password must be at least 8 characters')
		.regex(/[A-Z]/, 'Must contain an uppercase letter')
		.regex(/[0-9]/, 'Must contain a number'),
	locale: z.string().default('en')
});

export type LoginSchema = typeof loginSchema;
export type RegisterSchema = typeof registerSchema;

// ─── Rate Limiter ────────────────────────────────────────────────────────────

const limiter = new RateLimiter({
	IP: [5, '15m']
});

// ─── Auth Error i18n ─────────────────────────────────────────────────────────

const authErrors: Record<string, Record<string, string>> = {
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
	return authErrors[lang][key] ?? authErrors[lang]['unexpected'];
}

// ─── Load ────────────────────────────────────────────────────────────────────

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) {
		redirect(302, '/dashboard');
	}

	const [loginForm, registerForm] = await Promise.all([
		superValidate(zod(loginSchema)),
		superValidate(zod(registerSchema))
	]);

	return { loginForm, registerForm };
};

// ─── Actions ─────────────────────────────────────────────────────────────────

export const actions: Actions = {
	signInEmail: async (event) => {
		const form = await superValidate(event, zod(loginSchema));

		if (!form.valid) return fail(400, { form });

		const locale = form.data.locale;

		console.log('locale signinEmail', locale);
		if (await limiter.isLimited(event)) {
			return message(form, t('too_many_requests', locale), { status: 429 });
		}

		try {
			await auth.api.signInEmail({
				body: {
					email: form.data.email,
					password: form.data.password,
					callbackURL: '/auth/verification-success'
				}
			});
		} catch (error) {
			if (error instanceof APIError) {
				return message(form, t(error.message, locale) ?? t('sign_in_failed', locale), {
					status: 400
				});
			}
			return message(form, t('unexpected', locale), { status: 500 });
		}

		redirect(302, '/dashboard');
	},

	signUpEmail: async (event) => {
		const form = await superValidate(event, zod(registerSchema));
		if (!form.valid) return fail(400, { form });

		const locale = form.data.locale;

		if (await limiter.isLimited(event)) {
			return message(form, t('too_many_requests', locale), { status: 429 });
		}

		try {
			await auth.api.signUpEmail({
				body: {
					name: form.data.name,
					email: form.data.email,
					password: form.data.password,
					callbackURL: '/auth/verification-success'
				}
			});
		} catch (error) {
			if (error instanceof APIError) {
				return message(form, t(error.message, locale) ?? t('registration_failed', locale), {
					status: 400
				});
			}
			return message(form, t('unexpected', locale), { status: 500 });
		}

		redirect(302, '/dashboard');
	},

	signInSocial: async (event) => {
		const formData = await event.request.formData();
		const provider = formData.get('provider')?.toString() ?? 'github';
		const callbackURL = formData.get('callbackURL')?.toString() ?? '/auth';

		const result = await auth.api.signInSocial({
			body: {
				provider: provider as 'google' | 'github' | 'facebook' | 'linkedin',
				callbackURL
			}
		});

		if (result.url) {
			return redirect(302, result.url);
		}

		return fail(400, { message: t('unexpected') });
	}
};
