import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  Users, 
  Globe, 
  Heart,
  Droplets,
  GraduationCap,
  Home,
  TreePine,
  Stethoscope,
  Shield,
  Calendar,
  MapPin,
  Target
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Impact = () => {
  const overallStats = [
    { 
      icon: TrendingUp, 
      label: 'Total Funds Raised', 
      value: '$2,847,592',
      subtitle: '+23% from last month',
      color: 'text-green-500'
    },
    { 
      icon: Users, 
      label: 'Lives Impacted', 
      value: '156,342',
      subtitle: 'Across 89 countries',
      color: 'text-blue-500'
    },
    { 
      icon: Target, 
      label: 'Projects Completed', 
      value: '1,247',
      subtitle: '94% success rate',
      color: 'text-purple-500'
    },
    { 
      icon: Globe, 
      label: 'Active Donors', 
      value: '45,678',
      subtitle: 'Monthly active users',
      color: 'text-orange-500'
    }
  ];

  const categoryImpact = [
    {
      icon: Droplets,
      category: 'Clean Water',
      raised: '$489,234',
      beneficiaries: '28,450',
      projects: 67,
      description: 'Wells drilled and water systems installed',
      color: 'bg-blue-500'
    },
    {
      icon: GraduationCap,
      category: 'Education',
      raised: '$623,891',
      beneficiaries: '45,230',
      projects: 234,
      description: 'Students supported with supplies and scholarships',
      color: 'bg-green-500'
    },
    {
      icon: Stethoscope,
      category: 'Healthcare',
      raised: '$756,123',
      beneficiaries: '32,167',
      projects: 89,
      description: 'Medical treatments and equipment provided',
      color: 'bg-red-500'
    },
    {
      icon: Home,
      category: 'Emergency Relief',
      raised: '$892,456',
      beneficiaries: '67,890',
      projects: 156,
      description: 'Families provided with emergency assistance',
      color: 'bg-orange-500'
    },
    {
      icon: TreePine,
      category: 'Environment',
      raised: '$234,567',
      beneficiaries: '125,000',
      projects: 45,
      description: 'Trees planted and conservation projects',
      color: 'bg-emerald-500'
    }
  ];

  const recentProjects = [
    {
      id: 1,
      title: 'Solar Power for Rural Schools',
      location: 'Kenya',
      completed: '2024-01-15',
      raised: '$45,000',
      beneficiaries: 1200,
      image: 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=400&h=300&fit=crop',
      description: 'Installed solar panels in 12 rural schools, providing electricity for the first time.'
    },
    {
      id: 2,
      title: 'Emergency Food Distribution',
      location: 'Philippines',
      completed: '2024-01-10',
      raised: '$78,500',
      beneficiaries: 2500,
      image: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=400&h=300&fit=crop',
      description: 'Distributed emergency food supplies to families affected by typhoon.'
    },
    {
      id: 3,
      title: 'Mobile Medical Clinic',
      location: 'Brazil',
      completed: '2023-12-28',
      raised: '$92,300',
      beneficiaries: 850,
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop',
      description: 'Launched mobile clinic serving remote communities with basic healthcare.'
    }
  ];

  const milestones = [
    {
      date: '2024-01-20',
      title: 'Reached $2.5M in Total Donations',
      description: 'A major milestone celebrating our community\'s generosity'
    },
    {
      date: '2023-12-15',
      title: 'Launched in 10 New Countries',
      description: 'Expanded our reach to serve more communities globally'
    },
    {
      date: '2023-11-30',
      title: '1000th Project Completed',
      description: 'Celebrated our thousandth successful project completion'
    },
    {
      date: '2023-10-25',
      title: 'Blockchain Integration Launch',
      description: 'Introduced full transparency with blockchain tracking'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <section className="py-20 lg:py-32">
        <div className="container">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              Impact Report
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Measuring Our <span className="gradient-text">Impact</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Transparency is at the heart of everything we do. See how your donations 
              are creating real, measurable change around the world.
            </p>
          </div>
        </div>
      </section>

      {/* Overall Statistics */}
      <section className="pb-16">
        <div className="container">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {overallStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="card-modern text-center">
                  <CardHeader>
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-hero rounded-full flex items-center justify-center">
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="text-3xl font-bold mb-2">
                      {stat.value}
                    </div>
                    <CardTitle className="text-lg">{stat.label}</CardTitle>
                    <p className={`text-sm ${stat.color}`}>
                      {stat.subtitle}
                    </p>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Category Impact */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Impact by <span className="gradient-text">Category</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              See how donations are making a difference across different cause areas
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categoryImpact.map((category, index) => {
              const Icon = category.icon;
              return (
                <Card key={index} className="card-modern">
                  <CardHeader>
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{category.category}</CardTitle>
                        <p className="text-muted-foreground">{category.projects} projects</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Raised:</span>
                        <span className="font-semibold">{category.raised}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Beneficiaries:</span>
                        <span className="font-semibold">{category.beneficiaries}</span>
                      </div>
                      <p className="text-sm text-muted-foreground pt-2">
                        {category.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Recent Completed Projects */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Recently Completed Projects</h2>
            <p className="text-xl text-muted-foreground">
              See the latest projects that have reached their goals and delivered impact
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentProjects.map((project) => (
              <Card key={project.id} className="card-modern">
                <CardHeader className="p-0">
                  <div className="relative">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-48 object-cover rounded-t-xl"
                    />
                    <Badge className="absolute top-3 left-3 bg-green-500 text-white">
                      Completed
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-2">{project.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {project.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(project.completed).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-4">
                    {project.description}
                  </p>
                  
                  <div className="flex justify-between text-sm">
                    <div>
                      <p className="text-muted-foreground">Raised</p>
                      <p className="font-semibold">{project.raised}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-muted-foreground">Beneficiaries</p>
                      <p className="font-semibold">{project.beneficiaries.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button asChild className="btn-hero">
              <Link to="/campaigns">
                View All Projects
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Milestones Timeline */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Our Journey</h2>
            <p className="text-xl text-muted-foreground">
              Key milestones in our mission to revolutionize charitable giving
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex gap-6">
                  <div className="flex flex-col items-center">
                    <div className="w-4 h-4 bg-primary rounded-full"></div>
                    {index < milestones.length - 1 && (
                      <div className="w-0.5 h-16 bg-border mt-2"></div>
                    )}
                  </div>
                  <div className="flex-1 pb-8">
                    <div className="flex items-center gap-4 mb-2">
                      <h3 className="text-lg font-semibold">{milestone.title}</h3>
                      <Badge variant="secondary" className="text-xs">
                        {new Date(milestone.date).toLocaleDateString()}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground">{milestone.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Transparency Section */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Built on <span className="gradient-text">Transparency</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Every donation is tracked on the blockchain for complete accountability
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="card-modern text-center">
              <CardHeader>
                <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Blockchain Verified</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  All transactions are recorded on an immutable blockchain ledger
                </p>
              </CardContent>
            </Card>

            <Card className="card-modern text-center">
              <CardHeader>
                <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Real-time Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Monitor your donation's journey from contribution to impact
                </p>
              </CardContent>
            </Card>

            <Card className="card-modern text-center">
              <CardHeader>
                <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Impact Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Regular updates showing exactly how funds are being used
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 hero-gradient">
        <div className="container">
          <div className="text-center text-white">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Be Part of Our Impact Story
            </h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Join thousands of donors who are creating measurable, transparent change worldwide
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90">
                <Link to="/campaigns">
                  <Heart className="h-5 w-5 mr-2" />
                  Start Donating
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Link to="/about">
                  Learn More
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Impact;