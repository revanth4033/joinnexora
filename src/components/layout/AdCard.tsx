import { Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function AdCard() {
  const navigate = useNavigate();
  return (
    <div className="relative sticky top-8 rounded-2xl bg-gradient-to-br from-primary/90 to-blue-400/80 shadow-2xl p-8 flex flex-col items-center text-center overflow-hidden animate-fade-in">
      {/* Animated Sparkles */}
      <div className="absolute -top-4 -right-4 animate-pulse">
        <Sparkles className="h-12 w-12 text-white/70" />
      </div>
      {/* Logo/Icon */}
      <div className="flex items-center justify-center mb-4">
        <div className="h-12 w-12 rounded-xl bg-white/80 flex items-center justify-center shadow-lg">
          <img src="/favicon.ico" alt="Nexora Logo" className="h-8 w-8" />
        </div>
      </div>
      <h2 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">Join Nexora</h2>
      <p className="text-white/90 mb-4 text-base font-medium drop-shadow-sm">
        Empower your career with <span className="font-semibold text-yellow-200">world-class courses</span> and certifications.<br/>
        Unlock your potential today!
      </p>
      {/* #LevelUp badge - more visible */}
      <div className="mb-4 flex justify-center">
        <span className="bg-blue-600 text-white font-bold px-4 py-1 rounded-full text-xs shadow-lg animate-bounce tracking-wide">#LevelUp</span>
      </div>
      <Button
        size="lg"
        className="bg-white text-primary font-bold shadow-lg hover:scale-105 hover:bg-primary/90 hover:text-white transition-all duration-300 px-8 py-2 rounded-xl mb-6"
        onClick={() => navigate('/courses')}
      >
        Explore All Courses <ArrowRight className="ml-2 h-5 w-5" />
      </Button>
      {/* Telecommuting illustration by Storyset (https://storyset.com/illustration/telecommuting/rafiki) */}
      <div className="w-full flex justify-center mt-2">
        <img
          src="/learn.svg"
          alt="Telecommuting illustration by Storyset"
          style={{ width: '100%', maxWidth: 220, height: 'auto' }}
        />
      </div>
    </div>
  );
} 