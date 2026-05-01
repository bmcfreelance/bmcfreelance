import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	const user = locals.user;

	if (!user) redirect(302, '/auth');

	return {
		user: {
			id: user.id,
			name: user.name,
			email: user.email,
			image: user.image ?? null,
			role: user.role ?? 'client',
			status: user.status ?? 'active',
			phone: user.phone ?? null,
			address: user.address ?? null
		}
	};
};
