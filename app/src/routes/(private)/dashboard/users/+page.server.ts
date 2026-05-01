import { db } from '$lib/server/db';
import { user } from '$lib/server/db/auth.schema';
import { eq, desc } from 'drizzle-orm';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod4 as zod } from 'sveltekit-superforms/adapters';
import { userSchema, editUserSchema } from '$lib/schemas/user';
import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { auth } from '$lib/server/auth';
import { saveAvatar, deleteAvatar } from '$lib/server/upload';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.session) return redirect(302, '/auth');

	const [users, createForm, editForm] = await Promise.all([
		db.select().from(user).orderBy(desc(user.createdAt)),
		superValidate(zod(userSchema)),
		superValidate(zod(editUserSchema))
	]);

	return { users, createForm, editForm };
};

export const actions: Actions = {
	create: async ({ request }) => {
		// Must parse as formData manually to handle file + superforms together
		const formData = await request.formData();
		const form = await superValidate(formData, zod(userSchema));
		if (!form.valid) return fail(400, { form });

		// Handle image upload
		let imagePath: string | null = null;
		const imageFile = formData.get('imageFile') as File | null;

		if (imageFile && imageFile.size > 0) {
			try {
				imagePath = await saveAvatar(imageFile);
			} catch (e: any) {
				return fail(400, {
					form,
					imageError: e.message
				});
			}
		}

		await db.insert(user).values({
			id: crypto.randomUUID(),
			name: form.data.name,
			email: form.data.email,
			phone: form.data.phone ?? null,
			address: form.data.address ?? null,
			image: imagePath,
			role: form.data.role,
			status: form.data.status
		});

		return message(form, 'User created');
	},

	edit: async ({ request }) => {
		const formData = await request.formData();
		const form = await superValidate(formData, zod(editUserSchema));
		if (!form.valid) return fail(400, { form });

		const { id, ...data } = form.data;

		// Get existing user to maybe delete old avatar
		const [existing] = await db.select({ image: user.image }).from(user).where(eq(user.id, id));

		// Handle image upload
		let imagePath: string | null = existing?.image ?? null;
		const imageFile = formData.get('imageFile') as File | null;

		if (imageFile && imageFile.size > 0) {
			try {
				// Delete old avatar first
				await deleteAvatar(existing?.image ?? null);
				imagePath = await saveAvatar(imageFile);
			} catch (e: any) {
				return fail(400, { form, imageError: e.message });
			}
		}

		await db
			.update(user)
			.set({
				name: data.name,
				email: data.email,
				phone: data.phone ?? null,
				address: data.address ?? null,
				image: imagePath,
				role: data.role,
				status: data.status
			})
			.where(eq(user.id, id));

		return message(form, 'User updated');
	},

	delete: async ({ request }) => {
		const data = await request.formData();
		const id = data.get('id') as string;
		if (!id) return fail(400);

		// Delete avatar file when user is deleted
		const [existing] = await db.select({ image: user.image }).from(user).where(eq(user.id, id));

		await deleteAvatar(existing?.image ?? null);
		await db.delete(user).where(eq(user.id, id));

		return { success: true };
	},

	signOut: async (event) => {
		await auth.api.signOut({ headers: event.request.headers });
		return redirect(302, '/auth');
	}
};
