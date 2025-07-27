
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Target, Award, Globe, Heart, Sparkles, TrendingUp, BookOpen, Calendar, Lightbulb, Rocket, Shield } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const AboutPage = () => {
  const values = [
    {
      icon: <Target className="h-8 w-8 text-primary" />,
      title: "Our Mission",
      description: "To democratize quality education and make skills accessible to everyone, everywhere.",
      color: "bg-primary/10"
    },
    {
      icon: <Users className="h-8 w-8 text-blue-500" />,
      title: "Expert Instructors",
      description: "Learn from industry professionals with years of real-world experience.",
      color: "bg-blue-500/10"
    },
    {
      icon: <Award className="h-8 w-8 text-amber-500" />,
      title: "Quality Content",
      description: "Carefully curated courses designed to provide practical, job-ready skills.",
      color: "bg-amber-500/10"
    },
    {
      icon: <Globe className="h-8 w-8 text-green-500" />,
      title: "Global Community",
      description: "Join thousands of learners from around the world in your learning journey.",
      color: "bg-green-500/10"
    }
  ];

  const team = [
    {
      name: "Sarah Johnson",
      role: "CEO & Founder",
      image: "https://images.unsplash.com/photo-1494790108755-2616b332c133?w=200&h=200&fit=crop&crop=face",
      description: "Former tech executive with 15+ years in education technology.",
      gradient: "from-purple-500/10 to-pink-500/10"
    },
    {
      name: "Michael Chen",
      role: "Head of Content",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
      description: "Award-winning educator and curriculum designer.",
      gradient: "from-blue-500/10 to-cyan-500/10"
    },
    {
      name: "Emily Rodriguez",
      role: "Lead Instructor",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face",
      description: "Industry expert with expertise in digital marketing and design.",
      gradient: "from-green-500/10 to-emerald-500/10"
    }
  ];


  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Startup Journey Hero */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        {/* Dynamic Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,hsl(var(--primary))_0%,transparent_50%),radial-gradient(circle_at_80%_20%,hsl(var(--secondary))_0%,transparent_50%)] opacity-10"></div>
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,hsl(var(--primary)/5%)_25%,hsl(var(--primary)/5%)_50%,transparent_50%,transparent_75%,hsl(var(--primary)/5%)_75%)] bg-[size:20px_20px] animate-pulse"></div>
          <div className="absolute top-10 left-10 w-2 h-2 bg-primary rounded-full animate-ping"></div>
          <div className="absolute top-32 right-20 w-1 h-1 bg-secondary rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-20 left-1/4 w-1.5 h-1.5 bg-accent rounded-full animate-ping" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-3 bg-primary/10 backdrop-blur-sm border border-primary/20 rounded-full px-8 py-4 mb-8 animate-fade-in">
                <div className="relative">
                  <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                  <div className="absolute inset-0 h-5 w-5 text-primary animate-ping opacity-20">
                    <Sparkles className="h-full w-full" />
                  </div>
                </div>
                <span className="text-primary font-semibold">Fresh. Ambitious. Growing.</span>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight">
                <span className="block mb-2 text-muted-foreground text-lg md:text-xl font-normal">The journey that started in</span>
                <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-fade-in">
                  2024
                </span>
                <span className="block mt-4 text-3xl md:text-5xl lg:text-6xl">
                  Small Team,
                  <span className="block bg-gradient-to-r from-secondary via-primary to-accent bg-clip-text text-transparent">
                    Big Dreams
                  </span>
                </span>
              </h1>
              
              <div className="max-w-4xl mx-auto space-y-6">
                <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed animate-fade-in" style={{ animationDelay: '200ms' }}>
                  We're a small but passionate team that launched this year with one mission: 
                  <span className="block mt-2 text-primary font-medium">Make quality education accessible to everyone.</span>
                </p>
                
                <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-lg animate-fade-in" style={{ animationDelay: '400ms' }}>
                  <div className="flex items-center gap-2 bg-background/60 backdrop-blur-sm border border-primary/20 rounded-full px-6 py-3">
                    <Calendar className="h-5 w-5 text-primary" />
                    <span className="text-muted-foreground">Founded in 2024</span>
                  </div>
                  <div className="flex items-center gap-2 bg-background/60 backdrop-blur-sm border border-secondary/20 rounded-full px-6 py-3">
                    <Users className="h-5 w-5 text-secondary" />
                    <span className="text-muted-foreground">Small but mighty team</span>
                  </div>
                  <div className="flex items-center gap-2 bg-background/60 backdrop-blur-sm border border-accent/20 rounded-full px-6 py-3">
                    <Rocket className="h-5 w-5 text-accent" />
                    <span className="text-muted-foreground">Growing fast</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Achievement Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12 max-w-4xl mx-auto">
              {[
                { number: "5+", label: "Team Members", icon: <Users className="h-6 w-6" /> },
                { number: "50+", label: "Courses Created", icon: <BookOpen className="h-6 w-6" /> },
                { number: "1K+", label: "Early Students", icon: <TrendingUp className="h-6 w-6" /> },
                { number: "4.8", label: "Average Rating", icon: <Award className="h-6 w-6" /> }
              ].map((stat, index) => (
                <div key={stat.label} className="text-center group animate-fade-in" style={{ animationDelay: `${600 + index * 100}ms` }}>
                  <div className="p-4 bg-primary/10 rounded-2xl w-fit mx-auto mb-4 group-hover:bg-primary/20 transition-colors duration-300 group-hover:scale-110 transform">
                    <div className="text-primary">
                      {stat.icon}
                    </div>
                  </div>
                  <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">{stat.number}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 mb-4">
                <Sparkles className="h-4 w-4 mr-2" />
                Our Journey
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 gradient-text">Our Story</h2>
            </div>
            <div className="card-gradient rounded-2xl p-8 md:p-12 border border-primary/10 shadow-xl">
              <div className="prose prose-lg mx-auto text-muted-foreground">
                <p className="text-lg leading-relaxed mb-6">
                  Founded in 2020, Join Nexora was born from a simple belief: everyone deserves access to 
                  high-quality education that can transform their career and life. Our founders, having experienced 
                  the challenges of finding quality online education, set out to create a platform that would 
                  bridge the gap between learning and real-world application.
                </p>
                <p className="text-lg leading-relaxed">
                  Today, we're proud to serve over 50,000 students worldwide, offering courses that are not just 
                  informative, but transformative. Every course on our platform is designed with one goal in mind: 
                  to help you gain practical, job-ready skills that make a real difference in your career.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-gradient-to-b from-background to-muted/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 mb-4">
              <Target className="h-4 w-4 mr-2" />
              Our Values
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold gradient-text">What Drives Us</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center p-6 card-gradient border-primary/10 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <CardContent className="p-0">
                  <div className="flex justify-center mb-4">
                    <div className={`p-4 ${value.color} rounded-2xl hover:scale-110 transition-transform duration-300`}>
                      {value.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 hover:text-primary transition-colors duration-300">{value.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 mb-4">
              <Users className="h-4 w-4 mr-2" />
              Leadership Team
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold gradient-text">Meet Our Team</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {team.map((member, index) => (
              <Card key={index} className="text-center card-gradient border-primary/10 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <CardContent className="p-8">
                  <div className={`w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br ${member.gradient} p-2`}>
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-semibold mb-1 hover:text-primary transition-colors duration-300">{member.name}</h3>
                  <p className="text-primary font-medium mb-3">{member.role}</p>
                  <p className="text-muted-foreground text-sm leading-relaxed">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutPage;
