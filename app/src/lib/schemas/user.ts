import { z } from 'zod';

export const userSchema = z.object({
	name: z.string().min(2, 'Name must be at least 2 characters'),
	email: z.string().email('Invalid email'),
	phone: z.string().min(6).nullable().optional(),
	address: z.string().min(4).nullable().optional(),
	image: z.string().nullable().optional(), // stored path after upload
	role: z.enum(['admin', 'employee', 'client']),
	status: z.enum(['active', 'inactive', 'pending'])
});

export const editUserSchema = userSchema.extend({
	id: z.string()
});

export type UserFormData = z.infer<typeof userSchema>;
