import type { Actions } from '@sveltejs/kit';
import { superValidate, message } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { z } from 'zod/v4';

const contactSchema = z.object({
	name: z.string().min(2, 'Name must be at least 2 characters'),
	email: z.string().email('Please enter a valid email address'),
	subject: z.string().min(5, 'Subject must be at least 5 characters'),
	message: z.string().min(20, 'Message must be at least 20 characters')
});

export const load = async () => {
	const form = await superValidate(zod4(contactSchema));
	return { form };
};

export const actions: Actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, zod4(contactSchema));

		if (!form.valid) {
			return message(form, { type: 'error', text: 'Please fix the errors above.' });
		}

		// TODO: send email via Nodemailer or your preferred mailer
		// await sendEmail({ to: 'hello@bmcfreelance.net', ...form.data });

		console.log('Contact form submission:', form.data);

		return message(form, { type: 'success', text: 'Message sent successfully!' });
	}
};
