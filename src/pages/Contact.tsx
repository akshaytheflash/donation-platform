import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Mail, 
  MessageCircle, 
  Phone, 
  MapPin, 
  Clock,
  Send,
  Heart,
  Shield,
  HelpCircle
} from 'lucide-react';
import ChatBox from '@/components/ChatBox'; // <-- Add this import

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    type: 'general'
  });

  const [chatOpen, setChatOpen] = useState(false); // <-- Chat popup state

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Us',
      description: 'Get in touch via email',
      contact: 'hello@Donify.org',
      action: 'mailto:hello@Donify.org'
    },
    {
      icon: MessageCircle,
      title: 'Live Chat',
      description: '24/7 support available',
      contact: 'Start chat',
      action: '#'
    },
    {
      icon: Phone,
      title: 'Call Us',
      description: 'Mon-Fri 9AM-6PM EST',
      contact: '+1 (555) 123-4567',
      action: 'tel:+15551234567'
    }
  ];

  const faqItems = [
    {
      question: 'How do I track my donation?',
      answer: 'Every donation is recorded on the blockchain with a unique transaction ID. You can track your donation in real-time through your donor dashboard.'
    },
    {
      question: 'Is my donation tax-deductible?',
      answer: 'Yes, donations to verified 501(c)(3) organizations are tax-deductible. You\'ll receive a receipt with the necessary tax information.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept credit/debit cards, PayPal, UPI payments, and various cryptocurrency wallets including MetaMask and WalletConnect.'
    },
    {
      question: 'How do you ensure campaign legitimacy?',
      answer: 'All campaigns go through a rigorous verification process. We verify organizer identity, project documentation, and maintain ongoing monitoring.'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* ChatBox Popup */}
      <ChatBox open={chatOpen} onClose={() => setChatOpen(false)} />

      {/* Header */}
      <section className="py-20 lg:py-32">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              Get in Touch
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              We're Here to <span className="gradient-text">Help</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Have questions about donations, campaigns, or our platform? 
              Our team is ready to assist you every step of the way.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="pb-16">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <Card key={index} className="card-modern text-center">
                  <CardHeader>
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-hero rounded-full flex items-center justify-center">
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-lg">{info.title}</CardTitle>
                    <p className="text-muted-foreground">{info.description}</p>
                  </CardHeader>
                  <CardContent>
                    {info.title === 'Live Chat' ? (
                      <Button className="btn-hero w-full" onClick={() => setChatOpen(true)}>
                        {info.contact}
                      </Button>
                    ) : (
                      <Button asChild className="btn-hero w-full">
                        <a href={info.action}>
                          {info.contact}
                        </a>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Form & FAQ */}
      <section className="pb-20">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div>
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-4">Send us a Message</h2>
                <p className="text-muted-foreground">
                  Fill out the form below and we'll get back to you within 24 hours.
                </p>
              </div>

              <Card className="card-modern">
                <CardContent className="p-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Full Name
                        </label>
                        <Input
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          placeholder="Enter your full name"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Email Address
                        </label>
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="Enter your email"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Inquiry Type
                      </label>
                      <select
                        value={formData.type}
                        onChange={(e) => handleInputChange('type', e.target.value)}
                        className="w-full p-2 border border-border rounded-md bg-background"
                      >
                        <option value="general">General Inquiry</option>
                        <option value="donation">Donation Support</option>
                        <option value="campaign">Campaign Questions</option>
                        <option value="technical">Technical Issues</option>
                        <option value="partnership">Partnership Opportunities</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Subject
                      </label>
                      <Input
                        value={formData.subject}
                        onChange={(e) => handleInputChange('subject', e.target.value)}
                        placeholder="Brief description of your inquiry"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Message
                      </label>
                      <Textarea
                        value={formData.message}
                        onChange={(e) => handleInputChange('message', e.target.value)}
                        placeholder="Please provide details about your inquiry..."
                        rows={6}
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full btn-hero">
                      <Send className="h-4 w-4 mr-2" />
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* FAQ */}
            <div>
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-4">
                  Frequently Asked <span className="gradient-text">Questions</span>
                </h2>
                <p className="text-muted-foreground">
                  Quick answers to common questions about our platform.
                </p>
              </div>

              <div className="space-y-4">
                {faqItems.map((item, index) => (
                  <Card key={index} className="card-modern">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-start gap-3">
                        <HelpCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        {item.question}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground pl-8">
                        {item.answer}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="card-modern mt-8">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-hero rounded-full flex items-center justify-center">
                    <Heart className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Need Immediate Help?</h3>
                  <p className="text-muted-foreground mb-4">
                    For urgent donation or campaign issues, reach out directly.
                  </p>
                  <Button className="btn-hero" onClick={() => setChatOpen(true)}>
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Start Live Chat
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Office Info */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Visit Our Office</h2>
            <p className="text-muted-foreground">
              Located in the heart of the tech district
            </p>
          </div>

          <Card className="card-modern max-w-2xl mx-auto">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Address
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    123 Innovation Drive<br />
                    San Francisco, CA 94105<br />
                    United States
                  </p>

                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Office Hours
                  </h3>
                  <div className="text-muted-foreground space-y-1">
                    <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                    <p>Saturday: 10:00 AM - 4:00 PM</p>
                    <p>Sunday: Closed</p>
                  </div>
                </div>

                <div className="bg-muted/50 rounded-lg p-4 flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <MapPin className="h-12 w-12 mx-auto mb-2" />
                    <p>Interactive Map</p>
                    <p className="text-sm">Coming Soon</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Contact;