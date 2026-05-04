<script lang="ts">
	import { setLocale, getLocale } from '$lib/paraglide/runtime';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { m } from '$lib/paraglide/messages.js';
	import { locales, localizeHref } from '$lib/paraglide/runtime';

	import reactjs from '$lib/assets/reactjs.jpg';
	import reactjs1 from '$lib/assets/reactjs2.jpg';
	import reactjs2 from '$lib/assets/reactjs3.jpg';
	import reactjs3 from '$lib/assets/reactjs4.jpg';
	import reactjs4 from '$lib/assets/reactjs5.jpg';

	import * as Card from '$lib/components/ui/card/index.js';
	import * as Carousel from '$lib/components/ui/carousel/index.js';
	import type { CarouselAPI } from '$lib/components/ui/carousel/context.js';

	import { onMount } from 'svelte';

	let api = $state<CarouselAPI>();
	let current = $state(0);
	let count = $state(0);

	$effect(() => {
		if (api) {
			count = api.scrollSnapList().length;
			current = api.selectedScrollSnap() + 1;
			api.on('select', () => {
				current = api!.selectedScrollSnap() + 1;
			});
		}
	});

	// Intersection Observer for motion animations
	onMount(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						entry.target.classList.add('visible');
						observer.unobserve(entry.target);
					}
				});
			},
			{ threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
		);

		const motionItems = document.querySelectorAll('.motion-item');
		motionItems.forEach((item) => observer.observe(item));

		return () => observer.disconnect();
	});

	// Carousel data with images
	const carouselSlides = [
		{
			title: 'Ignite Your Digital Future',
			subtitle: 'Cutting-edge solutions tailored for modern enterprises.',
			buttonText: 'Explore Now →',
			buttonColor: 'indigo',
			image: reactjs,
			gradient: 'from-indigo-900/60 to-purple-900/60'
		},
		{
			title: 'Ignite Your Digital Future',
			subtitle: 'Smart platforms that adapt to your business needs.',
			buttonText: 'Learn More →',
			buttonColor: 'cyan',
			image: reactjs1,
			gradient: 'from-cyan-900/60 to-blue-900/60'
		},
		{
			title: 'Seamless Experiences',
			subtitle: 'From ideation to deployment, we craft success.',
			buttonText: 'Get Started →',
			buttonColor: 'rose',
			image: reactjs2,
			gradient: 'from-amber-900/60 to-rose-900/60'
		},
		{
			title: 'Cloud Native Solutions',
			subtitle: 'Scale infinitely with our cloud expertise.',
			buttonText: 'Discover →',
			buttonColor: 'emerald',
			image: reactjs3,
			gradient: 'from-emerald-900/60 to-teal-900/60'
		},
		{
			title: '24/7 Support & Maintenance',
			subtitle: 'We ensure your business runs without interruptions.',
			buttonText: 'Contact Support →',
			buttonColor: 'slate',
			image: reactjs4,
			gradient: 'from-slate-900/60 to-gray-900/60'
		}
	];

	const categories = [
		{
			emoji: '🚀',
			title: 'Web Development',
			desc: 'Modern, responsive, high-performance web apps.'
		},
		{ emoji: '📱', title: 'Mobile Apps', desc: 'Native & cross-platform, seamless UX.' },
		{ emoji: '🤖', title: 'AI & ML', desc: 'Intelligent automation and predictive analytics.' },
		{ emoji: '☁️', title: 'Cloud Solutions', desc: 'Scalable, secure cloud infrastructure.' },
		{ emoji: '🔒', title: 'Cyber Security', desc: 'Robust threat protection and compliance.' },
		{ emoji: '🎨', title: 'UX/UI Design', desc: 'User-centric interfaces that delight.' }
	];

	const projects = [
		{
			emoji: '🛍️',
			title: 'EcoMarket Hub',
			desc: 'Sustainable e-commerce platform with carbon offset tracking.',
			tags: ['React', 'Node.js']
		},
		{
			emoji: '📊',
			title: 'Analytics Pro',
			desc: 'Real-time BI dashboard with AI insights.',
			tags: ['Vue', 'D3.js']
		},
		{
			emoji: '🏥',
			title: 'MediFlow',
			desc: 'Patient management system for clinics.',
			tags: ['SvelteKit', 'Supabase']
		},
		{
			emoji: '🎮',
			title: 'GameStream',
			desc: 'Low-latency game streaming platform.',
			tags: ['WebRTC', 'Go']
		},
		{
			emoji: '🏦',
			title: 'FinCore',
			desc: 'Banking core system with fraud detection.',
			tags: ['Java', 'Kafka']
		},
		{
			emoji: '📚',
			title: 'EduSmart',
			desc: 'Adaptive learning platform for schools.',
			tags: ['Next.js', 'Python']
		}
	];

	const services = [
		{
			emoji: '💎',
			title: 'UX/UI Design',
			desc: 'User-centric interfaces that delight and convert.'
		},
		{
			emoji: '⚙️',
			title: 'DevOps & Cloud',
			desc: 'CI/CD pipelines, Kubernetes, AWS/Azure expertise.'
		},
		{ emoji: '🔒', title: 'Cyber Security', desc: 'Robust threat protection and compliance.' },
		{ emoji: '📈', title: 'Digital Marketing', desc: 'SEO, analytics, and growth strategies.' },
		{ emoji: '💡', title: 'Tech Consulting', desc: 'Expert guidance for digital transformation.' },
		{ emoji: '🤝', title: 'Staff Augmentation', desc: 'Top-tier developers for your team.' }
	];

	const trainings = [
		{
			emoji: '📘',
			title: 'Full-Stack Development Bootcamp',
			desc: '12 weeks intensive. JavaScript, Node, React, Tailwind.',
			action: 'Starts June 10 →'
		},
		{
			emoji: '🤖',
			title: 'AI & Machine Learning Masterclass',
			desc: 'Practical LLMs, computer vision, and MLOps.',
			action: 'Enroll now →'
		},
		{
			emoji: '🎨',
			title: 'UI/UX Design Sprint',
			desc: 'Figma, prototyping, user research methods.',
			action: 'Limited seats →'
		},
		{
			emoji: '☁️',
			title: 'Cloud Architecture Workshop',
			desc: 'AWS, Azure, serverless best practices.',
			action: 'Register →'
		}
	];

	// Button click handlers
	function handleCarouselButtonClick(slideIndex: number) {
		console.log(`Carousel button clicked for slide ${slideIndex + 1}`);
	}

	function handleCTA(type: string) {
		console.log(`CTA clicked: ${type}`);
	}
</script>

<main class="flex min-h-screen flex-col">
	<!-- ========== 1. CAROUSEL SECTION - Full Width, 70vh Height with Images ========== -->
	<section class="motion-item h-[50vh] w-full" data-motion>
		<div class=" relative mx-auto mt-2 max-w-7xl rounded">
			<Carousel.Root
				setApi={(emblaApi) => (api = emblaApi)}
				class="h-full w-full"
				opts={{ loop: true, duration: 40 }}
			>
				<Carousel.Content class="h-full">
					{#each carouselSlides as slide, i (i)}
						<Carousel.Item class="relative h-full w-full shrink-0 overflow-hidden">
							<!-- Background Image -->
							<img
								src={slide.image}
								alt={slide.title}
								class="absolute inset-0 h-full w-full object-cover"
							/>
							<!-- Dark Gradient Overlay -->
							<div class="absolute inset-0 bg-linear-to-br {slide.gradient}"></div>
							<!-- Content -->
							<div
								class="relative flex h-full w-full flex-col items-center justify-center p-8 text-white"
							>
								<div class="max-w-2xl rounded-3xl bg-black/30 p-8 text-center backdrop-blur-md">
									<h1 class="mb-4 text-4xl font-bold md:text-5xl lg:text-6xl">
										{slide.title}
									</h1>
									<p class="mb-6 text-lg opacity-95 md:text-xl">
										{slide.subtitle}
									</p>
									<button
										onclick={() => handleCarouselButtonClick(i)}
										class="rounded-full bg-white px-6 py-3 font-semibold shadow-lg transition-all hover:scale-105 hover:shadow-xl {slide.buttonColor ===
										'indigo'
											? 'text-indigo-700'
											: slide.buttonColor === 'cyan'
												? 'text-cyan-700'
												: slide.buttonColor === 'rose'
													? 'text-rose-700'
													: slide.buttonColor === 'emerald'
														? 'text-emerald-700'
														: 'text-slate-700'}"
									>
										{slide.buttonText}
									</button>
								</div>
							</div>
						</Carousel.Item>
					{/each}
				</Carousel.Content>
				<Carousel.Previous class="absolute top-1/2 left-4 -translate-y-1/2" />
				<Carousel.Next class="absolute top-1/2 right-4 -translate-y-1/2" />
			</Carousel.Root>
		</div>

		<!-- Clickable buttons under carousel -->
		<div class="flex flex-wrap items-center justify-center gap-3 py-4">
			{#each carouselSlides as slide, i (i)}
				<button
					onclick={() => api?.scrollTo(i)}
					class="rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 {current ===
					i + 1
						? 'bg-indigo-600 text-white shadow-md'
						: 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'}"
				>
					{i + 1}
				</button>
			{/each}
		</div>
	</section>

	<div class="mx-auto mt-12 max-w-7xl px-4 py-6 sm:px-6 md:py-10 lg:px-8">
		<!-- ========== 2. CATEGORIES CARD SECTION ========== -->
		<section class="motion-item mb-20" data-motion>
			<div class="mb-12 text-center">
				<span
					class="rounded-full bg-indigo-100 px-3 py-1 text-sm font-semibold tracking-wider text-indigo-700 uppercase dark:bg-indigo-900/40 dark:text-indigo-300"
				>
					Explore by Category
				</span>
				<h2 class="mt-4 text-3xl font-bold md:text-4xl">Solutions That Drive Growth</h2>
				<p class="mx-auto mt-2 max-w-2xl text-muted-foreground">
					Discover our comprehensive range of digital solutions tailored for modern businesses
				</p>
			</div>
			<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
				{#each categories as cat, i (i)}
					<Card.Root
						class="group cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
					>
						<Card.Content class="p-6">
							<div
								class="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-2xl transition-transform group-hover:scale-110 dark:bg-indigo-900/50"
							>
								{cat.emoji}
							</div>
							<h3 class="mb-2 text-xl font-semibold">{cat.title}</h3>
							<p class="text-muted-foreground">{cat.desc}</p>
						</Card.Content>
					</Card.Root>
				{/each}
			</div>
		</section>

		<!-- ========== 3. PROJECTS SECTION + CTA ========== -->
		<section class="motion-item mb-20" data-motion>
			<div class="mb-12 text-center">
				<span
					class="rounded-full bg-indigo-100 px-3 py-1 text-sm font-semibold tracking-wider text-indigo-700 uppercase dark:bg-indigo-900/40 dark:text-indigo-300"
				>
					Our Work
				</span>
				<h2 class="mt-4 text-3xl font-bold md:text-4xl">Featured Projects</h2>
				<p class="mx-auto mt-2 max-w-2xl text-muted-foreground">
					Real-world solutions that made a difference
				</p>
			</div>
			<div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
				{#each projects.slice(0, 6) as project, i (i)}
					<Card.Root
						class="overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
					>
						<div
							class="flex h-48 items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-500 text-5xl text-white"
						>
							{project.emoji}
						</div>
						<Card.Content class="p-5">
							<h3 class="text-xl font-bold">{project.title}</h3>
							<p class="mt-1 text-muted-foreground">{project.desc}</p>
							<div class="mt-4 flex flex-wrap gap-2">
								{#each project.tags as tag}
									<span class="rounded bg-gray-100 px-2 py-1 text-xs dark:bg-gray-800">{tag}</span>
								{/each}
							</div>
						</Card.Content>
					</Card.Root>
				{/each}
			</div>

			<!-- Call to action after projects -->
			<div
				class="mt-12 rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 p-8 text-center dark:from-indigo-950/20 dark:to-purple-950/20"
			>
				<h3 class="text-2xl font-bold md:text-3xl">Ready to build something great?</h3>
				<p class="mt-2 text-muted-foreground">
					Let's collaborate and turn your vision into reality.
				</p>
				<button
					onclick={() => handleCTA('project')}
					class="mt-5 rounded-full bg-indigo-600 px-8 py-3 font-semibold text-white shadow-md transition-all hover:scale-105 hover:bg-indigo-700"
				>
					Start a Project →
				</button>
			</div>
		</section>

		<!-- ========== 4. SERVICES CARD SECTION + CTA ========== -->
		<section class="motion-item mb-20" data-motion>
			<div class="mb-12 text-center">
				<span
					class="rounded-full bg-indigo-100 px-3 py-1 text-sm font-semibold tracking-wider text-indigo-700 uppercase dark:bg-indigo-900/40 dark:text-indigo-300"
				>
					What We Offer
				</span>
				<h2 class="mt-4 text-3xl font-bold md:text-4xl">End-to-End Digital Services</h2>
				<p class="mx-auto mt-2 max-w-2xl text-muted-foreground">
					Comprehensive solutions from strategy to execution
				</p>
			</div>
			<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
				{#each services as service, i (i)}
					<Card.Root
						class="cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-xl dark:hover:border-indigo-700"
					>
						<Card.Content class="p-6 text-center">
							<div class="mb-4 inline-block text-5xl transition-transform group-hover:scale-110">
								{service.emoji}
							</div>
							<h3 class="mb-2 text-xl font-bold">{service.title}</h3>
							<p class="text-muted-foreground">{service.desc}</p>
						</Card.Content>
					</Card.Root>
				{/each}
			</div>

			<!-- Call to action after services -->
			<div
				class="mt-12 rounded-2xl bg-gradient-to-r from-cyan-50 to-blue-50 p-8 text-center dark:from-cyan-950/20 dark:to-blue-950/20"
			>
				<h3 class="text-2xl font-bold md:text-3xl">Scale your business with expert services</h3>
				<p class="mt-2 text-muted-foreground">Get a custom quote tailored to your needs.</p>
				<button
					onclick={() => handleCTA('services')}
					class="mt-5 rounded-full bg-cyan-600 px-8 py-3 font-semibold text-white shadow-md transition-all hover:scale-105 hover:bg-cyan-700"
				>
					Request Consultation →
				</button>
			</div>
		</section>

		<!-- ========== 5. TRAINING CARD SECTION + FINAL CTA ========== -->
		<section class="motion-item mb-20" data-motion>
			<div class="mb-12 text-center">
				<span
					class="rounded-full bg-indigo-100 px-3 py-1 text-sm font-semibold tracking-wider text-indigo-700 uppercase dark:bg-indigo-900/40 dark:text-indigo-300"
				>
					Upskill
				</span>
				<h2 class="mt-4 text-3xl font-bold md:text-4xl">Training & Workshops</h2>
				<p class="mx-auto mt-2 max-w-2xl text-muted-foreground">
					Empower your team with cutting-edge knowledge
				</p>
			</div>
			<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
				{#each trainings as training, i (i)}
					<Card.Root
						class="cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
					>
						<Card.Content class="p-6">
							<div class="text-4xl">{training.emoji}</div>
							<h3 class="mt-3 text-lg font-bold">{training.title}</h3>
							<p class="mt-2 text-sm text-muted-foreground">{training.desc}</p>
							<div class="mt-4 text-sm font-medium text-indigo-600 dark:text-indigo-400">
								{training.action}
							</div>
						</Card.Content>
					</Card.Root>
				{/each}
			</div>

			<!-- Final Call to Action -->
			<div
				class="mt-12 rounded-2xl bg-gradient-to-r from-fuchsia-50 to-rose-50 p-10 text-center dark:from-fuchsia-950/20 dark:to-rose-950/20"
			>
				<h3 class="text-2xl font-bold tracking-tight md:text-4xl">Ready to transform your team?</h3>
				<p class="mx-auto mt-3 max-w-xl text-lg text-muted-foreground">
					Join our next cohort or request in-house training.
				</p>
				<button
					onclick={() => handleCTA('training')}
					class="mt-6 rounded-full bg-fuchsia-600 px-10 py-3 font-semibold text-white shadow-lg transition-all hover:scale-105 hover:bg-fuchsia-700"
				>
					Get Brochure →
				</button>
			</div>
		</section>
	</div>
</main>

<style>
	.motion-item {
		opacity: 0;
		transform: translateY(30px);
		transition:
			opacity 0.7s cubic-bezier(0.2, 0.9, 0.4, 1.1),
			transform 0.7s cubic-bezier(0.2, 0.9, 0.4, 1.1);
	}

	.motion-item.visible {
		opacity: 1;
		transform: translateY(0);
	}

	@media (prefers-reduced-motion: reduce) {
		.motion-item {
			transition: none;
			opacity: 1;
			transform: none;
		}
	}
</style>
