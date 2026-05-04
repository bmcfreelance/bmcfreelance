import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { APIError } from 'better-auth/api';

import { auth } from '$lib/server/auth';
import type { Actions } from './$types';

console.log('Auth page server load');
export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		return redirect(302, '/auth');
	}
	return {};
};

export const actions: Actions = {
	signOut: async (event) => {
		await auth.api.signOut({
			headers: event.request.headers
		});

		return redirect(302, '/auth');
	}
};
