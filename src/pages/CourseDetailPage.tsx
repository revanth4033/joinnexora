import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, Star, Play, Lock, CheckCircle, BookOpen, Award, Calendar, Globe, Zap, Target } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import YouTube from 'react-youtube';
import AdCard from '@/components/layout/AdCard';
import { Star as StarIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// Course data for different courses
const coursesData = {
  1: {
    id: "1",
    title: "Complete Video Editing Masterclass 2024",
    subtitle: "Master Professional Video Editing with Industry-Standard Tools",
    description: "Transform your creative vision into stunning visual stories. This comprehensive course covers everything from basic editing principles to advanced color grading and motion graphics.",
    price: "₹4,999",
    originalPrice: "₹9,999",
    instructor: {
      name: "Sarah Johnson",
      title: "Senior Video Editor at Netflix",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b5f5?w=100&h=100&fit=crop&crop=face",
      experience: "8+ years"
    },
    rating: 4.9,
    students: 1234,
    duration: "12 hours",
    lessons: 45,
    level: "Beginner",
    language: "English",
    lastUpdated: "December 2024",
    image: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=800&h=400&fit=crop",
    category: "Creative"
  },
  2: {
    id: "2",
    title: "Full Stack Web Development Bootcamp",
    subtitle: "Build Modern Web Applications with React, Node.js, and MongoDB",
    description: "Learn to build complete web applications from scratch using modern technologies. This comprehensive course covers frontend, backend, and database development.",
    price: "₹7,999",
    originalPrice: "₹14,999",
    instructor: {
      name: "Mike Chen",
      title: "Senior Full Stack Developer at Google",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      experience: "10+ years"
    },
    rating: 4.8,
    students: 2156,
    duration: "24 hours",
    lessons: 89,
    level: "Intermediate",
    language: "English",
    lastUpdated: "December 2024",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop",
    category: "Programming"
  },
  3: {
    id: "3",
    title: "Digital Marketing Mastery Course",
    subtitle: "Learn SEO, Social Media Marketing, and Paid Advertising",
    description: "Master the art of digital marketing with proven strategies that work. Learn to drive traffic, generate leads, and grow businesses online.",
    price: "₹3,999",
    originalPrice: "₹7,999",
    instructor: {
      name: "Emma Davis",
      title: "Digital Marketing Director at HubSpot",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      experience: "7+ years"
    },
    rating: 4.7,
    students: 987,
    duration: "16 hours",
    lessons: 67,
    level: "Beginner",
    language: "English",
    lastUpdated: "December 2024",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop",
    category: "Marketing"
  },
  4: {
    id: "4",
    title: "UI/UX Design Fundamentals",
    subtitle: "Create Beautiful and User-Friendly Interfaces",
    description: "Learn modern design principles and create stunning user interfaces. Master Figma, user research, and design thinking methodologies.",
    price: "₹5,999",
    originalPrice: "₹11,999",
    instructor: {
      name: "Lisa Park",
      title: "Senior UX Designer at Apple",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
      experience: "9+ years"
    },
    rating: 4.9,
    students: 1567,
    duration: "18 hours",
    lessons: 72,
    level: "Beginner",
    language: "English",
    lastUpdated: "December 2024",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=400&fit=crop",
    category: "Design"
  },
  5: {
    id: "5",
    title: "Data Science with Python Mastery",
    subtitle: "Analyze Data, Build ML Models, and Create Visualizations",
    description: "Become a data scientist and learn to extract insights from data. Master Python, pandas, machine learning, and data visualization libraries.",
    price: "₹9,999",
    originalPrice: "₹19,999",
    instructor: {
      name: "David Wilson",
      title: "Lead Data Scientist at Microsoft",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      experience: "12+ years"
    },
    rating: 4.6,
    students: 892,
    duration: "32 hours",
    lessons: 128,
    level: "Advanced",
    language: "English",
    lastUpdated: "December 2024",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
    category: "Data Science"
  },
  6: {
    id: "6",
    title: "Business Strategy & Leadership",
    subtitle: "Develop Strategic Thinking and Leadership Skills",
    description: "Learn to lead teams and make strategic business decisions. Develop essential leadership skills for modern business environments.",
    price: "₹4,499",
    originalPrice: "₹8,999",
    instructor: {
      name: "Jennifer Adams",
      title: "Business Strategy Consultant",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face",
      experience: "15+ years"
    },
    rating: 4.8,
    students: 743,
    duration: "14 hours",
    lessons: 56,
    level: "Intermediate",
    language: "English",
    lastUpdated: "December 2024",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop",
    category: "Business"
  }
};

function getYouTubeId(url: string) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (document.getElementById('razorpay-sdk')) return resolve(true);
    const script = document.createElement('script');
    script.id = 'razorpay-sdk';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

// Progress helpers
function getProgressKey(courseId: string, userId: string) {
  return `progress_${userId}_${courseId}`;
}
function getCompletedLessons(courseId: string, userId: string): string[] {
  try {
    return JSON.parse(localStorage.getItem(getProgressKey(courseId, userId)) || "[]");
  } catch {
    return [];
  }
}

// Add review types
interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  student: { name: string; avatar?: string };
}

const CourseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isEnrolledParam = searchParams.get('enrolled') === '1';
  const [isEnrolledApi, setIsEnrolledApi] = useState(false);
  const [enrollmentLoading, setEnrollmentLoading] = useState(true);

  // Check enrollment status from API on mount
  useEffect(() => {
    const checkEnrollment = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setEnrollmentLoading(false);
          return;
        }
        const res = await fetch('/api/enrollments/my-courses', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          const enrolledIds = (data.data || data.enrollments || []).map((e: any) => e.courseId || e.course?.id);
          if (enrolledIds.map(String).includes(String(id))) {
            setIsEnrolledApi(true);
          }
        }
      } catch (err) { /* ignore */ }
      setEnrollmentLoading(false);
    };
    checkEnrollment();
  }, [id]);
  const [course, setCourse] = useState<any>(null);
  const [firstLessonId, setFirstLessonId] = useState<string | null>(null);
  const [sections, setSections] = useState<any[]>([]);
  const [lessonsBySection, setLessonsBySection] = useState<{ [sectionId: string]: any[] }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const youtubePlayerRef = useRef<any>(null);
  const userId = localStorage.getItem("userId") || "guest";

  // Progress state
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [completionRate, setCompletionRate] = useState<number>(0);
  const [completedAt, setCompletedAt] = useState<string | null>(null);
  // Fetch progress from backend on mount
  useEffect(() => {
    async function fetchProgress() {
      const token = localStorage.getItem("token");
      if (!token || !id) return;
      const res = await fetch(`/api/enrollments/${id}/progress`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data) {
          setCompletedLessons(Array.isArray(data.data.progress) ? data.data.progress.map((p: any) => p.lessonId) : []);
          setCompletionRate(data.data.completionRate || 0);
          setCompletedAt(data.data.completedAt || null);
        }
      }
    }
    fetchProgress();
  }, [id, userId]);

  // Fetch course, sections, and lessons
  useEffect(() => {
    const fetchAll = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        // Fetch course
        const courseRes = await fetch(`/api/courses/${id}`);
        const courseData = await courseRes.json();
        if (!courseRes.ok || !courseData.success) throw new Error(courseData.message || 'Failed to load course');
        setCourse(courseData.data);

        // Fetch sections
        const sectionsRes = await fetch(`/api/courses/${id}/sections`);
        const sectionsData = await sectionsRes.json();
        if (!sectionsRes.ok || !sectionsData.success) throw new Error(sectionsData.message || 'Failed to load sections');
        setSections(sectionsData.data);

        // Fetch lessons for each section in parallel
        const lessonsObj: { [sectionId: string]: any[] } = {};
        await Promise.all(sectionsData.data.map(async (section: any) => {
          const lessonsRes = await fetch(`/api/courses/${id}/sections/${section.id}/lessons`);
          const lessonsData = await lessonsRes.json();
          lessonsObj[section.id] = lessonsData.success ? lessonsData.data : [];
        }));
        setLessonsBySection(lessonsObj);
      } catch (err: any) {
        setError(err.message || 'Failed to load course');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
    window.scrollTo(0, 0);
  }, [id]);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [reviewRating, setReviewRating] = useState<number>(0);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);

  // Fetch reviews
  useEffect(() => {
    if (!id) return;
    fetch(`/api/reviews/course/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setReviews(data.data);
      });
    // Optionally, fetch user's own review if needed
  }, [id]);

  // Calculate average rating
  const averageRating = reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) : 0;

  // Open review modal automatically when eligible
  useEffect(() => {
    // if (canReview) setShowReviewModal(true); // Removed as per edit hint
  }, []); // Removed canReview dependency

  // Add state for certificate
  const [certificateUrl, setCertificateUrl] = useState<string | null>(null);
  const [certificateLoading, setCertificateLoading] = useState(false);
  const [certificateError, setCertificateError] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Loading...</h1>
            <p className="text-muted-foreground">Please wait while we load the course details.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Course Not Found</h1>
            <p className="text-muted-foreground">{error || "The course you're looking for doesn't exist."}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const features = [
    `${course.duration} of on-demand video content`,
    `${course.lessons} comprehensive lessons`,
    "Downloadable resources and project files",
    "Certificate of completion",
    "Lifetime access to course materials",
    "Mobile and desktop compatibility",
    "Private community access",
    "30-day money-back guarantee"
  ];

  const curriculum = [
    { 
      id: 1,
      title: "Course Introduction & Setup", 
      duration: "12 min", 
      locked: false,
      description: "Welcome to the course and software installation guide"
    },
    { 
      id: 2,
      title: `Understanding ${course.category} Fundamentals`, 
      duration: "28 min", 
      locked: true,
      description: `Learn the core concepts of ${course.category.toLowerCase()}`
    },
    { 
      id: 3,
      title: "Basic Techniques and Methods", 
      duration: "45 min", 
      locked: true,
      description: "Master the fundamental techniques"
    },
    { 
      id: 4,
      title: "Advanced Concepts", 
      duration: "38 min", 
      locked: true,
      description: "Dive deeper into advanced topics"
    },
    { 
      id: 5,
      title: "Practical Projects", 
      duration: "1hr 15min", 
      locked: true,
      description: "Apply your knowledge with hands-on projects"
    },
    { 
      id: 6,
      title: "Professional Techniques", 
      duration: "52 min", 
      locked: true,
      description: "Learn industry-standard practices"
    },
    { 
      id: 7,
      title: "Advanced Applications", 
      duration: "1hr 8min", 
      locked: true,
      description: "Explore advanced use cases and applications"
    },
    { 
      id: 8,
      title: "Final Project & Certification", 
      duration: "1hr 22min", 
      locked: true,
      description: "Complete your final project and get certified"
    }
  ];

  const skills = [
    course.category,
    `${course.category} Tools`,
    "Project Management",
    "Problem Solving",
    "Best Practices"
  ];

  const requirements = [
    "Computer with Windows 10/macOS 10.14 or later",
    "At least 8GB RAM (16GB recommended)",
    "Internet connection for video streaming",
    "Basic computer skills"
  ];

  const handleBuyNow = async () => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    let userId = null;
    try {
      if (userStr) {
        const userObj = JSON.parse(userStr);
        userId = userObj.id;
      }
    } catch {}
    if (!token || !userId) {
      window.location.href = `/login?redirect=/course/${course.id}`;
      return;
    }
    setPaymentLoading(true);
    try {
      // Parse price to number (remove currency symbol/commas)
      let amount = course.price;
      if (typeof amount === 'string') {
        amount = parseFloat(amount.replace(/[^\d.]/g, ''));
      }
      // Razorpay receipt must be <= 40 characters
      const shortReceipt = `rcpt_${course.id.slice(0, 8)}${userId.slice(0, 8)}${Date.now()}`.slice(0, 40);

      // Create Razorpay order
      const res = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },

        body: JSON.stringify({ amount, currency: 'INR', receipt: shortReceipt })
      });
      const order = await res.json();
      if (!res.ok || !order.id) {
        alert(order.message || 'Failed to create payment order');
        setPaymentLoading(false);
        return;
      }
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        alert('Failed to load Razorpay SDK.');
        setPaymentLoading(false);
        return;
      }
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_2bilVeOgMIFak0',
        amount: order.amount,
        currency: order.currency,
        name: course.title,
        description: 'Course Purchase',
        order_id: order.id,
        handler: async function (response) {
          try {
            const verifyRes = await fetch('/api/payments/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                courseId: course.id,
                userId: userId
              })
            });
            const verifyData = await verifyRes.json();
            if (verifyRes.ok && verifyData.success) {
              setPaymentLoading(false);
              navigate('/dashboard');
            } else {
              setPaymentLoading(false);
              alert(verifyData.message || 'Payment verification failed.');
            }
          } catch (err) {
            setPaymentLoading(false);
            alert('Payment verification failed.');
          }
        },
        prefill: {
          name: course.instructor?.name || '',
          email: '',
        },
        theme: {
          color: '#3B82F6'
        },
        modal: {
          ondismiss: () => setPaymentLoading(false)
        }
      };
      // @ts-ignore
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setPaymentLoading(false);
      alert('Failed to initiate payment.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-40 h-40 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Course Info */}
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-4">
                <Badge className="bg-gradient-to-r from-primary to-primary/80 text-white px-4 py-2">
                  🎯 {course.category}
                </Badge>
                <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                  {course.title}
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  {course.subtitle}
                </p>
              </div>

              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                  <span className="font-semibold">{course.rating}</span>
                  <span className="text-muted-foreground">({(typeof course.students === 'number' ? course.students : (course.enrollmentCount || 0)).toLocaleString()} students)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{course.duration}</span>
                </div>
                <Badge variant="outline">{course.level}</Badge>
              </div>

              <div className="flex items-center space-x-4">
                {course.instructor?.avatar && (
                  <img
                    src={course.instructor.avatar}
                    alt={course.instructor.name}
                    className="w-12 h-12 rounded-full border-2 border-primary/20"
                  />
                )}
                <div>
                  <p className="font-semibold">{course.instructor?.name || 'Instructor'}</p>
                  <p className="text-sm text-muted-foreground">{course.instructor?.title || ''}</p>
                </div>
              </div>
            </div>

            {/* Course Preview */}
            <div className="relative group animate-fade-in" style={{ animationDelay: '200ms' }}>
              <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border border-primary/20">
                {course.previewVideoUrl ? (
                  course.previewVideoUrl.includes('youtube.com') || course.previewVideoUrl.includes('youtu.be') ? (
                    <div className="relative w-full h-full">
                      <YouTube
                        videoId={getYouTubeId(course.previewVideoUrl) || ''}
                        className="w-full h-full"
                        opts={{
                          width: '100%',
                          height: '100%',
                          playerVars: {
                            modestbranding: 1,
                            rel: 0,
                            controls: 0,
                            showinfo: 0,
                          },
                        }}
                        onReady={e => { youtubePlayerRef.current = e.target; }}
                        onPlay={() => setIsVideoPlaying(true)}
                        onPause={() => setIsVideoPlaying(false)}
                        onEnd={() => setIsVideoPlaying(false)}
                      />
                      <div className="absolute inset-0 flex items-center justify-center z-10">
                        {!isVideoPlaying ? (
                          <button
                            className="w-20 h-20 bg-primary/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-all duration-300 group-hover:bg-primary"
                            onClick={() => {
                              if (youtubePlayerRef.current) {
                                youtubePlayerRef.current.playVideo();
                              }
                            }}
                            aria-label="Play Preview"
                          >
                            <Play className="h-8 w-8 text-white ml-1" />
                          </button>
                        ) : (
                          <button
                            className="w-20 h-20 bg-primary/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-all duration-300 group-hover:bg-primary"
                            onClick={() => {
                              if (youtubePlayerRef.current) {
                                youtubePlayerRef.current.pauseVideo();
                              }
                            }}
                            aria-label="Pause Preview"
                          >
                            <svg className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <video
                      ref={videoRef}
                      src={course.previewVideoUrl}
                      controls
                      className="w-full h-full object-cover"
                      onPlay={() => setIsVideoPlaying(true)}
                      onPause={() => setIsVideoPlaying(false)}
                    />
                  )
                ) : (
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                {course.previewVideoUrl && !(course.previewVideoUrl.includes('youtube.com') || course.previewVideoUrl.includes('youtu.be')) && (
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    {!isVideoPlaying ? (
                      <button
                        className="w-20 h-20 bg-primary/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-all duration-300 group-hover:bg-primary"
                        onClick={() => {
                          if (videoRef.current) {
                            videoRef.current.play();
                          }
                        }}
                        aria-label="Play Preview"
                      >
                        <Play className="h-8 w-8 text-white ml-1" />
                      </button>
                    ) : (
                      <button
                        className="w-20 h-20 bg-primary/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-all duration-300 group-hover:bg-primary"
                        onClick={() => {
                          if (videoRef.current) {
                            videoRef.current.pause();
                          }
                        }}
                        aria-label="Pause Preview"
                      >
                        <svg className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                      </button>
                    )}
                  </div>
                )}
                <div className="absolute bottom-4 left-4">
                  <Badge className="bg-black/50 text-white">Preview Available</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Course Description */}
            <Card className="p-8 border-primary/10 shadow-lg animate-fade-in" style={{ animationDelay: '400ms' }}>
              <h2 className="text-2xl font-bold mb-4">About This Course</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                {course.description}
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-primary/5 rounded-lg">
                  <BookOpen className="h-6 w-6 text-primary mx-auto mb-2" />
                  <div className="text-sm font-semibold">{course.totalDuration || 0}</div>
                  <div className="text-xs text-muted-foreground">Minutes</div>
                </div>
                <div className="text-center p-4 bg-primary/5 rounded-lg">
                  <Clock className="h-6 w-6 text-primary mx-auto mb-2" />
                  <div className="text-sm font-semibold">{course.level}</div>
                  <div className="text-xs text-muted-foreground">Level</div>
                </div>
                <div className="text-center p-4 bg-primary/5 rounded-lg">
                  <Users className="h-6 w-6 text-primary mx-auto mb-2" />
                  <div className="text-sm font-semibold">{course.enrollmentCount || 0}</div>
                  <div className="text-xs text-muted-foreground">Students</div>
                </div>
                <div className="text-center p-4 bg-primary/5 rounded-lg">
                  <Award className="h-6 w-6 text-primary mx-auto mb-2" />
                  <div className="text-sm font-semibold">{course.ratingAverage || 0}</div>
                  <div className="text-xs text-muted-foreground">Rating</div>
                </div>
              </div>

              {course.whatYouWillLearn && course.whatYouWillLearn.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">What You'll Learn</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {course.whatYouWillLearn.map((skill: string, index: number) => (
                      <div key={index} className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span className="text-sm">{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>

            {/* Course Curriculum */}
            <Card className="p-8 border-primary/10 shadow-lg animate-fade-in" style={{ animationDelay: '600ms' }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Course Content</h2>
                <Badge variant="outline">Curriculum</Badge>
              </div>
              <div className="space-y-6">
                {sections.length === 0 && <div className="text-muted-foreground">No sections yet.</div>}
                {sections.map((section) => (
                  <div key={section.id} className="mb-4">
                    <h3 className="font-semibold text-lg mb-2">{section.title}</h3>
                    {lessonsBySection[section.id]?.length === 0 && <div className="text-muted-foreground ml-4">No lessons yet.</div>}
                    <ul className="space-y-2">
                      {lessonsBySection[section.id]?.map((lesson: any, idx: number) => {
                        // Find the flat index of this lesson in the course
                        const allLessons = Object.values(lessonsBySection).flat();
                        const allLessonsCompleted = allLessons.length > 0 && allLessons.every((l: any) => completedLessons.includes(l.id));
                        const flatIdx = allLessons.findIndex((l: any) => l.id === lesson.id);
                        const isCompleted = completedLessons.includes(lesson.id);
                        const isFirst = flatIdx === 0;
                        const prevCompleted = isFirst || completedLessons.includes(allLessons[flatIdx - 1]?.id);
                        const isUnlocked = allLessonsCompleted || isFirst || prevCompleted;
                        let buttonText = "Play";
                        if (isCompleted) buttonText = "Re-watch";
                        else if (isUnlocked) buttonText = "Play";
                        else buttonText = "Locked";
                        return (
                          <li key={lesson.id} className="flex items-center justify-between bg-muted/30 rounded p-3 shadow-sm">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-primary/10">
                                {isCompleted ? <CheckCircle className="h-5 w-5 text-green-500" /> : isUnlocked ? <Play className="h-5 w-5 text-primary" /> : <Lock className="h-5 w-5 text-muted-foreground" />}
                              </div>
                              <div>
                                <div className="font-medium">{lesson.title}</div>
                                <div className="text-sm text-muted-foreground">{lesson.description}</div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <span className="text-xs text-muted-foreground">{lesson.duration} min</span>
                              {(isEnrolledParam || isEnrolledApi) && isUnlocked ? (
                                <Button size="sm" onClick={() => navigate(`/course/${course.id}/lesson/${lesson.id}`, { state: { lesson, allLessons } })}>
                                  {buttonText}
                                </Button>
                              ) : (
                                <div className="flex items-center space-x-1">
                                  <Lock className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-xs bg-muted px-2 py-0.5 rounded">Locked</span>
                                </div>
                              )}
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>
              {sections.length > 0 && Object.values(lessonsBySection).flat().length > 0 && (
                <div className="flex justify-end mt-6">
                  <Button
                    disabled={Object.values(lessonsBySection).flat().length === 0 || !Object.values(lessonsBySection).flat().every((l: any) => completedLessons.includes(l.id)) || certificateLoading}
                    onClick={async () => {
                      setCertificateLoading(true);
                      setCertificateError(null);
                      try {
                        const token = localStorage.getItem('token');
                        const res = await fetch('/api/certificates/request', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                            ...(token ? { Authorization: `Bearer ${token}` } : {})
                          },
                          body: JSON.stringify({ courseId: course.id })
                        });
                        const data = await res.json();
                        if (data.success && data.certificateUrl) {
                          setCertificateUrl(data.certificateUrl);
                        } else {
                          setCertificateError(data.message || 'Failed to get certificate');
                        }
                      } catch (err: any) {
                        setCertificateError('Failed to get certificate');
                      } finally {
                        setCertificateLoading(false);
                      }
                    }}
                  >
                    {certificateLoading ? 'Processing...' : 'Get Certificate'}
                  </Button>
                </div>
              )}
              {certificateUrl && (
                <div className="mt-4">
                  <a
                    href={certificateUrl.startsWith('/certificates/') ? `http://localhost:5000${certificateUrl}` : certificateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline font-semibold"
                  >
                    Download your certificate
                  </a>
                </div>
              )}
              {certificateError && (
                <div className="mt-2 text-red-500 text-sm">{certificateError}</div>
              )}
            </Card>

            {/* Course Reviews */}
            <Card className="p-8 border-primary/10 shadow-lg animate-fade-in" style={{ animationDelay: '900ms' }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Course Reviews</h2>
                <div className="flex items-center space-x-2">
                  <StarIcon className="h-6 w-6 text-amber-400 fill-amber-400" />
                  <span className="text-xl font-semibold">{averageRating.toFixed(1)}</span>
                  <span className="text-muted-foreground">({reviews.length} reviews)</span>
                </div>
              </div>
              <div className="space-y-6">
                {reviews.length === 0 && <div className="text-muted-foreground">No reviews yet. Be the first to review this course!</div>}
                {reviews.map((review) => (
                  <div key={review.id} className="flex items-start gap-4 p-4 bg-background rounded-lg border border-primary/10">
                    <img
                      src={review.student?.avatar || "/public/placeholder.svg"}
                      alt={review.student?.name || "User"}
                      className="w-10 h-10 rounded-full object-cover border"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">{review.student?.name || "User"}</span>
                        <span className="flex items-center gap-1 text-amber-400">
                          {[...Array(review.rating)].map((_, i) => <StarIcon key={i} className="h-4 w-4 fill-current" />)}
                        </span>
                        <span className="text-xs text-muted-foreground ml-2">{new Date(review.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="text-muted-foreground text-sm">{review.comment}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar - Purchase Card */}
          {/* Only show the sidebar card if not on the learning page (?enrolled=1 is NOT present) */}
          {!isEnrolledParam ? (
            <div className="lg:col-span-1">
              <Card className="sticky top-4 p-6 border-primary/20 shadow-xl bg-gradient-to-br from-card to-primary/5 animate-fade-in" style={{ animationDelay: '1000ms' }}>
                <div className="text-center space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-center space-x-3">
                      <span className="text-3xl font-bold text-primary">{course.price}</span>
                      <span className="text-lg text-muted-foreground line-through">{course.originalPrice}</span>
                    </div>
                    <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                      50% OFF - Limited Time
                    </Badge>
                  </div>
                  {/* Show loading spinner while checking enrollment */}
                  {enrollmentLoading ? (
                    <div className="flex justify-center items-center py-6">
                      <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                  ) : isEnrolledApi ? (
                    <Button
                      onClick={() => navigate(`/course/${course.id}?enrolled=1`)}
                      size="lg"
                      className="w-full text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 bg-gradient-to-r from-primary to-primary/80"
                    >
                      <Play className="h-5 w-5 mr-2" />
                      Continue Learning
                    </Button>
                  ) : (
                    <Button
                      onClick={handleBuyNow}
                      size="lg"
                      className="w-full text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 bg-gradient-to-r from-primary to-primary/80"
                      disabled={paymentLoading}
                    >
                      {paymentLoading ? (
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        <>
                          <Zap className="h-5 w-5 mr-2" />
                          Buy Now
                        </>
                      )}
                    </Button>
                  )}
                  <div className="text-center text-sm text-muted-foreground space-y-2">
                    <p>30-day money-back guarantee</p>
                    <div className="flex items-center justify-center space-x-4 text-xs">
                      <div className="flex items-center space-x-1">
                        <Globe className="h-3 w-3" />
                        <span>{course.language}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>Updated {course.lastUpdated}</span>
                      </div>
                    </div>
                  </div>
                  {course.courseIncludes && course.courseIncludes.length > 0 && (
                    <div className="border-t pt-4">
                      <h4 className="font-semibold mb-3">This Course Includes:</h4>
                      <ul className="space-y-2 text-sm">
                        {course.courseIncludes.map((feature: string, index: number) => (
                          <li key={index} className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-2">Instructor</h4>
                    <div className="flex items-center space-x-3">
                      {course.instructor?.avatar && (
                        <img
                          src={course.instructor.avatar}
                          alt={course.instructor.name}
                          className="w-10 h-10 rounded-full"
                        />
                      )}
                      <div className="text-left">
                        <p className="font-medium text-sm">{course.instructor?.name || 'Instructor'}</p>
                        {course.instructor?.title && (
                          <p className="text-xs text-muted-foreground">{course.instructor.title}</p>
                        )}
                        {course.instructor?.bio && (
                          <p className="text-xs text-muted-foreground mt-1">{course.instructor.bio}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          ) : (
            <div className="lg:col-span-1">
              <AdCard />
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default CourseDetailPage;
