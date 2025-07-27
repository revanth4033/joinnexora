import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import YouTube, { YouTubePlayer } from "react-youtube";
import { CheckCircle, Lock, Play, SkipBack, SkipForward, Star as StarIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Lesson {
  id: string;
  title: string;
  description?: string;
  videoUrl: string;
  duration?: number;
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  student: { name: string; avatar?: string };
}

type EnrollmentProgress = { lessonId: string; watchTime?: number; completedAt?: string };
type Enrollment = {
  courseId?: string;
  course?: { id: string };
  progress?: EnrollmentProgress[];
  // ...other fields if needed
};

// Add video progress helpers
function getVideoProgressKey(courseId: string, lessonId: string, userId: string) {
  return `video_progress_${userId}_${courseId}_${lessonId}`;
}
function getVideoProgress(courseId: string, lessonId: string, userId: string): number {
  return Number(localStorage.getItem(getVideoProgressKey(courseId, lessonId, userId)) || 0);
}
function setVideoProgress(courseId: string, lessonId: string, userId: string, value: number) {
  localStorage.setItem(getVideoProgressKey(courseId, lessonId, userId), String(value));
}

const LessonPlayerPage = () => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const userId = localStorage.getItem("userId") || "guest";
  const [lesson, setLesson] = useState<Lesson | null>(() => (location.state as { lesson?: Lesson } | undefined)?.lesson || null);
  const [allLessons, setAllLessons] = useState<Lesson[]>(() => (location.state as { allLessons?: Lesson[] } | undefined)?.allLessons || []);
  const [loading, setLoading] = useState(true);
  const [completedLessons, setCompletedLessonsState] = useState<string[]>([]);
  const [videoProgress, setVideoProgressState] = useState<number>(() => lesson ? getVideoProgress(courseId!, lesson.id, userId) : 0);
  const [youtubeDuration, setYoutubeDuration] = useState<number>(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const youtubePlayerRef = useRef<YouTubePlayer | null>(null);
  const youtubeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewRating, setReviewRating] = useState<number>(0);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  // Track if the user has already submitted a review in localStorage
  const reviewedKey = courseId && userId ? `reviewed_${courseId}_${userId}` : '';
  const [hasReviewed, setHasReviewed] = useState(false);

  // Check if user has reviewed the course from backend
  useEffect(() => {
    if (!courseId || !userId) return;
    const checkReviewed = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`/api/reviews/course/${courseId}/user`, {
          headers: { Authorization: token ? `Bearer ${token}` : "" },
        });
        if (res.ok) {
          const data = await res.json();
          setHasReviewed(!!data.reviewed);
          if (data.reviewed && reviewedKey) localStorage.setItem(reviewedKey, "1");
        } else {
          // fallback to localStorage if API fails
          setHasReviewed(reviewedKey && localStorage.getItem(reviewedKey) === "1");
        }
      } catch {
        setHasReviewed(reviewedKey && localStorage.getItem(reviewedKey) === "1");
      }
    };
    checkReviewed();
    // eslint-disable-next-line
  }, [courseId, userId]);

  useEffect(() => {
    // Always update lesson and allLessons from location.state if available
    const state = location.state as { lesson?: Lesson; allLessons?: Lesson[] } | undefined;
    if (state && state.lesson) {
      setLesson(state.lesson);
      setLoading(false);
    } else {
      // fallback: fetch lesson from API
      const fetchLesson = async () => {
        setLoading(true);
        try {
          const token = localStorage.getItem("token");
          const res = await fetch(`/api/courses/${courseId}/lessons/${lessonId}`, {
            headers: { Authorization: token ? `Bearer ${token}` : "" },
          });
          if (res.ok) {
            const data: { data?: Lesson; lesson?: Lesson } = await res.json();
            setLesson(data.data || data.lesson || null);
          }
        } catch (err) {
          console.error(err);
        }
        setLoading(false);
      };
      fetchLesson();
    }
    if (state && state.allLessons) {
      setAllLessons(state.allLessons);
    }
    if (lesson) {
      setVideoProgressState(getVideoProgress(courseId!, lesson.id, userId));
      setYoutubeDuration(0);
    }
    // Clean up YouTube polling interval on lesson change/unmount
    return () => {
      if (youtubeIntervalRef.current) {
        clearInterval(youtubeIntervalRef.current);
        youtubeIntervalRef.current = null;
      }
    };
    // eslint-disable-next-line
  }, [lessonId, courseId, location.state]);

  // Fetch progress from backend on mount
  useEffect(() => {
    async function fetchProgress() {
      const token = localStorage.getItem("token");
      if (!token || !courseId) return;
      const res = await fetch(`/api/enrollments/${courseId}/progress`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data) {
          if (Array.isArray(data.data.progress)) {
            setCompletedLessonsState(data.data.progress.map((p: { lessonId: string }) => p.lessonId));
          } else {
            setCompletedLessonsState([]);
          }
        }
      }
    }
    fetchProgress();
  }, [courseId, userId]);

  useEffect(() => {
    if (!courseId) return;
    fetch(`/api/reviews/course/${courseId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setReviews(data.data);
      });
  }, [courseId]);

  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  // On lesson complete, update backend
  const handleVideoEnd = async () => {
    if (!lesson) return;
    if (!completedLessons.includes(lesson.id)) {
      // Update backend
      const token = localStorage.getItem("token");
      await fetch(`/api/enrollments/${courseId}/progress`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ lessonId: lesson.id, watchTime: videoRef.current?.duration || 0 })
      });
      setCompletedLessonsState([...completedLessons, lesson.id]);
      // Emit custom event for dashboard refresh
      window.dispatchEvent(new Event("lesson-progress-updated"));
    }
  };

  const handleSkip = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, Math.min(videoRef.current.duration, videoRef.current.currentTime + seconds));
    }
  };

  const handleVideoTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const current = e.currentTarget.currentTime;
    if (completedLessons.includes(lesson!.id)) {
      // Don't overwrite 100% progress
      return;
    }
    setVideoProgress(courseId!, lesson!.id, userId, current);
    setVideoProgressState(current);
  };

  const handleYouTubeReady = (event: { target: YouTubePlayer }) => {
    youtubePlayerRef.current = event.target;
    setYoutubeDuration(event.target.getDuration());
    // Poll current time every 500ms
    if (youtubeIntervalRef.current) clearInterval(youtubeIntervalRef.current);
    youtubeIntervalRef.current = setInterval(() => {
      if (!lesson) return;
      if (completedLessons.includes(lesson.id)) {
        // Don't overwrite 100% progress
        return;
      }
      const current = event.target.getCurrentTime();
      setVideoProgress(courseId!, lesson.id, userId, current);
      setVideoProgressState(current);
      setYoutubeDuration(event.target.getDuration());
    }, 500);
  };

  const handleYouTubeEnd = async () => {
    if (!lesson) return;
    if (!completedLessons.includes(lesson.id)) {
      // Update backend
      const token = localStorage.getItem("token");
      await fetch(`/api/enrollments/${courseId}/progress`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ lessonId: lesson.id, watchTime: youtubeDuration })
      });
      const updated = [...completedLessons, lesson.id];
      setCompletedLessonsState(updated);
      // Emit custom event for dashboard refresh
      window.dispatchEvent(new Event("lesson-progress-updated"));
    }
    // Set progress to 100%
    setVideoProgress(courseId!, lesson.id, userId, youtubeDuration);
    setVideoProgressState(youtubeDuration);
  };

  // Remove canReview function and replace with a simple check
  const allLessonsArr: Lesson[] = allLessons.length > 0 ? allLessons : lesson ? [lesson] : [];
  const allCompleted = allLessonsArr.length > 0 && allLessonsArr.every((l: Lesson) => completedLessons.includes(l.id));
  // const reviewedKey = `reviewed_${courseId}_${userId}`; // Moved to top
  // const [hasReviewed, setHasReviewed] = useState(() => localStorage.getItem(reviewedKey) === "1"); // Moved to top

  useEffect(() => {
    if (!courseId || !userId) return;
    if (allCompleted && !hasReviewed) setShowReviewModal(true);
    else setShowReviewModal(false);
  }, [allCompleted, hasReviewed, courseId, userId]);

  // Only show review modal if allCompleted && !hasReviewed
  useEffect(() => {
    if (allCompleted && !hasReviewed) setShowReviewModal(true);
    else setShowReviewModal(false);
  }, [allCompleted, hasReviewed]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        Loading...
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div>
          <h1 className="text-2xl font-bold mb-4">Lesson not found</h1>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </div>
    );
  }

  // Sidebar lesson list logic
  const flatLessons: Lesson[] = allLessons.length > 0 ? allLessons : [lesson];
  const currentIdx = flatLessons.findIndex(l => l.id === lesson.id);
  const isFirst = currentIdx === 0;
  const prevCompleted = isFirst || completedLessons.includes(flatLessons[currentIdx - 1]?.id);
  const isUnlocked = isFirst || prevCompleted;
  const isCompleted = completedLessons.includes(lesson.id);

  const youtubeId = getYoutubeId(lesson.videoUrl);

  // For progress bar, use lesson.duration for HTML5, youtubeDuration for YouTube
  const progressDuration = youtubeId ? youtubeDuration : lesson.duration ? lesson.duration * 60 : 0;
  const progressPercent = progressDuration ? Math.min(100, (videoProgress / progressDuration) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r p-6 hidden md:block">
        <h2 className="text-xl font-bold mb-4">Course Lessons</h2>
        <ul className="space-y-2">
          {flatLessons.map((l, idx) => {
            const lIsCompleted = completedLessons.includes(l.id);
            const lIsFirst = idx === 0;
            const lPrevCompleted = lIsFirst || completedLessons.includes(flatLessons[idx - 1]?.id);
            const lIsUnlocked = lIsFirst || lPrevCompleted;
            const lProgress = getVideoProgress(courseId!, l.id, userId);
            // For sidebar, use lesson.duration for HTML5, youtubeDuration for YouTube if current lesson
            const lDuration = youtubeId && l.id === lesson.id ? youtubeDuration : l.duration ? l.duration * 60 : 0;
            const lPercent = lDuration ? Math.min(100, (lProgress / lDuration) * 100) : 0;
            return (
              <li key={l.id} className={`flex flex-col gap-1 rounded px-3 py-2 ${l.id === lesson.id ? "bg-primary/10" : ""}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {lIsCompleted ? <CheckCircle className="h-4 w-4 text-green-500" /> : lIsUnlocked ? <Play className="h-4 w-4 text-primary" /> : <Lock className="h-4 w-4 text-muted-foreground" />}
                    <span className="text-sm font-medium">{l.title}</span>
                  </div>
                  {lIsUnlocked ? (
                    <button
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-all duration-150 ${l.id === lesson.id ? "bg-primary text-white" : "bg-primary/10 text-primary hover:bg-primary/20"}`}
                      onClick={() => navigate(`/course/${courseId}/lesson/${l.id}`, { state: { lesson: l, allLessons: flatLessons } })}
                    >
                      {lIsCompleted ? "Play again" : "Play"}
                    </button>
                  ) : (
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">Locked</span>
                  )}
                </div>
                {/* Per-video progress bar */}
                <div className="w-full h-1 bg-gray-200 rounded-full mt-1">
                  <div
                    className="h-1 rounded-full bg-primary transition-all duration-200"
                    style={{ width: `${lPercent}%` }}
                  />
                </div>
                {lPercent > 0 ? (
                  <span className="text-[10px] text-muted-foreground">{lPercent.toFixed(0)}% watched</span>
                ) : null}
              </li>
            );
          })}
        </ul>
      </div>
      {/* Main player */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Hide Header and Footer, show only a back button at the top */}
        <div className="w-full flex items-center p-4 bg-background border-b">
          <Button variant="outline" onClick={() => navigate(`/course/${courseId}`)}>
            Back to Course
          </Button>
        </div>
        <div className="container mx-auto px-4 py-8 flex flex-col items-center">
          <Card className="p-6 space-y-6 w-full max-w-3xl">
            <h1 className="text-2xl font-bold">{lesson.title}</h1>
            <div className="relative w-full">
              {youtubeId ? (
                <YouTube
                  videoId={youtubeId}
                  opts={{ width: "100%", playerVars: { autoplay: 0 } }}
                  onReady={handleYouTubeReady}
                  onEnd={handleYouTubeEnd}
                  className="w-full"
                />
              ) : (
                <div className="relative">
                  <video
                    ref={videoRef}
                    controls
                    className="w-full max-h-[70vh]"
                    onEnded={handleVideoEnd}
                    onTimeUpdate={handleVideoTimeUpdate}
                  >
                    <source src={lesson.videoUrl} />
                    Your browser does not support the video tag.
                  </video>
                  {/* Udemy-style skip controls */}
                  <div className="absolute bottom-4 left-4 flex space-x-2">
                    <Button size="icon" variant="secondary" onClick={() => handleSkip(-10)} title="Back 10s">
                      <SkipBack className="w-5 h-5" />
                    </Button>
                    <Button size="icon" variant="secondary" onClick={() => handleSkip(10)} title="Forward 10s">
                      <SkipForward className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
            {/* Current video progress bar */}
            {progressDuration ? (
              <div className="w-full mt-2">
                <div className="flex items-center gap-2">
                  <div className="w-full h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-2 rounded-full bg-primary transition-all duration-200"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground min-w-[32px] text-right">{progressPercent ? `${progressPercent.toFixed(0)}%` : "0%"}</span>
                </div>
              </div>
            ) : null}
            {lesson.description && <p className="text-muted-foreground">{lesson.description}</p>}
            {isCompleted && <div className="text-green-600 font-semibold flex items-center gap-2"><CheckCircle className="w-4 h-4" /> Completed</div>}
          </Card>
        </div>
        {/* Footer is removed */}
      </div>
      <Dialog open={showReviewModal && !hasReviewed} onOpenChange={setShowReviewModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Leave a Review</DialogTitle>
          </DialogHeader>
          <form
            className="flex flex-col gap-4"
            onSubmit={async e => {
              e.preventDefault();
              setReviewSubmitting(true);
              setReviewError(null);
              if (!courseId) {
                setReviewError("Course Not Found");
                setReviewSubmitting(false);
                return;
              }
              try {
                const token = localStorage.getItem("token");
                const res = await fetch("/api/reviews", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: token ? `Bearer ${token}` : ""
                  },
                  body: JSON.stringify({ courseId, rating: reviewRating, comment: reviewComment })
                });
                let data;
                try {
                  data = await res.json();
                } catch (jsonErr) {
                  // If response is not JSON, show generic error
                  setReviewError("Unexpected server error. Please try again later.");
                  setReviewSubmitting(false);
                  return;
                }
                if (res.ok && data.success) {
                  setReviews([data.data, ...reviews]);
                  setReviewRating(0);
                  setReviewComment("");
                  setHasReviewed(true);
                  setShowReviewModal(false);
                  if (reviewedKey) localStorage.setItem(reviewedKey, "1");
                  navigate(`/course/${courseId}`); // Redirect after review
                  window.location.reload();
                } else {
                  setReviewError(data.message || "Failed to submit review");
                }
              } catch (err) {
                setReviewError("Failed to submit review");
              }
              setReviewSubmitting(false);
            }}
          >
            <div className="flex items-center gap-2">
              {[1,2,3,4,5].map(star => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setReviewRating(star)}
                  className={star <= reviewRating ? "text-amber-400" : "text-gray-300"}
                  aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                >
                  <StarIcon className="h-7 w-7 fill-current" />
                </button>
              ))}
              <span className="ml-2 text-sm">{reviewRating > 0 ? `${reviewRating} / 5` : "Rate this course"}</span>
            </div>
            <textarea
              className="w-full border rounded p-2 mt-2"
              rows={3}
              placeholder="Write your review..."
              value={reviewComment}
              onChange={e => setReviewComment(e.target.value)}
              required
            />
            <div className="flex items-center gap-4">
              <Button type="submit" disabled={reviewSubmitting || reviewRating === 0}>
                {reviewSubmitting ? "Submitting..." : "Submit Review"}
              </Button>
              {reviewError && <span className="text-red-500 text-sm">{reviewError}</span>}
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LessonPlayerPage;
