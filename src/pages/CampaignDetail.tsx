import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { 
  Heart, 
  Share2, 
  Calendar, 
  MapPin, 
  Users, 
  TrendingUp,
  Shield,
  ChevronLeft,
  DollarSign,
  CreditCard,
  Wallet,
  Star,
  MessageCircle
} from 'lucide-react';
import ProgressBar from '@/components/ProgressBar';

const CampaignDetail = () => {
  const { id } = useParams();
  const [donationAmount, setDonationAmount] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [message, setMessage] = useState('');

  // Mock campaign data - in real app, this would be fetched based on ID
  const campaign = {
    id: '1',
    title: 'Clean Water for Rural Communities',
    description: 'Providing access to clean drinking water for remote villages in Kenya through sustainable well-drilling projects.',
    fullDescription: `Our mission is to bring clean, safe drinking water to rural communities in Kenya that have been without reliable water access for generations. Through this campaign, we aim to drill 10 new wells equipped with solar-powered pumps, serving over 2,000 people across 5 villages.

Each well will be strategically placed to serve approximately 200 people and will include:
- Professional drilling to reach clean groundwater
- Solar-powered pumping system for sustainability
- Water storage tanks for consistent supply
- Community training for maintenance
- Water quality testing and monitoring

The wells will not only provide clean water but also reduce the time women and children spend walking long distances to collect water, allowing children to attend school regularly and women to engage in income-generating activities.

We work directly with local community leaders and have partnerships with established drilling companies in Kenya. Our team includes water engineers and community development specialists who ensure each project meets international standards and serves the community's long-term needs.`,
    image: 'https://images.unsplash.com/photo-1594736797933-d0dba35b5c24?w=800&h=600&fit=crop',
    raised: 45680,
    goal: 75000,
    donors: 234,
    daysLeft: 15,
    category: 'Water',
    location: 'Kenya',
    organizer: {
      name: 'Water for All Foundation',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face',
      verified: true
    },
    updates: [
      {
        id: 1,
        date: '2024-01-15',
        title: 'First Well Successfully Drilled!',
        content: 'Great news! We\'ve completed our first well in Kibera village. The community is overjoyed to have access to clean water for the first time in decades.',
        image: 'https://images.unsplash.com/photo-1541840031508-326b77c9a17e?w=400&h=300&fit=crop'
      },
      {
        id: 2, 
        date: '2024-01-10',
        title: 'Equipment Arrives in Kenya',
        content: 'All drilling equipment has safely arrived at our staging area. Local teams are preparing for the first well drilling to begin next week.',
        image: null
      }
    ],
    recentDonations: [
      { name: 'Sarah M.', amount: 250, message: 'So important to have clean water access!', anonymous: false },
      { name: 'Anonymous', amount: 100, message: '', anonymous: true },
      { name: 'Michael R.', amount: 500, message: 'Keep up the great work!', anonymous: false },
      { name: 'Jennifer L.', amount: 75, message: 'Every drop counts 💧', anonymous: false }
    ]
  };

  const suggestedAmounts = [25, 50, 100, 250, 500];

  const handleDonate = () => {
    // In real app, this would integrate with payment processing
    console.log('Donation:', { amount: donationAmount, anonymous: isAnonymous, message });
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Back Navigation */}
      <div className="container py-4">
        <Button variant="ghost" asChild>
          <Link to="/campaigns" className="flex items-center">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Campaigns
          </Link>
        </Button>
      </div>

      {/* Campaign Header */}
      <section className="pb-8">
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="relative mb-6">
                <img
                  src={campaign.image}
                  alt={campaign.title}
                  className="w-full h-64 lg:h-96 object-cover rounded-xl"
                />
                <Badge className="absolute top-4 left-4 bg-primary/90 text-primary-foreground">
                  {campaign.category}
                </Badge>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <img
                  src={campaign.organizer.image}
                  alt={campaign.organizer.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{campaign.organizer.name}</p>
                    {campaign.organizer.verified && (
                      <Shield className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {campaign.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {campaign.daysLeft} days left
                    </span>
                  </div>
                </div>
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold mb-4">{campaign.title}</h1>
              <p className="text-lg text-muted-foreground mb-6">{campaign.description}</p>

              <div className="flex items-center gap-4 mb-8">
                <Button className="btn-hero">
                  <Heart className="h-4 w-4 mr-2" />
                  Donate Now
                </Button>
                <Button variant="outline">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>

            {/* Donation Sidebar */}
            <div className="lg:col-span-1">
              <Card className="card-modern sticky top-4">
                <CardHeader>
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2">
                      ${campaign.raised.toLocaleString()}
                    </div>
                    <div className="text-muted-foreground mb-4">
                      raised of ${campaign.goal.toLocaleString()} goal
                    </div>
                    <ProgressBar 
                      current={campaign.raised} 
                      goal={campaign.goal} 
                      showPercentage={false}
                      className="mb-4"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {campaign.donors} donors
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {campaign.daysLeft} days left
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Donation Amount</label>
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      {suggestedAmounts.map((amount) => (
                        <Button
                          key={amount}
                          variant={donationAmount === amount.toString() ? "default" : "outline"}
                          size="sm"
                          onClick={() => setDonationAmount(amount.toString())}
                        >
                          ${amount}
                        </Button>
                      ))}
                    </div>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="number"
                        placeholder="Custom amount"
                        value={donationAmount}
                        onChange={(e) => setDonationAmount(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Message (Optional)
                    </label>
                    <Textarea
                      placeholder="Share why this cause matters to you..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="anonymous"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="rounded"
                    />
                    <label htmlFor="anonymous" className="text-sm">
                      Donate anonymously
                    </label>
                  </div>

                  <Button 
                    onClick={handleDonate}
                    className="w-full btn-hero"
                    disabled={!donationAmount}
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    Donate ${donationAmount || '0'}
                  </Button>

                  <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground pt-2">
                    <span className="flex items-center gap-1">
                      <CreditCard className="h-3 w-3" />
                      Cards
                    </span>
                    <span className="flex items-center gap-1">
                      <Wallet className="h-3 w-3" />
                      Crypto
                    </span>
                    <span className="flex items-center gap-1">
                      <Shield className="h-3 w-3" />
                      Secure
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Campaign Details */}
      <section className="py-8">
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Tabs defaultValue="story" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="story">Story</TabsTrigger>
                  <TabsTrigger value="updates">Updates ({campaign.updates.length})</TabsTrigger>
                  <TabsTrigger value="donors">Donors ({campaign.donors})</TabsTrigger>
                </TabsList>
                
                <TabsContent value="story" className="mt-6">
                  <Card className="card-modern">
                    <CardContent className="p-6">
                      <div className="prose prose-gray max-w-none">
                        {campaign.fullDescription.split('\n\n').map((paragraph, index) => (
                          <p key={index} className="mb-4 text-foreground leading-relaxed">
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="updates" className="mt-6">
                  <div className="space-y-6">
                    {campaign.updates.map((update) => (
                      <Card key={update.id} className="card-modern">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <h3 className="text-lg font-semibold">{update.title}</h3>
                            <span className="text-sm text-muted-foreground">
                              {new Date(update.date).toLocaleDateString()}
                            </span>
                          </div>
                          {update.image && (
                            <img
                              src={update.image}
                              alt={update.title}
                              className="w-full h-48 object-cover rounded-lg mb-4"
                            />
                          )}
                          <p className="text-muted-foreground">{update.content}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="donors" className="mt-6">
                  <Card className="card-modern">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {campaign.recentDonations.map((donation, index) => (
                          <div key={index}>
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-hero rounded-full flex items-center justify-center">
                                  <Heart className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                  <p className="font-medium">{donation.name}</p>
                                  <p className="text-sm text-muted-foreground">
                                    Donated ${donation.amount}
                                  </p>
                                  {donation.message && (
                                    <p className="text-sm text-muted-foreground mt-1 italic">
                                      "{donation.message}"
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                            {index < campaign.recentDonations.length - 1 && (
                              <Separator className="mt-4" />
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar Info */}
            <div className="lg:col-span-1">
              <Card className="card-modern">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Campaign Stats
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Created</span>
                      <span>Dec 1, 2023</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Category</span>
                      <Badge variant="secondary">{campaign.category}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Location</span>
                      <span>{campaign.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Beneficiaries</span>
                      <span>2,000+ people</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CampaignDetail;