
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, Sparkles, HeadphonesIcon, Globe, Zap, Shield, CheckCircle } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitSuccess(null);
    setSubmitError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setSubmitSuccess("Your message has been sent! We'll get back to you soon.");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        const data = await res.json().catch(() => ({}));
        setSubmitError(data.message || "Failed to send message. Please try again later.");
      }
    } catch (err) {
      setSubmitError("Failed to send message. Please try again later.");
    }
    setSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactMethods = [
    {
      icon: <Mail className="h-12 w-12" />,
      title: "Email Support",
      subtitle: "Get help via email",
      content: "support@joinnexora.com",
      description: "We respond within 1 hour",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-500/10",
      feature: "Priority Support"
    },
    {
      icon: <MessageCircle className="h-12 w-12" />,
      title: "Live Chat",
      subtitle: "Instant assistance",
      content: "Start chatting now",
      description: "Available 24/7",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-500/10",
      feature: "Real-time Help"
    },
    {
      icon: <Phone className="h-12 w-12" />,
      title: "Phone Support",
      subtitle: "Direct line to experts",
      content: "+1 (555) 123-4567",
      description: "Mon-Fri, 9AM-6PM EST",
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-500/10",
      feature: "Personal Touch"
    }
  ];

  const supportFeatures = [
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Lightning Fast",
      description: "Average response time under 1 hour"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Secure & Private",
      description: "Your data is protected and confidential"
    },
    {
      icon: <CheckCircle className="h-6 w-6" />,
      title: "Expert Solutions",
      description: "Get help from our knowledgeable team"
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Global Support",
      description: "Available worldwide, in multiple languages"
    }
  ];

  console.log("Button submitting state:", submitting);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Unique Communication-Focused Hero */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        {/* Dynamic Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,hsl(var(--primary))_0%,transparent_50%)] opacity-10"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,hsl(var(--accent))_0%,transparent_50%)] opacity-10"></div>
          <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0deg,hsl(var(--primary))_20deg,transparent_40deg)] opacity-5"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center mb-20">
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 mb-6">
                <MessageCircle className="h-4 w-4 mr-2" />
                Let's Connect
              </Badge>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
                We're Here to
                <br />
                <span className="bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
                  Help You Succeed
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                Choose your preferred way to reach out. Our expert support team is ready 
                to assist you with anything you need.
              </p>
            </div>

            {/* Interactive Contact Methods */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
              {contactMethods.map((method, index) => (
                <Card 
                  key={method.title}
                  className="group relative overflow-hidden border-primary/10 hover:border-primary/30 transition-all duration-500 hover:scale-105 cursor-pointer"
                  style={{
                    animationDelay: `${index * 150}ms`,
                    animation: 'fade-in 0.8s ease-out forwards'
                  }}
                >
                  {/* Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${method.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                  
                  <CardContent className="p-8 relative text-center">
                    {/* Icon */}
                    <div className={`p-6 rounded-3xl ${method.bgColor} group-hover:scale-110 transition-transform duration-300 mx-auto mb-6 w-fit`}>
                      <div className={`bg-gradient-to-br ${method.color} bg-clip-text text-transparent`}>
                        {method.icon}
                      </div>
                    </div>
                    
                    {/* Badge */}
                    <Badge variant="outline" className="mb-4 bg-primary/5 text-primary border-primary/20">
                      {method.feature}
                    </Badge>
                    
                    {/* Content */}
                    <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors duration-300">
                      {method.title}
                    </h3>
                    <p className="text-muted-foreground mb-4">{method.subtitle}</p>
                    
                    <div className="space-y-3">
                      <div className="text-lg font-semibold">{method.content}</div>
                      <div className="text-sm text-muted-foreground">{method.description}</div>
                    </div>
                    
                    {/* Hover Effect */}
                    <div className="mt-6 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                      <Button variant="outline" size="sm" className="border-primary/20 hover:bg-primary/5">
                        Get Started
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Support Features */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {supportFeatures.map((feature, index) => (
                <div key={feature.title} className="text-center group">
                  <div className="p-4 bg-primary/10 rounded-2xl w-fit mx-auto mb-4 group-hover:bg-primary/20 transition-colors duration-300 group-hover:scale-110 transform">
                    <div className="text-primary">
                      {feature.icon}
                    </div>
                  </div>
                  <h4 className="font-semibold mb-2 group-hover:text-primary transition-colors duration-300">
                    {feature.title}
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16 bg-gradient-to-b from-background to-muted/10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Enhanced Contact Form */}
          <div>
            <Card className="card-gradient border-primary/10 shadow-xl">
              <CardHeader className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-2xl flex items-center justify-center">
                  <Send className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl gradient-text">Send us a Message</CardTitle>
                <CardDescription className="text-lg">
                  Fill out the form below and we'll get back to you as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                      Full Name
                    </label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your full name"
                      className="bg-background/50 backdrop-blur-sm border-primary/20 focus:border-primary/40"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      Email Address
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your.email@example.com"
                      className="bg-background/50 backdrop-blur-sm border-primary/20 focus:border-primary/40"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium mb-2">
                      Subject
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="What's this about?"
                      className="bg-background/50 backdrop-blur-sm border-primary/20 focus:border-primary/40"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-2">
                      Message
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us more about your inquiry..."
                      className="bg-background/50 backdrop-blur-sm border-primary/20 focus:border-primary/40"
                    />
                  </div>
                  
                  <Button
                    type="submit"
                    style={{ cursor: submitting ? "not-allowed" : "pointer" }}
                    className="w-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    // disabled={submitting}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {submitting ? "Sending..." : "Send Message"}
                  </Button>
                  {submitSuccess && <div className="text-green-600 text-center mt-2">{submitSuccess}</div>}
                  {submitError && <div className="text-red-600 text-center mt-2">{submitError}</div>}
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Contact Information */}
          <div className="space-y-8">
            <div>
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 mb-4">
                <Sparkles className="h-4 w-4 mr-2" />
                Contact Information
              </Badge>
              <h2 className="text-3xl font-bold mb-6 gradient-text">Let's Connect</h2>
              <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
                We're here to help and answer any questions you might have. 
                We look forward to hearing from you.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {[
                {
                  icon: <Mail className="h-6 w-6 text-primary" />,
                  title: "Email Us",
                  content: "support@joinnexora.com",
                  description: "We'll respond within 24 hours",
                  color: "bg-primary/10"
                },
                {
                  icon: <Phone className="h-6 w-6 text-green-500" />,
                  title: "Call Us",
                  content: "+1 (555) 123-4567",
                  description: "Mon-Fri, 9AM-6PM EST",
                  color: "bg-green-500/10"
                },
                {
                  icon: <MapPin className="h-6 w-6 text-blue-500" />,
                  title: "Visit Us",
                  content: "123 Learning St, Education City, EC 12345",
                  description: "Our headquarters",
                  color: "bg-blue-500/10"
                },
                {
                  icon: <Clock className="h-6 w-6 text-purple-500" />,
                  title: "Support Hours",
                  content: "24/7 Online Support",
                  description: "Always here to help",
                  color: "bg-purple-500/10"
                }
              ].map((info, index) => (
                <Card key={index} className="card-gradient border-primary/10 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 ${info.color} rounded-2xl hover:scale-110 transition-transform duration-300`}>
                        {info.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1 hover:text-primary transition-colors duration-300">{info.title}</h3>
                        <p className="text-muted-foreground mb-1 font-medium">{info.content}</p>
                        <p className="text-sm text-muted-foreground">{info.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Enhanced FAQ Section */}
            <Card className="card-gradient border-primary/10 shadow-xl">
              <CardContent className="p-8">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center">
                    <MessageCircle className="h-6 w-6 text-amber-500" />
                  </div>
                  <h3 className="text-xl font-semibold gradient-text">Frequently Asked Questions</h3>
                </div>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Check out our comprehensive FAQ section for quick answers to common questions about courses, pricing, and platform features.
                </p>
                <Button variant="outline" className="border-primary/20 hover:bg-primary/5 hover:border-primary/30 transition-all duration-300 hover:scale-105">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  View FAQ
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ContactPage;
