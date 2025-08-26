import { pgTable, uuid, text, integer, timestamp, jsonb, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users';
import { tasks } from './tasks';

export const creditTransactions = pgTable('credit_transactions', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  taskId: uuid('task_id').references(() => tasks.id),
  type: text('type', { 
    enum: ['debit', 'credit', 'bonus', 'refund', 'purchase'] 
  }).notNull(),
  amount: integer('amount').notNull(),
  description: text('description'),
  metadata: jsonb('metadata').$type<Record<string, any>>().default({}),
  balanceAfter: integer('balance_after').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  userCreatedIdx: index('credit_transactions_user_created_idx').on(table.userId, table.createdAt),
  taskIdx: index('credit_transactions_task_idx').on(table.taskId),
  typeIdx: index('credit_transactions_type_idx').on(table.type),
  createdIdx: index('credit_transactions_created_idx').on(table.createdAt),
}));

export const creditTransactionsRelations = relations(creditTransactions, ({ one }) => ({
  user: one(users, { 
    fields: [creditTransactions.userId], 
    references: [users.id] 
  }),
  task: one(tasks, { 
    fields: [creditTransactions.taskId], 
    references: [tasks.id] 
  }),
}));

export const creditPackages = pgTable('credit_packages', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  credits: integer('credits').notNull(),
  price: integer('price').notNull(), // Price in cents
  currency: text('currency').default('USD'),
  isActive: boolean('is_active').default(true),
  stripePriceId: text('stripe_price_id'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  activeIdx: index('credit_packages_active_idx').on(table.isActive),
  priceIdx: index('credit_packages_price_idx').on(table.price),
}));

export const creditPurchases = pgTable('credit_purchases', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  packageId: uuid('package_id').references(() => creditPackages.id).notNull(),
  stripePaymentIntentId: text('stripe_payment_intent_id').unique(),
  amount: integer('amount').notNull(), // Amount paid in cents
  credits: integer('credits').notNull(), // Credits purchased
  status: text('status', { 
    enum: ['pending', 'completed', 'failed', 'refunded'] 
  }).notNull().default('pending'),
  metadata: jsonb('metadata').$type<Record<string, any>>().default({}),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  userCreatedIdx: index('credit_purchases_user_created_idx').on(table.userId, table.createdAt),
  statusIdx: index('credit_purchases_status_idx').on(table.status),
  stripePaymentIdx: unique('credit_purchases_stripe_idx').on(table.stripePaymentIntentId),
}));

export const creditPurchasesRelations = relations(creditPurchases, ({ one }) => ({
  user: one(users, { 
    fields: [creditPurchases.userId], 
    references: [users.id] 
  }),
  package: one(creditPackages, { 
    fields: [creditPurchases.packageId], 
    references: [creditPackages.id] 
  }),
}));

// Import other tables for relations
import { boolean, unique } from 'drizzle-orm/pg-core';
