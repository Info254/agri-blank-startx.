import React from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  HelpCircle, 
  MessageCircle, 
  Mail, 
  Phone, 
  ExternalLink,
  Book,
  Users,
  Shield
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQSupport = () => {
  const faqs = [
    {
      question: "How do I get started with SokoConnect?",
      answer: "Create an account by clicking the Sign Up button. Fill in your details and choose your user type (farmer, buyer, service provider, etc.). Once registered, complete your profile to access all features."
    },
    {
      question: "Is SokoConnect available as a mobile app?",
      answer: "Yes, SokoConnect is available as a mobile app for both Android and iOS devices. You can download it from the Google Play Store or Apple App Store."
    },
    {
      question: "How does food rescue work?",
      answer: "Farmers can list surplus food, transporters offer delivery services, and organizations (schools, hospitals, children's homes) receive donations. Our smart matching system coordinates the entire supply chain efficiently."
    },
    {
      question: "What are carbon credits and how do I participate?",
      answer: "Carbon credits are generated through sustainable farming practices. Register as an interested farmer in the Carbon Forum, adopt eligible practices, and connect with verified providers who facilitate certification and trading. Typical earnings range from $15-30 per ton of CO2 offset."
    },
    {
      question: "How secure is contract farming on SokoConnect?",
      answer: "We provide milestone tracking, escrow-style payments, dispute resolution systems, and transparent documentation. You can upload contracts via Google Drive links, and both parties are protected through our verification and rating systems."
    },
    {
      question: "Can I report suspicious posts or users?",
      answer: "Yes! Every post has a report/flag option. Select the reason (spam, scam, inappropriate content, etc.) and our moderation team reviews all reports within 24-48 hours."
    },
    {
      question: "How do I contact support?",
      answer: "You can reach us via email at support@sokoconnect.co.ke, call our support line at +254 700 000 000, or visit our community forum at https://tenderzville-portal.co.ke/supply-chain-coded-forum/ for peer support."
    },
    {
      question: "What payment methods are supported?",
      answer: "We support M-Pesa, bank transfers, and cash payments. For subscriptions and premium services, credit/debit cards are also accepted."
    },
    {
      question: "How does the reward points system work?",
      answer: "Earn points by participating in food rescue, completing transactions, helping others, and contributing to the community. Points can be redeemed for platform benefits and discounts."
    },
    {
      question: "Are there any fees for using SokoConnect?",
      answer: "Basic features are free. We charge a small commission (2-5%) on completed marketplace transactions. Premium features like advanced analytics and API access have subscription fees."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-600 via-green-500 to-emerald-500 dark:from-green-900 dark:via-green-800 dark:to-emerald-900 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <HelpCircle className="h-16 w-16 mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Help & Support</h1>
          <p className="text-xl opacity-95 max-w-2xl mx-auto">
            Find answers to common questions and get the support you need
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        {/* Quick Support Options */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6 text-center">
              <MessageCircle className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Community Forum</h3>
              <p className="text-muted-foreground mb-4 text-sm">
                Get help from other farmers and community members
              </p>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => window.open('https://tenderzville-portal.co.ke/supply-chain-coded-forum/', '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Visit Forum
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6 text-center">
              <Mail className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Email Support</h3>
              <p className="text-muted-foreground mb-4 text-sm">
                Send us an email and we'll respond within 24 hours
              </p>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => window.location.href = 'mailto:support@sokoconnect.co.ke'}
              >
                <Mail className="h-4 w-4 mr-2" />
                Email Us
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6 text-center">
              <Phone className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Phone Support</h3>
              <p className="text-muted-foreground mb-4 text-sm">
                Call us for urgent issues (Mon-Fri, 8AM-6PM)
              </p>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => window.location.href = 'tel:+254700000000'}
              >
                <Phone className="h-4 w-4 mr-2" />
                Call Now
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <Card className="mb-16">
          <CardHeader>
            <CardTitle className="text-3xl flex items-center gap-3">
              <Book className="h-8 w-8" />
              Frequently Asked Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        {/* Additional Resources */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                User Guides
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="ghost" className="w-full justify-start">
                Getting Started Guide
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                Marketplace Tutorial
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                Food Rescue Guide
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                Contract Farming Best Practices
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Safety & Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="ghost" className="w-full justify-start">
                Safety Guidelines
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                How to Report Issues
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                Privacy Policy
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                Terms of Service
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Contact Information */}
        <Card className="mt-8 bg-muted/30">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4">Still need help?</h3>
              <p className="text-muted-foreground mb-6">
                Our support team is here to help you succeed
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <div className="text-sm">
                  <div className="font-medium">Email</div>
                  <a href="mailto:support@sokoconnect.co.ke" className="text-primary">
                    support@sokoconnect.co.ke
                  </a>
                </div>
                <div className="text-sm">
                  <div className="font-medium">Phone</div>
                  <a href="tel:+254700000000" className="text-primary">
                    +254 700 000 000
                  </a>
                </div>
                <div className="text-sm">
                  <div className="font-medium">Hours</div>
                  <div className="text-muted-foreground">Mon-Fri, 8AM-6PM EAT</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FAQSupport;
