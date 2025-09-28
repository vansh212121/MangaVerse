import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, Menu, X } from "lucide-react";
import { SearchBar } from "./SearchBar";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";

export const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // --- Local UI State (Unchanged) ---
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // --- Global Reactive Auth State ---
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const clearToken = useAuthStore((state) => state.clearToken);

  // The navItems are now static again, as requested.
  const navItems = [
    { path: "/", label: "Home" },
    { path: "/catalog", label: "Catalog" },
    { path: "/news", label: "News" },
    { path: "/collections", label: "Collections" },
  ];

  // The logout handler now uses the global store and navigates smoothly.
  const handleLogout = () => {
    clearToken();
    navigate("/"); // Use navigate for a smooth SPA transition
  };

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo (UI Unchanged) */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-14 h-14 relative shrink-0">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-400 via-purple-400 to-blue-400 rounded-full animate-float shadow-lg transition-shadow duration-300">
                <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-2 bg-pink-600 rounded-full animate-pulse"></div>
                    <div
                      className="w-1.5 h-2 bg-blue-600 rounded-full animate-pulse"
                      style={{ animationDelay: "0.5s" }}
                    ></div>
                  </div>
                  <div className="absolute bottom-1.5 w-2 h-1 bg-pink-400 rounded-full opacity-80"></div>
                </div>
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-mint-green-300 rounded-full animate-ping"></div>
                <div
                  className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-lavender-300 rounded-full animate-ping"
                  style={{ animationDelay: "1s" }}
                ></div>
              </div>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
              MangaVerse
            </span>
          </Link>

          {/* Desktop Navigation (UI Unchanged) */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Right Side Actions (Now Reactive) */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="hover:bg-muted"
            >
              <Search className="w-5 h-5" />
            </Button>

            {isAuthenticated ? (
              <Button
                onClick={handleLogout}
                className="hidden md:flex gradient-anime hover:gradient-anime-dark text-white"
              >
                Logout
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  asChild
                  className="hidden md:flex border-border/50 hover:border-primary/50"
                >
                  <Link to="/login">Log In</Link>
                </Button>
                <Button
                  asChild
                  className="hidden md:flex gradient-anime hover:gradient-anime-dark text-white"
                >
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Search Bar (UI Unchanged) */}
        {isSearchOpen && (
          <div className="py-4 animate-slide-in-up">
            <SearchBar onClose={() => setIsSearchOpen(false)} />
          </div>
        )}

        {/* Mobile Menu (Now Reactive) */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-slide-in-up">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`text-sm font-medium transition-colors hover:text-primary ${
                      isActive ? "text-primary" : "text-muted-foreground"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <div className="flex gap-2 pt-4 border-t border-border">
                {isAuthenticated ? (
                  <Button
                    onClick={handleLogout}
                    className="flex-1 gradient-anime text-white"
                  >
                    Logout
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      asChild
                      className="flex-1 border-border/50"
                    >
                      <Link to="/login">Log In</Link>
                    </Button>
                    <Button
                      asChild
                      className="flex-1 gradient-anime text-white"
                    >
                      <Link to="/signup">Sign Up</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
