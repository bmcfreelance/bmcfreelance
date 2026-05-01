import { sequence } from '@sveltejs/kit/hooks';
import { building } from '$app/environment';
import { auth } from '$lib/server/auth';
import { svelteKitHandler } from 'better-auth/svelte-kit';
import type { Handle } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { getTextDirection } from '$lib/paraglide/runtime';
import { paraglideMiddleware } from '$lib/paraglide/server';

const handleParaglide: Handle = ({ event, resolve }) =>
	paraglideMiddleware(event.request, ({ request, locale }) => {
		event.request = request;

		return resolve(event, {
			transformPageChunk: ({ html }) =>
				html
					.replace('%paraglide.lang%', locale)
					.replace('%paraglide.dir%', getTextDirection(locale))
		});
	});

const handleBetterAuth: Handle = async ({ event, resolve }) => {
	const session = await auth.api.getSession({ headers: event.request.headers });

	// make sure this only sets locals when session actually exists
	if (session) {
		event.locals.session = session.session;
		event.locals.user = session.user;
	} else {
		event.locals.user = undefined;
		event.locals.session = undefined;
	}
	const path = event.url.pathname;
	const user = event.locals.user;

	// Protected routes — must be logged in and verified
	if (path.startsWith('/dashboard')) {
		if (!user) redirect(302, '/auth');
		if (!user.emailVerified) redirect(302, '/auth/verify-email');
	}

	// Verify email route — must be logged in but not yet verified
	if (path.startsWith('/auth/verify-email')) {
		if (!user) redirect(302, '/auth');
		if (user.emailVerified) redirect(302, '/dashboard');
	}

	// Auth route — redirect away if already logged in and verified
	if (path.startsWith('/auth')) {
		if (user?.emailVerified) redirect(302, '/dashboard');
	}

	return svelteKitHandler({ event, resolve, auth, building });
	//return resolve(event);
};

export const handle: Handle = sequence(handleParaglide, handleBetterAuth);
