import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Star, Users, Pause, Volume2, RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";

export const HeroSection = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleVideoClick = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
        setShowControls(true);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
        setShowControls(false);
      }
    }
  };

  const handlePlayButtonClick = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
      setShowControls(false);
    }
  };

  const handlePauseButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
      setShowControls(true);
    }
  };

  const handleRewind = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 10);
    }
  };

  // Auto-pause video when component unmounts or page changes
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (videoRef.current && isPlaying) {
        videoRef.current.pause();
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden && videoRef.current && isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
        setShowControls(true);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (videoRef.current && isPlaying) {
        videoRef.current.pause();
      }
    };
  }, [isPlaying]);

  return (
    <section className="relative py-16 md:py-24 hero-gradient overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-primary rounded-full animate-ping"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-accent rounded-full animate-ping delay-1000"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-6 md:space-y-8 text-center lg:text-left">
            <div className="space-y-4 md:space-y-6">
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 text-xs md:text-sm px-3 py-1 hover:scale-105 transition-transform duration-300">
                🚀 New: AI-Powered Learning Paths
              </Badge>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Master New Skills with
                <span className="gradient-text block mt-2 transform hover:scale-105 transition-transform duration-500">Join Nexora</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-lg mx-auto lg:mx-0 leading-relaxed">
                Transform your career with our comprehensive online learning platform. 
                Learn from industry experts and earn recognized certifications.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button asChild size="lg" className="text-base md:text-lg px-6 md:px-8 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transform hover:scale-105 transition-all duration-300">
                <Link to="/courses">
                  <Play className="h-4 md:h-5 w-4 md:w-5 mr-2" />
                  Start Learning
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-base md:text-lg px-6 md:px-8 border-primary/20 hover:bg-primary/5 hover:border-primary/30 transform hover:scale-105 transition-all duration-300">
                <Link to="/about">
                  Learn More
                </Link>
              </Button>
            </div>

            {/* Enhanced Stats */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-8 pt-6">
              <div className="flex items-center space-x-2 group">
                <div className="p-2 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors duration-300">
                  <Users className="h-4 md:h-5 w-4 md:w-5 text-primary" />
                </div>
                <span className="font-semibold text-sm md:text-base">50,000+ Students</span>
              </div>
              <div className="flex items-center space-x-2 group">
                <div className="p-2 bg-amber-500/10 rounded-full group-hover:bg-amber-500/20 transition-colors duration-300">
                  <Star className="h-4 md:h-5 w-4 md:w-5 text-amber-500" />
                </div>
                <span className="font-semibold text-sm md:text-base">4.9/5 Rating</span>
              </div>
            </div>
          </div>

          {/* Enhanced Video Section */}
          <div className="relative group">
            <div className="relative aspect-video card-gradient rounded-2xl md:rounded-3xl border border-primary/10 shadow-2xl shadow-primary/10 overflow-hidden transform hover:scale-105 transition-all duration-500">
              <video
                ref={videoRef}
                className="w-full h-full object-cover cursor-pointer"
                poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600'%3E%3Crect width='800' height='600' fill='%23f8fafc'/%3E%3Ctext x='400' y='280' text-anchor='middle' font-family='Arial, sans-serif' font-size='24' fill='%236b7280'%3EJoin Nexora Introduction%3C/text%3E%3Ctext x='400' y='320' text-anchor='middle' font-family='Arial, sans-serif' font-size='16' fill='%239ca3af'%3EDiscover the future of learning%3C/text%3E%3C/svg%3E"
                onClick={handleVideoClick}
              >
                <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>

              {/* Play/Pause Button Overlay */}
              {showControls && (
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/30 transition-all duration-300">
                  <button
                    onClick={handlePlayButtonClick}
                    className="w-16 h-16 md:w-20 md:h-20 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-xl hover:bg-white hover:scale-110 transition-all duration-300"
                  >
                    <Play className="h-6 md:h-8 w-6 md:w-8 text-primary ml-1" />
                  </button>
                </div>
              )}

              {/* Video Info Badge */}
              <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs md:text-sm flex items-center space-x-2">
                <Volume2 className="h-3 w-3" />
                <span>Join Nexora Intro</span>
              </div>
            </div>
            
            {/* Video Controls */}
            <div className="flex items-center justify-center space-x-4 mt-4 bg-card/50 backdrop-blur-sm rounded-full px-6 py-3 border border-primary/10">
              <button
                onClick={handleRewind}
                className="flex items-center space-x-2 px-3 py-2 rounded-full hover:bg-primary/10 transition-colors duration-300"
              >
                <RotateCcw className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">10s</span>
              </button>
              
              <button
                onClick={handlePauseButtonClick}
                className="w-10 h-10 bg-primary/10 hover:bg-primary/20 rounded-full flex items-center justify-center transition-all duration-300"
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4 text-primary" />
                ) : (
                  <Play className="h-4 w-4 text-primary ml-0.5" />
                )}
              </button>
            </div>

            {/* 3D Floating Elements */}
            <div className="absolute -bottom-4 -left-4 md:-bottom-6 md:-left-6 bg-card/95 backdrop-blur-sm border border-primary/10 rounded-xl p-3 md:p-4 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 hidden sm:block">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center animate-pulse">
                  <span className="text-green-600 font-semibold text-sm">✓</span>
                </div>
                <div>
                  <p className="font-semibold text-xs md:text-sm">Course Completed</p>
                  <p className="text-muted-foreground text-xs">Advanced React Development</p>
                </div>
              </div>
            </div>

            <div className="absolute -top-4 -right-4 md:-top-6 md:-right-6 bg-card/95 backdrop-blur-sm border border-primary/10 rounded-xl p-3 md:p-4 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 hidden sm:block">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center">
                  <Star className="h-4 w-4 md:h-5 md:w-5 text-amber-500 animate-spin" style={{animationDuration: '3s'}} />
                </div>
                <div>
                  <p className="font-semibold text-xs md:text-sm">5.0 Rating</p>
                  <p className="text-muted-foreground text-xs">Web Development</p>
                </div>
              </div>
            </div>

            {/* Additional 3D Elements */}
            <div className="absolute top-1/2 -right-8 w-4 h-4 bg-accent/30 rounded-full animate-bounce delay-500 hidden lg:block"></div>
            <div className="absolute bottom-1/4 -left-8 w-3 h-3 bg-primary/40 rounded-full animate-bounce delay-1000 hidden lg:block"></div>
          </div>
        </div>
      </div>
    </section>
  );
};
