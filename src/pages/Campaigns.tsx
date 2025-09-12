import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import CampaignCard from '@/components/CampaignCard';
import { useCampaigns } from '@/hooks/useCampaigns';

const Campaigns = () => {
  const { campaigns: dbCampaigns, loading } = useCampaigns();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('trending');

  // Transform database campaigns to match component props
  const campaigns = dbCampaigns.map(campaign => ({
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

  const categories = ['All Categories', ...Array.from(new Set(campaigns.map(c => c.category)))];

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                           campaign.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="text-center mb-8">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Active <span className="gradient-text">Campaigns</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover causes that matter to you and make a direct impact with transparent, 
              blockchain-verified donations.
            </p>
          </div>
          
          <div className="flex justify-center">
            <Button asChild className="btn-hero">
              <Link to="/start-campaign">
                <Plus className="h-5 w-5 mr-2" />
                Start Your Campaign
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 border-b">
        <div className="container">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search campaigns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category, index) => (
                  <SelectItem 
                    key={index} 
                    value={index === 0 ? 'all' : category.toLowerCase()}
                  >
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="trending">Trending</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="ending-soon">Ending Soon</SelectItem>
                <SelectItem value="most-funded">Most Funded</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Campaign Grid */}
      <section className="py-16">
        <div className="container">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold">
                {filteredCampaigns.length} Campaigns Found
              </h2>
              {selectedCategory !== 'all' && (
                <Badge variant="secondary" className="capitalize">
                  {selectedCategory}
                </Badge>
              )}
            </div>
            
            <Button variant="ghost" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
          
          {loading ? (
            // Loading skeletons
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="card-modern animate-pulse">
                  <div className="h-48 bg-muted rounded-t-xl" />
                  <div className="p-6 space-y-4">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-full" />
                    <div className="h-3 bg-muted rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredCampaigns.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold mb-2">No campaigns found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search terms or filters
              </p>
              <Button onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}>
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCampaigns.map((campaign) => (
                <CampaignCard key={campaign.id} {...campaign} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Load More */}
      {filteredCampaigns.length > 0 && (
        <section className="pb-16">
          <div className="container text-center">
            <Button variant="outline" size="lg">
              Load More Campaigns
            </Button>
          </div>
        </section>
      )}
    </div>
  );
};

export default Campaigns;