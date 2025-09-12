import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Award, Calendar, DollarSign, Target } from 'lucide-react';
import { DonationCertificate } from '@/hooks/useCertificates';

interface CertificateCardProps {
  certificate: DonationCertificate & {
    donations?: {
      amount: number;
      payment_method: string;
      created_at: string;
      campaigns: {
        title: string;
        image_url: string | null;
      };
    };
  };
}

const CertificateCard = ({ certificate }: CertificateCardProps) => {
  const donation = certificate.donations;
  const campaign = donation?.campaigns;
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDonorName = () => {
    const donorAttr = certificate.metadata.attributes.find(
      attr => attr.trait_type === 'Donor Name'
    );
    return donorAttr?.value || 'Anonymous';
  };

  const getAmount = () => {
    const amountAttr = certificate.metadata.attributes.find(
      attr => attr.trait_type === 'Amount'
    );
    return amountAttr?.value || `₹${donation?.amount || 0}`;
  };

  const getCampaignName = () => {
    const campaignAttr = certificate.metadata.attributes.find(
      attr => attr.trait_type === 'Campaign'
    );
    return campaignAttr?.value || campaign?.title || 'Unknown Campaign';
  };

  return (
    <Card className="card-modern overflow-hidden hover:shadow-lg transition-all duration-300">
      <div className="relative">
        {/* Certificate Header with Gradient */}
        <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Award className="h-8 w-8" />
              <div>
                <h3 className="text-xl font-bold">NFT Certificate</h3>
                <p className="text-primary-foreground/80 text-sm">
                  {certificate.certificate_id}
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              {certificate.blockchain_network}
            </Badge>
          </div>
        </div>

        {/* Certificate Content */}
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <DollarSign className="h-4 w-4" />
                <span>Amount</span>
              </div>
              <p className="font-semibold text-lg">{getAmount()}</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Date</span>
              </div>
              <p className="font-semibold">
                {formatDate(certificate.created_at)}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Target className="h-4 w-4" />
              <span>Campaign</span>
            </div>
            <p className="font-semibold">{getCampaignName()}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Award className="h-4 w-4" />
              <span>Donor</span>
            </div>
            <p className="font-semibold">{getDonorName()}</p>
          </div>

          {certificate.token_id && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Token ID</p>
              <p className="font-mono text-sm bg-muted p-2 rounded break-all">
                {certificate.token_id}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            {certificate.opensea_url && (
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1"
                onClick={() => window.open(certificate.opensea_url!, '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View on OpenSea
              </Button>
            )}
            
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => {
                const metadata = JSON.stringify(certificate.metadata, null, 2);
                const blob = new Blob([metadata], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `certificate-${certificate.certificate_id}.json`;
                a.click();
                URL.revokeObjectURL(url);
              }}
            >
              Download Metadata
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default CertificateCard;