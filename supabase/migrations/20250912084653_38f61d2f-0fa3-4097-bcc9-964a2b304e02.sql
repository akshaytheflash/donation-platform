-- Create campaigns table
CREATE TABLE public.campaigns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  goal_amount DECIMAL(12,2) NOT NULL,
  raised_amount DECIMAL(12,2) DEFAULT 0,
  category TEXT NOT NULL,
  location TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'cancelled')),
  start_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  end_date TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create donations table
CREATE TABLE public.donations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID REFERENCES public.campaigns(id) NOT NULL,
  donor_id UUID REFERENCES auth.users(id),
  amount DECIMAL(12,2) NOT NULL,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('card', 'upi', 'paypal', 'crypto')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
  is_anonymous BOOLEAN DEFAULT false,
  is_recurring BOOLEAN DEFAULT false,
  recurring_frequency TEXT CHECK (recurring_frequency IN ('monthly', 'quarterly', 'yearly')),
  donor_name TEXT,
  donor_email TEXT,
  message TEXT,
  transaction_id TEXT UNIQUE,
  receipt_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create profiles table for additional user data
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  country TEXT DEFAULT 'India',
  is_admin BOOLEAN DEFAULT false,
  total_donated DECIMAL(12,2) DEFAULT 0,
  donation_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create volunteers table
CREATE TABLE public.volunteers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  skills TEXT,
  availability TEXT,
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create newsletter subscriptions table
CREATE TABLE public.newsletter_subscribers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create blog posts table
CREATE TABLE public.blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  excerpt TEXT,
  image_url TEXT,
  author_id UUID REFERENCES auth.users(id),
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.volunteers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for campaigns
CREATE POLICY "Anyone can view active campaigns" 
ON public.campaigns FOR SELECT 
USING (status = 'active');

CREATE POLICY "Authenticated users can create campaigns" 
ON public.campaigns FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = created_by);

CREATE POLICY "Campaign creators can update their campaigns" 
ON public.campaigns FOR UPDATE 
USING (auth.uid() = created_by);

-- RLS Policies for donations
CREATE POLICY "Donors can view their own donations" 
ON public.donations FOR SELECT 
USING (auth.uid() = donor_id OR is_anonymous = false);

CREATE POLICY "Anyone can create donations" 
ON public.donations FOR INSERT 
WITH CHECK (true);

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for volunteers
CREATE POLICY "Anyone can submit volunteer applications" 
ON public.volunteers FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can view volunteer applications" 
ON public.volunteers FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = auth.uid() AND profiles.is_admin = true
  )
);

-- RLS Policies for newsletter
CREATE POLICY "Anyone can subscribe to newsletter" 
ON public.newsletter_subscribers FOR INSERT 
WITH CHECK (true);

-- RLS Policies for blog posts
CREATE POLICY "Anyone can view published blog posts" 
ON public.blog_posts FOR SELECT 
USING (published = true);

CREATE POLICY "Admins can manage blog posts" 
ON public.blog_posts FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = auth.uid() AND profiles.is_admin = true
  )
);

-- Create indexes for better performance
CREATE INDEX idx_campaigns_status ON public.campaigns(status);
CREATE INDEX idx_campaigns_category ON public.campaigns(category);
CREATE INDEX idx_donations_campaign_id ON public.donations(campaign_id);
CREATE INDEX idx_donations_donor_id ON public.donations(donor_id);
CREATE INDEX idx_donations_created_at ON public.donations(created_at);

-- Create function to update updated_at column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_campaigns_updated_at
  BEFORE UPDATE ON public.campaigns
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to update campaign raised amount when donations are added
CREATE OR REPLACE FUNCTION public.update_campaign_raised_amount()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.payment_status = 'completed' THEN
    UPDATE public.campaigns 
    SET raised_amount = raised_amount + NEW.amount
    WHERE id = NEW.campaign_id;
    
    -- Update donor profile stats
    IF NEW.donor_id IS NOT NULL THEN
      UPDATE public.profiles 
      SET 
        total_donated = total_donated + NEW.amount,
        donation_count = donation_count + 1
      WHERE user_id = NEW.donor_id;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for updating campaign amounts
CREATE TRIGGER update_campaign_amount_on_donation
  AFTER INSERT ON public.donations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_campaign_raised_amount();

-- Function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Trigger for automatic profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample campaigns
INSERT INTO public.campaigns (title, description, image_url, goal_amount, raised_amount, category, location, created_by) VALUES
('Clean Water for Rural Communities', 'Providing access to clean drinking water for remote villages in Kenya through sustainable well-drilling projects and water purification systems.', 'https://images.unsplash.com/photo-1594736797933-d0dba35b5c24?w=400&h=300&fit=crop', 75000, 45680, 'Water', 'Kenya', NULL),
('Education for Underprivileged Children', 'Supporting school supplies, uniforms, nutritious meals, and quality education for children in underserved communities across rural India.', 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=400&h=300&fit=crop', 50000, 32150, 'Education', 'India', NULL),
('Emergency Relief for Natural Disasters', 'Immediate aid including food, shelter, medical supplies and long-term recovery support for families affected by recent flooding and natural disasters.', 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=300&fit=crop', 100000, 89420, 'Emergency', 'Philippines', NULL),
('Healthcare for Remote Villages', 'Mobile medical clinics and essential healthcare services for remote communities lacking access to basic medical care and emergency treatment.', 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop', 120000, 67800, 'Healthcare', 'Bangladesh', NULL),
('Food Security Initiative', 'Combating hunger through sustainable farming programs, food banks, and nutrition education in food-insecure regions worldwide.', 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400&h=300&fit=crop', 80000, 23400, 'Food', 'Global', NULL),
('Environmental Conservation Project', 'Protecting endangered forests, wildlife habitats, and implementing sustainable conservation practices to combat climate change effects.', 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop', 95000, 41200, 'Environment', 'Costa Rica', NULL);