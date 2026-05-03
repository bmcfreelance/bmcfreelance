import {
	pgTable,
	text,
	integer,
	serial,
	timestamp,
	unique,
	real,
	primaryKey
} from 'drizzle-orm/pg-core';

import { user } from './auth.schema';

export const task = pgTable('task', {
	id: serial('id').primaryKey(),
	title: text('title').notNull(),
	priority: integer('priority').notNull().default(1)
});

// src/lib/server/schema.ts

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
		locale: text('locale').notNull(), // 'en' | 'fr'
		title: text('title').notNull(),
		description: text('description').notNull(),
		content: text('content')
	},
	(t) => ({
		uniq: unique().on(t.projectId, t.locale) // one row per project per language
	})
);

// src/lib/server/db/schema.ts

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
		locale: text('locale').notNull(), // 'en' | 'fr'
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

export const comments = pgTable('comments', {
	id: serial('id').primaryKey(),
	projectId: integer('project_id')
		.notNull()
		.references(() => projects.id, { onDelete: 'cascade' }),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }), // Better Auth users table
	content: text('content').notNull(),
	rating: integer('rating'), // 1-5, optional
	publish: integer('publish').default(0), // 0 = pending, 1 = published, 2 = rejected
	createdAt: timestamp('created_at').defaultNow()
});

export * from './auth.schema';
