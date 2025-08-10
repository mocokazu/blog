export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: 'JPY' | 'USD';
  interval: 'month' | 'year';
  stripe_price_id: string;
  features: PlanFeature[];
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface PlanFeature {
  name: string;
  description?: string;
  included: boolean;
  limit?: number;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan_id: string;
  stripe_subscription_id: string;
  status: 'active' | 'canceled' | 'past_due' | 'unpaid' | 'incomplete';
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  canceled_at?: string;
  trial_start?: string;
  trial_end?: string;
  created_at: string;
  updated_at: string;
  
  // Relations
  plan?: SubscriptionPlan;
  user?: User;
}

export interface Payment {
  id: string;
  user_id: string;
  subscription_id?: string;
  stripe_payment_intent_id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'succeeded' | 'failed' | 'canceled';
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  role: 'user' | 'admin' | 'moderator';
  subscription_id?: string;
  email_verified: boolean;
  preferences: UserPreferences;
  created_at: string;
  updated_at: string;
  last_login?: string;
  
  // Relations
  subscription?: Subscription;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: 'ja' | 'en';
  notifications: {
    email: boolean;
    push: boolean;
    new_articles: boolean;
    comments: boolean;
    marketing: boolean;
  };
  character: {
    preferred_character_id?: string;
    interaction_level: 'minimal' | 'normal' | 'interactive';
    voice_enabled: boolean;
  };
  display: {
    articles_per_page: number;
    show_reading_time: boolean;
    show_view_count: boolean;
    auto_play_videos: boolean;
  };
}

export interface PremiumContent {
  id: string;
  title: string;
  type: 'article' | 'video' | 'download' | 'live_stream';
  content_id: string;
  required_plan_id?: string;
  is_free_trial: boolean;
  trial_duration_days?: number;
  created_at: string;
  updated_at: string;
}

export interface UserAccess {
  user_id: string;
  content_id: string;
  access_type: 'subscription' | 'purchase' | 'trial' | 'gift';
  granted_at: string;
  expires_at?: string;
  created_at: string;
}
