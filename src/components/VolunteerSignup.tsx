import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Users, Heart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const VolunteerSignup = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    skills: '',
    availability: '',
    message: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('volunteers')
        .insert({
          full_name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          skills: formData.skills,
          availability: formData.availability,
          message: formData.message,
        });

      if (error) throw error;

      toast.success('Volunteer application submitted successfully!');
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        skills: '',
        availability: '',
        message: '',
      });
    } catch (error: any) {
      toast.error('Failed to submit application. Please try again.');
      console.error('Error submitting volunteer application:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="card-modern">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          Volunteer with Us
        </CardTitle>
        <CardDescription>
          Join our community of changemakers and help us make a difference
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="fullName">Full Name *</Label>
            <Input
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div>
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email address"
              required
            />
          </div>

          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Enter your phone number"
            />
          </div>

          <div>
            <Label htmlFor="skills">Skills & Expertise</Label>
            <Input
              id="skills"
              name="skills"
              value={formData.skills}
              onChange={handleInputChange}
              placeholder="e.g., Marketing, Teaching, Event Management"
            />
          </div>

          <div>
            <Label htmlFor="availability">Availability</Label>
            <Input
              id="availability"
              name="availability"
              value={formData.availability}
              onChange={handleInputChange}
              placeholder="e.g., Weekends, Evenings, 10 hours/week"
            />
          </div>

          <div>
            <Label htmlFor="message">Why do you want to volunteer?</Label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Tell us about your motivation to volunteer..."
              rows={4}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full btn-hero" 
            disabled={loading}
          >
            {loading ? 'Submitting...' : (
              <>
                <Heart className="h-4 w-4 mr-2" />
                Submit Application
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default VolunteerSignup;