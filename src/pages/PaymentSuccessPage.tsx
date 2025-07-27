
import { useEffect, useState } from "react";
import { useLocation, useSearchParams, Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Download, Play, Star } from "lucide-react";

const PaymentSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  // Try to get courseId from URL or state
  const courseId = searchParams.get('courseId') || location.state?.courseId;
  const paymentId = location.state?.paymentId || '';
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [redirectCountdown, setRedirectCountdown] = useState(4);

  useEffect(() => {
    if (!courseId) return;
    setLoading(true);
    fetch(`/api/courses/${courseId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setCourse(data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [courseId]);

  useEffect(() => {
    if (loading) return;
    if (redirectCountdown <= 0) {
      navigate('/dashboard');
      return;
    }
    const timer = setTimeout(() => setRedirectCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [redirectCountdown, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading...</h1>
          <p className="text-muted-foreground">Please wait while we load your course details.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-green-50/20 to-background">
      <Header />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Animation */}
          <div className="mb-8 animate-fade-in">
            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
              <CheckCircle className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-green-600 mb-4">Payment Successful!</h1>
            <p className="text-xl text-muted-foreground">
              Welcome to your new learning journey
            </p>
          </div>

          {/* Payment Details */}
          <Card className="border-green-200 shadow-lg mb-8 animate-fade-in" style={{ animationDelay: '200ms' }}>
            <CardContent className="p-8">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Transaction ID:</span>
                  <span className="font-mono text-sm">{paymentId || '-'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Course:</span>
                  <span className="font-medium">{course?.title || '-'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Access:</span>
                  <span className="text-green-600 font-medium">Lifetime</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-4 animate-fade-in" style={{ animationDelay: '400ms' }}>
            <Button 
              asChild 
              size="lg" 
              className="w-full text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <Link to={`/course/${courseId}`}>
                <Play className="h-5 w-5 mr-2" />
                Start Learning Now
              </Link>
            </Button>
            <Button 
              asChild 
              size="lg" 
              variant="outline"
              className="w-full text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <Link to="/dashboard">
                Go to Dashboard
              </Link>
            </Button>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="outline" size="lg" className="flex-1" disabled>
                <Download className="h-4 w-4 mr-2" />
                Download Receipt
              </Button>
              <Button variant="outline" size="lg" className="flex-1" disabled>
                <Star className="h-4 w-4 mr-2" />
                Rate Course
              </Button>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-12 p-6 bg-primary/5 rounded-lg animate-fade-in" style={{ animationDelay: '600ms' }}>
            <h3 className="font-semibold mb-2">What's Next?</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Access your course anytime from your dashboard</li>
              <li>• Download resources and project files</li>
              <li>• Join our exclusive community</li>
              <li>• Get your certificate upon completion</li>
            </ul>
            <div className="mt-4 text-sm text-muted-foreground">
              Redirecting to your dashboard in <span className="font-semibold text-primary">{redirectCountdown}</span> seconds...
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PaymentSuccessPage;
