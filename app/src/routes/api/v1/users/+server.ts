// src/routes/api/v1/users/+server.ts
import { db } from '$lib/server/db';
import { user } from '$lib/server/db/schema';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { auth } from '$lib/server/auth';
// src/routes/api/v1/users/+server.ts

export const GET: RequestHandler = async ({ request, locals }) => {
	// check bearer token first, then fall back to cookie session
	const session = await auth.api.getSession({ headers: request.headers });

	// console.log('🔵 session:', session);
	// console.log('🔵 locals.user:', locals.user);

	if (!session?.user && !locals.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const users = await db.query.user.findMany();
	return json(users);
};
// POST /api/v1/users
export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const body = await request.json();
	// create user logic here
	return json({ success: true }, { status: 201 });
};
