<script>
	// @ts-ignore
	import { m, social_medias } from '$lib/paraglide/messages.js';
	import { setLocale, getLocale, localizeHref } from '$lib/paraglide/runtime';
	import instagramIcon from '$lib/assets/instagram.png';
	import facebookIcon from '$lib/assets/facebook.png';
	//import twitterIcon from '$lib/assets/twitter.png';
	import linkedinIcon from '$lib/assets/linkedin.png';
	import tiktokIcon from '$lib/assets/tiktok.png';
	// import githubIcon from '$lib/assets/github.png';

	import { Phone, Mail } from 'lucide-svelte';

	let formData = $state({ name: '', email: '', message: '' });
	let submitted = $state(false);
	let submitting = $state(false);

	const socials = [
		{ icon: facebookIcon, label: 'Facebook', href: 'https://facebook.com/bmcfreelance' },
		{ icon: instagramIcon, label: 'Instagram', href: 'https://instagram.com/bmcfreelance' },
		{ icon: tiktokIcon, label: 'TikTok', href: 'https://tiktok.com/@bmcfreelance' },
		{ icon: linkedinIcon, label: 'LinkedIn', href: 'https://linkedin.com/in/bmcfreelance' }
	];

	const navLinks = [
		{ href: '/', label: () => m.nav_home() },
		{ href: '/projects', label: () => m.nav_projects() },
		{ href: '/services', label: () => m.nav_services() },
		{ href: '/training', label: () => m.nav_training() },
		{ href: '/about', label: () => m.nav_about() },
		{ href: '/contact', label: () => m.nav_contact() }
	];

	// @ts-ignore
	async function handleSubmit(e) {
		e.preventDefault();
		submitting = true;
		await new Promise((r) => setTimeout(r, 900));
		submitted = true;
		submitting = false;
	}
</script>

<footer class="border-t border-border bg-background text-foreground">
	<div class="mx-auto mb-16 max-w-6xl px-4 py-12 md:mb-0">
		<!-- Top grid -->
		<div class="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
			<!-- Brand + socials -->
			<div class="flex flex-col gap-4">
				<div>
					<p class="text-lg font-semibold tracking-tight">BMC Freelance</p>
					<p class="prose mt-1 max-w-none dark:prose-invert">
						{m.introduce_yourself()}
					</p>
					<hr class="my-4 border-t border-border" />
				</div>
				<address class="not-italic">
					<p class="mb-3 text-xs font-semibold tracking-widest text-muted-foreground uppercase">
						{m.Contact_information()}
					</p>
					<ul class="flex flex-col gap-2 text-sm text-muted-foreground">
						<li>
							<a
								href="mailto:bmcfreelance33@gmail.com"
								class="inline-flex items-center gap-2 transition-colors hover:text-foreground"
							>
								<Mail class="h-4 w-4" />

								<span>bmcfreelance33@gmail.com</span>
							</a>
						</li>
						<li>
							<a
								href="tel:+21655385474"
								class="inline-flex items-center gap-2
								 transition-colors hover:text-foreground"
							>
								<Phone class="h-4 w-4" />

								<span class=" ">+216 55 385 474</span>
							</a>
						</li>
					</ul>
					<hr class="my-4 border-t border-border" />
				</address>
				<nav aria-label="Social media links">
					<p class="mb-3 text-xs font-semibold tracking-widest text-muted-foreground uppercase">
						{m.social_medias()}
					</p>
					<ul class="flex gap-3">
						{#each socials as { icon, label, href }}
							<li>
								<a
									{href}
									target="_blank"
									rel="noopener noreferrer"
									aria-label={label}
									class="
									flex h-8
									w-8 items-center justify-center rounded-md border border-input bg-background transition-colors
                         hover:bg-accent hover:text-accent-foreground dark:bg-white"
								>
									<img
										src={icon}
										title={label}
										alt={label}
										class="
									h-4 w-4
									opacity-75"
									/>
								</a>
							</li>
						{/each}
					</ul>
				</nav>
			</div>

			<!-- Nav links -->
			<nav aria-label="Footer navigation" class="flex flex-col gap-2">
				<p class="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
					Navigation
				</p>
				<ul class="flex flex-col gap-1.5">
					{#each navLinks as { href, label }}
						<li>
							<a
								href={localizeHref(href)}
								class="text-sm text-muted-foreground transition-colors hover:text-foreground"
							>
								{label()}
							</a>
						</li>
					{/each}
				</ul>
			</nav>

			<!-- Contact form -->
			<div>
				<p class="mb-3 text-xs font-semibold tracking-widest text-muted-foreground uppercase">
					{m.Get_in_touch()}
				</p>

				{#if submitted}
					<div
						class="rounded-md border border-border bg-accent px-4 py-6 text-center text-sm text-accent-foreground"
					>
						<p class="font-medium">{m.Message_sent_successfully()} ✓</p>
						<p class="mt-1 text-muted-foreground">{m.contact_you_soon()}</p>
					</div>
				{:else}
					<form onsubmit={handleSubmit} class="flex flex-col gap-2.5" novalidate>
						<div>
							<label for="footer-name" class="sr-only">Your name</label>
							<input
								id="footer-name"
								type="text"
								placeholder={m.Your_name()}
								required
								autocomplete="name"
								bind:value={formData.name}
								class="h-9 w-full rounded-md border border-input bg-background px-3 text-sm
                       text-foreground placeholder:text-muted-foreground
                       focus:ring-1 focus:ring-ring focus:outline-none"
							/>
						</div>
						<div>
							<label for="footer-email" class="sr-only">{m.Your_email()}</label>
							<input
								id="footer-email"
								type="email"
								placeholder={m.Your_email()}
								required
								autocomplete="email"
								bind:value={formData.email}
								class="h-9 w-full rounded-md border border-input bg-background px-3 text-sm
                       text-foreground placeholder:text-muted-foreground
                       focus:ring-1 focus:ring-ring focus:outline-none"
							/>
						</div>
						<div>
							<label for="footer-message" class="sr-only">{m.Your_message()}</label>
							<textarea
								id="footer-message"
								placeholder={m.Your_message()}
								required
								rows="3"
								bind:value={formData.message}
								class="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm
                       text-foreground placeholder:text-muted-foreground
                       focus:ring-1 focus:ring-ring focus:outline-none"
							></textarea>
						</div>
						<button
							type="submit"
							disabled={submitting}
							class="inline-flex h-9 items-center justify-center rounded-md border border-input
                     bg-foreground px-4 text-sm font-medium text-background
                     transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
						>
							{submitting ? 'Sending…' : m.Send_message()}
						</button>
					</form>
				{/if}
			</div>
		</div>

		<!-- Bottom bar -->
		<div
			class="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row"
		>
			<p>
				&copy; {new Date().getFullYear()}
				<strong class="font-medium text-foreground">BMC Freelance</strong>. All rights reserved.
			</p>
		</div>
	</div>
</footer>
