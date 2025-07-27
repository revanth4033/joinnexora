import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Clock, Award, TrendingUp, Play, Download, User as UserIcon, Mail, Phone, Calendar, Globe, MapPin, Home, GraduationCap, Briefcase, Info, Linkedin, Globe2 } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";

// Type definitions for dashboard data
interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  bio?: string;
  title?: string;
  dateOfBirth?: string;
  gender?: string;
  country?: string;
  state?: string;
  city?: string;
  address?: string;
  educationLevel?: string;
  institution?: string;
  fieldOfStudy?: string;
  occupation?: string;
  linkedin?: string;
  website?: string;
}

interface Lesson {
  id: string;
  title: string;
  duration?: number;
  order?: number;
}

interface Section {
  id: string;
  title: string;
  order?: number;
  lessons?: Lesson[];
}

interface Course {
  id: string;
  title: string;
  thumbnail?: string;
  totalDuration?: number;
  sections?: Section[];
}

interface Enrollment {
  id: string;
  courseId: string;
  course?: Course;
  completionRate?: number;
  enrolledAt?: string;
  progress?: { lessonId: string }[]; // New field for progress
  // Add more fields as needed
}

interface Certificate {
  id: string;
  courseId?: string;
  course?: { title: string };
  courseName?: string;
  issueDate?: string;
  // Add more fields as needed
}

interface DashboardStats {
  totalEnrolled: number;
  coursesCompleted?: number;
  totalLearningTime: number;
  averageProgress?: number;
  certificatesEarned: number;
}

const DashboardPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [progressMap, setProgressMap] = useState<{ [courseId: string]: string[] }>({});
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState<User | null>(null);

  // Fetch all progress on mount and when lesson progress is updated
  useEffect(() => {
    async function fetchProgress() {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await fetch("/api/enrollments/my-courses", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setEnrollments(data.data || []);
        const map: { [courseId: string]: string[] } = {};
        (data.data || []).forEach((e: Enrollment) => {
          const courseId = e.courseId || e.course?.id;
          if (courseId && Array.isArray(e.progress)) {
            map[courseId] = e.progress.map((p) => p.lessonId);
          }
        });
        setProgressMap(map);
      }
    }
    fetchProgress();
    // Listen for lesson progress updates
    const handler = () => fetchProgress();
    window.addEventListener("lesson-progress-updated", handler);
    return () => {
      window.removeEventListener("lesson-progress-updated", handler);
    };
  }, []);

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/users/dashboard", {
          headers: { Authorization: token ? `Bearer ${token}` : "" }
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setUser(data.data.user);
          setCertificates(data.data.certificates || []);
          setStats(data.data.stats || null);
        }
      } catch (error) {
        console.error("Error fetching dashboard:", error);
      }
      setLoading(false);
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading...</h1>
          <p className="text-muted-foreground">Please wait while we load your dashboard.</p>
        </div>
      </div>
    );
  }

  const userId = localStorage.getItem("userId") || "guest";

  const completedCourses = enrollments.filter(enrollment => {
    if (!enrollment.course) return false;
    const courseId = enrollment.courseId || enrollment.course.id;
    const courseLessons = (enrollment.course.sections ?? []).flatMap(section => section.lessons ?? []);
    const totalLessons = courseLessons.length;
    const completedLessons = progressMap[courseId] || [];
    return totalLessons > 0 && completedLessons.length === totalLessons;
  }).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name || "User"}!</h1>
          <p className="text-muted-foreground">Continue your learning journey</p>
        </div>
        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card><CardContent className="p-6"><div><p className="text-sm text-muted-foreground">Enrolled Courses</p><p className="text-2xl font-bold">{stats.totalEnrolled}</p><p className="text-xs text-muted-foreground">Active enrollments</p></div></CardContent></Card>
            <Card><CardContent className="p-6"><div><p className="text-sm text-muted-foreground">Completed</p><p className="text-2xl font-bold">{completedCourses}</p><p className="text-xs text-muted-foreground">Courses finished</p></div></CardContent></Card>
            <Card><CardContent className="p-6"><div><p className="text-sm text-muted-foreground">Study Hours</p><p className="text-2xl font-bold">{stats.totalLearningTime}</p><p className="text-xs text-muted-foreground">Total learning time</p></div></CardContent></Card>
            <Card><CardContent className="p-6"><div><p className="text-sm text-muted-foreground">Certificates</p><p className="text-2xl font-bold">{stats.certificatesEarned}</p><p className="text-xs text-muted-foreground">Earned certificates</p></div></CardContent></Card>
          </div>
        )}
        {/* Main Content */}
        <Tabs defaultValue="courses" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="courses">My Courses</TabsTrigger>
            <TabsTrigger value="certificates">Certificates</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>
          {/* My Courses Tab */}
          <TabsContent value="courses" className="space-y-6">
            {enrollments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16">
                <p className="text-lg text-muted-foreground mb-6">No courses enrolled yet. Start exploring and enroll in your first course!</p>
                <Button asChild size="lg" className="text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 bg-gradient-to-r from-primary to-primary/80">
                  <a href="/courses">Browse Courses</a>
                </Button>
              </div>
            ) :
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {enrollments.map((enrollment) => {
                  if (!enrollment.course) return null; // Guard clause
                  const courseId = enrollment.courseId || enrollment.course.id;
                  const courseLessons = (enrollment.course.sections ?? []).flatMap((section: Section) => section.lessons ?? []);
                  const totalLessons = courseLessons.length;
                  const completedLessons = progressMap[courseId] || [];
                  const completedCount = completedLessons.length;
                  const percent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
                  return (
                    <Card key={enrollment.id} className="overflow-hidden">
                      <div className="relative">
                        <img 
                          src={enrollment.course?.thumbnail || 'https://source.unsplash.com/400x300/?course,education'} 
                          alt={enrollment.course?.title || 'Course'}
                          className="w-full h-40 object-cover"
                        />
                        <Badge className="absolute top-2 right-2 bg-blue-600">Enrolled</Badge>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-2">{enrollment.course?.title}</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Progress</span>
                            <span>{percent}%</span>
                          </div>
                          <Progress value={percent} className="h-2" />
                          <div className="flex justify-between text-sm text-muted-foreground">
                            <span>
                              {totalLessons > 0
                                ? `${completedCount} / ${totalLessons} lessons completed`
                                : "Progress data unavailable"}
                            </span>
                          </div>
                          <Button
                               className="w-full"
                               variant={percent === 100 ? 'outline' : 'default'}
                               onClick={() => navigate(`/course/${courseId}?enrolled=1`) }
                             >
                            <Play className="h-4 w-4 mr-2" />
                            {percent === 100 ? 'Review Course' : 'Continue Learning'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            }    
          </TabsContent>
          {/* Certificates Tab */}
          <TabsContent value="certificates" className="space-y-6">
            {certificates.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {certificates.map((cert) => (
                  <Card key={cert.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <Award className="h-8 w-8 text-yellow-500" />
                        <Badge variant="secondary">Certificate</Badge>
                      </div>
                      <CardTitle className="text-lg">{cert.course?.title || cert.courseName}</CardTitle>
                      <CardDescription>
                        Issued on {cert.issueDate ? new Date(cert.issueDate).toLocaleDateString() : ''}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="outline" className="w-full mt-2">
                        <Download className="h-4 w-4 mr-2" />
                        Download Certificate
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16">
                <p className="text-lg text-muted-foreground mb-6">No certificates earned yet.</p>
              </div>
            )}
          </TabsContent>
          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="w-full shadow-lg border-0">
              <div className="bg-gradient-to-r from-blue-600 to-blue-400 rounded-t-lg p-6 flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-md">
                  <UserIcon className="w-12 h-12 text-blue-500" />
                </div>
                <div className="text-white">
                  <div className="text-2xl font-bold">{user?.name}</div>
                  <div className="text-sm opacity-80 capitalize">{user?.role || 'Student'}</div>
                </div>
              </div>
              <CardContent className="px-4 md:px-12 py-8 bg-white rounded-b-lg">
                {/* Contact Info */}
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-2 text-blue-600 font-semibold text-lg">
                    <Mail className="w-5 h-5" /> Contact Information
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-3">
                    <div><span className="font-semibold flex items-center gap-2"><Mail className="w-4 h-4" />Email:</span> {user?.email}</div>
                    <div><span className="font-semibold flex items-center gap-2"><Phone className="w-4 h-4" />Phone:</span> {user?.phone || '-'}</div>
                    <div><span className="font-semibold flex items-center gap-2"><Globe className="w-4 h-4" />Country:</span> {user?.country || '-'}</div>
                    <div><span className="font-semibold flex items-center gap-2"><MapPin className="w-4 h-4" />State:</span> {user?.state || '-'}</div>
                    <div><span className="font-semibold flex items-center gap-2"><Home className="w-4 h-4" />City:</span> {user?.city || '-'}</div>
                    <div className="lg:col-span-3"><span className="font-semibold flex items-center gap-2"><Home className="w-4 h-4" />Address:</span> {user?.address || '-'}</div>
                  </div>
                </div>
                {/* Personal Info */}
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-2 text-blue-600 font-semibold text-lg">
                    <Info className="w-5 h-5" /> Personal Information
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-3">
                    <div><span className="font-semibold flex items-center gap-2"><Calendar className="w-4 h-4" />Date of Birth:</span> {user?.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : '-'}</div>
                    <div><span className="font-semibold flex items-center gap-2"><UserIcon className="w-4 h-4" />Gender:</span> {user?.gender || '-'}</div>
                    <div className="lg:col-span-3"><span className="font-semibold flex items-center gap-2"><Info className="w-4 h-4" />Bio:</span> {user?.bio || '-'}</div>
                  </div>
                </div>
                {/* Education & Career */}
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-2 text-blue-600 font-semibold text-lg">
                    <GraduationCap className="w-5 h-5" /> Education & Career
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-3">
                    <div><span className="font-semibold flex items-center gap-2"><GraduationCap className="w-4 h-4" />Education Level:</span> {user?.educationLevel || '-'}</div>
                    <div><span className="font-semibold flex items-center gap-2"><GraduationCap className="w-4 h-4" />Institution:</span> {user?.institution || '-'}</div>
                    <div><span className="font-semibold flex items-center gap-2"><GraduationCap className="w-4 h-4" />Field of Study:</span> {user?.fieldOfStudy || '-'}</div>
                    <div><span className="font-semibold flex items-center gap-2"><Briefcase className="w-4 h-4" />Occupation:</span> {user?.occupation || '-'}</div>
                  </div>
                </div>
                {/* Social Links */}
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-2 text-blue-600 font-semibold text-lg">
                    <Globe2 className="w-5 h-5" /> Social Links
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-3">
                    <div><span className="font-semibold flex items-center gap-2"><Linkedin className="w-4 h-4" />LinkedIn:</span> {user?.linkedin ? <a href={user.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{user.linkedin}</a> : '-'}</div>
                    <div><span className="font-semibold flex items-center gap-2"><Globe2 className="w-4 h-4" />Website:</span> {user?.website ? <a href={user.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{user.website}</a> : '-'}</div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button onClick={() => { setEditData(user); setEditOpen(true); }} className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded shadow">Edit Profile</Button>
                </div>
              </CardContent>
            </Card>
            {/* Enhanced Edit Profile Dialog */}
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
              <DialogContent className="w-full max-w-2xl !p-0 overflow-y-auto max-h-[90vh]">
                <DialogHeader className="p-6 pb-0">
                  <DialogTitle>Edit Profile</DialogTitle>
                </DialogHeader>
                <form
                  className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 p-6 pt-2"
                  style={{ maxHeight: '65vh', overflowY: 'auto' }}
                  onSubmit={async e => {
                    e.preventDefault();
                    if (!editData) return;
                    try {
                      const token = localStorage.getItem("token");
                      const res = await fetch("/api/users/profile", {
                        method: "PUT",
                        headers: { "Content-Type": "application/json", Authorization: token ? `Bearer ${token}` : "" },
                        body: JSON.stringify(editData)
                      });
                      const data = await res.json();
                      if (res.ok && data.success) {
                        setUser(data.data);
                        setEditOpen(false);
                        toast.success("Profile updated successfully");
                      } else {
                        toast.error(data.message || "Failed to update profile");
                      }
                    } catch {
                      toast.error("Failed to update profile");
                    }
                  }}
                >
                  {/* Contact Info */}
                  <div className="md:col-span-2 text-blue-600 font-semibold flex items-center gap-2 mb-1 mt-2"><Mail className="w-4 h-4" /> Contact Information</div>
                  <div><Label>Name</Label><Input value={editData?.name || ''} onChange={e => setEditData(d => d ? { ...d, name: e.target.value } : d)} required /></div>
                  <div><Label>Email</Label><Input value={editData?.email || ''} onChange={e => setEditData(d => d ? { ...d, email: e.target.value } : d)} type="email" required /></div>
                  <div><Label>Phone</Label><Input value={editData?.phone || ''} onChange={e => setEditData(d => d ? { ...d, phone: e.target.value } : d)} /></div>
                  <div><Label>Country</Label><Input value={editData?.country || ''} onChange={e => setEditData(d => d ? { ...d, country: e.target.value } : d)} /></div>
                  <div><Label>State</Label><Input value={editData?.state || ''} onChange={e => setEditData(d => d ? { ...d, state: e.target.value } : d)} /></div>
                  <div><Label>City</Label><Input value={editData?.city || ''} onChange={e => setEditData(d => d ? { ...d, city: e.target.value } : d)} /></div>
                  <div className="md:col-span-2"><Label>Address</Label><Input value={editData?.address || ''} onChange={e => setEditData(d => d ? { ...d, address: e.target.value } : d)} /></div>
                  {/* Personal Info */}
                  <div className="md:col-span-2 text-blue-600 font-semibold flex items-center gap-2 mb-1 mt-4"><Info className="w-4 h-4" /> Personal Information</div>
                  <div><Label>Date of Birth</Label><Input value={editData?.dateOfBirth ? editData.dateOfBirth.slice(0,10) : ''} onChange={e => setEditData(d => d ? { ...d, dateOfBirth: e.target.value } : d)} type="date" /></div>
                  <div><Label>Gender</Label><select className="w-full border rounded p-2" value={editData?.gender || ''} onChange={e => setEditData(d => d ? { ...d, gender: e.target.value } : d)}><option value="">Select</option><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option><option value="prefer_not_to_say">Prefer not to say</option></select></div>
                  <div className="md:col-span-2"><Label>Bio</Label><Input value={editData?.bio || ''} onChange={e => setEditData(d => d ? { ...d, bio: e.target.value } : d)} /></div>
                  {/* Education & Career */}
                  <div className="md:col-span-2 text-blue-600 font-semibold flex items-center gap-2 mb-1 mt-4"><GraduationCap className="w-4 h-4" /> Education & Career</div>
                  <div><Label>Education Level</Label><Input value={editData?.educationLevel || ''} onChange={e => setEditData(d => d ? { ...d, educationLevel: e.target.value } : d)} /></div>
                  <div><Label>Institution</Label><Input value={editData?.institution || ''} onChange={e => setEditData(d => d ? { ...d, institution: e.target.value } : d)} /></div>
                  <div><Label>Field of Study</Label><Input value={editData?.fieldOfStudy || ''} onChange={e => setEditData(d => d ? { ...d, fieldOfStudy: e.target.value } : d)} /></div>
                  <div><Label>Occupation</Label><Input value={editData?.occupation || ''} onChange={e => setEditData(d => d ? { ...d, occupation: e.target.value } : d)} /></div>
                  {/* Social Links */}
                  <div className="md:col-span-2 text-blue-600 font-semibold flex items-center gap-2 mb-1 mt-4"><Globe2 className="w-4 h-4" /> Social Links</div>
                  <div><Label>LinkedIn</Label><Input value={editData?.linkedin || ''} onChange={e => setEditData(d => d ? { ...d, linkedin: e.target.value } : d)} /></div>
                  <div><Label>Website</Label><Input value={editData?.website || ''} onChange={e => setEditData(d => d ? { ...d, website: e.target.value } : d)} /></div>
                  <div className="md:col-span-2 flex justify-end mt-4 sticky bottom-0 bg-white pt-4 z-10">
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-2 rounded shadow">Save</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
};

export default DashboardPage;
