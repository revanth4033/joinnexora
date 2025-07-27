
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Award, Target, TrendingUp, Zap, Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedCourses } from "@/components/home/FeaturedCourses";
import { StatsSection } from "@/components/home/StatsSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Header />
      
      <main>
        <HeroSection />
        <FeaturedCourses />
        <StatsSection />
        <TestimonialsSection />
        
        {/* Enhanced Why Choose Us Section */}
        <section className="relative py-16 md:py-20 gradient-bg-subtle overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0">
            <div className="absolute top-10 left-10 w-20 h-20 bg-primary/5 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute bottom-20 right-20 w-32 h-32 bg-accent/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/4 w-1 h-1 bg-primary rounded-full animate-ping delay-500"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-12 md:mb-16">
              <div className="inline-flex items-center space-x-2 bg-primary/10 backdrop-blur-sm border border-primary/20 rounded-full px-4 py-2 mb-4">
                <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                <span className="text-sm font-medium text-primary">Why Choose Us</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
                Why Choose <span className="gradient-text">Join Nexora</span>?
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Unlock your potential with our comprehensive learning platform designed for professionals
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {[
                {
                  icon: <BookOpen className="h-6 w-6 md:h-8 md:w-8 text-primary" />,
                  title: "Expert-Led Courses",
                  description: "Learn from industry professionals with real-world experience",
                  color: "bg-primary/10 border-primary/20"
                },
                {
                  icon: <Award className="h-6 w-6 md:h-8 md:w-8 text-amber-500" />,
                  title: "Certified Learning",
                  description: "Earn certificates that are recognized by top companies",
                  color: "bg-amber-500/10 border-amber-500/20"
                },
                {
                  icon: <Target className="h-6 w-6 md:h-8 md:w-8 text-green-500" />,
                  title: "Practical Projects",
                  description: "Apply your skills with hands-on projects and assignments",
                  color: "bg-green-500/10 border-green-500/20"
                },
                {
                  icon: <TrendingUp className="h-6 w-6 md:h-8 md:w-8 text-purple-500" />,
                  title: "Career Growth",
                  description: "Advance your career with in-demand skills and knowledge",
                  color: "bg-purple-500/10 border-purple-500/20"
                }
              ].map((feature, index) => (
                <Card key={index} className="group text-center p-4 md:p-6 hover:shadow-xl hover:shadow-primary/10 transition-all duration-500 border-primary/10 card-gradient transform hover:scale-105 hover:-translate-y-2">
                  <CardContent className="p-0">
                    <div className="mb-4 flex justify-center">
                      <div className={`relative p-3 md:p-4 ${feature.color} rounded-full border transition-all duration-300 group-hover:scale-110`}>
                        {feature.icon}
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent/50 rounded-full animate-ping"></div>
                      </div>
                    </div>
                    <h3 className="text-lg md:text-xl font-semibold mb-2 group-hover:text-primary transition-colors duration-300">{feature.title}</h3>
                    <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced CTA Section */}
        <section className="relative py-16 md:py-20 gradient-bg-primary text-primary-foreground overflow-hidden">
          {/* 3D Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/20 to-transparent"></div>
            <div className="absolute top-10 right-10 w-24 h-24 border border-white/20 rounded-full animate-spin" style={{animationDuration: '20s'}}></div>
            <div className="absolute bottom-10 left-10 w-16 h-16 border border-white/20 rounded-full animate-bounce"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white/30 rounded-full animate-ping"></div>
          </div>

          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="max-w-4xl mx-auto">
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
                <Zap className="h-4 w-4 text-white animate-pulse" />
                <span className="text-sm font-medium text-white">Start Your Journey</span>
              </div>
              
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 md:mb-6">Start Your Learning Journey Today</h2>
              <p className="text-lg md:text-xl mb-6 md:mb-8 opacity-90 max-w-2xl mx-auto leading-relaxed">
                Join thousands of professionals who have transformed their careers with Join Nexora
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button asChild size="lg" variant="secondary" className="text-base md:text-lg px-6 md:px-8 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 group">
                  <Link to="/courses">
                    Browse Courses
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-base md:text-lg px-6 md:px-8 bg-transparent border-white/30 text-white hover:bg-white/10 hover:border-white/50 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                  <Link to="/signup">Get Started Free</Link>
                </Button>
              </div>

              {/* Enhanced Trust Indicators */}
              <div className="mt-10 md:mt-12 grid grid-cols-2 sm:grid-cols-4 gap-6 md:gap-8 opacity-80">
                <div className="text-center group">
                  <div className="text-xl md:text-2xl font-bold mb-1 group-hover:scale-110 transition-transform duration-300">50K+</div>
                  <div className="text-xs md:text-sm opacity-75">Active Learners</div>
                </div>
                <div className="text-center group">
                  <div className="text-xl md:text-2xl font-bold mb-1 group-hover:scale-110 transition-transform duration-300">200+</div>
                  <div className="text-xs md:text-sm opacity-75">Expert Courses</div>
                </div>
                <div className="text-center group">
                  <div className="text-xl md:text-2xl font-bold mb-1 group-hover:scale-110 transition-transform duration-300">4.9★</div>
                  <div className="text-xs md:text-sm opacity-75">Average Rating</div>
                </div>
                <div className="text-center group">
                  <div className="text-xl md:text-2xl font-bold mb-1 group-hover:scale-110 transition-transform duration-300">99%</div>
                  <div className="text-xs md:text-sm opacity-75">Success Rate</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
