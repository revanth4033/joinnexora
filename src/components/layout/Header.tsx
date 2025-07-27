
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, User, BookOpen, Sparkles } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Courses", href: "/courses" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const isActive = (path: string) => location.pathname === path;
  let userName = "User";
  try {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const userObj = JSON.parse(userStr);
      if (userObj && userObj.name) userName = userObj.name;
    }
  } catch {}

  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <header className="sticky top-0 z-50 w-full border-b border-primary/10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-14 md:h-16 items-center justify-between">
          {/* Enhanced Logo */}
          <Link to={isAdminPage ? "/admin" : location.pathname.startsWith("/dashboard") ? "/dashboard" : "/"} className="flex items-center space-x-2 group">
            <div className="relative h-8 w-8 md:h-10 md:w-10 gradient-bg-primary rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110">
              <BookOpen className="h-4 w-4 md:h-5 md:w-5 text-primary-foreground" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-pulse"></div>
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-lg md:text-xl font-bold gradient-text">Join Nexora</span>
              <Sparkles className="h-4 w-4 text-primary animate-pulse" />
            </div>
          </Link>
          {isAdminPage ? (
            <div className="flex items-center space-x-3 lg:space-x-4">
              <span className="text-base font-medium text-muted-foreground">{userName}</span>
              <Button variant="outline" onClick={handleLogout} className="hover:bg-primary/5 hover:scale-105 transition-all duration-300">
                Logout
              </Button>
            </div>
          ) : (
            <>
              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`text-sm font-medium transition-all duration-300 hover:text-primary relative group ${
                      isActive(item.href) ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {item.name}
                    <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full ${
                      isActive(item.href) ? "w-full" : ""
                    }`}></span>
                  </Link>
                ))}
              </nav>
              {/* Desktop Auth Buttons */}
              <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
                {isLoggedIn ? (
                  <>
                    <span className="text-base font-medium text-muted-foreground">{userName}</span>
                    <Button asChild variant="ghost" className="hover:bg-primary/5 hover:scale-105 transition-all duration-300">
                      <Link to="/dashboard">Dashboard</Link>
                    </Button>
                    <Button asChild variant="ghost" className="hover:bg-primary/5 hover:scale-105 transition-all duration-300">
                      <Link to="/courses">Browse Courses</Link>
                    </Button>
                    <Button variant="outline" onClick={handleLogout} className="hover:bg-primary/5 hover:scale-105 transition-all duration-300">
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button asChild variant="ghost" className="hover:bg-primary/5 hover:scale-105 transition-all duration-300">
                      <Link to="/login">
                        <User className="h-4 w-4 mr-2" />
                        Login
                      </Link>
                    </Button>
                    <Button asChild className="shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-r from-primary to-primary/80">
                      <Link to="/signup">Get Started</Link>
                    </Button>
                  </>
                )}
              </div>
            </>
          )}
          {/* Mobile Navigation - hide on admin page */}
          {!isAdminPage && (
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" className="hover:bg-primary/5 hover:scale-110 transition-all duration-300">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 border-primary/10 bg-background/95 backdrop-blur">
                <div className="flex flex-col space-y-6 mt-6">
                  <Link to="/" className="flex items-center space-x-2">
                    <div className="h-10 w-10 gradient-bg-primary rounded-xl flex items-center justify-center shadow-lg">
                      <BookOpen className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="text-xl font-bold gradient-text">Join Nexora</span>
                      <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                    </div>
                  </Link>
                  <nav className="flex flex-col space-y-4">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={() => setIsOpen(false)}
                        className={`text-lg font-medium transition-colors hover:text-primary relative group ${
                          isActive(item.href) ? "text-primary" : "text-muted-foreground"
                        }`}
                      >
                        {item.name}
                        <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full ${
                          isActive(item.href) ? "w-full" : ""
                        }`}></span>
                      </Link>
                    ))}
                  </nav>
                  <div className="flex flex-col space-y-3 pt-6 border-t border-primary/10">
                    {isLoggedIn ? (
                      <Button variant="outline" className="w-full border-primary/20 hover:bg-primary/5 hover:border-primary/30 transition-all duration-300" onClick={handleLogout}>
                        Logout
                      </Button>
                    ) : (
                      <>
                        <Button asChild variant="outline" className="w-full border-primary/20 hover:bg-primary/5 hover:border-primary/30 transition-all duration-300">
                          <Link to="/login" onClick={() => setIsOpen(false)}>
                            <User className="h-4 w-4 mr-2" />
                            Login
                          </Link>
                        </Button>
                        <Button asChild className="w-full shadow-lg bg-gradient-to-r from-primary to-primary/80 hover:shadow-xl transition-all duration-300">
                          <Link to="/signup" onClick={() => setIsOpen(false)}>
                            Get Started
                          </Link>
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </header>
  );
};
