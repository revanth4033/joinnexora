
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Shield, CreditCard, Smartphone, Wallet, CheckCircle } from "lucide-react";

const PaymentPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const courseId = searchParams.get('courseId');
  const price = searchParams.get('price');

  // Mock course data based on courseId
  const courseData = {
    title: "Complete Video Editing Masterclass 2024",
    instructor: "Alex Rodriguez",
    duration: "42 hours",
    lessons: 156,
    image: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400&h=300&fit=crop"
  };

  const handlePayment = async () => {
    setLoading(true);
    
    // Simulate Razorpay integration
    try {
      // In real implementation, you would integrate with Razorpay here
      const options = {
        key: "your_razorpay_key_id", // Replace with your Razorpay key
        amount: parseInt(price?.replace('₹', '').replace(',', '') || '4999') * 100, // Amount in paise
        currency: "INR",
        name: "Join Nexora",
        description: courseData.title,
        image: "/favicon.ico",
        handler: function (response: any) {
          // Handle successful payment
          console.log("Payment successful:", response);
          navigate('/payment-success', { 
            state: { 
              paymentId: response.razorpay_payment_id,
              courseId: courseId 
            }
          });
        },
        prefill: {
          name: "Student Name",
          email: "student@example.com",
          contact: "+919999999999"
        },
        theme: {
          color: "#3B82F6"
        }
      };

      // Simulate payment modal (replace with actual Razorpay integration)
      setTimeout(() => {
        navigate('/payment-success', { 
          state: { 
            paymentId: 'pay_mock_' + Date.now(),
            courseId: courseId 
          }
        });
      }, 2000);

    } catch (error) {
      console.error("Payment failed:", error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background">
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mb-8 hover:bg-primary/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Course
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Course Summary */}
            <Card className="border-primary/20 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Order Summary</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex space-x-4">
                  <img 
                    src={courseData.image} 
                    alt={courseData.title}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{courseData.title}</h3>
                    <p className="text-muted-foreground">by {courseData.instructor}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                      <span>{courseData.duration}</span>
                      <span>•</span>
                      <span>{courseData.lessons} lessons</span>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center text-lg">
                    <span className="font-semibold">Total:</span>
                    <span className="font-bold text-primary text-2xl">{price}</span>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 text-green-700">
                    <Shield className="h-4 w-4" />
                    <span className="text-sm font-medium">30-Day Money Back Guarantee</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Methods */}
            <Card className="border-primary/20 shadow-lg">
              <CardHeader>
                <CardTitle>Choose Payment Method</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-3">
                    <div className="p-4 border border-primary/20 rounded-lg hover:border-primary/40 transition-colors cursor-pointer">
                      <div className="flex items-center space-x-3">
                        <CreditCard className="h-6 w-6 text-primary" />
                        <div>
                          <p className="font-medium">Credit/Debit Card</p>
                          <p className="text-sm text-muted-foreground">Visa, Mastercard, RuPay</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 border border-primary/20 rounded-lg hover:border-primary/40 transition-colors cursor-pointer">
                      <div className="flex items-center space-x-3">
                        <Smartphone className="h-6 w-6 text-primary" />
                        <div>
                          <p className="font-medium">UPI</p>
                          <p className="text-sm text-muted-foreground">Pay using UPI ID or QR code</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 border border-primary/20 rounded-lg hover:border-primary/40 transition-colors cursor-pointer">
                      <div className="flex items-center space-x-3">
                        <Wallet className="h-6 w-6 text-primary" />
                        <div>
                          <p className="font-medium">Wallets</p>
                          <p className="text-sm text-muted-foreground">Paytm, PhonePe, Google Pay</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={handlePayment}
                  disabled={loading}
                  size="lg" 
                  className="w-full text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 bg-gradient-to-r from-primary to-primary/80"
                >
                  {loading ? "Processing..." : `Pay ${price}`}
                </Button>

                <div className="text-center text-xs text-muted-foreground">
                  <p>Secured by Razorpay</p>
                  <p className="mt-1">Your payment information is encrypted and secure</p>
                </div>

                <div className="flex items-center justify-center space-x-4 pt-4">
                  <Badge variant="outline" className="text-xs">SSL Encrypted</Badge>
                  <Badge variant="outline" className="text-xs">PCI Compliant</Badge>
                  <Badge variant="outline" className="text-xs">256-bit Security</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PaymentPage;
