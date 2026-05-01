<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Chart from '$lib/components/ui/chart/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import * as Badge from '$lib/components/ui/badge/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { BarChart, AreaChart } from 'layerchart';
	import { scaleBand } from 'd3-scale';
	import {
		TrendingUp,
		TrendingDown,
		Users,
		FolderKanban,
		CircleDollarSign,
		Activity,
		ArrowUpRight,
		MoreHorizontal
	} from 'lucide-svelte';

	// ── Stat cards ──────────────────────────────────────────────
	const stats = [
		{
			label: 'Total revenue',
			value: '$48,295',
			change: '+12.5%',
			up: true,
			icon: CircleDollarSign,
			color: 'text-emerald-500',
			bg: 'bg-emerald-500/10'
		},
		{
			label: 'Active users',
			value: '3,842',
			change: '+8.2%',
			up: true,
			icon: Users,
			color: 'text-blue-500',
			bg: 'bg-blue-500/10'
		},
		{
			label: 'Open projects',
			value: '24',
			change: '-2',
			up: false,
			icon: FolderKanban,
			color: 'text-violet-500',
			bg: 'bg-violet-500/10'
		},
		{
			label: 'System health',
			value: '99.9%',
			change: '+0.1%',
			up: true,
			icon: Activity,
			color: 'text-amber-500',
			bg: 'bg-amber-500/10'
		}
	];

	// ── Bar chart ────────────────────────────────────────────────
	const barData = [
		{ month: 'Jan', desktop: 186, mobile: 80 },
		{ month: 'Feb', desktop: 305, mobile: 200 },
		{ month: 'Mar', desktop: 237, mobile: 120 },
		{ month: 'Apr', desktop: 73, mobile: 190 },
		{ month: 'May', desktop: 209, mobile: 130 },
		{ month: 'Jun', desktop: 214, mobile: 140 }
	];

	const barConfig = {
		desktop: { label: 'Desktop', color: '#2563eb' },
		mobile: { label: 'Mobile', color: '#60a5fa' }
	} satisfies Chart.ChartConfig;

	// ── Area chart ───────────────────────────────────────────────
	const areaData = [
		{ month: 'Jan', revenue: 12400 },
		{ month: 'Feb', revenue: 18200 },
		{ month: 'Mar', revenue: 15800 },
		{ month: 'Apr', revenue: 22100 },
		{ month: 'May', revenue: 19300 },
		{ month: 'Jun', revenue: 28700 }
	];

	const areaConfig = {
		revenue: { label: 'Revenue', color: '#7c3aed' }
	} satisfies Chart.ChartConfig;

	// ── Recent activity ──────────────────────────────────────────
	const activity = [
		{
			user: 'Alice Martin',
			action: 'Created project',
			project: 'Arcadia v2',
			status: 'active',
			time: '2 min ago'
		},
		{
			user: 'Bob Dupont',
			action: 'Closed ticket',
			project: 'BMC Freelance',
			status: 'done',
			time: '14 min ago'
		},
		{
			user: 'Camille Rouge',
			action: 'Invited member',
			project: 'Arcadia v2',
			status: 'active',
			time: '1 hr ago'
		},
		{
			user: 'David Osei',
			action: 'Submitted report',
			project: 'Internal Tools',
			status: 'review',
			time: '3 hr ago'
		},
		{
			user: 'Eva Müller',
			action: 'Archived project',
			project: 'Legacy API',
			status: 'archived',
			time: 'Yesterday'
		}
	];

	const statusColor: Record<string, string> = {
		active: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
		done: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
		review: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
		archived: 'bg-muted text-muted-foreground'
	};

	function initials(name: string) {
		return name
			.split(' ')
			.map((n) => n[0])
			.join('')
			.slice(0, 2)
			.toUpperCase();
	}
</script>

<!-- ── Page ───────────────────────────────────────────────────── -->
<div class="space-y-6">
	<!-- Page heading -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="font-display text-2xl font-semibold tracking-tight">Dashboard</h1>
			<p class="mt-0.5 text-sm text-muted-foreground">
				Welcome back — here's what's happening today.
			</p>
		</div>
		<Button size="sm" class="gap-1.5">
			<ArrowUpRight class="h-4 w-4" />
			New project
		</Button>
	</div>

	<!-- ── Stat cards ── -->
	<div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
		{#each stats as stat}
			{@const Icon = stat.icon}
			<Card.Root class="border shadow-none">
				<Card.Content class="p-5">
					<div class="flex items-start justify-between">
						<div class="space-y-1">
							<p class="text-xs font-medium tracking-wide text-muted-foreground uppercase">
								{stat.label}
							</p>
							<p class="font-display text-2xl font-semibold">
								{stat.value}
							</p>
						</div>
						<div class="rounded-lg p-2 {stat.bg}">
							<Icon class="h-5 w-5 {stat.color}" />
						</div>
					</div>
					<div class="mt-3 flex items-center gap-1 text-xs">
						{#if stat.up}
							<TrendingUp class="h-3.5 w-3.5 text-emerald-500" />
							<span class="font-medium text-emerald-600 dark:text-emerald-400">{stat.change}</span>
						{:else}
							<TrendingDown class="h-3.5 w-3.5 text-red-500" />
							<span class="font-medium text-red-500">{stat.change}</span>
						{/if}
						<span class="text-muted-foreground">vs last month</span>
					</div>
				</Card.Content>
			</Card.Root>
		{/each}
	</div>

	<!-- ── Charts row ── -->
	<div class="grid gap-4 lg:grid-cols-5">
		<!-- Bar chart — spans 3 cols -->
		<Card.Root class="border shadow-none lg:col-span-3">
			<Card.Header class="pb-2">
				<div class="flex items-center justify-between">
					<div>
						<Card.Title class="font-display text-base font-semibold">Traffic overview</Card.Title>
						<Card.Description class="text-xs">Desktop vs mobile — last 6 months</Card.Description>
					</div>
					<Button variant="ghost" size="icon" class="h-8 w-8">
						<MoreHorizontal class="h-4 w-4" />
					</Button>
				</div>
			</Card.Header>
			<Card.Content>
				<Chart.Container config={barConfig} class="h-55 w-full">
					<BarChart
						data={barData}
						xScale={scaleBand().padding(0.25)}
						x="month"
						axis="x"
						seriesLayout="group"
						tooltipContext={false}
						series={[
							{ key: 'desktop', label: barConfig.desktop.label, color: barConfig.desktop.color },
							{ key: 'mobile', label: barConfig.mobile.label, color: barConfig.mobile.color }
						]}
					/>
				</Chart.Container>
				<!-- Legend -->
				<div class="mt-3 flex items-center gap-4">
					{#each Object.entries(barConfig) as [key, cfg]}
						<div class="flex items-center gap-1.5 text-xs text-muted-foreground">
							<span class="h-2.5 w-2.5 rounded-full" style="background:{cfg.color}"></span>
							{cfg.label}
						</div>
					{/each}
				</div>
			</Card.Content>
		</Card.Root>

		<!-- Area chart — spans 2 cols -->
		<Card.Root class="border shadow-none lg:col-span-2">
			<Card.Header class="pb-2">
				<Card.Title class="font-display text-base font-semibold">Revenue trend</Card.Title>
				<Card.Description class="text-xs">Monthly revenue — last 6 months</Card.Description>
			</Card.Header>
			<Card.Content>
				<Chart.Container config={areaConfig} class="h-55 w-full">
					<AreaChart
						data={areaData}
						x="month"
						axis="x"
						series={[
							{ key: 'revenue', label: areaConfig.revenue.label, color: areaConfig.revenue.color }
						]}
					/>
				</Chart.Container>
			</Card.Content>
		</Card.Root>
	</div>

	<!-- ── Recent activity table ── -->
	<Card.Root class="border shadow-none">
		<Card.Header class="pb-2">
			<div class="flex items-center justify-between">
				<div>
					<Card.Title class="font-display text-base font-semibold">Recent activity</Card.Title>
					<Card.Description class="text-xs">Latest actions across all projects</Card.Description>
				</div>
				<Button variant="outline" size="sm" class="text-xs">View all</Button>
			</div>
		</Card.Header>
		<Card.Content class="p-0">
			<Table.Root>
				<Table.Header>
					<Table.Row
						class="text-xs tracking-wide text-muted-foreground uppercase hover:bg-transparent"
					>
						<Table.Head class="pl-6 font-medium">User</Table.Head>
						<Table.Head class="font-medium">Action</Table.Head>
						<Table.Head class="font-medium">Project</Table.Head>
						<Table.Head class="font-medium">Status</Table.Head>
						<Table.Head class="pr-6 text-right font-medium">Time</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each activity as row}
						<Table.Row class="transition-colors hover:bg-muted/40">
							<Table.Cell class="pl-6">
								<div class="flex items-center gap-2.5">
									<div
										class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 font-display text-[10px] font-semibold text-primary"
									>
										{initials(row.user)}
									</div>
									<span class="text-sm font-medium">{row.user}</span>
								</div>
							</Table.Cell>
							<Table.Cell class="text-sm text-muted-foreground">{row.action}</Table.Cell>
							<Table.Cell class="text-sm">{row.project}</Table.Cell>
							<Table.Cell>
								<span
									class="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium capitalize {statusColor[
										row.status
									]}"
								>
									{row.status}
								</span>
							</Table.Cell>
							<Table.Cell class="pr-6 text-right text-xs text-muted-foreground"
								>{row.time}</Table.Cell
							>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		</Card.Content>
	</Card.Root>
</div>
