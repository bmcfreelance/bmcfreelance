<script lang="ts">
	import { setLocale, getLocale } from '$lib/paraglide/runtime';
	import { m } from '$lib/paraglide/messages.js';
	import { locales, localizeHref } from '$lib/paraglide/runtime';

	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js';
	import * as Button from '$lib/components/ui/button/index.js';
	import * as Input from '$lib/components/ui/input/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Textarea from '$lib/components/ui/textarea/index.js';
	import * as Label from '$lib/components/ui/label/index.js';
	import { onMount } from 'svelte';

	// Import images (replace with your actual image imports)
	import projectsHero from '$lib/assets/projects-hero.jpg';
	import Badge from '$lib/components/ui/badge/badge.svelte';

	// Project type definitions
	type ProjectCategory = 'ecommerce' | 'iot' | 'vitrine' | 'all';
	type ProjectAppType = 'desktop' | 'mobile' | 'web' | 'all';

	interface Comment {
		id: number;
		userName: string;
		rating: number;
		content: string;
		date: string;
	}

	interface Project {
		id: number;
		title: string;
		description: string;
		category: Exclude<ProjectCategory, 'all'>;
		appType: Exclude<ProjectAppType, 'all'>;
		image: string;
		tags: string[];
		date: string;
		client: string;
		averageRating: number;
		commentCount: number;
		comments: Comment[];
	}

	// Helper function to generate random ratings and comments for demo
	function generateRandomRating(): number {
		return parseFloat((3 + Math.random() * 2).toFixed(1));
	}

	function generateRandomCommentCount(): number {
		return Math.floor(Math.random() * 50) + 1;
	}

	function generateRandomComments(projectId: number, count: number): Comment[] {
		const userNames = [
			'Alice Johnson',
			'Bob Smith',
			'Carol Davis',
			'David Wilson',
			'Emma Brown',
			'Frank Miller',
			'Grace Lee',
			'Henry Taylor'
		];
		const commentTexts = [
			'Excellent work! Very professional team.',
			'Great project, met all our requirements.',
			'Impressive design and functionality.',
			'Good communication throughout the project.',
			'Delivered on time and within budget.',
			'Would definitely recommend this team.',
			'The UI/UX is outstanding!',
			'Very responsive to feedback.',
			'High quality code and documentation.',
			'Exceeded our expectations!'
		];

		const comments: Comment[] = [];
		const commentCount = Math.min(count, 15);

		for (let i = 0; i < commentCount; i++) {
			comments.push({
				id: i + 1,
				userName: userNames[Math.floor(Math.random() * userNames.length)],
				rating: generateRandomRating(),
				content: commentTexts[Math.floor(Math.random() * commentTexts.length)],
				date: new Date(
					2024,
					Math.floor(Math.random() * 3),
					Math.floor(Math.random() * 28) + 1
				).toLocaleDateString()
			});
		}

		// Sort by date (newest first)
		return comments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
	}

	// Generate 30+ projects for pagination demo
	const allProjects: Project[] = [
		// E-commerce projects
		{
			id: 1,
			title: 'FashionHub Marketplace',
			description: 'Multi-vendor fashion e-commerce platform with AI recommendations.',
			category: 'ecommerce',
			appType: 'web',
			image: '/images/projects/reactjs.jpg',
			tags: ['React', 'Node.js', 'MongoDB'],
			date: '2024-01-15',
			client: 'FashionHub Inc.',
			averageRating: 4.8,
			commentCount: 24,
			comments: []
		},
		{
			id: 2,
			title: 'Organic Mart',
			description: 'Online grocery store with real-time inventory and delivery tracking.',
			category: 'ecommerce',
			appType: 'mobile',
			image: '/images/projects/reactjs.jpg',
			tags: ['Flutter', 'Firebase', 'Stripe'],
			date: '2024-02-20',
			client: 'Organic Mart Co.',
			averageRating: 4.6,
			commentCount: 18,
			comments: []
		},
		{
			id: 3,
			title: 'TechGadgets Store',
			description: 'Electronics e-commerce with product comparisons and reviews.',
			category: 'ecommerce',
			appType: 'web',
			image: '/images/projects/reactjs.jpg',
			tags: ['Vue.js', 'Django', 'PostgreSQL'],
			date: '2024-01-10',
			client: 'TechGadgets Ltd.',
			averageRating: 4.9,
			commentCount: 42,
			comments: []
		},
		{
			id: 4,
			title: 'HomeDecor Boutique',
			description: 'Luxury home decor shopping with AR preview feature.',
			category: 'ecommerce',
			appType: 'mobile',
			image: '/images/projects/reactjs.jpg',
			tags: ['React Native', 'Shopify', 'Three.js'],
			date: '2024-03-05',
			client: 'HomeDecor Boutique',
			averageRating: 4.7,
			commentCount: 31,
			comments: []
		},
		{
			id: 5,
			title: 'SportsGear Pro',
			description: 'Sports equipment store with live inventory and flash sales.',
			category: 'ecommerce',
			appType: 'web',
			image: '/images/projects/reactjs.jpg',
			tags: ['Next.js', 'Express', 'Redis'],
			date: '2024-02-28',
			client: 'SportsGear Pro',
			averageRating: 4.5,
			commentCount: 27,
			comments: []
		},

		// IoT projects
		{
			id: 6,
			title: 'SmartHome Hub',
			description: 'Centralized IoT platform for managing smart home devices.',
			category: 'iot',
			appType: 'mobile',
			image: '/images/projects/reactjs.jpg',
			tags: ['IoT', 'MQTT', 'React Native'],
			date: '2024-01-25',
			client: 'SmartHome Solutions',
			averageRating: 4.9,
			commentCount: 38,
			comments: []
		},
		{
			id: 7,
			title: 'Industrial Monitor',
			description: 'Real-time monitoring system for manufacturing equipment.',
			category: 'iot',
			appType: 'desktop',
			image: '/images/projects/reactjs.jpg',
			tags: ['C#', '.NET', 'Azure IoT'],
			date: '2024-02-12',
			client: 'Industrial Systems Inc.',
			averageRating: 4.7,
			commentCount: 22,
			comments: []
		},
		{
			id: 8,
			title: 'FleetTracker',
			description: 'GPS fleet management system with predictive maintenance.',
			category: 'iot',
			appType: 'web',
			image: '/images/projects/reactjs.jpg',
			tags: ['Angular', 'Node.js', 'Socket.io'],
			date: '2024-03-01',
			client: 'FleetTracker Co.',
			averageRating: 4.6,
			commentCount: 19,
			comments: []
		},
		{
			id: 9,
			title: 'AgriSense',
			description: 'Smart agriculture solution for soil and crop monitoring.',
			category: 'iot',
			appType: 'mobile',
			image: '/images/projects/reactjs.jpg',
			tags: ['Flutter', 'LoRaWAN', 'TensorFlow'],
			date: '2024-01-18',
			client: 'AgriSense Corp',
			averageRating: 4.8,
			commentCount: 34,
			comments: []
		},
		{
			id: 10,
			title: 'EnergyGuard',
			description: 'Energy consumption monitoring for smart buildings.',
			category: 'iot',
			appType: 'web',
			image: '/images/projects/reactjs.jpg',
			tags: ['React', 'GraphQL', 'InfluxDB'],
			date: '2024-02-22',
			client: 'EnergyGuard Systems',
			averageRating: 4.4,
			commentCount: 16,
			comments: []
		},

		// Vitrine (portfolio/brochure) projects
		{
			id: 11,
			title: 'Creative Agency Portfolio',
			description: 'Modern portfolio website for a creative design agency.',
			category: 'vitrine',
			appType: 'web',
			image: '/images/projects/reactjs.jpg',
			tags: ['SvelteKit', 'Tailwind', 'GSAP'],
			date: '2024-01-30',
			client: 'Creative Studio',
			averageRating: 5.0,
			commentCount: 47,
			comments: []
		},
		{
			id: 12,
			title: 'Restaurant Showcase',
			description: 'Elegant restaurant website with menu and reservation system.',
			category: 'vitrine',
			appType: 'web',
			image: '/images/projects/reactjs.jpg',
			tags: ['WordPress', 'PHP', 'MySQL'],
			date: '2024-02-14',
			client: 'La Belle Table',
			averageRating: 4.7,
			commentCount: 29,
			comments: []
		},
		{
			id: 13,
			title: 'Real Estate Showcase',
			description: 'Property listing website with virtual tours.',
			category: 'vitrine',
			appType: 'web',
			image: '/images/projects/reactjs.jpg',
			tags: ['Next.js', 'Mapbox', 'Sanity'],
			date: '2024-03-08',
			client: 'Luxury Estates',
			averageRating: 4.9,
			commentCount: 53,
			comments: []
		},
		{
			id: 14,
			title: 'Artist Portfolio',
			description: 'Interactive portfolio for a digital artist with gallery.',
			category: 'vitrine',
			appType: 'mobile',
			image: '/images/projects/reactjs.jpg',
			tags: ['React Native', 'Expo'],
			date: '2024-01-22',
			client: 'Alex Chen Art',
			averageRating: 4.8,
			commentCount: 35,
			comments: []
		},
		{
			id: 15,
			title: 'Hotel Website',
			description: 'Luxury hotel booking and information website.',
			category: 'vitrine',
			appType: 'web',
			image: '/images/projects/reactjs.jpg',
			tags: ['Vue', 'Nuxt', 'Prismic'],
			date: '2024-02-18',
			client: 'Grand Hotel',
			averageRating: 4.6,
			commentCount: 41,
			comments: []
		},

		// More projects for pagination
		{
			id: 16,
			title: 'Wearable Health Monitor',
			description: 'IoT wearable device integration with health tracking app.',
			category: 'iot',
			appType: 'mobile',
			image: '/images/projects/reactjs.jpg',
			tags: ['Flutter', 'Bluetooth', 'Firebase'],
			date: '2024-03-10',
			client: 'HealthTech Inc.',
			averageRating: 4.8,
			commentCount: 26,
			comments: []
		},
		{
			id: 17,
			title: 'Luxury Watch Store',
			description: 'Premium watch e-commerce with authentication certificates.',
			category: 'ecommerce',
			appType: 'web',
			image: '/images/projects/reactjs.jpg',
			tags: ['Shopify', 'Liquid', 'Vue'],
			date: '2024-02-05',
			client: 'Timepiece Luxury',
			averageRating: 4.9,
			commentCount: 44,
			comments: []
		},
		{
			id: 18,
			title: 'Architecture Portfolio',
			description: 'Minimalist portfolio for an architecture firm.',
			category: 'vitrine',
			appType: 'web',
			image: '/images/projects/reactjs.jpg',
			tags: ['Webflow', 'GSAP', 'Three.js'],
			date: '2024-01-28',
			client: 'ArchiForm Studio',
			averageRating: 4.7,
			commentCount: 23,
			comments: []
		},
		{
			id: 19,
			title: 'Smart Lock System',
			description: 'IoT smart lock management with remote access.',
			category: 'iot',
			appType: 'mobile',
			image: '/images/projects/reactjs.jpg',
			tags: ['Kotlin', 'BLE', 'AWS IoT'],
			date: '2024-03-12',
			client: 'SecureLiving',
			averageRating: 4.5,
			commentCount: 17,
			comments: []
		},
		{
			id: 20,
			title: 'Pet Supplies Shop',
			description: 'Online pet store with subscription service.',
			category: 'ecommerce',
			appType: 'web',
			image: '/images/projects/reactjs.jpg',
			tags: ['WooCommerce', 'PHP', 'React'],
			date: '2024-02-25',
			client: 'Pet Paradise',
			averageRating: 4.6,
			commentCount: 32,
			comments: []
		},
		{
			id: 21,
			title: 'Smart City Dashboard',
			description: 'IoT city management dashboard for urban planners.',
			category: 'iot',
			appType: 'desktop',
			image: '/images/projects/reactjs.jpg',
			tags: ['Electron', 'D3.js', 'Python'],
			date: '2024-01-15',
			client: 'CityTech Solutions',
			averageRating: 4.9,
			commentCount: 28,
			comments: []
		},
		{
			id: 22,
			title: 'Fashion Lookbook',
			description: 'Digital lookbook for fashion brand.',
			category: 'vitrine',
			appType: 'web',
			image: '/images/projects/reactjs.jpg',
			tags: ['Astro', 'Tailwind', 'Alpine.js'],
			date: '2024-02-08',
			client: 'Chic Boutique',
			averageRating: 4.8,
			commentCount: 39,
			comments: []
		},
		{
			id: 23,
			title: 'Furniture Store',
			description: 'Modern furniture e-commerce with 3D preview.',
			category: 'ecommerce',
			appType: 'web',
			image: '/images/projects/reactjs.jpg',
			tags: ['Medusa', 'Next.js', 'Three.js'],
			date: '2024-03-15',
			client: 'Modern Living',
			averageRating: 4.7,
			commentCount: 45,
			comments: []
		},
		{
			id: 24,
			title: 'Wine Cellar Manager',
			description: 'IoT temperature and humidity monitoring for wine storage.',
			category: 'iot',
			appType: 'mobile',
			image: '/images/projects/reactjs.jpg',
			tags: ['React Native', 'MQTT', 'Chart.js'],
			date: '2024-01-20',
			client: 'VinoTech',
			averageRating: 4.6,
			commentCount: 14,
			comments: []
		},
		{
			id: 25,
			title: 'Photography Portfolio',
			description: 'Visual portfolio for a professional photographer.',
			category: 'vitrine',
			appType: 'web',
			image: '/images/projects/reactjs.jpg',
			tags: ['Hugo', 'Sass', 'Lightbox'],
			date: '2024-02-28',
			client: 'Jane Doe Photography',
			averageRating: 4.9,
			commentCount: 51,
			comments: []
		}
	];

	// Generate comments for each project
	for (const project of allProjects) {
		project.comments = generateRandomComments(project.id, project.commentCount);
	}

	// Filter state
	let selectedCategory: ProjectCategory = $state('all');
	let selectedAppType: ProjectAppType = $state('all');
	let searchQuery: string = $state('');

	// Pagination state
	let currentPage = $state(1);
	const itemsPerPage = $state(15);

	// Derive filtered projects based on all filters + search
	let filteredProjects = $derived(() => {
		let results = allProjects.filter((project) => {
			const categoryMatch = selectedCategory === 'all' || project.category === selectedCategory;
			const appTypeMatch = selectedAppType === 'all' || project.appType === selectedAppType;
			return categoryMatch && appTypeMatch;
		});

		// Apply search filter if search query exists
		if (searchQuery.trim() !== '') {
			const query = searchQuery.toLowerCase().trim();
			results = results.filter((project) => {
				return (
					project.title.toLowerCase().includes(query) ||
					project.description.toLowerCase().includes(query) ||
					project.client.toLowerCase().includes(query) ||
					project.tags.some((tag) => tag.toLowerCase().includes(query))
				);
			});
		}

		return results;
	});

	// Reset to first page when filters or search change

	selectedCategory;
	selectedAppType;
	searchQuery;
	currentPage = 1;

	const totalPages = Math.ceil(filteredProjects().length / itemsPerPage);
	const paginatedProjects = filteredProjects().slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	// Render star rating
	function renderStars(rating: number): string {
		const fullStars = Math.floor(rating);
		const hasHalfStar = rating % 1 >= 0.5;
		const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
		return '★'.repeat(fullStars) + (hasHalfStar ? '½' : '') + '☆'.repeat(emptyStars);
	}

	// Share functionality
	async function shareProject(project: Project) {
		const shareUrl = `${window.location.origin}/projects/${project.id}`;
		const shareText = `Check out this project: ${project.title} - ${project.description}`;

		if (navigator.share) {
			try {
				await navigator.share({
					title: project.title,
					text: shareText,
					url: shareUrl
				});
			} catch (err) {
				console.log('Share cancelled or failed');
			}
		} else {
			await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
			alert('Link copied to clipboard!');
		}
	}

	// Send link to friend (email/social)
	function sendLinkToFriend(project: Project) {
		const shareUrl = `${window.location.origin}/projects/${project.id}`;
		const subject = `Check out this project: ${project.title}`;
		const body = `I thought you might be interested in this project:\n\n${project.title}\n${project.description}\nRating: ${project.averageRating}/5 ⭐\n\nView it here: ${shareUrl}`;
		window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
	}

	// Navigate to project details
	function goToProjectDetails(projectId: number) {
		goto(`/projects/${projectId}`);
	}

	// Clear search
	function clearSearch() {
		searchQuery = '';
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
					<Breadcrumb.Link href="/projects" class="font-semibold text-foreground"
						>Projects</Breadcrumb.Link
					>
				</Breadcrumb.Item>
			</Breadcrumb.List>
		</Breadcrumb.Root>
	</div>

	<!-- ========== HERO IMAGE - Full width 30vh ========== -->
	<div class="relative w-full" style="height: 30vh; min-height: 250px;">
		<img src={projectsHero} alt="Projects Hero" class="h-full w-full object-cover" />
		<div class="absolute inset-0 bg-black/40"></div>
		<div class="absolute inset-0 flex flex-col items-center justify-center text-white">
			<h1 class="text-4xl font-bold md:text-5xl lg:text-6xl">Our Projects</h1>
			<p class="mt-2 text-lg md:text-xl">Discover our latest work and success stories</p>
		</div>
	</div>

	<!-- ========== MAIN CONTENT ========== -->
	<div class="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
		<!-- ========== FILTERS SECTION ========== -->
		<div class="mb-8 space-y-6">
			<!-- Search Bar -->
			<div>
				<h3 class="mb-3 text-sm font-medium text-muted-foreground">Search Projects</h3>
				<div class="relative">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="18"
						height="18"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
					>
						<circle cx="10" cy="10" r="7" />
						<line x1="21" y1="21" x2="15" y2="15" />
					</svg>
					<Input.Root
						type="text"
						placeholder="Search by title, description, tags, or client..."
						bind:value={searchQuery}
						class="pr-24 pl-10"
					/>
					{#if searchQuery}
						<button
							onclick={clearSearch}
							class="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<line x1="18" y1="6" x2="6" y2="18" />
								<line x1="6" y1="6" x2="18" y2="18" />
							</svg>
						</button>
					{/if}
				</div>
			</div>

			<!-- Category Filter -->
			<div>
				<h3 class="mb-3 text-sm font-medium text-muted-foreground">Categories</h3>
				<div class="flex flex-wrap gap-2">
					<button
						onclick={() => (selectedCategory = 'all')}
						class="rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 {selectedCategory ===
						'all'
							? 'bg-indigo-600 text-white shadow-md'
							: 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'}"
					>
						All
					</button>
					<button
						onclick={() => (selectedCategory = 'ecommerce')}
						class="rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 {selectedCategory ===
						'ecommerce'
							? 'bg-indigo-600 text-white shadow-md'
							: 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'}"
					>
						E-commerce
					</button>
					<button
						onclick={() => (selectedCategory = 'iot')}
						class="rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 {selectedCategory ===
						'iot'
							? 'bg-indigo-600 text-white shadow-md'
							: 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'}"
					>
						IoT
					</button>
					<button
						onclick={() => (selectedCategory = 'vitrine')}
						class="rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 {selectedCategory ===
						'vitrine'
							? 'bg-indigo-600 text-white shadow-md'
							: 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'}"
					>
						Vitrine
					</button>
				</div>
			</div>

			<!-- Application Type Filter -->
			<div>
				<h3 class="mb-3 text-sm font-medium text-muted-foreground">Application Type</h3>
				<div class="flex flex-wrap gap-2">
					<button
						onclick={() => (selectedAppType = 'all')}
						class="rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 {selectedAppType ===
						'all'
							? 'bg-indigo-600 text-white shadow-md'
							: 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'}"
					>
						All
					</button>
					<button
						onclick={() => (selectedAppType = 'web')}
						class="rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 {selectedAppType ===
						'web'
							? 'bg-indigo-600 text-white shadow-md'
							: 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'}"
					>
						Web
					</button>
					<button
						onclick={() => (selectedAppType = 'mobile')}
						class="rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 {selectedAppType ===
						'mobile'
							? 'bg-indigo-600 text-white shadow-md'
							: 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'}"
					>
						Mobile
					</button>
					<button
						onclick={() => (selectedAppType = 'desktop')}
						class="rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 {selectedAppType ===
						'desktop'
							? 'bg-indigo-600 text-white shadow-md'
							: 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'}"
					>
						Desktop
					</button>
				</div>
			</div>

			<!-- Results count -->
			<div class="text-sm text-muted-foreground">
				Found {filteredProjects().length} project{filteredProjects().length !== 1 ? 's' : ''}
				{#if searchQuery}
					<span class="ml-2">
						for "<span class="font-medium">{searchQuery}</span>"
					</span>
				{/if}
			</div>
		</div>

		<!-- ========== PROJECTS GRID ========== -->
		<div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
			{#each paginatedProjects as project (project.id)}
				<Card.Root
					class="group flex cursor-pointer flex-col overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
				>
					<!-- Project Image -->
					<!-- svelte-ignore a11y_click_events_have_key_events -->
					<div class="relative h-48 overflow-hidden" onclick={() => goToProjectDetails(project.id)}>
						<img
							src={project.image}
							alt={project.title}
							class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
						/>
						<!-- Category Badge -->
						<div class="absolute top-3 left-3">
							<Badge class="capitalize">
								{project.category}
							</Badge>
						</div>
						<!-- App Type Badge -->
						<div class="absolute top-3 right-3">
							<Badge variant="secondary" class="capitalize">
								{project.appType}
							</Badge>
						</div>
					</div>

					<Card.Content class="flex-1 p-5">
						<div class="mb-2 flex items-start justify-between gap-2">
							<h3
								class="line-clamp-1 flex-1 text-xl font-bold group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
							>
								{project.title}
							</h3>
						</div>

						<!-- Rating Section -->
						<div class="mb-2 flex items-center gap-2">
							<div class="flex text-yellow-500">
								<span class="text-sm font-medium">{renderStars(project.averageRating)}</span>
							</div>
							<span class="text-sm font-semibold">{project.averageRating}</span>
							<span class="text-xs text-muted-foreground">({project.commentCount} reviews)</span>
						</div>

						<p class="line-clamp-2 text-sm text-muted-foreground">
							{project.description}
						</p>
						<div class="mt-3 flex flex-wrap gap-2">
							{#each project.tags.slice(0, 3) as tag}
								<span class="rounded bg-gray-100 px-2 py-0.5 text-xs dark:bg-gray-800">
									{tag}
								</span>
							{/each}
							{#if project.tags.length > 3}
								<span class="text-xs text-muted-foreground">+{project.tags.length - 3}</span>
							{/if}
						</div>
						<div class="mt-3 text-xs text-muted-foreground">
							Client: {project.client}
						</div>
					</Card.Content>

					<Card.Footer class="flex gap-2 p-5 pt-0">
						<Button.Root
							size="sm"
							variant="outline"
							onclick={() => shareProject(project)}
							class="flex-1"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="14"
								height="14"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								class="mr-1"
							>
								<path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
								<polyline points="16 6 12 2 8 6" />
								<line x1="12" y1="2" x2="12" y2="15" />
							</svg>
							Share
						</Button.Root>
						<Button.Root
							size="sm"
							variant="outline"
							onclick={() => sendLinkToFriend(project)}
							class="flex-1"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="14"
								height="14"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								class="mr-1"
							>
								<path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
							</svg>
							Send
						</Button.Root>
						<Button.Root
							size="sm"
							variant="default"
							onclick={() => goToProjectDetails(project.id)}
							class="flex-1"
						>
							View
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="14"
								height="14"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								class="ml-1"
							>
								<path d="M5 12h14M12 5l7 7-7 7" />
							</svg>
						</Button.Root>
					</Card.Footer>
				</Card.Root>
			{/each}
		</div>

		<!-- Empty state -->
		{#if paginatedProjects.length === 0}
			<div class="py-12 text-center">
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
					class="mx-auto mb-4 text-muted-foreground"
				>
					<circle cx="10" cy="10" r="7" />
					<line x1="21" y1="21" x2="15" y2="15" />
				</svg>
				<p class="text-muted-foreground">No projects found matching your criteria.</p>
				<Button.Root variant="outline" class="mt-4" onclick={clearSearch}>
					Clear all filters
				</Button.Root>
			</div>
		{/if}

		<!-- ========== PAGINATION ========== -->
		{#if totalPages > 1}
			<div class="mt-12 flex flex-wrap items-center justify-center gap-2">
				<Button.Root
					variant="outline"
					size="sm"
					disabled={currentPage === 1}
					onclick={() => currentPage--}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="mr-1"
					>
						<path d="M15 18l-6-6 6-6" />
					</svg>
					Previous
				</Button.Root>

				<!-- {#each Array(totalPages) as _, i}
					{const pageNum = i + 1}
					{#if pageNum === 1 || pageNum === totalPages || (pageNum >= currentPage - 2 && pageNum <= currentPage + 2)}
						<Button.Root
							variant={currentPage === pageNum ? 'default' : 'outline'}
							size="sm"
							onclick={() => (currentPage = pageNum)}	
							class="min-w-10"
						>
							{pageNum}
						</Button.Root>
					{:else if pageNum === currentPage - 3 || pageNum === currentPage + 3}
						<span class="px-2 text-muted-foreground">...</span>
					{/if}
				{/each} -->

				<Button.Root
					variant="outline"
					size="sm"
					disabled={currentPage === totalPages}
					onclick={() => currentPage++}
				>
					Next
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="ml-1"
					>
						<path d="M9 18l6-6-6-6" />
					</svg>
				</Button.Root>
			</div>

			<!-- Page info -->
			<div class="mt-4 text-center text-sm text-muted-foreground">
				Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(
					currentPage * itemsPerPage,
					filteredProjects().length
				)} of {filteredProjects().length} projects
			</div>
		{/if}
	</div>
</main>

<style>
	.line-clamp-1 {
		display: -webkit-box;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.min-w-10 {
		min-width: 40px;
	}
</style>
