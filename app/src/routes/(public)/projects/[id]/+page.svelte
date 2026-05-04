<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';
	import { page } from '$app/state';
	import { localizeHref } from '$lib/paraglide/runtime';

	import { goto } from '$app/navigation';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js';
	import * as Button from '$lib/components/ui/button/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import * as Input from '$lib/components/ui/input/index.js';
	import * as Textarea from '$lib/components/ui/textarea/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as Separator from '$lib/components/ui/separator/index.js';
	import * as Alert from '$lib/components/ui/alert/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { onMount } from 'svelte';

	// Import images (replace with your actual image imports)
	import projectImage from '$lib/assets/reactjs.jpg';

	// Types
	interface Comment {
		id: number;
		userName: string;
		userAvatar?: string;
		rating: number;
		content: string;
		date: string;
		likes: number;
	}

	interface Project {
		id: number;
		title: string;
		description: string;
		fullDescription: string;
		category: string;
		appType: string;
		image: string;
		galleryImages?: string[];
		tags: string[];
		date: string;
		client: string;
		clientIndustry: string;
		projectDuration: string;
		technologies: string[];
		averageRating: number;
		commentCount: number;
		comments: Comment[];
		challenge: string;
		solution: string;
		results: string[];
		liveUrl?: string;
		youtubeVideoId?: string;
	}

	// Mock project data
	const project: Project = {
		id: 1,
		title: 'FashionHub Marketplace',
		description: 'Multi-vendor fashion e-commerce platform with AI recommendations.',
		fullDescription: `FashionHub is a revolutionary multi-vendor e-commerce platform that connects fashion designers, brands, and consumers in a seamless ecosystem. The platform features AI-powered product recommendations, real-time inventory management, and an intuitive vendor dashboard.

The platform was built to handle high traffic during flash sales and seasonal events, with a focus on providing a smooth checkout experience. Our team implemented advanced search functionality with faceted filters, allowing users to find products by size, color, brand, price range, and style.

Key achievements include a 40% increase in conversion rate after implementing personalized recommendations, 99.9% uptime during Black Friday sales, and successfully onboarding over 500 vendors within the first 3 months.`,
		category: 'ecommerce',
		appType: 'web',
		image: projectImage,
		galleryImages: [projectImage, projectImage, projectImage],
		tags: ['React', 'Node.js', 'MongoDB', 'Redis', 'AWS'],
		date: '2024-01-15',
		client: 'FashionHub Inc.',
		clientIndustry: 'Fashion & Retail',
		projectDuration: '6 months',
		technologies: [
			'React 18',
			'Node.js',
			'Express',
			'MongoDB',
			'Redis',
			'AWS EC2',
			'S3',
			'CloudFront',
			'Stripe API',
			'OpenAI API'
		],
		averageRating: 4.8,
		commentCount: 24,
		comments: [
			{
				id: 1,
				userName: 'Sarah Johnson',
				userAvatar: 'SJ',
				rating: 5,
				content:
					'Absolutely amazing platform! The AI recommendations are spot-on and the checkout process is incredibly smooth. Our sales increased by 35% since launch. The team was very responsive throughout the development process.',
				date: '2024-02-20',
				likes: 12
			},
			{
				id: 2,
				userName: 'Michael Chen',
				userAvatar: 'MC',
				rating: 4.5,
				content:
					'Great platform overall. The vendor dashboard is intuitive and easy to use. Would love to see more analytics features in the future. Support team is excellent!',
				date: '2024-02-15',
				likes: 8
			},
			{
				id: 3,
				userName: 'Emma Davis',
				userAvatar: 'ED',
				rating: 5,
				content:
					"Best e-commerce solution we've used. The mobile responsiveness is perfect and the admin panel gives us full control. Highly recommend!",
				date: '2024-02-10',
				likes: 15
			},
			{
				id: 4,
				userName: 'James Wilson',
				userAvatar: 'JW',
				rating: 4,
				content:
					'Very solid platform with great features. The only minor issue was some initial bugs that were quickly fixed. Good job!',
				date: '2024-02-05',
				likes: 3
			},
			{
				id: 5,
				userName: 'Lisa Anderson',
				userAvatar: 'LA',
				rating: 5,
				content:
					'The team exceeded our expectations. The platform handles thousands of concurrent users without any issues. Outstanding work!',
				date: '2024-01-28',
				likes: 20
			}
		],
		challenge:
			'The client needed a scalable multi-vendor platform that could handle high traffic, provide personalized recommendations, and offer a seamless experience for both end-users and vendors. The main challenges included implementing real-time inventory sync across vendors, creating an AI-powered recommendation engine, and ensuring 99.9% uptime during peak seasons.',
		solution:
			'We built a microservices architecture using Node.js and MongoDB for flexibility and scalability. The AI recommendation engine uses collaborative filtering and real-time user behavior analysis. Redis caching was implemented for session management and to reduce database load. The frontend uses React with server-side rendering for optimal performance and SEO.',
		results: [
			'40% increase in conversion rate',
			'99.9% uptime during Black Friday sales',
			'500+ vendors onboarded in first 3 months',
			'2.5x increase in average order value',
			'35% reduction in cart abandonment'
		],
		liveUrl: 'https://fashionhub.example.com',
		youtubeVideoId: 'dQw4w9WgXcQ' // Replace with your actual YouTube video ID
	};

	// Dialog state for video modal
	let isVideoDialogOpen = $state(false);
	let isDemoDialogOpen = $state(false);

	// Quote request form state
	let quoteForm = $state({
		name: '',
		email: '',
		phone: '',
		budget: '',
		message: '',
		submitted: false,
		submitting: false
	});

	let formErrors = $state<Record<string, string>>({});
	let showAlert = $state(false);
	let alertMessage = $state('');
	let alertType: 'success' | 'error' = 'success';

	// Validate form
	function validateForm(): boolean {
		const errors: Record<string, string> = {};

		if (!quoteForm.name.trim()) {
			errors.name = 'Name is required';
		}
		if (!quoteForm.email.trim()) {
			errors.email = 'Email is required';
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(quoteForm.email)) {
			errors.email = 'Please enter a valid email address';
		}
		if (!quoteForm.message.trim()) {
			errors.message = 'Message is required';
		} else if (quoteForm.message.trim().length < 20) {
			errors.message = 'Message must be at least 20 characters';
		}

		formErrors = errors;
		return Object.keys(errors).length === 0;
	}

	// Submit quote request
	async function submitQuoteRequest() {
		if (!validateForm()) {
			alertType = 'error';
			alertMessage = 'Please fix the errors before submitting.';
			showAlert = true;
			setTimeout(() => {
				showAlert = false;
			}, 5000);
			return;
		}

		quoteForm.submitting = true;

		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 1500));

		console.log('Quote request submitted:', {
			project: project.title,
			...quoteForm
		});

		quoteForm.submitted = true;
		quoteForm.submitting = false;
		alertType = 'success';
		alertMessage = 'Thank you! We will contact you within 24 hours with a custom quote.';
		showAlert = true;

		// Reset form after 3 seconds
		setTimeout(() => {
			quoteForm = {
				name: '',
				email: '',
				phone: '',
				budget: '',
				message: '',
				submitted: false,
				submitting: false
			};
			formErrors = {};
			showAlert = false;
		}, 3000);
	}

	// Render star rating
	function renderStars(rating: number): string {
		const fullStars = Math.floor(rating);
		const hasHalfStar = rating % 1 >= 0.5;
		const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
		return '★'.repeat(fullStars) + (hasHalfStar ? '½' : '') + '☆'.repeat(emptyStars);
	}

	// Format date
	function formatDate(dateString: string): string {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	// Open demo link
	function openDemo() {
		if (project.liveUrl) {
			window.open(project.liveUrl, '_blank');
		}
	}

	onMount(() => {
		window.scrollTo(0, 0);
	});
</script>

<main class="flex min-h-screen flex-col">
	<!-- ========== BREADCRUMB SECTION ========== -->
	<div class="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
		<Breadcrumb.Root>
			<Breadcrumb.List>
				<Breadcrumb.Item>
					<Breadcrumb.Link href="/">Home</Breadcrumb.Link>
				</Breadcrumb.Item>
				<Breadcrumb.Separator />
				<Breadcrumb.Item>
					<Breadcrumb.Link href="/projects">Projects</Breadcrumb.Link>
				</Breadcrumb.Item>
				<Breadcrumb.Separator />
				<Breadcrumb.Item>
					<Breadcrumb.Link href="/projects/1" class="font-semibold text-foreground">
						{project.title}
					</Breadcrumb.Link>
				</Breadcrumb.Item>
			</Breadcrumb.List>
		</Breadcrumb.Root>
	</div>

	<!-- ========== PROJECT HEADER SECTION ========== -->
	<div class="relative h-80 w-full overflow-hidden md:h-96">
		<img src={project.image} alt={project.title} class="h-full w-full object-cover" />
		<div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
		<div class="absolute right-0 bottom-0 left-0 p-8 text-white">
			<div class="mx-auto max-w-7xl">
				<div class="mb-4 flex flex-wrap gap-2">
					<Badge class="bg-indigo-600 capitalize">{project.category}</Badge>
					<Badge variant="secondary" class="bg-white/20 text-white capitalize">
						{project.appType}
					</Badge>
				</div>
				<h1 class="mb-3 text-3xl font-bold md:text-5xl">{project.title}</h1>
				<p class="max-w-3xl text-lg text-white/90 md:text-xl">{project.description}</p>
			</div>
		</div>
	</div>

	<!-- ========== MAIN CONTENT ========== -->
	<div class="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
		<div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
			<!-- Left Column: Project Details -->
			<div class="space-y-8 lg:col-span-2">
				<!-- Video & Demo Preview Section -->
				<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
					<!-- YouTube Video Card -->
					<Card.Root class="overflow-hidden">
						<div
							class="relative cursor-pointer overflow-hidden"
							onclick={() => (isVideoDialogOpen = true)}
						>
							<img
								src={`https://img.youtube.com/vi/${project.youtubeVideoId}/maxresdefault.jpg`}
								alt="Project Video Thumbnail"
								class="h-48 w-full object-cover transition-transform duration-300 hover:scale-105"
							/>
							<div
								class="absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity hover:bg-black/50"
							>
								<div
									class="flex h-16 w-16 items-center justify-center rounded-full bg-red-600 text-white shadow-lg transition-transform hover:scale-110"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="32"
										height="32"
										viewBox="0 0 24 24"
										fill="white"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									>
										<polygon points="5 3 19 12 5 21 5 3" />
									</svg>
								</div>
							</div>
						</div>
						<Card.Content class="p-4 text-center">
							<h3 class="font-semibold">Project Demo Video</h3>
							<p class="text-sm text-muted-foreground">Watch the full walkthrough</p>
						</Card.Content>
					</Card.Root>

					<!-- Live Demo Preview Card -->
					<Card.Root
						class="cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-lg"
						onclick={openDemo}
					>
						<div
							class="relative h-48 overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600"
						>
							<div class="flex h-full flex-col items-center justify-center text-white">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="48"
									height="48"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="1.5"
									stroke-linecap="round"
									stroke-linejoin="round"
									class="mb-3"
								>
									<circle cx="12" cy="12" r="10" />
									<polygon points="10 8 16 12 10 16 10 8" />
								</svg>
								<p class="text-lg font-semibold">Live Demo Available</p>
								<p class="text-sm opacity-90">Click to preview the project</p>
							</div>
						</div>
						<Card.Content class="p-4 text-center">
							<h3 class="font-semibold">Try Live Demo</h3>
							<p class="text-sm text-muted-foreground">Experience the platform in action</p>
						</Card.Content>
					</Card.Root>
				</div>

				<!-- Overview Card -->
				<Card.Root>
					<Card.Header>
						<Card.Title>Project Overview</Card.Title>
						<Card.Description>Detailed information about this project</Card.Description>
					</Card.Header>
					<Card.Content class="space-y-6">
						<div>
							<h3 class="mb-2 font-semibold">Challenge</h3>
							<p class="text-muted-foreground">{project.challenge}</p>
						</div>
						<div>
							<h3 class="mb-2 font-semibold">Solution</h3>
							<p class="text-muted-foreground">{project.solution}</p>
						</div>
						<div>
							<h3 class="mb-2 font-semibold">Key Results</h3>
							<ul class="list-inside list-disc space-y-1 text-muted-foreground">
								{#each project.results as result}
									<li>{result}</li>
								{/each}
							</ul>
						</div>
						<div>
							<h3 class="mb-2 font-semibold">Technologies Used</h3>
							<div class="flex flex-wrap gap-2">
								{#each project.technologies as tech}
									<Badge variant="outline" class="text-sm">{tech}</Badge>
								{/each}
							</div>
						</div>
					</Card.Content>
				</Card.Root>

				<!-- Project Details Grid -->
				<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<Card.Root>
						<Card.Content class="flex items-center gap-3 p-4">
							<div
								class="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/40"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="20"
									height="20"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									class="text-indigo-600 dark:text-indigo-400"
								>
									<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
									<circle cx="12" cy="7" r="4" />
								</svg>
							</div>
							<div>
								<p class="text-xs text-muted-foreground">Client</p>
								<p class="font-medium">{project.client}</p>
							</div>
						</Card.Content>
					</Card.Root>

					<Card.Root>
						<Card.Content class="flex items-center gap-3 p-4">
							<div
								class="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/40"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="20"
									height="20"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									class="text-indigo-600 dark:text-indigo-400"
								>
									<rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
									<line x1="16" y1="2" x2="16" y2="6" />
									<line x1="8" y1="2" x2="8" y2="6" />
									<line x1="3" y1="10" x2="21" y2="10" />
								</svg>
							</div>
							<div>
								<p class="text-xs text-muted-foreground">Duration</p>
								<p class="font-medium">{project.projectDuration}</p>
							</div>
						</Card.Content>
					</Card.Root>

					<Card.Root>
						<Card.Content class="flex items-center gap-3 p-4">
							<div
								class="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/40"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="20"
									height="20"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									class="text-indigo-600 dark:text-indigo-400"
								>
									<path
										d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"
									/>
								</svg>
							</div>
							<div>
								<p class="text-xs text-muted-foreground">Industry</p>
								<p class="font-medium">{project.clientIndustry}</p>
							</div>
						</Card.Content>
					</Card.Root>

					<Card.Root>
						<Card.Content class="flex items-center gap-3 p-4">
							<div
								class="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/40"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="20"
									height="20"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									class="text-indigo-600 dark:text-indigo-400"
								>
									<circle cx="12" cy="12" r="10" />
									<polyline points="12 6 12 12 16 14" />
								</svg>
							</div>
							<div>
								<p class="text-xs text-muted-foreground">Completion Date</p>
								<p class="font-medium">{formatDate(project.date)}</p>
							</div>
						</Card.Content>
					</Card.Root>
				</div>

				<!-- Reviews & Comments Section -->
				<Card.Root>
					<Card.Header>
						<div class="flex flex-wrap items-center justify-between gap-4">
							<div>
								<Card.Title>Customer Reviews</Card.Title>
								<Card.Description>
									Based on {project.commentCount} reviews
								</Card.Description>
							</div>
							<div class="flex items-center gap-2">
								<div class="text-3xl font-bold text-yellow-500">{project.averageRating}</div>
								<div class="text-xl text-yellow-500">{renderStars(project.averageRating)}</div>
							</div>
						</div>
					</Card.Header>
					<Card.Content class="space-y-6">
						{#each project.comments as comment (comment.id)}
							<div class="border-b border-border pb-6 last:border-0 last:pb-0">
								<div class="flex items-start gap-4">
									<div
										class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-sm font-semibold text-white"
									>
										{comment.userAvatar}
									</div>
									<div class="flex-1">
										<div class="mb-1 flex flex-wrap items-center justify-between gap-2">
											<div>
												<span class="font-semibold">{comment.userName}</span>
												<div class="mt-1 flex items-center gap-2">
													<div class="text-sm text-yellow-500">{renderStars(comment.rating)}</div>
													<span class="text-xs text-muted-foreground">{comment.rating}</span>
												</div>
											</div>
											<span class="text-xs text-muted-foreground">{formatDate(comment.date)}</span>
										</div>
										<p class="mt-2 text-muted-foreground">{comment.content}</p>
										<div class="mt-3 flex items-center gap-4">
											<button
												class="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-indigo-600"
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													width="14"
													height="14"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													stroke-width="2"
												>
													<path
														d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
													/>
												</svg>
												{comment.likes} likes
											</button>
											<button
												class="text-xs text-muted-foreground transition-colors hover:text-indigo-600"
											>
												Reply
											</button>
										</div>
									</div>
								</div>
							</div>
						{/each}
					</Card.Content>
				</Card.Root>
			</div>

			<!-- Right Column: Quote Form -->
			<div class="lg:col-span-1">
				<div class="sticky top-8">
					<Card.Root class="border-2 border-indigo-200 dark:border-indigo-800">
						<Card.Header
							class="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30"
						>
							<Card.Title class="flex items-center gap-2">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="20"
									height="20"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									class="text-indigo-600"
								>
									<path
										d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"
									/>
									<polyline points="3.29 7 12 12 20.71 7" />
									<line x1="12" y1="22" x2="12" y2="12" />
								</svg>
								Request a Quote
							</Card.Title>
							<Card.Description>Get a personalized quote for a similar project</Card.Description>
						</Card.Header>

						<Card.Content class="p-6">
							{#if showAlert}
								<Alert.Root
									class="mb-4"
									variant={alertType === 'success' ? 'default' : 'destructive'}
								>
									<Alert.Description>{alertMessage}</Alert.Description>
								</Alert.Root>
							{/if}

							{#if quoteForm.submitted}
								<div class="py-8 text-center">
									<div
										class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="32"
											height="32"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="2"
											class="text-green-600"
										>
											<polyline points="20 6 9 17 4 12" />
										</svg>
									</div>
									<h3 class="mb-2 font-semibold">Quote Request Sent!</h3>
									<p class="text-sm text-muted-foreground">
										We'll get back to you within 24 hours.
									</p>
								</div>
							{:else}
								<div class="space-y-4">
									<div class="space-y-2">
										<Label for="name">Full Name *</Label>
										<Input.Root
											id="name"
											placeholder="John Doe"
											bind:value={quoteForm.name}
											class={formErrors.name ? 'border-red-500' : ''}
										/>
										{#if formErrors.name}
											<p class="text-xs text-red-500">{formErrors.name}</p>
										{/if}
									</div>

									<div class="space-y-2">
										<Label for="email">Email Address *</Label>
										<Input.Root
											id="email"
											type="email"
											placeholder="john@example.com"
											bind:value={quoteForm.email}
											class={formErrors.email ? 'border-red-500' : ''}
										/>
										{#if formErrors.email}
											<p class="text-xs text-red-500">{formErrors.email}</p>
										{/if}
									</div>

									<div class="space-y-2">
										<Label for="phone">Phone Number (Optional)</Label>
										<Input.Root
											id="phone"
											type="tel"
											placeholder="+1 234 567 8900"
											bind:value={quoteForm.phone}
										/>
									</div>

									<div class="space-y-2">
										<Label for="budget">Estimated Budget (Optional)</Label>
										<select
											id="budget"
											bind:value={quoteForm.budget}
											class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
										>
											<option value="">Select budget range</option>
											<option value="5k-10k">$5,000 - $10,000</option>
											<option value="10k-25k">$10,000 - $25,000</option>
											<option value="25k-50k">$25,000 - $50,000</option>
											<option value="50k+">$50,000+</option>
										</select>
									</div>

									<div class="space-y-2">
										<Label for="message">Project Details / Message *</Label>
										<Textarea.Root
											id="message"
											placeholder="Tell us about your project requirements, timeline, and specific needs..."
											rows={5}
											bind:value={quoteForm.message}
											class={formErrors.message ? 'border-red-500' : ''}
										/>
										{#if formErrors.message}
											<p class="text-xs text-red-500">{formErrors.message}</p>
										{:else}
											<p class="text-xs text-muted-foreground">Minimum 20 characters</p>
										{/if}
									</div>

									<Separator.Root />

									<div class="rounded-lg bg-muted/50 p-3 text-sm">
										<p class="mb-1 font-medium">What happens next?</p>
										<ul class="space-y-1 text-xs text-muted-foreground">
											<li>✓ We'll review your requirements within 24 hours</li>
											<li>✓ A project specialist will contact you</li>
											<li>✓ We'll provide a detailed quote and timeline</li>
											<li>✓ Free consultation and no obligation</li>
										</ul>
									</div>

									<Button.Root
										onclick={submitQuoteRequest}
										disabled={quoteForm.submitting}
										class="w-full bg-indigo-600 hover:bg-indigo-700"
									>
										{#if quoteForm.submitting}
											<svg
												class="mr-2 h-4 w-4 animate-spin"
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
											>
												<circle
													class="opacity-25"
													cx="12"
													cy="12"
													r="10"
													stroke="currentColor"
													stroke-width="4"
												></circle>
												<path
													class="opacity-75"
													fill="currentColor"
													d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
												></path>
											</svg>
											Sending...
										{:else}
											Get Quote for This Project
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="16"
												height="16"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												stroke-width="2"
												class="ml-2"
											>
												<path d="M5 12h14M12 5l7 7-7 7" />
											</svg>
										{/if}
									</Button.Root>
								</div>
							{/if}
						</Card.Content>

						<Card.Footer class="bg-muted/30 text-center text-xs text-muted-foreground">
							<p>Your information is secure. We'll never share your details.</p>
						</Card.Footer>
					</Card.Root>
				</div>
			</div>
		</div>
	</div>

	<!-- YouTube Video Modal Dialog -->
	<Dialog.Root bind:open={isVideoDialogOpen}>
		<Dialog.Content class="max-w-4xl">
			<Dialog.Header>
				<Dialog.Title>Project Demo Video</Dialog.Title>
				<Dialog.Description>Watch the full walkthrough of {project.title}</Dialog.Description>
			</Dialog.Header>
			<div class="aspect-video w-full">
				<iframe
					class="h-full w-full rounded-lg"
					src={`https://www.youtube.com/embed/${project.youtubeVideoId}?autoplay=1`}
					title="YouTube video player"
					frameborder="0"
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
					allowfullscreen
				></iframe>
			</div>
		</Dialog.Content>
	</Dialog.Root>
</main>
