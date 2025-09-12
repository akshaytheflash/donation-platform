import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Users, 
  Heart, 
  Download,
  DollarSign,
  Eye,
  UserCheck,
  Mail
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface DashboardStats {
  totalRaised: number;
  totalDonations: number;
  activeCampaigns: number;
  totalDonors: number;
  volunteers: number;
  newsletterSubscribers: number;
}

const Admin = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalRaised: 0,
    totalDonations: 0,
    activeCampaigns: 0,
    totalDonors: 0,
    volunteers: 0,
    newsletterSubscribers: 0,
  });
  const [recentDonations, setRecentDonations] = useState<any[]>([]);
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch dashboard statistics
      const [
        { data: donations },
        { data: campaigns },
        { data: donorsData },
        { data: volunteersData },
        { data: subscribersData }
      ] = await Promise.all([
        supabase.from('donations').select('amount, payment_status, created_at, donor_name, donor_email, campaign_id, campaigns(title)').eq('payment_status', 'completed'),
        supabase.from('campaigns').select('*').eq('status', 'active'),
        supabase.from('donations').select('donor_id, donor_email').eq('payment_status', 'completed'),
        supabase.from('volunteers').select('*'),
        supabase.from('newsletter_subscribers').select('*').eq('is_active', true)
      ]);

      const totalRaised = donations?.reduce((sum, donation) => sum + donation.amount, 0) || 0;
      const uniqueDonors = new Set(donorsData?.map(d => d.donor_id || d.donor_email)).size;

      setStats({
        totalRaised,
        totalDonations: donations?.length || 0,
        activeCampaigns: campaigns?.length || 0,
        totalDonors: uniqueDonors,
        volunteers: volunteersData?.length || 0,
        newsletterSubscribers: subscribersData?.length || 0,
      });

      setRecentDonations(donations?.slice(0, 10) || []);
      setVolunteers(volunteersData || []);
    } catch (error) {
      toast.error('Failed to load dashboard data');
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportDonorData = async () => {
    try {
      const { data } = await supabase
        .from('donations')
        .select('donor_name, donor_email, amount, created_at, campaigns(title)')
        .eq('payment_status', 'completed');

      if (data) {
        const csvContent = [
          'Donor Name,Email,Amount,Date,Campaign',
          ...data.map(d => 
            `"${d.donor_name || 'Anonymous'}","${d.donor_email || ''}","${d.amount}","${new Date(d.created_at).toLocaleDateString()}","${d.campaigns?.title || ''}"`
          )
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `donor-data-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        toast.success('Donor data exported successfully');
      }
    } catch (error) {
      toast.error('Failed to export donor data');
      console.error('Error exporting data:', error);
    }
  };

  const updateVolunteerStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('volunteers')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      setVolunteers(prev => 
        prev.map(v => v.id === id ? { ...v, status } : v)
      );

      toast.success(`Volunteer application ${status}`);
    } catch (error) {
      toast.error('Failed to update volunteer status');
      console.error('Error updating volunteer status:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your charitable platform</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
          <Card className="card-modern">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Raised</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span className="text-2xl font-bold">₹{stats.totalRaised.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="card-modern">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Donations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-primary" />
                <span className="text-2xl font-bold">{stats.totalDonations}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="card-modern">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Campaigns</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-primary" />
                <span className="text-2xl font-bold">{stats.activeCampaigns}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="card-modern">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Donors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <span className="text-2xl font-bold">{stats.totalDonors}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="card-modern">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Volunteers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-primary" />
                <span className="text-2xl font-bold">{stats.volunteers}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="card-modern">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Newsletter</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <span className="text-2xl font-bold">{stats.newsletterSubscribers}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="donations" className="space-y-6">
          <TabsList>
            <TabsTrigger value="donations">Recent Donations</TabsTrigger>
            <TabsTrigger value="volunteers">Volunteer Applications</TabsTrigger>
          </TabsList>

          <TabsContent value="donations">
            <Card className="card-modern">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Donations</CardTitle>
                  <CardDescription>Latest successful donations to campaigns</CardDescription>
                </div>
                <Button onClick={exportDonorData} className="btn-secondary">
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentDonations.map((donation, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{donation.donor_name || 'Anonymous'}</p>
                        <p className="text-sm text-muted-foreground">
                          {donation.campaigns?.title}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">₹{donation.amount.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(donation.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="volunteers">
            <Card className="card-modern">
              <CardHeader>
                <CardTitle>Volunteer Applications</CardTitle>
                <CardDescription>Review and manage volunteer applications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {volunteers.map((volunteer) => (
                    <div key={volunteer.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-medium">{volunteer.full_name}</p>
                          <p className="text-sm text-muted-foreground">{volunteer.email}</p>
                        </div>
                        <Badge 
                          variant={
                            volunteer.status === 'approved' ? 'default' :
                            volunteer.status === 'rejected' ? 'destructive' : 'secondary'
                          }
                        >
                          {volunteer.status}
                        </Badge>
                      </div>
                      
                      {volunteer.skills && (
                        <p className="text-sm mb-2">
                          <span className="font-medium">Skills:</span> {volunteer.skills}
                        </p>
                      )}
                      
                      {volunteer.availability && (
                        <p className="text-sm mb-2">
                          <span className="font-medium">Availability:</span> {volunteer.availability}
                        </p>
                      )}
                      
                      {volunteer.message && (
                        <p className="text-sm mb-4">
                          <span className="font-medium">Message:</span> {volunteer.message}
                        </p>
                      )}
                      
                      {volunteer.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            className="btn-hero"
                            onClick={() => updateVolunteerStatus(volunteer.id, 'approved')}
                          >
                            Approve
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => updateVolunteerStatus(volunteer.id, 'rejected')}
                          >
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;