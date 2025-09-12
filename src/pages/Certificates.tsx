import { useState } from 'react';
import { Award, Search, Filter, Download, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCertificates } from '@/hooks/useCertificates';
import CertificateCard from '@/components/CertificateCard';
import { useAuth } from '@/context/AuthContext';

const Certificates = () => {
  const { certificates, loading, fetchUserCertificates } = useCertificates();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const { user, loading: authLoading } = useAuth();

  const filteredCertificates = certificates.filter(cert => {
    const matchesSearch = cert.certificate_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.metadata.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterBy === 'all') return matchesSearch;
    if (filterBy === 'recent') {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      return matchesSearch && new Date(cert.created_at) > oneMonthAgo;
    }
    
    return matchesSearch;
  });

  const downloadAllCertificates = () => {
    const allMetadata = certificates.map(cert => cert.metadata);
    const blob = new Blob([JSON.stringify(allMetadata, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'all-certificates.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen py-12 flex items-center justify-center">
        <div className="text-lg text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen py-12">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <Award className="h-16 w-16 text-primary mx-auto mb-6" />
            <h1 className="text-3xl font-bold mb-4">My NFT Certificates</h1>
            <p className="text-muted-foreground mb-8">
              Please sign in to view your donation certificates
            </p>
            <Button size="lg" onClick={() => window.location.href = '/auth'}>
              Sign In
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-12">
          <Award className="h-16 w-16 text-primary mx-auto mb-6" />
          <h1 className="text-4xl font-bold mb-4">My NFT Certificates</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your blockchain-verified donation certificates. Each NFT represents a unique 
            contribution you've made to meaningful causes.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Award className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold">{certificates.length}</div>
              <div className="text-sm text-muted-foreground">Total Certificates</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <ExternalLink className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold">
                {certificates.filter(c => c.opensea_url).length}
              </div>
              <div className="text-sm text-muted-foreground">On OpenSea</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Download className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold">JSON</div>
              <div className="text-sm text-muted-foreground">
                <Button 
                  variant="link" 
                  size="sm" 
                  className="p-0 h-auto"
                  onClick={downloadAllCertificates}
                  disabled={certificates.length === 0}
                >
                  Download All
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search certificates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <Select value={filterBy} onValueChange={setFilterBy}>
              <SelectTrigger className="w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Certificates</SelectItem>
                <SelectItem value="recent">Recent (30 days)</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" onClick={fetchUserCertificates} disabled={loading}>
              Refresh
            </Button>
          </div>
        </div>

        {/* Certificates Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="h-3 bg-muted rounded"></div>
                    <div className="h-3 bg-muted rounded w-2/3"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredCertificates.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCertificates.map((certificate) => (
              <CertificateCard key={certificate.id} certificate={certificate} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Award className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
              <CardTitle className="mb-2">No Certificates Found</CardTitle>
              <CardDescription className="mb-6">
                {searchTerm || filterBy !== 'all' 
                  ? 'No certificates match your search criteria.'
                  : 'You haven\'t received any NFT certificates yet. Make a donation to get your first certificate!'
                }
              </CardDescription>
              {!searchTerm && filterBy === 'all' && (
                <Button onClick={() => window.location.href = '/campaigns'}>
                  Browse Campaigns
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Certificates;