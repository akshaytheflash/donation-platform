import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Calendar, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCampaign } from '@/hooks/useCampaigns';
import ProgressBar from '@/components/ProgressBar';
import DonationForm from '@/components/DonationForm';

const Donate = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { campaign, loading } = useCampaign(id!);

  const handleDonationSuccess = () => {
    navigate(`/campaign/${id}`, { 
      state: { donationSuccess: true }
    });
  };

  const calculateDaysLeft = (endDate: string | null) => {
    if (!endDate) return null;
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Campaign not found</h1>
          <Button onClick={() => navigate('/campaigns')}>
            Browse Campaigns
          </Button>
        </div>
      </div>
    );
  }

  const daysLeft = calculateDaysLeft(campaign.end_date);
  const percentage = (campaign.raised_amount / campaign.goal_amount) * 100;

  return (
    <div className="min-h-screen py-12">
      <div className="container">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Campaign
        </Button>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Campaign Summary */}
          <div className="space-y-6">
            <div className="relative overflow-hidden rounded-xl">
              <img
                src={campaign.image_url || '/placeholder.svg'}
                alt={campaign.title}
                className="w-full h-64 object-cover"
              />
              <Badge className="absolute top-4 left-4 bg-primary/90 text-primary-foreground">
                {campaign.category}
              </Badge>
            </div>

            <div>
              <h1 className="text-3xl font-bold mb-4">{campaign.title}</h1>
              <p className="text-muted-foreground mb-6">{campaign.description}</p>
              
              <ProgressBar 
                current={campaign.raised_amount} 
                goal={campaign.goal_amount} 
                className="mb-6" 
              />

              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {percentage.toFixed(1)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Funded</div>
                </div>
                
                {daysLeft !== null && (
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{daysLeft}</div>
                    <div className="text-sm text-muted-foreground">Days Left</div>
                  </div>
                )}
              </div>

              {campaign.location && (
                <div className="flex items-center gap-2 mt-4 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{campaign.location}</span>
                </div>
              )}
            </div>
          </div>

          {/* Donation Form */}
          <div>
            <DonationForm 
              campaign={campaign} 
              onSuccess={handleDonationSuccess}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Donate;