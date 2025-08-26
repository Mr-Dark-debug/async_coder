import { pgTable, uuid, text, integer, timestamp, boolean, jsonb, index, unique } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users';

export const subscriptionPlans = pgTable('subscription_plans', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull().unique(),
  displayName: text('display_name').notNull(),
  description: text('description'),
  tier: text('tier', { 
    enum: ['free', 'pro', 'enterprise'] 
  }).notNull(),
  price: integer('price').notNull(), // Price in cents
  currency: text('currency').default('USD'),
  billingInterval: text('billing_interval', { 
    enum: ['month', 'year'] 
  }).notNull(),
  creditsIncluded: integer('credits_included').notNull(),
  maxRepositories: integer('max_repositories'),
  maxTasksPerDay: integer('max_tasks_per_day'),
  features: jsonb('features').$type<string[]>().notNull().default([]),
  stripePriceId: text('stripe_price_id'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  nameIdx: unique('subscription_plans_name_idx').on(table.name),
  tierIdx: index('subscription_plans_tier_idx').on(table.tier),
  activeIdx: index('subscription_plans_active_idx').on(table.isActive),
}));

export const subscriptions = pgTable('subscriptions', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  planId: uuid('plan_id').references(() => subscriptionPlans.id).notNull(),
  stripeSubscriptionId: text('stripe_subscription_id').unique(),
  stripeCustomerId: text('stripe_customer_id'),
  status: text('status', { 
    enum: ['active', 'canceled', 'past_due', 'unpaid', 'trialing', 'incomplete'] 
  }).notNull(),
  currentPeriodStart: timestamp('current_period_start').notNull(),
  currentPeriodEnd: timestamp('current_period_end').notNull(),
  cancelAtPeriodEnd: boolean('cancel_at_period_end').default(false),
  canceledAt: timestamp('canceled_at'),
  trialStart: timestamp('trial_start'),
  trialEnd: timestamp('trial_end'),
  metadata: jsonb('metadata').$type<Record<string, any>>().default({}),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  userIdx: index('subscriptions_user_idx').on(table.userId),
  statusIdx: index('subscriptions_status_idx').on(table.status),
  stripeSubIdx: unique('subscriptions_stripe_idx').on(table.stripeSubscriptionId),
  periodEndIdx: index('subscriptions_period_end_idx').on(table.currentPeriodEnd),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one, many }) => ({
  user: one(users, { 
    fields: [subscriptions.userId], 
    references: [users.id] 
  }),
  plan: one(subscriptionPlans, { 
    fields: [subscriptions.planId], 
    references: [subscriptionPlans.id] 
  }),
  invoices: many(subscriptionInvoices),
}));

export const subscriptionInvoices = pgTable('subscription_invoices', {
  id: uuid('id').defaultRandom().primaryKey(),
  subscriptionId: uuid('subscription_id').references(() => subscriptions.id).notNull(),
  stripeInvoiceId: text('stripe_invoice_id').unique(),
  amount: integer('amount').notNull(), // Amount in cents
  currency: text('currency').default('USD'),
  status: text('status', { 
    enum: ['draft', 'open', 'paid', 'uncollectible', 'void'] 
  }).notNull(),
  dueDate: timestamp('due_date'),
  paidAt: timestamp('paid_at'),
  hostedInvoiceUrl: text('hosted_invoice_url'),
  invoicePdf: text('invoice_pdf'),
  metadata: jsonb('metadata').$type<Record<string, any>>().default({}),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  subscriptionIdx: index('subscription_invoices_subscription_idx').on(table.subscriptionId),
  statusIdx: index('subscription_invoices_status_idx').on(table.status),
  stripeInvoiceIdx: unique('subscription_invoices_stripe_idx').on(table.stripeInvoiceId),
  dueDateIdx: index('subscription_invoices_due_date_idx').on(table.dueDate),
}));

export const subscriptionInvoicesRelations = relations(subscriptionInvoices, ({ one }) => ({
  subscription: one(subscriptions, { 
    fields: [subscriptionInvoices.subscriptionId], 
    references: [subscriptions.id] 
  }),
}));

export const subscriptionUsage = pgTable('subscription_usage', {
  id: uuid('id').defaultRandom().primaryKey(),
  subscriptionId: uuid('subscription_id').references(() => subscriptions.id).notNull(),
  date: timestamp('date').notNull(),
  creditsUsed: integer('credits_used').default(0),
  tasksExecuted: integer('tasks_executed').default(0),
  repositoriesAccessed: integer('repositories_accessed').default(0),
  metadata: jsonb('metadata').$type<Record<string, any>>().default({}),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  subscriptionDateIdx: index('subscription_usage_subscription_date_idx').on(table.subscriptionId, table.date),
  dateIdx: index('subscription_usage_date_idx').on(table.date),
}));

export const subscriptionUsageRelations = relations(subscriptionUsage, ({ one }) => ({
  subscription: one(subscriptions, { 
    fields: [subscriptionUsage.subscriptionId], 
    references: [subscriptions.id] 
  }),
}));
