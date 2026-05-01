// src/routes/api/v1/users/[id]/+server.ts
import { db } from '$lib/server/db';
import { user } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// GET /api/v1/users/:id
export const GET: RequestHandler = async ({ params, locals }) => {
	if (!locals.user) return json({ error: 'Unauthorized' }, { status: 401 });

	const found = await db.query.user.findFirst({
		where: eq(user.id, params.id)
	});

	if (!found) return json({ error: 'Not found' }, { status: 404 });

	return json(found);
};

// PUT /api/v1/users/:id
export const PUT: RequestHandler = async ({ params, request, locals }) => {
	if (!locals.user) return json({ error: 'Unauthorized' }, { status: 401 });

	const body = await request.json();

	await db.update(user).set(body).where(eq(user.id, params.id));

	return json({ success: true });
};

// DELETE /api/v1/users/:id
export const DELETE: RequestHandler = async ({ params, locals }) => {
	if (!locals.user) return json({ error: 'Unauthorized' }, { status: 401 });

	await db.delete(user).where(eq(user.id, params.id));

	return json({ success: true });
};
