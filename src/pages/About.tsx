import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Users, 
  Globe, 
  Heart, 
  CheckCircle, 
  Target,
  Award,
  TrendingUp
} from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
  const values = [
    {
      icon: Shield,
      title: 'Transparency',
      description: 'Every donation is tracked on the blockchain, ensuring complete transparency and accountability.'
    },
    {
      icon: Users,
      title: 'Community',
      description: 'We believe in the power of collective action to create meaningful change worldwide.'
    },
    {
      icon: Globe,
      title: 'Global Impact',
      description: 'Connecting donors with causes across the globe to maximize positive social impact.'
    },
    {
      icon: Heart,
      title: 'Compassion',
      description: 'Driven by empathy and the desire to help those who need it most.'
    }
  ];

  const achievements = [
    { icon: TrendingUp, label: 'Total Raised', value: '$2.4M+' },
    { icon: Users, label: 'Global Donors', value: '45,000+' },
    { icon: Target, label: 'Projects Funded', value: '1,247' },
    { icon: Globe, label: 'Countries Reached', value: '89' }
  ];

  const team = [
    {
      name: 'Coming Soon',
      role: 'Role to be Announced',
      bio: 'Our updated team details will be published here shortly.'
    },
    {
      name: 'Coming Soon',
      role: 'Role to be Announced',
      bio: 'Our updated team details will be published here shortly.'
    },
    {
      name: 'Coming Soon',
      role: 'Role to be Announced',
      bio: 'Our updated team details will be published here shortly.'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 lg:py-32 bg-gradient-subtle">
        <div className="container">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              Our Mission
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Revolutionizing <span className="gradient-text">Charitable Giving</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              We're building the future of transparent, accountable charitable donations using 
              blockchain technology to ensure every dollar reaches those who need it most.
            </p>
            <Button asChild size="lg" className="btn-hero">
              <Link to="/campaigns">
                <Heart className="h-5 w-5 mr-2" />
                Start Making Impact
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-20">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                Why We Built <span className="gradient-text">GiveChain</span>
              </h2>
              <div className="space-y-4 text-lg text-muted-foreground">
                <p>
                  Traditional charitable giving often lacks transparency, leaving donors unsure 
                  about how their contributions are being used. We saw an opportunity to leverage 
                  blockchain technology to solve this fundamental problem.
                </p>
                <p>
                  By recording every donation on an immutable ledger, we provide unprecedented 
                  transparency and accountability. Donors can track their contributions from the 
                  moment they give until the impact is delivered.
                </p>
                <p>
                  Our platform bridges the gap between compassionate individuals wanting to help 
                  and meaningful causes that need support, creating a more efficient and trustworthy 
                  charitable ecosystem.
                </p>
              </div>
            </div>
            
            <div className="relative">
              <div className="card-modern p-8">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-hero rounded-full flex items-center justify-center mr-4">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold">Our Promise</h3>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-primary mr-3" />
                    <span>100% transparent fund allocation</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-primary mr-3" />
                    <span>Blockchain-verified transactions</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-primary mr-3" />
                    <span>Regular impact reporting</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-primary mr-3" />
                    <span>Zero hidden fees</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Our Core Values</h2>
            <p className="text-xl text-muted-foreground">
              The principles that guide everything we do
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card key={index} className="card-modern text-center">
                  <CardHeader>
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-hero rounded-full flex items-center justify-center">
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-lg">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Our Impact So Far</h2>
            <p className="text-xl text-muted-foreground">
              Together, we're making a real difference
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => {
              const Icon = achievement.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-hero rounded-full flex items-center justify-center">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold mb-2">{achievement.value}</div>
                  <div className="text-muted-foreground">{achievement.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Meet Our Team</h2>
            <p className="text-xl text-muted-foreground mb-4">
              Passionate individuals working to change the world
            </p>
            <p className="text-muted-foreground">
              We're finalizing our team profiles — check back soon for updates!
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="card-modern text-center">
                <CardHeader>
                  <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-gradient-hero flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">CC</span>
                  </div>
                  <CardTitle className="text-xl">{member.name}</CardTitle>
                  <Badge variant="secondary" className="mx-auto">
                    {member.role}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Technology */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Built on <span className="gradient-text">Cutting-Edge Technology</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Leveraging blockchain for transparency and smart contracts for automation
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="card-modern">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-hero rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Polygon Blockchain</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Fast, secure, and eco-friendly blockchain for recording all transactions
                </p>
              </CardContent>
            </Card>
            
            <Card className="card-modern">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-hero rounded-lg flex items-center justify-center mb-4">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Smart Contracts</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Automated fund release based on predefined milestones and conditions
                </p>
              </CardContent>
            </Card>
            
            <Card className="card-modern">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-hero rounded-lg flex items-center justify-center mb-4">
                  <Globe className="h-6 w-6 text-white" />
                </div>
                <CardTitle>IPFS Storage</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Decentralized storage for campaign images and donation receipts
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
              Join Our Mission
            </h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Whether you're a donor, nonprofit, or simply someone who believes in transparent giving, 
              there's a place for you in our community.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90">
                <Link to="/campaigns">
                  Browse Campaigns
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Link to="/contact">
                  Get in Touch
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;