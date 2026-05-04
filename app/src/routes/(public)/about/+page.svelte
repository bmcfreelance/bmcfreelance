<script lang="ts">
	import { setLocale, getLocale } from '$lib/paraglide/runtime';
	import { m } from '$lib/paraglide/messages.js';
	import { page } from '$app/state';
	import { locales, localizeHref } from '$lib/paraglide/runtime';

	import { onMount } from 'svelte';

	let scrollY = $state(0);

	const stats = [
		{ value: '50+', label: 'Projects Delivered' },
		{ value: '98%', label: 'Client Satisfaction' },
		{ value: '5+', label: 'Years Experience' },
		{ value: '20+', label: 'Happy Clients' }
	];

	const services = [
		{
			icon: '⬡',
			title: 'Web Development',
			desc: 'Full-stack apps with SvelteKit, Next.js, and modern stacks.',
			color: '#a78bfa'
		},
		{
			icon: '◈',
			title: 'UI/UX Design',
			desc: 'Pixel-perfect interfaces that convert and delight users.',
			color: '#34d399'
		},
		{
			icon: '◉',
			title: 'API Integration',
			desc: 'Seamless third-party integrations and custom REST/GraphQL APIs.',
			color: '#fb923c'
		},
		{
			icon: '⬟',
			title: 'Consulting',
			desc: 'Architecture reviews, code audits, and technical strategy.',
			color: '#f472b6'
		}
	];

	const timeline = [
		{
			year: '2019',
			role: 'Junior Developer',
			company: 'StartupHub Tunis',
			desc: 'Built SaaS dashboards and onboarded 10k+ users.'
		},
		{
			year: '2021',
			role: 'Full-Stack Engineer',
			company: 'AgencePro',
			desc: 'Led frontend architecture for 3 enterprise clients.'
		},
		{
			year: '2022',
			role: 'Freelance Contractor',
			company: 'Remote — EU & MENA',
			desc: 'Delivered 20+ projects across e-commerce, fintech, and edtech.'
		},
		{
			year: '2024',
			role: 'BMCFreelance',
			company: 'Independent Studio',
			desc: 'Launched personal brand — design-driven, code-first freelancing.'
		}
	];

	const values = [
		{
			letter: 'B',
			word: 'Bold',
			desc: 'Every project is treated as a portfolio piece — no half measures.'
		},
		{
			letter: 'M',
			word: 'Meticulous',
			desc: 'Pixel-perfect craft. Scalable code. Obsessive attention to detail.'
		},
		{
			letter: 'C',
			word: 'Client-First',
			desc: 'Transparent communication, on-time delivery, zero surprises.'
		}
	];

	const wins = [
		{
			emoji: '🚀',
			title: 'E-Commerce Platform',
			kpi: '+340% conversion rate',
			detail: 'Rebuilt checkout flow for a fashion brand, cutting drop-off by half.'
		},
		{
			emoji: '📊',
			title: 'Analytics Dashboard',
			kpi: '2× faster insights',
			detail: 'Real-time data viz dashboard for a logistics startup, 50k events/day.'
		},
		{
			emoji: '🎓',
			title: 'EdTech SaaS',
			kpi: '12k active learners',
			detail: 'Multi-tenant LMS with video, quizzes & certificates.'
		},
		{
			emoji: '🏦',
			title: 'Fintech API Gateway',
			kpi: '99.9% uptime SLA',
			detail: 'Secure payment integration across 5 African markets.'
		}
	];

	onMount(() => {
		const observer = new IntersectionObserver(
			(entries) =>
				entries.forEach((e) => {
					if (e.isIntersecting) e.target.classList.add('in-view');
				}),
			{ threshold: 0.12 }
		);
		document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
		return () => observer.disconnect();
	});
</script>

<svelte:window bind:scrollY />

<div class="page-root">
	<div class="orb orb-1"></div>
	<div class="orb orb-2"></div>
	<div class="orb orb-3"></div>

	<!-- Hero -->
	<div class="hero">
		<div>
			<p class="hero-label">// about bmc freelance</p>
			<h1 class="hero-title">
				I build things<br />
				that <span>matter</span><br />
				on the web.
			</h1>
			<p class="hero-body">
				Full-stack developer & designer based in Tunis. I craft fast, beautiful digital products for
				ambitious startups and growing businesses across Europe and MENA.
			</p>
			<div class="hero-actions">
				<button class="btn-primary">View My Work</button>
				<button class="btn-ghost">Download CV ↓</button>
			</div>
		</div>

		<div class="hero-visual">
			<div class="avatar-card">
				<div class="avatar-frame">
					<div class="avatar-placeholder">
						<div class="avatar-initials">BMC</div>
						<div>
							<div class="avatar-name">BMC Freelance</div>
							<div class="avatar-tag">FULL-STACK · UI/UX · SVELTE</div>
						</div>
					</div>
				</div>
				<div class="card-badge badge-tl">✓ Available for projects<span>Status</span></div>
				<div class="card-badge badge-br">SvelteKit · Figma<span>Current stack</span></div>
				<div class="card-badge badge-mid">🇹🇳 Tunis<span>Based in</span></div>
			</div>
		</div>
	</div>

	<!-- Stats -->
	<div class="stats-wrap">
		<div class="stats-bar reveal">
			{#each stats as s, i}
				<div class="stat-item reveal d{i + 1}">
					<div class="stat-value">{s.value}</div>
					<div class="stat-label">{s.label}</div>
				</div>
			{/each}
		</div>
	</div>

	<!-- Services -->
	<section id="services">
		<div class="section-wrap">
			<p class="section-label reveal">// what i do</p>
			<h2 class="section-title reveal d1">Services that <em>ship</em>.</h2>
			<p class="section-sub reveal d2">
				End-to-end product development — from wireframe to deployment. I work lean, move fast, and
				don't cut corners.
			</p>
			<div class="services-grid">
				{#each services as svc, i}
					<div class="service-card reveal d{(i % 2) + 1}">
						<span class="service-icon" style="color: {svc.color}">{svc.icon}</span>
						<div class="service-title">{svc.title}</div>
						<div class="service-desc">{svc.desc}</div>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Resume -->
	<section
		id="resume"
		style="background: rgba(255,255,255,0.01); border-top: 1px solid rgba(255,255,255,0.04); border-bottom: 1px solid rgba(255,255,255,0.04);"
	>
		<div class="section-wrap">
			<div class="resume-grid">
				<div>
					<p class="section-label reveal">// resume</p>
					<h2 class="section-title reveal d1">The journey<br /><em>so far.</em></h2>
					<p class="section-sub reveal d2" style="margin-bottom: 2rem;">
						5 years building software across agencies, startups, and now independently under
						BMCFreelance.
					</p>
					<div class="timeline reveal d3">
						{#each timeline as t}
							<div class="timeline-item">
								<div class="tl-year">{t.year}</div>
								<div class="tl-role">{t.role}</div>
								<div class="tl-company">{t.company}</div>
								<div class="tl-desc">{t.desc}</div>
							</div>
						{/each}
					</div>
				</div>
				<div>
					<p class="section-label reveal" style="margin-top: 3.5rem;">// tech stack</p>
					<div class="tech-panel reveal d1">
						<div class="tech-label">Frontend</div>
						<div class="tech-chips">
							{#each ['SvelteKit', 'React', 'Next.js', 'TypeScript', 'Tailwind', 'Framer Motion'] as t}
								<span class="tech-chip">{t}</span>
							{/each}
						</div>
						<div class="tech-label">Backend</div>
						<div class="tech-chips">
							{#each ['Node.js', 'Hono', 'PostgreSQL', 'Drizzle ORM', 'Redis', 'Supabase'] as t}
								<span class="tech-chip">{t}</span>
							{/each}
						</div>
						<div class="tech-label">Tools & Cloud</div>
						<div class="tech-chips" style="margin-bottom: 0">
							{#each ['Vercel', 'Cloudflare', 'Docker', 'GitHub Actions', 'Figma', 'Linear'] as t}
								<span class="tech-chip">{t}</span>
							{/each}
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Values -->
	<section id="values">
		<div class="section-wrap">
			<div class="values-wrap">
				<div>
					<p class="section-label reveal">// values</p>
					<h2 class="section-title reveal d1">Why clients<br /><em>return.</em></h2>
					<p class="section-sub reveal d2">
						Three principles that define every engagement — not just the code, but the relationship.
					</p>
					<div class="values-list">
						{#each values as v, i}
							<div class="value-item reveal d{i + 1}">
								<div class="value-letter">{v.letter}</div>
								<div>
									<div class="value-word">{v.word}</div>
									<div class="value-desc">{v.desc}</div>
								</div>
							</div>
						{/each}
					</div>
				</div>
				<div class="testimonial reveal d2">
					<p class="t-quote">
						"Working with BMC was the smoothest dev experience we've had. They shipped on time,
						asked the right questions, and the product looked incredible."
					</p>
					<div class="t-author">
						<div class="t-avatar">SA</div>
						<div>
							<div class="t-name">Sara A.</div>
							<div class="t-role">CPO, Fintech Startup · Berlin</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Wins -->
	<section id="wins" class="wins-bg">
		<div class="section-wrap">
			<p class="section-label reveal">// selected wins</p>
			<h2 class="section-title reveal d1">Results that<br /><em>prove it.</em></h2>
			<p class="section-sub reveal d2">
				Real numbers from real projects. Here's a taste of what shipping with intention looks like.
			</p>
			<div class="wins-grid">
				{#each wins as w, i}
					<div class="win-card reveal d{(i % 2) + 1}">
						<div class="win-emoji">{w.emoji}</div>
						<div class="win-title">{w.title}</div>
						<div class="win-kpi">↑ {w.kpi}</div>
						<div class="win-detail">{w.detail}</div>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- CTA -->
	<section class="cta-outer">
		<div class="cta-glow"></div>
		<div class="cta-inner reveal">
			<p class="section-label" style="text-align: center;">// let's work together</p>
			<h2 class="cta-title">Ready to build<br /><em>something great?</em></h2>
			<p class="cta-sub">
				I'm currently accepting new projects for Q3 2025. Let's talk about what you're building.
			</p>
			<button class="btn-primary" style="font-size: 1rem; padding: 1rem 2.5rem;"
				>Start a Project →</button
			>
			<a href="mailto:hello@bmcfreelance.dev" class="cta-email">hello@bmcfreelance.dev</a>
		</div>
	</section>
</div>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,600;1,9..144,400&family=DM+Mono:wght@400;500&family=Outfit:wght@300;400;500;700&display=swap');

	.page-root {
		font-family: 'Outfit', sans-serif;
		color: #e8e6f0;
		overflow-x: hidden;
		position: relative;
	}

	.orb {
		position: fixed;
		border-radius: 50%;
		filter: blur(120px);
		pointer-events: none;
		z-index: 0;
		opacity: 0.15;
	}
	.orb-1 {
		width: 700px;
		height: 700px;
		background: #7c3aed;
		top: -200px;
		left: -200px;
	}
	.orb-2 {
		width: 500px;
		height: 500px;
		background: #059669;
		top: 30vh;
		right: -150px;
	}
	.orb-3 {
		width: 400px;
		height: 400px;
		background: #9333ea;
		bottom: 10vh;
		left: 20%;
	}

	/* Hero */
	.hero {
		min-height: 90vh;
		display: grid;
		grid-template-columns: 1fr 1fr;
		align-items: center;
		gap: 4rem;
		padding: 5rem 5vw;
		max-width: 1300px;
		margin: 0 auto;
		position: relative;
		z-index: 1;
	}
	.hero-label {
		font-family: 'DM Mono', monospace;
		font-size: 0.75rem;
		color: #a78bfa;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		margin-bottom: 1.5rem;
		opacity: 0;
		transform: translateY(20px);
		animation: fadeUp 0.6s 0.2s forwards;
	}
	.hero-title {
		font-family: 'Fraunces', serif;
		font-size: clamp(2.8rem, 5vw, 4.5rem);
		font-weight: 600;
		line-height: 1.08;
		margin-bottom: 1.5rem;
		opacity: 0;
		transform: translateY(30px);
		animation: fadeUp 0.8s 0.4s forwards;
	}
	.hero-title span {
		color: #a78bfa;
		font-style: italic;
		font-weight: 300;
	}
	.hero-body {
		font-size: 1.05rem;
		color: #9ca3af;
		line-height: 1.8;
		max-width: 480px;
		margin-bottom: 2.5rem;
		opacity: 0;
		transform: translateY(20px);
		animation: fadeUp 0.8s 0.6s forwards;
	}
	.hero-actions {
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
		opacity: 0;
		transform: translateY(20px);
		animation: fadeUp 0.8s 0.8s forwards;
	}
	.btn-primary {
		padding: 0.85rem 2rem;
		background: #a78bfa;
		color: #09090f;
		border: none;
		border-radius: 100px;
		font-size: 0.9rem;
		font-family: 'Outfit', sans-serif;
		font-weight: 500;
		cursor: pointer;
		transition:
			transform 0.15s,
			box-shadow 0.15s;
	}
	.btn-primary:hover {
		transform: translateY(-2px);
		box-shadow: 0 12px 40px rgba(167, 139, 250, 0.35);
	}
	.btn-ghost {
		padding: 0.85rem 2rem;
		background: transparent;
		color: #e8e6f0;
		border: 1px solid rgba(255, 255, 255, 0.12);
		border-radius: 100px;
		font-size: 0.9rem;
		font-family: 'Outfit', sans-serif;
		cursor: pointer;
		transition:
			border-color 0.2s,
			background 0.2s;
	}
	.btn-ghost:hover {
		border-color: rgba(255, 255, 255, 0.3);
		background: rgba(255, 255, 255, 0.04);
	}

	/* Avatar */
	.hero-visual {
		display: flex;
		justify-content: center;
		align-items: center;
		opacity: 0;
		animation: fadeIn 1s 0.5s forwards;
	}
	.avatar-card {
		position: relative;
		width: 340px;
		height: 430px;
		animation: float 5s ease-in-out infinite;
	}
	.avatar-frame {
		width: 100%;
		height: 100%;
		border-radius: 24px;
		background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
		border: 1px solid rgba(167, 139, 250, 0.2);
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.avatar-placeholder {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
	}
	.avatar-initials {
		width: 110px;
		height: 110px;
		border-radius: 50%;
		background: linear-gradient(135deg, #a78bfa, #7c3aed);
		display: flex;
		align-items: center;
		justify-content: center;
		font-family: 'Fraunces', serif;
		font-size: 2.4rem;
		font-weight: 600;
		color: white;
	}
	.avatar-name {
		font-family: 'Fraunces', serif;
		font-size: 1.3rem;
		font-weight: 600;
		color: #e8e6f0;
		text-align: center;
	}
	.avatar-tag {
		font-family: 'DM Mono', monospace;
		font-size: 0.65rem;
		color: #a78bfa;
		letter-spacing: 0.15em;
		margin-top: 0.25rem;
		text-align: center;
	}
	.card-badge {
		position: absolute;
		background: rgba(9, 9, 15, 0.85);
		backdrop-filter: blur(12px);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 12px;
		padding: 0.55rem 0.9rem;
		font-size: 0.76rem;
		white-space: nowrap;
	}
	.card-badge span {
		display: block;
		font-size: 0.6rem;
		color: #6b7280;
		font-family: 'DM Mono', monospace;
	}
	.badge-tl {
		top: -14px;
		left: -22px;
		color: #34d399;
	}
	.badge-br {
		bottom: -14px;
		right: -22px;
		color: #fb923c;
	}
	.badge-mid {
		top: 50%;
		right: -32px;
		transform: translateY(-50%);
		color: #f472b6;
	}

	/* Stats */
	.stats-wrap {
		padding: 0 5vw 5rem;
		position: relative;
		z-index: 1;
	}
	.stats-bar {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		max-width: 1100px;
		margin: 0 auto;
		border: 1px solid rgba(255, 255, 255, 0.07);
		border-radius: 20px;
		overflow: hidden;
	}
	.stat-item {
		padding: 2rem;
		text-align: center;
		border-right: 1px solid rgba(255, 255, 255, 0.07);
		background: rgba(255, 255, 255, 0.02);
		transition: background 0.2s;
	}
	.stat-item:last-child {
		border-right: none;
	}
	.stat-item:hover {
		background: rgba(167, 139, 250, 0.05);
	}
	.stat-value {
		font-family: 'Fraunces', serif;
		font-size: 2.6rem;
		font-weight: 600;
		color: #a78bfa;
		line-height: 1;
		margin-bottom: 0.4rem;
	}
	.stat-label {
		font-size: 0.78rem;
		color: #6b7280;
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}

	/* Sections */
	section {
		position: relative;
		z-index: 1;
	}
	.section-wrap {
		max-width: 1200px;
		margin: 0 auto;
		padding: 5rem 5vw;
	}
	.section-label {
		font-family: 'DM Mono', monospace;
		font-size: 0.72rem;
		color: #a78bfa;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		margin-bottom: 0.8rem;
	}
	.section-title {
		font-family: 'Fraunces', serif;
		font-size: clamp(2rem, 3.5vw, 3rem);
		font-weight: 600;
		line-height: 1.1;
		margin-bottom: 1rem;
	}
	.section-title em {
		font-style: italic;
		font-weight: 300;
		color: #a78bfa;
	}
	.section-sub {
		font-size: 1rem;
		color: #6b7280;
		max-width: 520px;
		line-height: 1.7;
		margin-bottom: 3.5rem;
	}

	/* Services */
	.services-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1.2rem;
	}
	.service-card {
		background: rgba(255, 255, 255, 0.025);
		border: 1px solid rgba(255, 255, 255, 0.07);
		border-radius: 20px;
		padding: 2rem;
		transition:
			transform 0.2s,
			border-color 0.2s,
			background 0.2s;
	}
	.service-card:hover {
		transform: translateY(-4px);
		border-color: rgba(167, 139, 250, 0.3);
		background: rgba(167, 139, 250, 0.04);
	}
	.service-icon {
		font-size: 1.8rem;
		margin-bottom: 1rem;
		display: block;
		line-height: 1;
	}
	.service-title {
		font-family: 'Fraunces', serif;
		font-size: 1.2rem;
		font-weight: 600;
		margin-bottom: 0.6rem;
		color: #e8e6f0;
	}
	.service-desc {
		font-size: 0.9rem;
		color: #6b7280;
		line-height: 1.6;
	}

	/* Timeline */
	.resume-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 5rem;
		align-items: start;
	}
	.timeline {
		position: relative;
		padding-left: 2rem;
	}
	.timeline::before {
		content: '';
		position: absolute;
		left: 0;
		top: 0;
		bottom: 0;
		width: 1px;
		background: linear-gradient(to bottom, transparent, #a78bfa 20%, #a78bfa 80%, transparent);
		opacity: 0.3;
	}
	.timeline-item {
		position: relative;
		padding: 0 0 2.5rem 2rem;
	}
	.timeline-item::before {
		content: '';
		position: absolute;
		left: -4.5px;
		top: 6px;
		width: 9px;
		height: 9px;
		border-radius: 50%;
		background: #a78bfa;
		box-shadow: 0 0 12px rgba(167, 139, 250, 0.5);
	}
	.tl-year {
		font-family: 'DM Mono', monospace;
		font-size: 0.7rem;
		color: #a78bfa;
		letter-spacing: 0.1em;
		margin-bottom: 0.2rem;
	}
	.tl-role {
		font-family: 'Fraunces', serif;
		font-size: 1.1rem;
		font-weight: 600;
		color: #e8e6f0;
	}
	.tl-company {
		font-size: 0.82rem;
		color: #6b7280;
		margin-bottom: 0.4rem;
	}
	.tl-desc {
		font-size: 0.88rem;
		color: #9ca3af;
		line-height: 1.6;
	}

	/* Tech */
	.tech-panel {
		background: rgba(255, 255, 255, 0.025);
		border: 1px solid rgba(255, 255, 255, 0.07);
		border-radius: 20px;
		padding: 2rem;
	}
	.tech-label {
		font-family: 'DM Mono', monospace;
		font-size: 0.68rem;
		color: #4b5563;
		letter-spacing: 0.15em;
		text-transform: uppercase;
		margin-bottom: 1rem;
	}
	.tech-chips {
		display: flex;
		flex-wrap: wrap;
		gap: 0.6rem;
		margin-bottom: 1.5rem;
	}
	.tech-chip {
		font-size: 0.78rem;
		padding: 0.35rem 0.9rem;
		background: rgba(167, 139, 250, 0.1);
		border: 1px solid rgba(167, 139, 250, 0.2);
		border-radius: 100px;
		color: #c4b5fd;
		font-family: 'DM Mono', monospace;
	}

	/* Values */
	.values-wrap {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 4rem;
		align-items: start;
	}
	.values-list {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}
	.value-item {
		display: flex;
		gap: 1.5rem;
		align-items: flex-start;
	}
	.value-letter {
		font-family: 'Fraunces', serif;
		font-size: 3.5rem;
		font-weight: 600;
		color: #a78bfa;
		line-height: 1;
		flex-shrink: 0;
		width: 48px;
		opacity: 0.35;
	}
	.value-word {
		font-family: 'Fraunces', serif;
		font-size: 1.3rem;
		font-weight: 600;
		margin-bottom: 0.3rem;
		color: #e8e6f0;
	}
	.value-desc {
		font-size: 0.9rem;
		color: #6b7280;
		line-height: 1.6;
	}
	.testimonial {
		background: rgba(167, 139, 250, 0.06);
		border: 1px solid rgba(167, 139, 250, 0.15);
		border-radius: 20px;
		padding: 2.5rem;
		margin-top: 5rem;
	}
	.t-quote {
		font-family: 'Fraunces', serif;
		font-size: 1.3rem;
		font-style: italic;
		line-height: 1.7;
		color: #c4b5fd;
		margin-bottom: 1.5rem;
	}
	.t-author {
		display: flex;
		align-items: center;
		gap: 0.8rem;
	}
	.t-avatar {
		width: 38px;
		height: 38px;
		border-radius: 50%;
		background: linear-gradient(135deg, #059669, #34d399);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 0.8rem;
		font-weight: 600;
		color: white;
		flex-shrink: 0;
	}
	.t-name {
		font-size: 0.88rem;
		font-weight: 500;
		color: #e8e6f0;
	}
	.t-role {
		font-size: 0.75rem;
		color: #6b7280;
		font-family: 'DM Mono', monospace;
	}

	/* Wins */
	.wins-bg {
		background: linear-gradient(180deg, #09090f 0%, #0d0d1c 50%, #09090f 100%);
		border-top: 1px solid rgba(255, 255, 255, 0.04);
		border-bottom: 1px solid rgba(255, 255, 255, 0.04);
	}
	.wins-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1.2rem;
	}
	.win-card {
		background: rgba(255, 255, 255, 0.025);
		border: 1px solid rgba(255, 255, 255, 0.07);
		border-radius: 20px;
		padding: 1.8rem;
		position: relative;
		overflow: hidden;
		transition:
			transform 0.25s,
			border-color 0.25s;
	}
	.win-card::before {
		content: '';
		position: absolute;
		inset: 0;
		background: radial-gradient(circle at 0% 0%, rgba(167, 139, 250, 0.08) 0%, transparent 60%);
		opacity: 0;
		transition: opacity 0.3s;
	}
	.win-card:hover {
		transform: translateY(-5px);
		border-color: rgba(167, 139, 250, 0.25);
	}
	.win-card:hover::before {
		opacity: 1;
	}
	.win-emoji {
		font-size: 1.6rem;
		margin-bottom: 1rem;
	}
	.win-title {
		font-family: 'Fraunces', serif;
		font-size: 1.1rem;
		font-weight: 600;
		color: #e8e6f0;
		margin-bottom: 0.5rem;
	}
	.win-kpi {
		font-family: 'DM Mono', monospace;
		font-size: 0.78rem;
		color: #34d399;
		margin-bottom: 0.6rem;
		letter-spacing: 0.05em;
	}
	.win-detail {
		font-size: 0.87rem;
		color: #6b7280;
		line-height: 1.6;
	}

	/* CTA */
	.cta-outer {
		position: relative;
		overflow: hidden;
	}
	.cta-glow {
		position: absolute;
		width: 600px;
		height: 400px;
		background: radial-gradient(ellipse, rgba(167, 139, 250, 0.12) 0%, transparent 70%);
		left: 50%;
		transform: translateX(-50%);
		pointer-events: none;
	}
	.cta-inner {
		text-align: center;
		padding: 7rem 5vw;
		max-width: 800px;
		margin: 0 auto;
		position: relative;
		z-index: 1;
	}
	.cta-title {
		font-family: 'Fraunces', serif;
		font-size: clamp(2.5rem, 5vw, 4rem);
		font-weight: 600;
		line-height: 1.1;
		margin-bottom: 1.2rem;
	}
	.cta-sub {
		font-size: 1rem;
		color: #6b7280;
		margin-bottom: 2.5rem;
	}
	.cta-email {
		font-family: 'DM Mono', monospace;
		font-size: 0.95rem;
		color: #a78bfa;
		margin-top: 1.5rem;
		display: block;
		text-decoration: none;
	}
	.cta-email:hover {
		text-decoration: underline;
	}

	/* Reveal */
	.reveal {
		opacity: 0;
		transform: translateY(32px);
		transition:
			opacity 0.7s ease,
			transform 0.7s ease;
	}
	.reveal.in-view {
		opacity: 1;
		transform: translateY(0);
	}
	.d1 {
		transition-delay: 0.1s;
	}
	.d2 {
		transition-delay: 0.2s;
	}
	.d3 {
		transition-delay: 0.3s;
	}
	.d4 {
		transition-delay: 0.4s;
	}

	@keyframes fadeUp {
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	@keyframes fadeIn {
		to {
			opacity: 1;
		}
	}
	@keyframes float {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-14px);
		}
	}
</style>
