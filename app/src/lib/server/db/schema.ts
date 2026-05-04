import {
	pgTable,
	text,
	integer,
	serial,
	timestamp,
	real,
	primaryKey,
	date,
	pgEnum,
	decimal,
	unique
} from 'drizzle-orm/pg-core';

import { user } from './auth.schema';

// ─── Enums ───────────────────────────────────────────────────────────────────

export const workStatusEnum = pgEnum('work_status', [
	'open',
	'pending',
	'in_progress',
	'cancelled',
	'completed'
]);

export const payStatusEnum = pgEnum('pay_status', ['paid', 'not_paid', 'partially']);

export const methodPayEnum = pgEnum('pay_method', [
	'bank_check',
	'bank_transfer',
	'payment_card',
	'paypal',
	'stripe',
	'payoneer'
]);

// ✅ Defined once, reused across tickets, commercialDemands, campaigns
export const statusEnum = pgEnum('status', ['open', 'in_progress', 'closed']);

// ─── Works ───────────────────────────────────────────────────────────────────

export const works = pgTable('task', {
	id: serial('id').primaryKey(),
	title: text('title').notNull(),
	description: text('description'),
	startDate: date('start_date').defaultNow(),
	endDate: date('end_date'),
	payStatus: payStatusEnum('pay_status'),
	price: decimal('price', { precision: 10, scale: 3 }),
	workStatus: workStatusEnum('work_status'),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull()
});

export const worksPayment = pgTable('works_payment', {
	id: serial('id').primaryKey(),
	title: text('title').notNull(),
	description: text('description'),
	payDate: date('pay_date').defaultNow(),
	nextPayDate: date('next_pay_date').defaultNow(),
	amountReceived: decimal('amount_received', { precision: 10, scale: 3 }),
	remainingAmount: decimal('remaining_amount', { precision: 10, scale: 3 }),
	methodPay: methodPayEnum('method_pay'),
	file: text('file'),
	workId: integer('work_id')
		.notNull()
		.references(() => works.id, { onDelete: 'cascade' }),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull()
});

export const worksPapers = pgTable('works_papers', {
	id: serial('id').primaryKey(),
	title: text('title').notNull(),
	description: text('description'),
	file: text('file'),
	workId: integer('work_id')
		.notNull()
		.references(() => works.id, { onDelete: 'cascade' }),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull()
});

export const worksProgression = pgTable('works_progression', {
	id: serial('id').primaryKey(),
	title: text('title').notNull(),
	description: text('description'),
	startDate: date('start_date').defaultNow(),
	endDate: date('end_date').defaultNow(),
	workId: integer('work_id')
		.notNull()
		.references(() => works.id, { onDelete: 'cascade' }),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull()
});

// ─── Projects ─────────────────────────────────────────────────────────────────

export const projects = pgTable('projects', {
	id: serial('id').primaryKey(),
	slug: text('slug').notNull().unique(),
	images: text('images').array(),
	videoUrl: text('video_url'),
	url: text('url'),
	tags: text('tags').array(),
	price: real('price'),
	sells: integer('sells').default(0),
	avgRating: real('avg_rating').default(0),
	ratingCount: integer('rating_count').default(0),
	createdAt: timestamp('created_at').defaultNow()
});

export const projectTranslations = pgTable(
	'project_translations',
	{
		id: serial('id').primaryKey(),
		projectId: integer('project_id')
			.notNull()
			.references(() => projects.id, { onDelete: 'cascade' }),
		locale: text('locale').notNull(),
		title: text('title').notNull(),
		description: text('description').notNull(),
		content: text('content')
	},
	(t) => ({
		uniq: unique().on(t.projectId, t.locale)
	})
);

export const categories = pgTable('categories', {
	id: serial('id').primaryKey(),
	slug: text('slug').notNull().unique(),
	createdAt: timestamp('created_at').defaultNow()
});

export const categoryTranslations = pgTable(
	'category_translations',
	{
		id: serial('id').primaryKey(),
		categoryId: integer('category_id')
			.notNull()
			.references(() => categories.id, { onDelete: 'cascade' }),
		locale: text('locale').notNull(),
		name: text('name').notNull(),
		description: text('description')
	},
	(t) => ({
		uniq: unique().on(t.categoryId, t.locale)
	})
);

export const projectCategories = pgTable(
	'project_categories',
	{
		projectId: integer('project_id')
			.notNull()
			.references(() => projects.id, { onDelete: 'cascade' }),
		categoryId: integer('category_id')
			.notNull()
			.references(() => categories.id, { onDelete: 'cascade' })
	},
	(t) => ({
		pk: primaryKey({ columns: [t.projectId, t.categoryId] })
	})
);

export const reviews = pgTable('reviews', {
	id: serial('id').primaryKey(),
	projectId: integer('project_id')
		.notNull()
		.references(() => projects.id, { onDelete: 'cascade' }),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	content: text('content').notNull(),
	rating: integer('rating'),
	publish: integer('publish').default(0),
	createdAt: timestamp('created_at').defaultNow()
});

// ─── Tickets ──────────────────────────────────────────────────────────────────

export const tickets = pgTable('tickets', {
	id: serial('id').primaryKey(),
	title: text('title').notNull(),
	description: text('description'),
	status: statusEnum('status').default('open'), // ✅ reusing statusEnum
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull()
});

export const ticketComments = pgTable('ticket_comments', {
	id: serial('id').primaryKey(),
	ticketId: integer('ticket_id')
		.notNull()
		.references(() => tickets.id, { onDelete: 'cascade' }),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	file: text('file'),
	content: text('content').notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull()
});

// ─── Commercial Demands ───────────────────────────────────────────────────────

export const commercialDemands = pgTable('commercial_demands', {
	id: serial('id').primaryKey(),
	title: text('title').notNull(),
	description: text('description'),
	status: statusEnum('status').default('open'), // ✅ reusing statusEnum
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull()
});

export const commercialDemandComments = pgTable('commercial_demand_comments', {
	id: serial('id').primaryKey(),
	commercialDemandId: integer('commercial_demand_id')
		.notNull()
		.references(() => commercialDemands.id, { onDelete: 'cascade' }),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	content: text('content').notNull(),
	file: text('file'),
	createdAt: timestamp('created_at').defaultNow().notNull()
});

// ─── Campaigns ────────────────────────────────────────────────────────────────

export const campaigns = pgTable('campaigns', {
	id: serial('id').primaryKey(),
	title: text('title').notNull(),
	description: text('description'),
	status: statusEnum('status').default('open'),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	projectId: integer('project_id')
		.notNull()
		.references(() => projects.id, { onDelete: 'cascade' }),
	socialMedia: text('social_media').array(),
	lead: text('lead'),
	leadCount: integer('lead_count').default(0),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull()
});

export const campaignComments = pgTable('campaign_comments', {
	id: serial('id').primaryKey(),
	campaignId: integer('campaign_id')
		.notNull()
		.references(() => campaigns.id, { onDelete: 'cascade' }),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	content: text('content').notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull()
});

export * from './auth.schema';
