import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface DonationCertificate {
  id: string;
  donation_id: string;
  donor_id: string | null;
  certificate_id: string;
  token_id: string | null;
  blockchain_network: string;
  contract_address: string | null;
  metadata: {
    name: string;
    description: string;
    image: string;
    attributes: Array<{
      trait_type: string;
      value: string;
    }>;
    donation_id: string;
    certificate_id: string;
    created_at: string;
  };
  opensea_url: string | null;
  image_url: string | null;
  minted_at: string;
  created_at: string;
}

export const useCertificates = () => {
  const [certificates, setCertificates] = useState<DonationCertificate[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUserCertificates = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Simulate fetching certificates - in a real app this would query the certificates table
      // For now, we'll return an empty array since the table doesn't exist yet
      setCertificates([]);
    } catch (error: any) {
      console.error('Error fetching certificates:', error);
      toast.error('Failed to load certificates');
    } finally {
      setLoading(false);
    }
  };

  const generateCertificate = async (
    donationId: string,
    donorId?: string,
    donorName?: string,
    campaignTitle?: string,
    amount?: number
  ) => {
    try {
      // Simulate certificate generation
      const certificateId = `CERT-${Math.random().toString(36).substr(2, 8).toUpperCase()}-${new Date().getFullYear()}`;
      const tokenId = `TOKEN-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      
      const mockCertificate: DonationCertificate = {
        id: Math.random().toString(36),
        donation_id: donationId,
        donor_id: donorId || null,
        certificate_id: certificateId,
        token_id: tokenId,
        blockchain_network: 'Polygon Mumbai Testnet',
        contract_address: null,
        metadata: {
          name: `Donation Certificate #${certificateId}`,
          description: `Certificate of donation to ${campaignTitle || 'Campaign'}`,
          image: 'https://example.com/certificate-template.png',
          attributes: [
            { trait_type: 'Donor Name', value: donorName || 'Anonymous' },
            { trait_type: 'Amount', value: `₹${amount || 0}` },
            { trait_type: 'Campaign', value: campaignTitle || 'Campaign' },
            { trait_type: 'Donation Date', value: new Date().toISOString().split('T')[0] },
            { trait_type: 'Certificate Type', value: 'One-time Donation' }
          ],
          donation_id: donationId,
          certificate_id: certificateId,
          created_at: new Date().toISOString()
        },
        opensea_url: `https://testnets.opensea.io/assets/mumbai/0x123.../${tokenId}`,
        image_url: `https://example.com/certificates/${certificateId}.png`,
        minted_at: new Date().toISOString(),
        created_at: new Date().toISOString()
      };

      // Store in localStorage for now (in a real app, this would be stored in the database)
      const existingCerts = JSON.parse(localStorage.getItem('donation_certificates') || '[]');
      existingCerts.push(mockCertificate);
      localStorage.setItem('donation_certificates', JSON.stringify(existingCerts));

      toast.success('NFT Certificate generated successfully!');
      return mockCertificate.id;
    } catch (error: any) {
      console.error('Error generating certificate:', error);
      toast.error('Failed to generate certificate');
      throw error;
    }
  };

  const getCertificateById = async (certificateId: string) => {
    try {
      const existingCerts = JSON.parse(localStorage.getItem('donation_certificates') || '[]');
      return existingCerts.find((cert: DonationCertificate) => cert.certificate_id === certificateId) || null;
    } catch (error: any) {
      console.error('Error fetching certificate:', error);
      return null;
    }
  };

  useEffect(() => {
    // Load certificates from localStorage for now
    const loadLocalCertificates = () => {
      try {
        const existingCerts = JSON.parse(localStorage.getItem('donation_certificates') || '[]');
        setCertificates(existingCerts);
      } catch (error) {
        console.error('Error loading certificates:', error);
      }
    };
    
    loadLocalCertificates();
  }, []);

  return {
    certificates,
    loading,
    fetchUserCertificates,
    generateCertificate,
    getCertificateById
  };
};