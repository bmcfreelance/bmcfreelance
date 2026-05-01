import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { env } from '$env/dynamic/private';
import { getRequestEvent } from '$app/server';
import { db } from '$lib/server/db';
import { emailOTP } from 'better-auth/plugins';
import { sendOTPEmail, sendPasswordResetEmail } from '$lib/server/mailer';
import { bearer } from 'better-auth/plugins';

export const auth = betterAuth({
	baseURL: env.ORIGIN,
	secret: env.BETTER_AUTH_SECRET,
	database: drizzleAdapter(db, { provider: 'pg' }),
	// src/lib/server/auth.ts
	emailAndPassword: {
		enabled: true,
		resetPasswordTokenExpiresIn: 900,
		sendResetPassword: async ({ user, url }) => {
			console.log('📧 sendResetPassword called');
			console.log('📧 to:', user.email);
			console.log('📧 url:', url); // check if the reset URL is being generated
			await sendPasswordResetEmail(user.email, url);
		}
	},
	socialProviders: {
		github: {
			clientId: env.GITHUB_CLIENT_ID!,
			clientSecret: env.GITHUB_CLIENT_SECRET!
		},
		google: {
			clientId: env.GOOGLE_CLIENT_ID!,
			clientSecret: env.GOOGLE_CLIENT_SECRET!
		}
	},

	plugins: [
		bearer(),
		emailOTP({
			async sendVerificationOTP({ email, otp }) {
				await sendOTPEmail(email, otp); // <-- use it here
				console.log(`OTP for ${email}: ${otp}`); // replace with real email send
			},
			otpLength: 6, // optional, default is 6
			expiresIn: 300 // optional, 5 minutes in seconds
		}),
		sveltekitCookies(getRequestEvent) // make sure this is the last plugin in the array
	]
});
