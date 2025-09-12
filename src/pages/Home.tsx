import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  Shield, 
  Globe, 
  TrendingUp, 
  Users, 
  Zap, 
  CheckCircle,
  ArrowRight,
  Wallet,
  CreditCard,
  Smartphone
} from 'lucide-react';
import heroImage from '@/assets/hero-donations.jpg';
import CampaignCard from '@/components/CampaignCard';
import NewsletterSignup from '@/components/NewsletterSignup';
import VolunteerSignup from '@/components/VolunteerSignup';
import { useCampaigns } from '@/hooks/useCampaigns';

const Home = () => {
  const { campaigns, loading } = useCampaigns();
  
  const features = [
    {
      icon: Shield,
      title: 'Blockchain Transparency',
      description: 'Every donation is recorded on the blockchain for complete transparency and accountability.'
    },
    {
      icon: Globe,
      title: 'Global Impact',
      description: 'Support causes worldwide with instant, borderless transactions.'
    },
    {
      icon: Zap,
      title: 'Instant Donations',
      description: 'Make donations instantly with crypto wallets or traditional payment methods.'
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Join a community of changemakers working together for social good.'
    }
  ];

  const stats = [
    { label: 'Total Raised', value: '$2.4M', icon: TrendingUp },
    { label: 'Active Campaigns', value: '1,247', icon: Heart },
    { label: 'Global Donors', value: '45K+', icon: Users },
    { label: 'Countries Served', value: '89', icon: Globe }
  ];

  // Use real campaigns from database, fallback to empty array
  const featuredCampaigns = campaigns.slice(0, 3).map(campaign => ({
    id: campaign.id,
    title: campaign.title,
    description: campaign.description,
    image: campaign.image_url || 'https://images.unsplash.com/photo-1594736797933-d0dba35b5c24?w=400&h=300&fit=crop',
    raised: campaign.raised_amount,
    goal: campaign.goal_amount,
    donors: Math.floor(Math.random() * 500) + 50, // Mock donor count for now
    daysLeft: campaign.end_date ? Math.max(0, Math.ceil((new Date(campaign.end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))) : Math.floor(Math.random() * 30) + 1,
    category: campaign.category,
    location: campaign.location || 'Global'
  }));

  const paymentMethods = [
    { name: 'MetaMask', icon: Wallet },
    { name: 'Credit Cards', icon: CreditCard },
    { name: 'UPI/QR Codes', icon: Smartphone },
    { name: 'PayPal', icon: CreditCard }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-subtle" />
        <div className="absolute inset-0 opacity-10">
          <img 
            src={heroImage} 
            alt="Hero background" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="container relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                🚀 Powered by Blockchain
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6">
                Transforming Lives Through <span className="gradient-text">Transparent Giving</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
                Join thousands of compassionate donors making a real difference. Every rupee is tracked with blockchain transparency, 
                ensuring your generosity creates maximum impact in communities that need it most.
              </p>
              
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button size="lg" className="btn-hero" asChild>
                  <Link to="/campaigns">
                  <Heart className="h-5 w-5 mr-2" />
                  Start Donating
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="btn-secondary" asChild>
                  <Link to="/campaigns">
                  Browse Campaigns
                  <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
            
            <div className="relative animate-float">
              <img 
                src={heroImage} 
                alt="Charitable giving illustration" 
                className="w-full rounded-2xl shadow-elegant"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <Icon className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Why Choose <span className="gradient-text">GiveChain</span>?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience the future of charitable giving with our blockchain-powered platform
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="card-modern text-center">
                  <CardHeader>
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-hero rounded-full flex items-center justify-center">
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Campaigns */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Featured Campaigns</h2>
            <p className="text-xl text-muted-foreground">
              Support these urgent causes and make an immediate impact
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              // Loading skeletons
              [...Array(3)].map((_, i) => (
                <div key={i} className="card-modern animate-pulse">
                  <div className="h-48 bg-muted rounded-t-xl" />
                  <div className="p-6 space-y-4">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-full" />
                    <div className="h-3 bg-muted rounded w-2/3" />
                  </div>
                </div>
              ))
            ) : (
              featuredCampaigns.map((campaign) => (
                <CampaignCard key={campaign.id} {...campaign} />
              ))
            )}
          </div>
          
          <div className="text-center mt-12">
            <Button asChild className="btn-hero">
              <Link to="/campaigns">
                View All Campaigns
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Payment Methods */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Multiple Payment Options</h2>
            <p className="text-xl text-muted-foreground">
              Donate using your preferred payment method
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {paymentMethods.map((method, index) => {
              const Icon = method.icon;
              return (
                <div key={index} className="card-modern text-center">
                  <Icon className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <p className="font-medium">{method.name}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Newsletter & Volunteer Section */}
      <section className="py-20">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold mb-4">Stay Connected</h2>
              <p className="text-muted-foreground mb-6">
                Get updates on our impact stories, new campaigns, and ways to make a difference.
              </p>
              <NewsletterSignup />
            </div>
            
            <div>
              <h2 className="text-2xl font-bold mb-4">Volunteer with Us</h2>
              <p className="text-muted-foreground mb-6">
                Join our community of changemakers. Your skills can help amplify our impact.
              </p>
              <VolunteerSignup />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 hero-gradient">
        <div className="container">
          <div className="text-center text-white">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Every Donation Counts, Every Life Matters
            </h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Be part of something bigger. Join thousands of compassionate donors creating real change.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90" asChild>
                <Link to="/campaigns">
                  <Heart className="h-5 w-5 mr-2" />
                  Start Donating Now
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
                <Link to="/contact">
                  Create Your Campaign
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;