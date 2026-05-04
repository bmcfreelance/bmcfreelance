<script lang="ts">
	import { setLocale, getLocale } from '$lib/paraglide/runtime';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { m } from '$lib/paraglide/messages.js';
	import { locales, localizeHref } from '$lib/paraglide/runtime';

	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { z } from 'zod/v4';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import { Separator } from '$lib/components/ui/separator';
	import { toast } from 'svelte-sonner';
	import { Mail, Phone, MapPin, Send, ArrowRight, Clock } from 'lucide-svelte';
	import type { PageData } from './$types';

	const contactSchema = z.object({
		name: z.string().min(2, 'Name must be at least 2 characters'),
		email: z.string().email('Please enter a valid email address'),
		subject: z.string().min(5, 'Subject must be at least 5 characters'),
		message: z.string().min(20, 'Message must be at least 20 characters')
	});

	let { data }: { data: PageData } = $props();

	const sf = superForm(data?.form ?? { name: '', email: '', subject: '', message: '' }, {
		validators: zod4Client(contactSchema),
		SPA: true,
		onUpdate({ form }) {
			if (form.valid) {
				toast.success('Message sent!', {
					description: "We'll get back to you within 24 hours."
				});
				form.data = { name: '', email: '', subject: '', message: '' };
			}
		}
	});

	const { form: formData, errors, enhance, submitting } = sf;

	const contactInfo = [
		{
			icon: Mail,
			label: 'Email',
			value: 'hello@bmcfreelance.net',
			href: 'mailto:hello@bmcfreelance.net'
		},
		{
			icon: Phone,
			label: 'Phone',
			value: '+216 XX XXX XXX',
			href: 'tel:+216XXXXXXXX'
		},
		{
			icon: MapPin,
			label: 'Location',
			value: 'Tunis, Tunisia',
			href: null
		},
		{
			icon: Clock,
			label: 'Response time',
			value: 'Within 24 hours',
			href: null
		}
	];

	const services = ['Video Production', 'Web Development', 'Data Solutions', 'Consulting'];
</script>

<svelte:head>
	<title>Contact — BMC Freelance</title>
</svelte:head>

<main class="min-h-screen bg-background text-foreground">
	<!-- Header strip -->
	<div class="sticky top-0 z-10 border-b border-border/40 bg-zinc-950/60 backdrop-blur-sm">
		<div class="mx-auto flex max-w-6xl items-center gap-3 px-6 py-3">
			<div class="h-2 w-2 animate-pulse rounded-full bg-emerald-500"></div>
			<span class="font-mono text-xs tracking-widest text-muted-foreground uppercase">
				Available for new projects
			</span>
		</div>
	</div>

	<div class="mx-auto max-w-6xl px-6 py-20">
		<!-- Hero section -->
		<div class="mb-16 max-w-2xl">
			<Badge variant="outline" class="mb-6 border-zinc-700 font-mono text-xs text-zinc-400">
				GET IN TOUCH
			</Badge>
			<h1 class="mb-4 text-5xl leading-tight font-bold tracking-tight">
				Let's build something
				<span class="bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent">
					remarkable
				</span>
			</h1>
			<p class="text-lg leading-relaxed text-muted-foreground">
				Whether you have a project in mind or just want to explore possibilities — drop us a message
				and we'll get back to you quickly.
			</p>
			<div class="mt-6 flex flex-wrap gap-2">
				{#each services as service}
					<Badge
						variant="secondary"
						class="bg-zinc-800 text-xs text-zinc-300 transition-colors hover:bg-zinc-700"
					>
						{service}
					</Badge>
				{/each}
			</div>
		</div>

		<div class="grid grid-cols-1 gap-12 lg:grid-cols-5">
			<!-- Left: Contact Info -->
			<aside class="space-y-8 lg:col-span-2">
				<div class="space-y-4">
					{#each contactInfo as item}
						<div
							class="group flex items-start gap-4 rounded-xl border border-border/50 bg-zinc-900/40 p-4 transition-all duration-200 hover:border-zinc-600 hover:bg-zinc-900/80"
						>
							<div
								class="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-zinc-800 transition-colors group-hover:bg-zinc-700"
							>
								<!-- svelte-ignore svelte_component_deprecated -->
								<svelte:component this={item.icon} class="h-4 w-4 text-zinc-400" />
							</div>
							<div>
								<p class="mb-0.5 font-mono text-xs tracking-wider text-muted-foreground uppercase">
									{item.label}
								</p>
								{#if item.href}
									<a
										href={item.href}
										class="text-sm font-medium text-foreground transition-colors hover:text-white"
									>
										{item.value}
									</a>
								{:else}
									<p class="text-sm font-medium text-foreground">{item.value}</p>
								{/if}
							</div>
						</div>
					{/each}
				</div>

				<Separator class="bg-border/40" />

				<!-- Socials / CTA -->
				<div class="space-y-3">
					<p class="font-mono text-xs tracking-widest text-muted-foreground uppercase">
						Also find us on
					</p>
					<div class="flex gap-3">
						<Button
							variant="outline"
							size="sm"
							class="border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-white"
						>
							LinkedIn
						</Button>
						<Button
							variant="outline"
							size="sm"
							class="border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-white"
						>
							GitHub
						</Button>
					</div>
				</div>
			</aside>

			<!-- Right: Form -->
			<div class="lg:col-span-3">
				<div class="rounded-2xl border border-border/50 bg-zinc-900/30 p-8">
					<form method="POST" use:enhance class="space-y-6">
						<div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
							<!-- Name -->
							<Form.Field form={sf} name="name">
								<Form.Control>
									{#snippet children({ props })}
										<Form.Label class="font-mono text-xs tracking-widest text-zinc-400 uppercase">
											Full Name
										</Form.Label>
										<Input
											{...props}
											bind:value={$formData.name}
											placeholder="John Doe"
											class="mt-2 border-zinc-700 bg-zinc-900 placeholder:text-zinc-600 focus:border-zinc-500 focus-visible:ring-0 focus-visible:ring-offset-0"
										/>
									{/snippet}
								</Form.Control>
								<Form.FieldErrors class="mt-1 text-xs text-red-400" />
							</Form.Field>

							<!-- Email -->
							<Form.Field form={sf} name="email">
								<Form.Control>
									{#snippet children({ props })}
										<Form.Label class="font-mono text-xs tracking-widest text-zinc-400 uppercase">
											Email Address
										</Form.Label>
										<Input
											{...props}
											bind:value={$formData.email}
											type="email"
											placeholder="you@example.com"
											class="mt-2 border-zinc-700 bg-zinc-900 placeholder:text-zinc-600 focus:border-zinc-500 focus-visible:ring-0 focus-visible:ring-offset-0"
										/>
									{/snippet}
								</Form.Control>
								<Form.FieldErrors class="mt-1 text-xs text-red-400" />
							</Form.Field>
						</div>

						<!-- Subject -->
						<Form.Field form={sf} name="subject">
							<Form.Control>
								{#snippet children({ props })}
									<Form.Label class="font-mono text-xs tracking-widest text-zinc-400 uppercase">
										Subject
									</Form.Label>
									<Input
										{...props}
										bind:value={$formData.subject}
										placeholder="Project inquiry, collaboration..."
										class="mt-2 border-zinc-700 bg-zinc-900 placeholder:text-zinc-600 focus:border-zinc-500 focus-visible:ring-0 focus-visible:ring-offset-0"
									/>
								{/snippet}
							</Form.Control>
							<Form.FieldErrors class="mt-1 text-xs text-red-400" />
						</Form.Field>

						<!-- Message -->
						<Form.Field form={sf} name="message">
							<Form.Control>
								{#snippet children({ props })}
									<Form.Label class="font-mono text-xs tracking-widest text-zinc-400 uppercase">
										Message
									</Form.Label>
									<Textarea
										{...props}
										bind:value={$formData.message}
										placeholder="Tell us about your project, goals, timeline..."
										rows={6}
										class="mt-2 resize-none border-zinc-700 bg-zinc-900 placeholder:text-zinc-600 focus:border-zinc-500 focus-visible:ring-0 focus-visible:ring-offset-0"
									/>
								{/snippet}
							</Form.Control>
							<Form.FieldErrors class="mt-1 text-xs text-red-400" />
						</Form.Field>

						<!-- Submit -->
						<div class="flex items-center justify-between pt-2">
							<p class="text-xs text-zinc-600">No spam. Replies within 24h.</p>
							<Button
								type="submit"
								disabled={$submitting}
								class="gap-2 bg-white px-6 font-semibold text-black hover:bg-zinc-200"
							>
								{#if $submitting}
									<div
										class="h-4 w-4 animate-spin rounded-full border-2 border-black/30 border-t-black"
									></div>
									Sending...
								{:else}
									<Send class="h-4 w-4" />
									Send Message
								{/if}
							</Button>
						</div>
					</form>
				</div>
			</div>
		</div>
	</div>
</main>
