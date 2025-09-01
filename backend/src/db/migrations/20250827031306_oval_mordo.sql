CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerk_id" text NOT NULL,
	"github_id" integer,
	"email" text NOT NULL,
	"username" text NOT NULL,
	"display_name" text,
	"avatar_url" text,
	"github_access_token" text,
	"is_github_connected" boolean DEFAULT false,
	"credits" integer DEFAULT 100,
	"total_credits_used" integer DEFAULT 0,
	"subscription_tier" text DEFAULT 'free',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_clerk_id_unique" UNIQUE("clerk_id"),
	CONSTRAINT "users_github_id_unique" UNIQUE("github_id"),
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_clerk_id_idx" UNIQUE("clerk_id"),
	CONSTRAINT "users_github_id_idx" UNIQUE("github_id"),
	CONSTRAINT "users_email_idx" UNIQUE("email"),
	CONSTRAINT "users_username_idx" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "repositories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"github_id" integer NOT NULL,
	"name" text NOT NULL,
	"full_name" text NOT NULL,
	"description" text,
	"is_private" boolean DEFAULT false,
	"default_branch" text DEFAULT 'main',
	"language" text,
	"url" text NOT NULL,
	"clone_url" text NOT NULL,
	"owner_id" uuid,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "repositories_github_id_unique" UNIQUE("github_id"),
	CONSTRAINT "repositories_github_id_idx" UNIQUE("github_id")
);
--> statement-breakpoint
CREATE TABLE "repository_webhooks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"repository_id" uuid NOT NULL,
	"github_webhook_id" integer,
	"url" text NOT NULL,
	"secret" text NOT NULL,
	"events" text[] NOT NULL,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "repository_webhooks_github_webhook_id_unique" UNIQUE("github_webhook_id"),
	CONSTRAINT "github_webhook_idx" UNIQUE("github_webhook_id")
);
--> statement-breakpoint
CREATE TABLE "user_repository_access" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"repository_id" uuid NOT NULL,
	"access_level" text NOT NULL,
	"is_collaborator" boolean DEFAULT false,
	"added_at" timestamp DEFAULT now(),
	CONSTRAINT "user_repo_access_unique" UNIQUE("user_id","repository_id")
);
--> statement-breakpoint
CREATE TABLE "ai_models" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"display_name" text NOT NULL,
	"provider" text NOT NULL,
	"description" text,
	"cost_per_token" numeric(10, 8) NOT NULL,
	"max_tokens" integer,
	"capabilities" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"configuration" jsonb DEFAULT '{}'::jsonb,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "ai_models_name_unique" UNIQUE("name"),
	CONSTRAINT "ai_models_name_idx" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "ai_provider_configs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"provider" text NOT NULL,
	"api_key" text,
	"base_url" text,
	"configuration" jsonb DEFAULT '{}'::jsonb,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "ai_provider_configs_provider_unique" UNIQUE("provider"),
	CONSTRAINT "ai_provider_configs_provider_idx" UNIQUE("provider")
);
--> statement-breakpoint
CREATE TABLE "model_usage_stats" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"model_id" uuid NOT NULL,
	"user_id" uuid,
	"date" timestamp NOT NULL,
	"total_requests" integer DEFAULT 0,
	"total_tokens_used" integer DEFAULT 0,
	"total_credits_used" integer DEFAULT 0,
	"average_response_time" numeric(8, 2),
	"success_rate" numeric(5, 2),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "task_analytics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"task_id" uuid NOT NULL,
	"execution_time_ms" integer,
	"tokens_used" integer,
	"lines_of_code_generated" integer,
	"files_modified" integer,
	"error_count" integer DEFAULT 0,
	"success_rate" integer,
	"performance_score" integer,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "task_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"task_id" uuid NOT NULL,
	"level" text NOT NULL,
	"message" text NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"timestamp" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "task_results" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"task_id" uuid NOT NULL,
	"result_type" text NOT NULL,
	"content" text,
	"file_path" text,
	"summary" text,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "tasks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"repository_id" uuid NOT NULL,
	"ai_model_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"prompt" text NOT NULL,
	"branch" text NOT NULL,
	"target_branch" text DEFAULT 'main',
	"status" text DEFAULT 'pending' NOT NULL,
	"type" text NOT NULL,
	"priority" text DEFAULT 'medium',
	"credits_used" integer DEFAULT 0,
	"estimated_credits" integer,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"started_at" timestamp,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "pull_request_comments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"pull_request_id" uuid NOT NULL,
	"github_comment_id" integer,
	"author_id" uuid,
	"body" text NOT NULL,
	"file_path" text,
	"line" integer,
	"is_resolved" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "pull_request_comments_github_comment_id_unique" UNIQUE("github_comment_id"),
	CONSTRAINT "pr_comments_github_idx" UNIQUE("github_comment_id")
);
--> statement-breakpoint
CREATE TABLE "pull_request_reviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"pull_request_id" uuid NOT NULL,
	"github_review_id" integer,
	"reviewer_id" uuid,
	"state" text NOT NULL,
	"body" text,
	"submitted_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "pull_request_reviews_github_review_id_unique" UNIQUE("github_review_id"),
	CONSTRAINT "pr_reviews_github_idx" UNIQUE("github_review_id")
);
--> statement-breakpoint
CREATE TABLE "pull_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"task_id" uuid,
	"repository_id" uuid NOT NULL,
	"github_pr_id" integer,
	"pr_number" integer NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"source_branch" text NOT NULL,
	"target_branch" text NOT NULL,
	"status" text NOT NULL,
	"url" text NOT NULL,
	"merged_at" timestamp,
	"closed_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "pull_requests_github_pr_id_unique" UNIQUE("github_pr_id"),
	CONSTRAINT "pull_requests_github_pr_idx" UNIQUE("github_pr_id")
);
--> statement-breakpoint
CREATE TABLE "credit_packages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"credits" integer NOT NULL,
	"price" integer NOT NULL,
	"currency" text DEFAULT 'USD',
	"is_active" boolean DEFAULT true,
	"stripe_price_id" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "credit_purchases" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"package_id" uuid NOT NULL,
	"stripe_payment_intent_id" text,
	"amount" integer NOT NULL,
	"credits" integer NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "credit_purchases_stripe_payment_intent_id_unique" UNIQUE("stripe_payment_intent_id"),
	CONSTRAINT "credit_purchases_stripe_idx" UNIQUE("stripe_payment_intent_id")
);
--> statement-breakpoint
CREATE TABLE "credit_transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"task_id" uuid,
	"type" text NOT NULL,
	"amount" integer NOT NULL,
	"description" text,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"balance_after" integer NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "subscription_invoices" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"subscription_id" uuid NOT NULL,
	"stripe_invoice_id" text,
	"amount" integer NOT NULL,
	"currency" text DEFAULT 'USD',
	"status" text NOT NULL,
	"due_date" timestamp,
	"paid_at" timestamp,
	"hosted_invoice_url" text,
	"invoice_pdf" text,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "subscription_invoices_stripe_invoice_id_unique" UNIQUE("stripe_invoice_id"),
	CONSTRAINT "subscription_invoices_stripe_idx" UNIQUE("stripe_invoice_id")
);
--> statement-breakpoint
CREATE TABLE "subscription_plans" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"display_name" text NOT NULL,
	"description" text,
	"tier" text NOT NULL,
	"price" integer NOT NULL,
	"currency" text DEFAULT 'USD',
	"billing_interval" text NOT NULL,
	"credits_included" integer NOT NULL,
	"max_repositories" integer,
	"max_tasks_per_day" integer,
	"features" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"stripe_price_id" text,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "subscription_plans_name_unique" UNIQUE("name"),
	CONSTRAINT "subscription_plans_name_idx" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "subscription_usage" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"subscription_id" uuid NOT NULL,
	"date" timestamp NOT NULL,
	"credits_used" integer DEFAULT 0,
	"tasks_executed" integer DEFAULT 0,
	"repositories_accessed" integer DEFAULT 0,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "subscriptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"plan_id" uuid NOT NULL,
	"stripe_subscription_id" text,
	"stripe_customer_id" text,
	"status" text NOT NULL,
	"current_period_start" timestamp NOT NULL,
	"current_period_end" timestamp NOT NULL,
	"cancel_at_period_end" boolean DEFAULT false,
	"canceled_at" timestamp,
	"trial_start" timestamp,
	"trial_end" timestamp,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "subscriptions_stripe_subscription_id_unique" UNIQUE("stripe_subscription_id"),
	CONSTRAINT "subscriptions_stripe_idx" UNIQUE("stripe_subscription_id")
);
--> statement-breakpoint
ALTER TABLE "repositories" ADD CONSTRAINT "repositories_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "repository_webhooks" ADD CONSTRAINT "repository_webhooks_repository_id_repositories_id_fk" FOREIGN KEY ("repository_id") REFERENCES "public"."repositories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_repository_access" ADD CONSTRAINT "user_repository_access_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_repository_access" ADD CONSTRAINT "user_repository_access_repository_id_repositories_id_fk" FOREIGN KEY ("repository_id") REFERENCES "public"."repositories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "model_usage_stats" ADD CONSTRAINT "model_usage_stats_model_id_ai_models_id_fk" FOREIGN KEY ("model_id") REFERENCES "public"."ai_models"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "model_usage_stats" ADD CONSTRAINT "model_usage_stats_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task_analytics" ADD CONSTRAINT "task_analytics_task_id_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."tasks"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task_logs" ADD CONSTRAINT "task_logs_task_id_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."tasks"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task_results" ADD CONSTRAINT "task_results_task_id_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."tasks"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_repository_id_repositories_id_fk" FOREIGN KEY ("repository_id") REFERENCES "public"."repositories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_ai_model_id_ai_models_id_fk" FOREIGN KEY ("ai_model_id") REFERENCES "public"."ai_models"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pull_request_comments" ADD CONSTRAINT "pull_request_comments_pull_request_id_pull_requests_id_fk" FOREIGN KEY ("pull_request_id") REFERENCES "public"."pull_requests"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pull_request_comments" ADD CONSTRAINT "pull_request_comments_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pull_request_reviews" ADD CONSTRAINT "pull_request_reviews_pull_request_id_pull_requests_id_fk" FOREIGN KEY ("pull_request_id") REFERENCES "public"."pull_requests"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pull_request_reviews" ADD CONSTRAINT "pull_request_reviews_reviewer_id_users_id_fk" FOREIGN KEY ("reviewer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pull_requests" ADD CONSTRAINT "pull_requests_task_id_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."tasks"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pull_requests" ADD CONSTRAINT "pull_requests_repository_id_repositories_id_fk" FOREIGN KEY ("repository_id") REFERENCES "public"."repositories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "credit_purchases" ADD CONSTRAINT "credit_purchases_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "credit_purchases" ADD CONSTRAINT "credit_purchases_package_id_credit_packages_id_fk" FOREIGN KEY ("package_id") REFERENCES "public"."credit_packages"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "credit_transactions" ADD CONSTRAINT "credit_transactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "credit_transactions" ADD CONSTRAINT "credit_transactions_task_id_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."tasks"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscription_invoices" ADD CONSTRAINT "subscription_invoices_subscription_id_subscriptions_id_fk" FOREIGN KEY ("subscription_id") REFERENCES "public"."subscriptions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscription_usage" ADD CONSTRAINT "subscription_usage_subscription_id_subscriptions_id_fk" FOREIGN KEY ("subscription_id") REFERENCES "public"."subscriptions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_plan_id_subscription_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."subscription_plans"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "repositories_owner_active_idx" ON "repositories" USING btree ("owner_id","is_active");--> statement-breakpoint
CREATE INDEX "repositories_full_name_idx" ON "repositories" USING btree ("full_name");--> statement-breakpoint
CREATE INDEX "repo_webhook_idx" ON "repository_webhooks" USING btree ("repository_id");--> statement-breakpoint
CREATE INDEX "user_repo_access_idx" ON "user_repository_access" USING btree ("user_id","repository_id");--> statement-breakpoint
CREATE INDEX "ai_models_provider_active_idx" ON "ai_models" USING btree ("provider","is_active");--> statement-breakpoint
CREATE INDEX "ai_models_active_idx" ON "ai_models" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "model_usage_model_date_idx" ON "model_usage_stats" USING btree ("model_id","date");--> statement-breakpoint
CREATE INDEX "model_usage_user_date_idx" ON "model_usage_stats" USING btree ("user_id","date");--> statement-breakpoint
CREATE INDEX "model_usage_date_idx" ON "model_usage_stats" USING btree ("date");--> statement-breakpoint
CREATE INDEX "task_analytics_task_idx" ON "task_analytics" USING btree ("task_id");--> statement-breakpoint
CREATE INDEX "task_logs_task_idx" ON "task_logs" USING btree ("task_id");--> statement-breakpoint
CREATE INDEX "task_logs_level_idx" ON "task_logs" USING btree ("level");--> statement-breakpoint
CREATE INDEX "task_logs_timestamp_idx" ON "task_logs" USING btree ("timestamp");--> statement-breakpoint
CREATE INDEX "task_results_task_idx" ON "task_results" USING btree ("task_id");--> statement-breakpoint
CREATE INDEX "task_results_type_idx" ON "task_results" USING btree ("result_type");--> statement-breakpoint
CREATE INDEX "tasks_user_status_idx" ON "tasks" USING btree ("user_id","status");--> statement-breakpoint
CREATE INDEX "tasks_user_created_idx" ON "tasks" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "tasks_repo_status_idx" ON "tasks" USING btree ("repository_id","status");--> statement-breakpoint
CREATE INDEX "tasks_status_idx" ON "tasks" USING btree ("status");--> statement-breakpoint
CREATE INDEX "tasks_type_idx" ON "tasks" USING btree ("type");--> statement-breakpoint
CREATE INDEX "tasks_priority_idx" ON "tasks" USING btree ("priority");--> statement-breakpoint
CREATE INDEX "pr_comments_pr_idx" ON "pull_request_comments" USING btree ("pull_request_id");--> statement-breakpoint
CREATE INDEX "pr_comments_author_idx" ON "pull_request_comments" USING btree ("author_id");--> statement-breakpoint
CREATE INDEX "pr_reviews_pr_idx" ON "pull_request_reviews" USING btree ("pull_request_id");--> statement-breakpoint
CREATE INDEX "pr_reviews_reviewer_idx" ON "pull_request_reviews" USING btree ("reviewer_id");--> statement-breakpoint
CREATE INDEX "pull_requests_repo_status_idx" ON "pull_requests" USING btree ("repository_id","status");--> statement-breakpoint
CREATE INDEX "pull_requests_task_idx" ON "pull_requests" USING btree ("task_id");--> statement-breakpoint
CREATE INDEX "pull_requests_status_idx" ON "pull_requests" USING btree ("status");--> statement-breakpoint
CREATE INDEX "credit_packages_active_idx" ON "credit_packages" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "credit_packages_price_idx" ON "credit_packages" USING btree ("price");--> statement-breakpoint
CREATE INDEX "credit_purchases_user_created_idx" ON "credit_purchases" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "credit_purchases_status_idx" ON "credit_purchases" USING btree ("status");--> statement-breakpoint
CREATE INDEX "credit_transactions_user_created_idx" ON "credit_transactions" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "credit_transactions_task_idx" ON "credit_transactions" USING btree ("task_id");--> statement-breakpoint
CREATE INDEX "credit_transactions_type_idx" ON "credit_transactions" USING btree ("type");--> statement-breakpoint
CREATE INDEX "credit_transactions_created_idx" ON "credit_transactions" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "subscription_invoices_subscription_idx" ON "subscription_invoices" USING btree ("subscription_id");--> statement-breakpoint
CREATE INDEX "subscription_invoices_status_idx" ON "subscription_invoices" USING btree ("status");--> statement-breakpoint
CREATE INDEX "subscription_invoices_due_date_idx" ON "subscription_invoices" USING btree ("due_date");--> statement-breakpoint
CREATE INDEX "subscription_plans_tier_idx" ON "subscription_plans" USING btree ("tier");--> statement-breakpoint
CREATE INDEX "subscription_plans_active_idx" ON "subscription_plans" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "subscription_usage_subscription_date_idx" ON "subscription_usage" USING btree ("subscription_id","date");--> statement-breakpoint
CREATE INDEX "subscription_usage_date_idx" ON "subscription_usage" USING btree ("date");--> statement-breakpoint
CREATE INDEX "subscriptions_user_idx" ON "subscriptions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "subscriptions_status_idx" ON "subscriptions" USING btree ("status");--> statement-breakpoint
CREATE INDEX "subscriptions_period_end_idx" ON "subscriptions" USING btree ("current_period_end");