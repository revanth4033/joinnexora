
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, Users, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const featuredCourses = [
  {
    id: 1,
    title: "Complete Video Editing Masterclass",
    description: "Master professional video editing with industry-standard tools and techniques.",
    instructor: "Alex Rodriguez",
    rating: 4.9,
    students: 12847,
    duration: "42 hours",
    price: "$99",
    originalPrice: "$199",
    image: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400&h=300&fit=crop",
    category: "Creative"
  },
  {
    id: 2,
    title: "Full Stack Web Development",
    description: "Build modern web applications with React, Node.js, and cutting-edge technologies.",
    instructor: "Sarah Chen",
    rating: 4.8,
    students: 8956,
    duration: "64 hours",
    price: "$129",
    originalPrice: "$249",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop",
    category: "Programming"
  },
  {
    id: 3,
    title: "Digital Marketing Strategy",
    description: "Learn proven strategies to grow your business with digital marketing.",
    instructor: "Mike Johnson",
    rating: 4.7,
    students: 15632,
    duration: "28 hours",
    price: "$79",
    originalPrice: "$159",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop",
    category: "Marketing"
  }
];

export const FeaturedCourses = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-background to-muted/30 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-primary/10 backdrop-blur-sm border border-primary/20 rounded-full px-6 py-3 mb-6">
            <Star className="h-5 w-5 text-primary" />
            <span className="text-primary font-medium">Featured Courses</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-foreground via-primary to-secondary bg-clip-text text-transparent">
              Most Popular
            </span>
            <span className="block">Learning Paths</span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Join thousands of students who have transformed their careers with our 
            <span className="text-primary font-medium"> expertly crafted courses</span>
          </p>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {featuredCourses.map((course, index) => (
            <Card 
              key={course.id} 
              className="group overflow-hidden border-primary/10 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 animate-fade-in"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              {/* Course Image */}
              <div className="relative overflow-hidden">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Badges */}
                <Badge className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm" variant="secondary">
                  {course.category}
                </Badge>
                
                {/* Discount Badge */}
                <Badge className="absolute top-4 right-4 bg-green-500 text-white hover:bg-green-600">
                  50% OFF
                </Badge>
              </div>

              <CardHeader className="pb-4">
                {/* Price and Rating */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-primary">{course.price}</span>
                    <span className="text-sm text-muted-foreground line-through">{course.originalPrice}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-medium">{course.rating}</span>
                  </div>
                </div>

                <CardTitle className="text-xl line-clamp-2 group-hover:text-primary transition-colors duration-300">
                  {course.title}
                </CardTitle>
                
                <CardDescription className="line-clamp-2 text-muted-foreground">
                  {course.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-0">
                {/* Course Meta */}
                <div className="space-y-3 mb-6">
                  <div className="text-sm text-muted-foreground">
                    by <span className="font-medium text-foreground">{course.instructor}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{course.students.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{course.duration}</span>
                    </div>
                  </div>
                </div>

                {/* CTA Button */}
                <Button 
                  asChild
                  className="w-full group/btn shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <Link to={`/course/${course.id}`}>
                    <span>View Course</span>
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center animate-fade-in" style={{ animationDelay: '800ms' }}>
          <Button 
            asChild
            size="lg" 
            variant="outline" 
            className="group shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <Link to="/courses">
              <span>View All Courses</span>
              <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
