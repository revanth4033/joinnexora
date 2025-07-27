import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Users, 
  BookOpen, 
  DollarSign, 
  TrendingUp, 
  Plus, 
  Edit, 
  Trash2,
  Eye,
  Search,
  Star
} from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useNavigate } from 'react-router-dom';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';

interface Instructor { id: string; name: string; title?: string; avatar?: string; }
interface Course { id: string; title: string; instructor?: Instructor; enrollmentCount?: number; isPublished?: boolean; createdAt?: string; }
interface Student { id: string; name: string; email?: string; }
interface Payment { id: string; studentName?: string; student?: string; courseTitle?: string; course?: string; amount?: number; date?: string; createdAt?: string; status?: string; }
interface Enrollment { id: string; student?: Student; course?: Course; status?: string; }

interface AdminReview {
  id: string;
  course?: { title?: string };
  student?: { name?: string };
  rating: number;
  comment: string;
  createdAt: string;
}

interface Stats {
  totalUsers: number;
  totalCourses: number;
  totalRevenue: number;
  totalEnrollments: number;
  // Add more fields if needed
}

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

const AddCourseDialog = ({ onCourseAdded }: { onCourseAdded?: () => void }) => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    shortDescription: "",
    fullDescription: "",
    category: "",
    level: "",
    price: "",
    originalPrice: "",
    thumbnail: "",
    instructorId: "",
    tags: "",
    isPublished: false,
    prerequisites: [] as string[],
    whatYouWillLearn: [] as string[],
    courseIncludes: [] as string[],
    previewVideoUrl: ""
  });
  const [newOutcome, setNewOutcome] = useState("");
  const [newRequirement, setNewRequirement] = useState("");
  const [newInclude, setNewInclude] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loadingInstructors, setLoadingInstructors] = useState(false);
  const categories = [
    "Web Development",
    "Data Science",
    "Digital Marketing",
    "UI/UX Design",
    "Business",
    "Video Editing"
  ];
  const levels = ["Beginner", "Intermediate", "Advanced"];

  // Fetch instructors when dialog opens
  useEffect(() => {
    if (open) {
      fetchInstructors();
    }
  }, [open]);

  const fetchInstructors = async () => {
    setLoadingInstructors(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/users/instructors", {
        headers: {
          Authorization: token ? `Bearer ${token}` : ""
        }
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setInstructors(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch instructors:", err);
    } finally {
      setLoadingInstructors(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("shortDescription", form.shortDescription);
      formData.append("description", form.fullDescription);
      formData.append("category", form.category);
      formData.append("level", form.level);
      formData.append("price", form.price);
      if (form.originalPrice) formData.append("originalPrice", form.originalPrice);
      if (form.thumbnail) formData.append("thumbnail", form.thumbnail);
      if (form.tags) formData.append("tags", form.tags);
      if (form.previewVideoUrl) formData.append("previewVideoUrl", form.previewVideoUrl);
      formData.append("isPublished", form.isPublished ? "true" : "false");
      formData.append("instructorId", form.instructorId);
      formData.append("prerequisites", JSON.stringify(form.prerequisites));
      formData.append("whatYouWillLearn", JSON.stringify(form.whatYouWillLearn));
      formData.append("courseIncludes", JSON.stringify(form.courseIncludes));
      // Instructor is set by backend from logged-in user
      const response = await fetch("/api/courses", {
        method: "POST",
        headers: {
          Authorization: token ? `Bearer ${token}` : ""
        },
        body: formData
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setSuccess(true);
        setOpen(false);
        if (onCourseAdded) onCourseAdded();
      } else {
        setError(data.message || "Failed to add course");
      }
    } catch (err) {
      setError("Failed to add course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Course
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-lg sm:max-w-xl p-4 sm:p-6 overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Add New Course</DialogTitle>
          <DialogDescription>Fill in the details to create a new course.</DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium mb-1">Title *</label>
            <Input
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              required
              placeholder="Course title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Short Description *</label>
            <Input
              value={form.shortDescription}
              onChange={e => setForm(f => ({ ...f, shortDescription: e.target.value }))}
              required
              placeholder="Brief summary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Full Description *</label>
            <textarea
              className="w-full border rounded p-2 min-h-[80px]"
              value={form.fullDescription}
              onChange={e => setForm(f => ({ ...f, fullDescription: e.target.value }))}
              required
              placeholder="Detailed course description"
            />
          </div>
          <div className="flex space-x-2">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Category *</label>
              <select
                className="w-full border rounded p-2"
                value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                required
              >
                <option value="">Select category</option>
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Level *</label>
              <select
                className="w-full border rounded p-2"
                value={form.level}
                onChange={e => setForm(f => ({ ...f, level: e.target.value }))}
                required
              >
                <option value="">Select level</option>
                {levels.map(lvl => <option key={lvl} value={lvl}>{lvl}</option>)}
              </select>
            </div>
          </div>
          <div className="flex space-x-2">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Price *</label>
              <Input
                type="number"
                value={form.price}
                onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                required
                placeholder="e.g. 99.99"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Original Price</label>
              <Input
                type="number"
                value={form.originalPrice}
                onChange={e => setForm(f => ({ ...f, originalPrice: e.target.value }))}
                placeholder="e.g. 149.99"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Thumbnail Image URL *</label>
            <Input
              type="url"
              value={form.thumbnail}
              onChange={e => setForm(f => ({ ...f, thumbnail: e.target.value }))}
              required
              placeholder="https://your-image-url.com/image.jpg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Preview Video URL</label>
            <Input
              value={form.previewVideoUrl}
              onChange={e => setForm(f => ({ ...f, previewVideoUrl: e.target.value }))}
              placeholder="https://www.youtube.com/watch?v=..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">What You'll Learn</label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newOutcome}
                onChange={e => setNewOutcome(e.target.value)}
                placeholder="Add a learning outcome"
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (newOutcome.trim()) {
                      setForm(f => ({ ...f, whatYouWillLearn: [...f.whatYouWillLearn, newOutcome.trim()] }));
                      setNewOutcome("");
                    }
                  }
                }}
              />
              <Button type="button" onClick={() => {
                if (newOutcome.trim()) {
                  setForm(f => ({ ...f, whatYouWillLearn: [...f.whatYouWillLearn, newOutcome.trim()] }));
                  setNewOutcome("");
                }
              }}>Add</Button>
            </div>
            <ul className="list-disc pl-5 space-y-1">
              {form.whatYouWillLearn.map((item, idx) => (
                <li key={idx} className="flex items-center justify-between">
                  <span>{item}</span>
                  <Button type="button" size="sm" variant="ghost" onClick={() => setForm(f => ({ ...f, whatYouWillLearn: f.whatYouWillLearn.filter((_, i) => i !== idx) }))}>Remove</Button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Requirements</label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newRequirement}
                onChange={e => setNewRequirement(e.target.value)}
                placeholder="Add a requirement"
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (newRequirement.trim()) {
                      setForm(f => ({ ...f, prerequisites: [...f.prerequisites, newRequirement.trim()] }));
                      setNewRequirement("");
                    }
                  }
                }}
              />
              <Button type="button" onClick={() => {
                if (newRequirement.trim()) {
                  setForm(f => ({ ...f, prerequisites: [...f.prerequisites, newRequirement.trim()] }));
                  setNewRequirement("");
                }
              }}>Add</Button>
            </div>
            <ul className="list-disc pl-5 space-y-1">
              {form.prerequisites.map((item, idx) => (
                <li key={idx} className="flex items-center justify-between">
                  <span>{item}</span>
                  <Button type="button" size="sm" variant="ghost" onClick={() => setForm(f => ({ ...f, prerequisites: f.prerequisites.filter((_, i) => i !== idx) }))}>Remove</Button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">This Course Includes</label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newInclude}
                onChange={e => setNewInclude(e.target.value)}
                placeholder="Add a course feature (e.g. Certificate, Lifetime Access)"
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (newInclude.trim()) {
                      setForm(f => ({ ...f, courseIncludes: [...f.courseIncludes, newInclude.trim()] }));
                      setNewInclude("");
                    }
                  }
                }}
              />
              <Button type="button" onClick={() => {
                if (newInclude.trim()) {
                  setForm(f => ({ ...f, courseIncludes: [...f.courseIncludes, newInclude.trim()] }));
                  setNewInclude("");
                }
              }}>Add</Button>
            </div>
            <ul className="list-disc pl-5 space-y-1">
              {form.courseIncludes.map((item, idx) => (
                <li key={idx} className="flex items-center justify-between">
                  <span>{item}</span>
                  <Button type="button" size="sm" variant="ghost" onClick={() => setForm(f => ({ ...f, courseIncludes: f.courseIncludes.filter((_, i) => i !== idx) }))}>Remove</Button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Instructor *</label>
            <select
              className="w-full border rounded p-2"
              value={form.instructorId}
              onChange={e => setForm(f => ({ ...f, instructorId: e.target.value }))}
              required
              disabled={loadingInstructors}
            >
              <option value="">Select instructor</option>
              {instructors.map(instructor => (
                <option key={instructor.id} value={instructor.id}>
                  {instructor.name} {instructor.title ? `(${instructor.title})` : ''}
                </option>
              ))}
            </select>
            {loadingInstructors && <p className="text-sm text-muted-foreground mt-1">Loading instructors...</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tags</label>
            <Input
              value={form.tags}
              onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
              placeholder="Comma separated tags"
            />
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isPublished"
              checked={form.isPublished}
              onChange={e => setForm(f => ({ ...f, isPublished: e.target.checked }))}
            />
            <label htmlFor="isPublished" className="text-sm">Publish immediately</label>
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          {success && <div className="text-green-600 text-sm">Course added successfully!</div>}
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save Course"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const AdminPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [studentsTabLoading, setStudentsTabLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('courses');
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  // Add state for analytics data
  const [userGrowth, setUserGrowth] = useState([]);
  const [enrollmentsOverTime, setEnrollmentsOverTime] = useState([]);
  const [revenue, setRevenue] = useState([]);
  const [completionRates, setCompletionRates] = useState([]);
  const [topCourses, setTopCourses] = useState([]);
  const [certificatesIssued, setCertificatesIssued] = useState([]);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [contactLoading, setContactLoading] = useState(false);
  const [contactError, setContactError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("/api/admin/dashboard", {
          headers: {
            "Authorization": token ? `Bearer ${token}` : undefined,
          },
        });
        const data = await response.json();
        if (response.ok && data.success) {
          setStats(data.data.stats);
          setCourses(data.data.courses || []);
          setStudents(data.data.students || []);
          setPayments(data.data.payments || []);
        } else {
          setError(data.message || "Failed to load dashboard data");
        }
      } catch (err) {
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (activeTab === 'students') {
      setStudentsTabLoading(true);
      const token = localStorage.getItem('token');
      fetch('/api/admin/enrollments', {
        headers: {
          Authorization: token ? `Bearer ${token}` : ''
        }
      })
        .then(res => res.json())
        .then(data => {
          setEnrollments(Array.isArray(data.data) ? data.data : []);
        })
        .catch(() => setEnrollments([]))
        .finally(() => setStudentsTabLoading(false));
    }
  }, [activeTab]);

  // Fetch reviews when Reviews tab is active
  useEffect(() => {
    if (activeTab === 'reviews') {
      const token = localStorage.getItem('token');
      fetch('/api/admin/reviews', {
        headers: { Authorization: token ? `Bearer ${token}` : '' }
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) setReviews(data.data);
        });
    }
  }, [activeTab]);

  // Add useEffect for analytics data fetching
  useEffect(() => {
    if (activeTab === 'analytics') {
      setAnalyticsLoading(true);
      const token = localStorage.getItem('token');
      Promise.all([
        fetch('/api/admin/analytics/user-growth', { headers: { Authorization: token ? `Bearer ${token}` : '' } }).then(r => r.json()),
        fetch('/api/admin/analytics/enrollments-over-time', { headers: { Authorization: token ? `Bearer ${token}` : '' } }).then(r => r.json()),
        fetch('/api/admin/analytics/revenue', { headers: { Authorization: token ? `Bearer ${token}` : '' } }).then(r => r.json()),
        fetch('/api/admin/analytics/completion-rates', { headers: { Authorization: token ? `Bearer ${token}` : '' } }).then(r => r.json()),
        fetch('/api/admin/analytics/top-courses', { headers: { Authorization: token ? `Bearer ${token}` : '' } }).then(r => r.json()),
        fetch('/api/admin/analytics/certificates-issued', { headers: { Authorization: token ? `Bearer ${token}` : '' } }).then(r => r.json()),
      ]).then(([ug, eo, rev, cr, tc, ci]) => {
        setUserGrowth(ug.data || []);
        setEnrollmentsOverTime(eo.data || []);
        setRevenue(rev.data || []);
        setCompletionRates(cr.data || []);
        setTopCourses(tc.data || []);
        setCertificatesIssued(ci.data || []);
      }).finally(() => setAnalyticsLoading(false));
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'contact') {
      setContactLoading(true);
      setContactError(null);
      const token = localStorage.getItem('token');
      fetch('/api/contact', {
        headers: { Authorization: token ? `Bearer ${token}` : '' }
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) setContactMessages(data.data);
          else setContactError(data.message || 'Failed to load contact messages');
        })
        .catch(() => setContactError('Failed to load contact messages'))
        .finally(() => setContactLoading(false));
    }
  }, [activeTab]);

  // Delete course handler
  const handleDeleteCourse = async (courseId: string) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/courses/${courseId}`, {
        method: "DELETE",
        headers: {
          Authorization: token ? `Bearer ${token}` : ""
        }
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setCourses(courses => courses.filter(c => c.id !== courseId));
      } else {
        alert(data.message || "Failed to delete course");
      }
    } catch (err) {
      alert("Failed to delete course");
    }
  };

  // Delete review handler
  const handleDeleteReview = async (reviewId: string) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: "DELETE",
        headers: { Authorization: token ? `Bearer ${token}` : '' }
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setReviews(reviews => reviews.filter(r => r.id !== reviewId));
      } else {
        alert(data.message || "Failed to delete review");
      }
    } catch (err) {
      alert("Failed to delete review");
    }
  };

  const handleDeleteContact = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    setDeletingId(id);
    setDeleteError(null);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/contact/${id}`, {
        method: 'DELETE',
        headers: { Authorization: token ? `Bearer ${token}` : '' }
      });
      if (res.ok) {
        setContactMessages(msgs => msgs.filter(m => m.id !== id));
      } else {
        const data = await res.json().catch(() => ({}));
        setDeleteError(data.message || 'Failed to delete message');
      }
    } catch {
      setDeleteError('Failed to delete message');
    }
    setDeletingId(null);
  };

  const COLORS = ['#2563eb', '#22c55e', '#f59e42', '#a21caf', '#fbbf24', '#ef4444', '#14b8a6', '#6366f1'];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your learning platform</p>
        </div>

        {loading ? (
          <div className="text-center py-12 text-lg">Loading...</div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">{error}</div>
        ) : (
          <>
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats && [
                {
                  icon: <Users className="h-6 w-6 text-blue-600" />,
                  label: "Total Users",
                  value: stats.totalUsers,
                  description: "All users"
                },
                {
                  icon: <BookOpen className="h-6 w-6 text-green-600" />,
                  label: "Total Courses",
                  value: stats.totalCourses,
                  description: "Published courses"
                },
                {
                  icon: <DollarSign className="h-6 w-6 text-purple-600" />,
                  label: "Revenue",
                  value: `$${stats.totalRevenue || 0}`,
                  description: "Total revenue"
                },
                {
                  icon: <TrendingUp className="h-6 w-6 text-orange-600" />,
                  label: "Enrollments",
                  value: stats.totalEnrollments,
                  description: "Total enrollments"
                }
              ].map((stat, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                        <p className="text-2xl font-bold">{stat.value}</p>
                        <p className="text-xs text-muted-foreground">{stat.description}</p>
                      </div>
                      <div className="p-2 bg-gray-100 rounded-lg">
                        {stat.icon}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Main Content */}
            <Tabs defaultValue="courses" className="space-y-6" onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="courses">Courses</TabsTrigger>
                <TabsTrigger value="students">Students</TabsTrigger>
                <TabsTrigger value="payments">Payments</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                <TabsTrigger value="contact" onClick={() => setActiveTab('contact')}>Contact Messages</TabsTrigger>
              </TabsList>

              {/* Courses Management */}
              <TabsContent value="courses" className="space-y-6">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                      <Input 
                        placeholder="Search courses..." 
                        className="pl-10 w-64"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  <AddCourseDialog />
                </div>

                <Card>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Course</TableHead>
                        <TableHead>Instructor</TableHead>
                        <TableHead>Students</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {courses.filter(course => course.title?.toLowerCase().includes(searchTerm.toLowerCase())).map((course) => (
                        <TableRow key={course.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{course.title}</p>
                              <p className="text-sm text-muted-foreground">Created {course.createdAt?.slice(0, 10)}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            {course.instructor ? (
                              <div className="flex items-center space-x-2">
                                {course.instructor.avatar && (
                                  <img 
                                    src={course.instructor.avatar} 
                                    alt={course.instructor.name}
                                    className="w-6 h-6 rounded-full"
                                  />
                                )}
                                <div>
                                  <p className="font-medium">{course.instructor.name}</p>
                                  {course.instructor.title && (
                                    <p className="text-xs text-muted-foreground">{course.instructor.title}</p>
                                  )}
                                </div>
                              </div>
                            ) : (
                              "-"
                            )}
                          </TableCell>
                          <TableCell>{course.enrollmentCount || 0}</TableCell>
                          <TableCell>
                            <Badge variant={course.isPublished ? 'default' : 'secondary'}>
                              {course.isPublished ? 'Active' : 'Draft'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => navigate(`/admin/course-builder/${course.id}`)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => handleDeleteCourse(course.id)}>
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              </TabsContent>

              {/* Students Management */}
              <TabsContent value="students" className="space-y-6">
                <Card>
                  {studentsTabLoading ? (
                    <div className="text-center py-8">Loading...</div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Course</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {enrollments.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center">No enrollments found.</TableCell>
                          </TableRow>
                        ) : (
                          enrollments.map((enrollment) => (
                            <TableRow key={enrollment.id}>
                              <TableCell>{enrollment.student?.name || '-'}</TableCell>
                              <TableCell>{enrollment.student?.email || '-'}</TableCell>
                              <TableCell>{enrollment.course?.title || '-'}</TableCell>
                              <TableCell>
                                <Badge
                                  variant={enrollment.status === 'active' ? 'default' : 'secondary'}
                                  className={enrollment.status === 'active' ? 'bg-primary text-primary-foreground' : ''}
                                >
                                  {enrollment.status === 'active' ? 'Active' : (enrollment.status || 'active')}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  )}
                </Card>
              </TabsContent>

              {/* Payments Management */}
              <TabsContent value="payments" className="space-y-6">
                <Card>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Course</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {payments.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell>{payment.studentName || payment.student || "-"}</TableCell>
                          <TableCell>{payment.courseTitle || payment.course || "-"}</TableCell>
                          <TableCell>{payment.amount ? `$${payment.amount}` : "-"}</TableCell>
                          <TableCell>{payment.date ? payment.date.slice(0, 10) : payment.createdAt?.slice(0, 10) || "-"}</TableCell>
                          <TableCell>
                            <Badge variant={payment.status === 'completed' ? 'default' : 'secondary'}>
                              {payment.status || 'pending'}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              </TabsContent>

              {/* Analytics Tab (placeholder) */}
              <TabsContent value="analytics" className="space-y-6">
                {analyticsLoading ? (
                  <Card><CardContent className="p-8 text-center">Loading analytics...</CardContent></Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* User Growth */}
                    <Card>
                      <CardHeader><CardTitle>User Growth</CardTitle></CardHeader>
                      <CardContent style={{ height: 250 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={userGrowth} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Line type="monotone" dataKey="users" stroke="#2563eb" strokeWidth={3} />
                          </LineChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                    {/* New Enrollments Over Time */}
                    <Card>
                      <CardHeader><CardTitle>New Enrollments Over Time</CardTitle></CardHeader>
                      <CardContent style={{ height: 250 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={enrollmentsOverTime} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Line type="monotone" dataKey="enrollments" stroke="#22c55e" strokeWidth={3} />
                          </LineChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                    {/* Revenue Over Time */}
                    <Card>
                      <CardHeader><CardTitle>Revenue Over Time</CardTitle></CardHeader>
                      <CardContent style={{ height: 250 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={revenue} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Line type="monotone" dataKey="revenue" stroke="#a21caf" strokeWidth={3} />
                          </LineChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                    {/* Course Completion Rates */}
                    <Card>
                      <CardHeader><CardTitle>Course Completion Rates</CardTitle></CardHeader>
                      <CardContent style={{ height: 250 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={completionRates} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="course" />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Bar dataKey="rate" fill="#f59e42" />
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                    {/* Top Courses */}
                    <Card>
                      <CardHeader><CardTitle>Top Courses</CardTitle></CardHeader>
                      <CardContent style={{ height: 250 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={topCourses}
                              dataKey="enrollments"
                              nameKey="course"
                              cx="50%"
                              cy="50%"
                              outerRadius={80}
                              label
                            >
                              {topCourses.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                    {/* Certificates Issued */}
                    <Card>
                      <CardHeader><CardTitle>Certificates Issued</CardTitle></CardHeader>
                      <CardContent style={{ height: 250 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={certificatesIssued} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Line type="monotone" dataKey="certificates" stroke="#fbbf24" strokeWidth={3} />
                          </LineChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </TabsContent>

              {/* Reviews Management */}
              <TabsContent value="reviews" className="space-y-6">
                <Card>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Course</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Comment</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reviews.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center">No reviews found.</TableCell>
                        </TableRow>
                      ) : (
                        reviews.map((review) => (
                          <TableRow key={review.id}>
                            <TableCell>{review.course?.title || '-'}</TableCell>
                            <TableCell>{review.student?.name || '-'}</TableCell>
                            <TableCell>
                              <span className="flex items-center gap-1 text-amber-400">
                                {[...Array(review.rating)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                              </span>
                            </TableCell>
                            <TableCell>{review.comment}</TableCell>
                            <TableCell>{new Date(review.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <Button variant="outline" size="sm" onClick={() => handleDeleteReview(review.id)}>
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </Card>
              </TabsContent>

              {/* Contact Messages Management */}
              <TabsContent value="contact">
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Contact Messages</CardTitle>
                    <CardDescription>Messages submitted via the Contact Us form.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {contactLoading ? (
                      <div>Loading...</div>
                    ) : contactError ? (
                      <div className="text-red-600">{contactError}</div>
                    ) : contactMessages.length === 0 ? (
                      <div>No contact messages found.</div>
                    ) : (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Name</TableHead>
                              <TableHead>Email</TableHead>
                              <TableHead>Subject</TableHead>
                              <TableHead>Message</TableHead>
                              <TableHead>Date</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {contactMessages.map(msg => (
                              <TableRow key={msg.id}>
                                <TableCell>{msg.name}</TableCell>
                                <TableCell>{msg.email}</TableCell>
                                <TableCell>{msg.subject}</TableCell>
                                <TableCell>{msg.message}</TableCell>
                                <TableCell>{new Date(msg.createdAt).toLocaleString()}</TableCell>
                                <TableCell>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleDeleteContact(msg.id)}
                                    disabled={deletingId === msg.id}
                                  >
                                    {deletingId === msg.id ? 'Deleting...' : 'Delete'}
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                        {deleteError && <div className="text-red-600 mt-2">{deleteError}</div>}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default AdminPage;
