import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useCertificates } from './useCertificates';

export interface DonationData {
  campaign_id: string;
  amount: number;
  payment_method: 'card' | 'upi' | 'paypal' | 'crypto';
  is_anonymous: boolean;
  is_recurring: boolean;
  recurring_frequency?: 'monthly' | 'quarterly' | 'yearly';
  donor_name?: string;
  donor_email?: string;
  message?: string;
}

export const useDonations = () => {
  const [loading, setLoading] = useState(false);
  const { generateCertificate } = useCertificates();

  const createDonation = async (donationData: DonationData) => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const donation = {
        ...donationData,
        donor_id: user?.id || null,
        payment_status: 'pending',
        transaction_id: `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      };

      const { data, error } = await supabase
        .from('donations')
        .insert(donation)
        .select()
        .single();

      if (error) throw error;

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update payment status to completed
      const { error: updateError } = await supabase
        .from('donations')
        .update({ payment_status: 'completed' })
        .eq('id', data.id);

      if (updateError) throw updateError;

      // Generate NFT certificate after successful donation
      try {
        await generateCertificate(
          data.id,
          user?.id,
          donationData.donor_name,
          undefined, // Campaign title will be fetched in the function
          donationData.amount
        );
      } catch (certError) {
        console.error('Certificate generation failed:', certError);
        // Don't fail the donation if certificate generation fails
      }

      toast.success('Donation completed successfully! Your NFT certificate is being generated.');
      return data;
    } catch (error: any) {
      toast.error('Donation failed. Please try again.');
      console.error('Error creating donation:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { createDonation, loading };
};