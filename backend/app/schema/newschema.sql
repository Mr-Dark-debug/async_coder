CREATE TABLE public.ai_models (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  display_name text NOT NULL,
  provider text NOT NULL,
  description text,
  cost_per_token numeric NOT NULL,
  max_tokens integer,
  capabilities jsonb NOT NULL DEFAULT '[]'::jsonb,
  configuration jsonb DEFAULT '{}'::jsonb,
  is_active boolean DEFAULT true,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  CONSTRAINT ai_models_pkey PRIMARY KEY (id)
);
CREATE TABLE public.ai_provider_configs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  provider text NOT NULL UNIQUE,
  api_key text,
  base_url text,
  configuration jsonb DEFAULT '{}'::jsonb,
  is_active boolean DEFAULT true,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  CONSTRAINT ai_provider_configs_pkey PRIMARY KEY (id)
);
CREATE TABLE public.api_key_providers (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  provider text NOT NULL UNIQUE,
  display_name text NOT NULL,
  description text,
  category text NOT NULL,
  logo_url text,
  website_url text,
  docs_url text,
  is_active boolean DEFAULT true,
  configuration jsonb DEFAULT '{}'::jsonb,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  CONSTRAINT api_key_providers_pkey PRIMARY KEY (id)
);
CREATE TABLE public.api_key_usage_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  api_key_id uuid NOT NULL,
  endpoint text,
  method text,
  status_code integer,
  response_time integer,
  tokens_used integer,
  cost numeric,
  error_message text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT api_key_usage_logs_pkey PRIMARY KEY (id),
  CONSTRAINT api_key_usage_logs_api_key_id_api_keys_id_fk FOREIGN KEY (api_key_id) REFERENCES public.api_keys(id)
);
CREATE TABLE public.api_keys (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  provider text NOT NULL,
  name text NOT NULL,
  description text,
  key_value text NOT NULL,
  is_active boolean DEFAULT true,
  last_used timestamp without time zone,
  usage_count integer DEFAULT 0,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  CONSTRAINT api_keys_pkey PRIMARY KEY (id),
  CONSTRAINT api_keys_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.credit_packages (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  credits integer NOT NULL,
  price integer NOT NULL,
  currency text DEFAULT 'USD'::text,
  is_active boolean DEFAULT true,
  stripe_price_id text,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  CONSTRAINT credit_packages_pkey PRIMARY KEY (id)
);
CREATE TABLE public.credit_purchases (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  package_id uuid NOT NULL,
  stripe_payment_intent_id text UNIQUE,
  amount integer NOT NULL,
  credits integer NOT NULL,
  status text NOT NULL DEFAULT 'pending'::text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  CONSTRAINT credit_purchases_pkey PRIMARY KEY (id),
  CONSTRAINT credit_purchases_package_id_credit_packages_id_fk FOREIGN KEY (package_id) REFERENCES public.credit_packages(id),
  CONSTRAINT credit_purchases_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.credit_transactions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  task_id uuid,
  type text NOT NULL,
  amount integer NOT NULL,
  description text,
  metadata jsonb DEFAULT '{}'::jsonb,
  balance_after integer NOT NULL,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT credit_transactions_pkey PRIMARY KEY (id),
  CONSTRAINT credit_transactions_task_id_tasks_id_fk FOREIGN KEY (task_id) REFERENCES public.tasks(id),
  CONSTRAINT credit_transactions_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.model_usage_stats (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  model_id uuid NOT NULL,
  user_id uuid,
  date timestamp without time zone NOT NULL,
  total_requests integer DEFAULT 0,
  total_tokens_used integer DEFAULT 0,
  total_credits_used integer DEFAULT 0,
  average_response_time numeric,
  success_rate numeric,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT model_usage_stats_pkey PRIMARY KEY (id),
  CONSTRAINT model_usage_stats_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT model_usage_stats_model_id_ai_models_id_fk FOREIGN KEY (model_id) REFERENCES public.ai_models(id)
);
CREATE TABLE public.pull_request_comments (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  pull_request_id uuid NOT NULL,
  github_comment_id integer UNIQUE,
  author_id uuid,
  body text NOT NULL,
  file_path text,
  line integer,
  is_resolved boolean DEFAULT false,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  CONSTRAINT pull_request_comments_pkey PRIMARY KEY (id),
  CONSTRAINT pull_request_comments_pull_request_id_pull_requests_id_fk FOREIGN KEY (pull_request_id) REFERENCES public.pull_requests(id),
  CONSTRAINT pull_request_comments_author_id_users_id_fk FOREIGN KEY (author_id) REFERENCES public.users(id)
);
CREATE TABLE public.pull_request_reviews (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  pull_request_id uuid NOT NULL,
  github_review_id integer UNIQUE,
  reviewer_id uuid,
  state text NOT NULL,
  body text,
  submitted_at timestamp without time zone,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT pull_request_reviews_pkey PRIMARY KEY (id),
  CONSTRAINT pull_request_reviews_pull_request_id_pull_requests_id_fk FOREIGN KEY (pull_request_id) REFERENCES public.pull_requests(id),
  CONSTRAINT pull_request_reviews_reviewer_id_users_id_fk FOREIGN KEY (reviewer_id) REFERENCES public.users(id)
);
CREATE TABLE public.pull_requests (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  task_id uuid,
  repository_id uuid NOT NULL,
  github_pr_id integer UNIQUE,
  pr_number integer NOT NULL,
  title text NOT NULL,
  description text,
  source_branch text NOT NULL,
  target_branch text NOT NULL,
  status text NOT NULL,
  url text NOT NULL,
  merged_at timestamp without time zone,
  closed_at timestamp without time zone,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  CONSTRAINT pull_requests_pkey PRIMARY KEY (id),
  CONSTRAINT pull_requests_repository_id_repositories_id_fk FOREIGN KEY (repository_id) REFERENCES public.repositories(id),
  CONSTRAINT pull_requests_task_id_tasks_id_fk FOREIGN KEY (task_id) REFERENCES public.tasks(id)
);
CREATE TABLE public.repositories (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  github_id integer NOT NULL UNIQUE,
  name text NOT NULL,
  full_name text NOT NULL,
  description text,
  is_private boolean DEFAULT false,
  default_branch text DEFAULT 'main'::text,
  language text,
  url text NOT NULL,
  clone_url text NOT NULL,
  owner_id uuid,
  is_active boolean DEFAULT true,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  CONSTRAINT repositories_pkey PRIMARY KEY (id),
  CONSTRAINT repositories_owner_id_users_id_fk FOREIGN KEY (owner_id) REFERENCES public.users(id)
);
CREATE TABLE public.repository_webhooks (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  repository_id uuid NOT NULL,
  github_webhook_id integer UNIQUE,
  url text NOT NULL,
  secret text NOT NULL,
  events ARRAY NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  CONSTRAINT repository_webhooks_pkey PRIMARY KEY (id),
  CONSTRAINT repository_webhooks_repository_id_repositories_id_fk FOREIGN KEY (repository_id) REFERENCES public.repositories(id)
);
CREATE TABLE public.subscription_invoices (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  subscription_id uuid NOT NULL,
  stripe_invoice_id text UNIQUE,
  amount integer NOT NULL,
  currency text DEFAULT 'USD'::text,
  status text NOT NULL,
  due_date timestamp without time zone,
  paid_at timestamp without time zone,
  hosted_invoice_url text,
  invoice_pdf text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT subscription_invoices_pkey PRIMARY KEY (id),
  CONSTRAINT subscription_invoices_subscription_id_subscriptions_id_fk FOREIGN KEY (subscription_id) REFERENCES public.subscriptions(id)
);
CREATE TABLE public.subscription_plans (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  display_name text NOT NULL,
  description text,
  tier text NOT NULL,
  price integer NOT NULL,
  currency text DEFAULT 'USD'::text,
  billing_interval text NOT NULL,
  credits_included integer NOT NULL,
  max_repositories integer,
  max_tasks_per_day integer,
  features jsonb NOT NULL DEFAULT '[]'::jsonb,
  stripe_price_id text,
  is_active boolean DEFAULT true,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  CONSTRAINT subscription_plans_pkey PRIMARY KEY (id)
);
CREATE TABLE public.subscription_usage (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  subscription_id uuid NOT NULL,
  date timestamp without time zone NOT NULL,
  credits_used integer DEFAULT 0,
  tasks_executed integer DEFAULT 0,
  repositories_accessed integer DEFAULT 0,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT subscription_usage_pkey PRIMARY KEY (id),
  CONSTRAINT subscription_usage_subscription_id_subscriptions_id_fk FOREIGN KEY (subscription_id) REFERENCES public.subscriptions(id)
);
CREATE TABLE public.subscriptions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  plan_id uuid NOT NULL,
  stripe_subscription_id text UNIQUE,
  stripe_customer_id text,
  status text NOT NULL,
  current_period_start timestamp without time zone NOT NULL,
  current_period_end timestamp without time zone NOT NULL,
  cancel_at_period_end boolean DEFAULT false,
  canceled_at timestamp without time zone,
  trial_start timestamp without time zone,
  trial_end timestamp without time zone,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  CONSTRAINT subscriptions_pkey PRIMARY KEY (id),
  CONSTRAINT subscriptions_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT subscriptions_plan_id_subscription_plans_id_fk FOREIGN KEY (plan_id) REFERENCES public.subscription_plans(id)
);
CREATE TABLE public.task_analytics (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  task_id uuid NOT NULL,
  execution_time_ms integer,
  tokens_used integer,
  lines_of_code_generated integer,
  files_modified integer,
  error_count integer DEFAULT 0,
  success_rate integer,
  performance_score integer,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT task_analytics_pkey PRIMARY KEY (id),
  CONSTRAINT task_analytics_task_id_tasks_id_fk FOREIGN KEY (task_id) REFERENCES public.tasks(id)
);
CREATE TABLE public.task_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  task_id uuid NOT NULL,
  level text NOT NULL,
  message text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  timestamp timestamp without time zone DEFAULT now(),
  CONSTRAINT task_logs_pkey PRIMARY KEY (id),
  CONSTRAINT task_logs_task_id_tasks_id_fk FOREIGN KEY (task_id) REFERENCES public.tasks(id)
);
CREATE TABLE public.task_results (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  task_id uuid NOT NULL,
  result_type text NOT NULL,
  content text,
  file_path text,
  summary text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT task_results_pkey PRIMARY KEY (id),
  CONSTRAINT task_results_task_id_tasks_id_fk FOREIGN KEY (task_id) REFERENCES public.tasks(id)
);
CREATE TABLE public.tasks (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  repository_id uuid NOT NULL,
  ai_model_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  prompt text NOT NULL,
  branch text NOT NULL,
  target_branch text DEFAULT 'main'::text,
  status text NOT NULL DEFAULT 'pending'::text,
  type text NOT NULL,
  priority text DEFAULT 'medium'::text,
  credits_used integer DEFAULT 0,
  estimated_credits integer,
  metadata jsonb DEFAULT '{}'::jsonb,
  started_at timestamp without time zone,
  completed_at timestamp without time zone,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  CONSTRAINT tasks_pkey PRIMARY KEY (id),
  CONSTRAINT tasks_repository_id_repositories_id_fk FOREIGN KEY (repository_id) REFERENCES public.repositories(id),
  CONSTRAINT tasks_ai_model_id_ai_models_id_fk FOREIGN KEY (ai_model_id) REFERENCES public.ai_models(id),
  CONSTRAINT tasks_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.user_repository_access (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  repository_id uuid NOT NULL,
  access_level text NOT NULL,
  is_collaborator boolean DEFAULT false,
  added_at timestamp without time zone DEFAULT now(),
  CONSTRAINT user_repository_access_pkey PRIMARY KEY (id),
  CONSTRAINT user_repository_access_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT user_repository_access_repository_id_repositories_id_fk FOREIGN KEY (repository_id) REFERENCES public.repositories(id)
);
-- Enhanced Users Table with Additional Signup and Profile Fields
CREATE TABLE public.users (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  clerk_id text NOT NULL UNIQUE,
  github_id integer UNIQUE,
  email text NOT NULL UNIQUE,
  username text NOT NULL UNIQUE,
  display_name text,
  first_name text,
  last_name text,
  avatar_url text,
  bio text,
  location text,
  website_url text,
  company text,
  github_access_token text,
  github_username text,
  is_github_connected boolean DEFAULT false,
  is_email_verified boolean DEFAULT false,
  is_onboarding_completed boolean DEFAULT false,
  credits integer DEFAULT 100,
  total_credits_used integer DEFAULT 0,
  subscription_tier text DEFAULT 'free'::text,
  timezone text DEFAULT 'UTC'::text,
  language text DEFAULT 'en'::text,
  theme_preference text DEFAULT 'dark'::text,
  notification_preferences jsonb DEFAULT '{"email": true, "push": true, "in_app": true}'::jsonb,
  last_login_at timestamp without time zone,
  last_active_at timestamp without time zone,
  signup_source text DEFAULT 'web'::text,
  referral_code text,
  referred_by_user_id uuid,
  is_active boolean DEFAULT true,
  is_premium boolean DEFAULT false,
  trial_ends_at timestamp without time zone,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  CONSTRAINT users_pkey PRIMARY KEY (id),
  CONSTRAINT users_referred_by_user_id_fk FOREIGN KEY (referred_by_user_id) REFERENCES public.users(id)
);

-- User Activity Tracking Table
CREATE TABLE public.user_activities (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  activity_type text NOT NULL,
  description text,
  metadata jsonb DEFAULT '{}'::jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT user_activities_pkey PRIMARY KEY (id),
  CONSTRAINT user_activities_user_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id)
);

-- User Sessions Table for Enhanced Security
CREATE TABLE public.user_sessions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  session_token text NOT NULL UNIQUE,
  device_info jsonb DEFAULT '{}'::jsonb,
  ip_address inet,
  user_agent text,
  is_active boolean DEFAULT true,
  expires_at timestamp without time zone NOT NULL,
  last_accessed_at timestamp without time zone DEFAULT now(),
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT user_sessions_pkey PRIMARY KEY (id),
  CONSTRAINT user_sessions_user_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id)
);

-- User Preferences Table for Extended Settings
CREATE TABLE public.user_preferences (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  editor_theme text DEFAULT 'dark'::text,
  editor_font_size integer DEFAULT 14,
  editor_font_family text DEFAULT 'Monaco'::text,
  default_ai_model text DEFAULT 'claude'::text,
  auto_save boolean DEFAULT true,
  show_line_numbers boolean DEFAULT true,
  enable_vim_mode boolean DEFAULT false,
  custom_instructions text,
  diff_view_mode text DEFAULT 'split'::text,
  branch_naming_pattern text DEFAULT 'async/{feature}'::text,
  notification_sound boolean DEFAULT true,
  email_notifications boolean DEFAULT true,
  push_notifications boolean DEFAULT true,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  CONSTRAINT user_preferences_pkey PRIMARY KEY (id),
  CONSTRAINT user_preferences_user_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id)
);

-- Indexes for Performance
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_username ON public.users(username);
CREATE INDEX idx_users_clerk_id ON public.users(clerk_id);
CREATE INDEX idx_users_github_id ON public.users(github_id);
CREATE INDEX idx_users_is_active ON public.users(is_active);
CREATE INDEX idx_users_subscription_tier ON public.users(subscription_tier);
CREATE INDEX idx_users_created_at ON public.users(created_at);
CREATE INDEX idx_users_last_active_at ON public.users(last_active_at);

CREATE INDEX idx_user_activities_user_id ON public.user_activities(user_id);
CREATE INDEX idx_user_activities_type ON public.user_activities(activity_type);
CREATE INDEX idx_user_activities_created_at ON public.user_activities(created_at);

CREATE INDEX idx_user_sessions_user_id ON public.user_sessions(user_id);
CREATE INDEX idx_user_sessions_token ON public.user_sessions(session_token);
CREATE INDEX idx_user_sessions_active ON public.user_sessions(is_active);
CREATE INDEX idx_user_sessions_expires_at ON public.user_sessions(expires_at);