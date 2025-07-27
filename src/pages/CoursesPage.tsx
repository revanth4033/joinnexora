import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, Clock, Users, Search, BookOpen, TrendingUp, Award } from "lucide-react";
import { Link } from "react-router-dom";

const CoursesPage = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [enrollmentsLoading, setEnrollmentsLoading] = useState(false);

  const categories = ["all", "Programming", "Creative", "Marketing", "Design", "Data Science", "Business", "Technology"];
  const levels = ["all", "Beginner", "Intermediate", "Advanced"];

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      const response = await fetch("/api/courses");
      const data = await response.json();
      if (response.ok && data.success) {
        setCourses(data.data);
      }
      setLoading(false);
    };
    fetchCourses();
    // Fetch enrollments if logged in
    const token = localStorage.getItem("token");
    if (token) {
      setEnrollmentsLoading(true);
      fetch("/api/enrollments/my-courses", {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data && (data.data || data.enrollments)) {
            setEnrollments((data.data || data.enrollments) || []);
          }
        })
        .finally(() => setEnrollmentsLoading(false));
    }
  }, []);

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || course.category === selectedCategory;
    const matchesLevel = selectedLevel === "all" || course.level === selectedLevel;
    return matchesSearch && matchesCategory && matchesLevel;
  });

  const sortedCourses = [...filteredCourses].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rating":
        return (b.ratingAverage || 0) - (a.ratingAverage || 0);
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      default:
        return (b.enrollmentCount || 0) - (a.enrollmentCount || 0);
    }
  });

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 bg-gradient-to-br from-primary/5 via-background to-secondary/5 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -left-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-20 right-20 w-32 h-32 bg-accent/20 rounded-full blur-2xl animate-bounce" style={{ animationDelay: '0.5s' }}></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-primary/10 backdrop-blur-sm border border-primary/20 rounded-full px-6 py-3 mb-8 animate-fade-in">
                <BookOpen className="h-5 w-5 text-primary" />
                <span className="text-primary font-medium">Discover Knowledge</span>
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              </div>

              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight">
                <span className="block mb-4">Master New</span>
                <span className="bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent">
                  Skills Today
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
                Transform your career with expert-led courses designed by industry professionals. 
                <span className="block mt-2 text-primary/80 font-medium">Learn at your own pace, anywhere, anytime.</span>
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
                {[
                  { number: "500+", label: "Courses", icon: <BookOpen className="h-6 w-6" /> },
                  { number: "50K+", label: "Students", icon: <Users className="h-6 w-6" /> },
                  { number: "95%", label: "Success Rate", icon: <TrendingUp className="h-6 w-6" /> },
                  { number: "24/7", label: "Support", icon: <Award className="h-6 w-6" /> }
                ].map((stat, index) => (
                  <div key={stat.label} className="group animate-fade-in" style={{ animationDelay: `${index * 200}ms` }}>
                    <div className="p-4 bg-background/60 backdrop-blur-sm border border-primary/10 rounded-2xl hover:border-primary/30 transition-all duration-300 hover:scale-105">
                      <div className="text-primary mb-2 flex justify-center group-hover:scale-110 transition-transform duration-300">
                        {stat.icon}
                      </div>
                      <div className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-1">
                        {stat.number}
                      </div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
        </section>

        {/* Filters Section */}
        <section className="py-8 border-b bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-background/50 backdrop-blur-sm border-primary/20"
                />
              </div>

              <div className="flex gap-4 items-center">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-40 bg-background/50 backdrop-blur-sm border-primary/20">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category === "all" ? "All Categories" : category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                  <SelectTrigger className="w-32 bg-background/50 backdrop-blur-sm border-primary/20">
                    <SelectValue placeholder="Level" />
                  </SelectTrigger>
                  <SelectContent>
                    {levels.map(level => (
                      <SelectItem key={level} value={level}>
                        {level === "all" ? "All Levels" : level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40 bg-background/50 backdrop-blur-sm border-primary/20">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-4 text-muted-foreground">
              Showing {sortedCourses.length} of {courses.length} courses
            </div>
          </div>
        </section>

        {/* Courses Grid */}
        <section className="py-12 bg-gradient-to-b from-background to-muted/10">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sortedCourses.map((course) => (
                <Card key={course.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 card-gradient border-primary/10">
                  <div className="relative">
                    <img
                      src={course.thumbnail || 'https://source.unsplash.com/400x300/?ux,ui,design'}
                      alt={course.title}
                      className="w-full h-48 object-cover"
                    />
                    <Badge className="absolute top-3 left-3 bg-background/90 backdrop-blur-sm" variant="secondary">
                      {course.level}
                    </Badge>
                    <Badge className="absolute top-3 right-3 bg-primary/10 text-primary border-primary/20" variant="outline">
                      {course.category}
                    </Badge>
                  </div>
                  
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl font-bold gradient-text">${course.price}</span>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        <span className="text-sm font-medium">{course.ratingAverage || 0}</span>
                      </div>
                    </div>
                    <CardTitle className="line-clamp-2 hover:text-primary transition-colors duration-300">{course.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {course.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-sm text-muted-foreground">
                        by <span className="font-medium text-foreground">{course.instructor?.name || '-'}</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>{(course.enrollmentCount || 0).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{course.totalDuration ? `${course.totalDuration} min` : '-'}</span>
                        </div>
                      </div>

                      <Button 
                        asChild
                        className="w-full group/btn shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                      >
                        {/* If user is enrolled, add ?enrolled=1 to the link */}
                        {(() => {
                          const enrolled = enrollments.some(e => (e.courseId || e.course?.id) == course.id);
                          return (
                            <Link to={enrolled ? `/course/${course.id}?enrolled=1` : `/course/${course.id}`}>
                              <span>View Course</span>
                            </Link>
                          );
                        })()}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {sortedCourses.length === 0 && (
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
                  <Search className="h-12 w-12 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">No courses found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your search criteria or browse all courses
                </p>
                <Button onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                  setSelectedLevel("all");
                }} className="shadow-lg hover:shadow-xl transition-all duration-300">
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default CoursesPage;
