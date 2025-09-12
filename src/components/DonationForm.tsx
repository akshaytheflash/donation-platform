import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreditCard, Smartphone, Wallet, DollarSign, Heart, Shield, Award } from 'lucide-react';
import { useDonations } from '@/hooks/useDonations';
import { Campaign } from '@/hooks/useCampaigns';
import { toast } from 'sonner';

interface DonationFormProps {
  campaign: Campaign;
  onSuccess?: () => void;
}

const DonationForm = ({ campaign, onSuccess }: DonationFormProps) => {
  const { createDonation, loading } = useDonations();
  const [amount, setAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringFrequency, setRecurringFrequency] = useState('monthly');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [message, setMessage] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const suggestedAmounts = [500, 1000, 2500, 5000];

  const getDonationAmount = () => {
    return amount === 'custom' ? parseFloat(customAmount) : parseFloat(amount);
  };

  // Clear donor info when switching to anonymous
  const handleAnonymousChange = (checked: boolean) => {
    setIsAnonymous(checked);
    if (checked) {
      setDonorName('');
      setDonorEmail('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const donationAmount = getDonationAmount();
    if (!donationAmount || donationAmount <= 0) {
      toast.error('Please enter a valid donation amount');
      setFormError('Please enter a valid donation amount');
      return;
    }

    if (!isAnonymous && (!donorName || !donorEmail)) {
      toast.error('Please provide your name and email');
      setFormError('Please provide your name and email');
      return;
    }

    try {
      await createDonation({
        campaign_id: campaign.id,
        amount: donationAmount,
        payment_method: paymentMethod as any,
        is_anonymous: isAnonymous,
        is_recurring: isRecurring,
        recurring_frequency: isRecurring ? recurringFrequency as any : undefined,
        donor_name: isAnonymous ? undefined : donorName,
        donor_email: isAnonymous ? undefined : donorEmail,
        message: message || undefined,
      });
      onSuccess?.();
    } catch (error: any) {
      // Show error details in toast and on form, and log to console
      const errorMsg = error?.message || error?.error_description || error?.toString() || 'Donation failed';
      toast.error(`Donation failed: ${errorMsg}`);
      setFormError(errorMsg);
      console.error('Donation error:', error);
    }
  };

  return (
    <Card className="card-modern">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-primary" />
          Make a Donation
        </CardTitle>
        <CardDescription>
          Support "{campaign.title}" and make a real difference
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {formError && (
            <div className="p-3 mb-2 rounded bg-red-100 text-red-700 border border-red-300 text-sm">
              {formError}
            </div>
          )}
          {/* Donation Amount */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Donation Amount (₹)</Label>
            <RadioGroup value={amount} onValueChange={setAmount}>
              <div className="grid grid-cols-2 gap-2">
                {suggestedAmounts.map((suggestedAmount) => (
                  <div key={suggestedAmount} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                    <RadioGroupItem value={suggestedAmount.toString()} id={`amount-${suggestedAmount}`} />
                    <Label htmlFor={`amount-${suggestedAmount}`} className="cursor-pointer flex-1">
                      ₹{suggestedAmount.toLocaleString()}
                    </Label>
                  </div>
                ))}
              </div>
              <div className="flex items-center space-x-2 p-3 border rounded-lg">
                <RadioGroupItem value="custom" id="amount-custom" />
                <Label htmlFor="amount-custom" className="cursor-pointer">Custom Amount:</Label>
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="flex-1 ml-2"
                  min="1"
                />
              </div>
            </RadioGroup>
          </div>

          {/* Payment Method */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Payment Method</Label>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50">
                  <RadioGroupItem value="card" id="payment-card" />
                  <CreditCard className="h-4 w-4" />
                  <Label htmlFor="payment-card" className="cursor-pointer flex-1">Credit/Debit Card</Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50">
                  <RadioGroupItem value="upi" id="payment-upi" />
                  <Smartphone className="h-4 w-4" />
                  <Label htmlFor="payment-upi" className="cursor-pointer flex-1">UPI / QR Code</Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50">
                  <RadioGroupItem value="crypto" id="payment-crypto" />
                  <Wallet className="h-4 w-4" />
                  <Label htmlFor="payment-crypto" className="cursor-pointer flex-1">Crypto Wallet</Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50">
                  <RadioGroupItem value="paypal" id="payment-paypal" />
                  <DollarSign className="h-4 w-4" />
                  <Label htmlFor="payment-paypal" className="cursor-pointer flex-1">PayPal</Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* Recurring Donation */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="recurring" 
                checked={isRecurring}
                onCheckedChange={(checked) => setIsRecurring(checked as boolean)}
              />
              <Label htmlFor="recurring" className="text-base font-semibold cursor-pointer">
                Make this a recurring donation
              </Label>
            </div>
            
            {isRecurring && (
              <Select value={recurringFrequency} onValueChange={setRecurringFrequency}>
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Anonymous Donation */}
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="anonymous" 
              checked={isAnonymous}
              onCheckedChange={handleAnonymousChange}
            />
            <Label htmlFor="anonymous" className="text-base font-semibold cursor-pointer">
              Donate anonymously
            </Label>
          </div>

          {/* Donor Information */}
          {!isAnonymous && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="donor-name">Full Name *</Label>
                <Input
                  id="donor-name"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="donor-email">Email Address *</Label>
                <Input
                  id="donor-email"
                  type="email"
                  value={donorEmail}
                  onChange={(e) => setDonorEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                />
              </div>
            </div>
          )}

          {/* Message */}
          <div>
            <Label htmlFor="message">Message (Optional)</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Leave a message of support..."
              rows={3}
            />
          </div>

          {/* Security Notice */}
          <div className="flex items-start gap-2 p-4 bg-muted/50 rounded-lg">
            <Shield className="h-5 w-5 text-primary mt-0.5" />
            <div className="text-sm">
              <p className="font-medium">Secure Donation</p>
              <p className="text-muted-foreground">
                Your donation is protected by bank-level encryption and security measures.
              </p>
            </div>
          </div>

          {/* NFT Certificate Notice */}
          <div className="flex items-start gap-2 p-4 bg-primary/10 rounded-lg border border-primary/20">
            <Award className="h-5 w-5 text-primary mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-primary">NFT Certificate Included</p>
              <p className="text-muted-foreground">
                You'll receive a unique blockchain certificate for your donation that you can view and share.
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full btn-hero" 
            size="lg"
            disabled={loading}
          >
            {loading ? 'Processing...' : `Donate ₹${getDonationAmount() || 0}`}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default DonationForm;