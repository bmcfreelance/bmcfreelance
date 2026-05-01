// src/routes/verify-email/+page.server.ts
import { auth } from '$lib/server/auth';
import { redirect, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const session = await auth.api.getSession({
		headers: event.request.headers
	});

	// Already verified, skip this page
	if (session?.user.emailVerified) {
		redirect(302, '/dashboard');
	}

	// Not logged in at all
	if (!session) {
		redirect(302, '/auth');
	}

	return { email: session.user.email };
};

export const actions: Actions = {
	// Send OTP to email
	sendOtp: async (event) => {
		const session = await auth.api.getSession({
			headers: event.request.headers
		});

		if (!session) redirect(302, '/auth');

		await auth.api.sendVerificationOTP({
			body: {
				email: session.user.email,
				type: 'email-verification'
			}
		});

		return { sent: true };
	},

	// Verify the OTP code
	verifyOtp: async (event) => {
		const formData = await event.request.formData();
		const code = formData.get('code') as string;

		const session = await auth.api.getSession({
			headers: event.request.headers
		});

		if (!session) redirect(302, '/auth');

		const result = await auth.api.verifyEmailOTP({
			body: {
				email: session.user.email,
				otp: code
			}
		});

		if (!result) {
			return fail(400, { message: 'Invalid or expired code' });
		}

		redirect(302, '/dashboard');
	}
};
