
import { Users, BookOpen, Award, Star } from "lucide-react";

const stats = [
  {
    icon: <Users className="h-8 w-8 text-primary-foreground" />,
    number: "50,000+",
    label: "Active Students"
  },
  {
    icon: <BookOpen className="h-8 w-8 text-primary-foreground" />,
    number: "200+",
    label: "Expert Courses"
  },
  {
    icon: <Award className="h-8 w-8 text-primary-foreground" />,
    number: "25,000+",
    label: "Certificates Issued"
  },
  {
    icon: <Star className="h-8 w-8 text-primary-foreground" />,
    number: "4.9/5",
    label: "Average Rating"
  }
];

export const StatsSection = () => {
  return (
    <section className="py-16 gradient-bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                  {stat.icon}
                </div>
              </div>
              <div className="text-3xl md:text-4xl font-bold mb-2">{stat.number}</div>
              <div className="text-primary-foreground/80">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
