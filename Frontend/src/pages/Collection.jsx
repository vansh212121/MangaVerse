import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { MangaCard } from "@/components/MangaCard";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Filter } from "lucide-react";
import SakuraPetals from "@/components/SakuraPetals";
import EmptyState from "@/components/EmptyState";
import { toast } from "sonner";

// --- TanStack Query & Zustand Imports ---
import {
  useUserCollection,
  useUpdateMangaStatus,
} from "@/hooks/useUserQueries";
import { useAuthStore } from "@/store/useAuthStore";

const Collections = () => {
  // --- Local UI State for filters (Unchanged) ---
  const [sortBy, setSortBy] = useState("title");
  const [showFilters, setShowFilters] = useState(false);

  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const {
    data: userCollection,
    isLoading,
    isError,
    refetch,
  } = useUserCollection();
  const updateStatusMutation = useUpdateMangaStatus();

  const { statusCounts, getFilteredCollection } = useMemo(() => {
    const collection = userCollection || [];

    const counts = {
      all: collection.length,
      reading: collection.filter((m) => m.status === "reading").length,
      completed: collection.filter((m) => m.status === "completed").length,
      planned: collection.filter((m) => m.status === "planned").length,
    };

    const filterAndSort = (status) => {
      const filtered =
        status === "all"
          ? collection
          : collection.filter((manga) => manga.status === status);

      return [...filtered].sort((a, b) => {
        switch (sortBy) {
          case "title":
            return a.title.localeCompare(b.title);
          case "author":
            return (a.author || "").localeCompare(b.author || "");
          case "rating":
            return (b.rating || 0) - (a.rating || 0);
          default:
            return 0;
        }
      });
    };

    return { statusCounts: counts, getFilteredCollection: filterAndSort };
  }, [userCollection, sortBy]);

  // --- Event Handlers ---
  const handleStatusUpdate = (mal_id, newStatus) => {
    updateStatusMutation.mutate(
      { mal_id, newStatus },
      {
        onSuccess: () => toast.success("Status updated successfully!"),
        onError: (error) =>
          toast.error(
            error.response?.data?.detail || "Failed to update status."
          ),
      }
    );
  };

  // --- Render Logic ---

  if (!isAuthenticated && !isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <SakuraPetals />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-6 animate-float">
              <span className="text-3xl">🔑</span>
            </div>
            <h3 className="text-2xl font-bold mb-4">Please Log In</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              You need to be logged in to view your personal manga collection.
            </p>
            <Button
              asChild
              className="bg-gradient-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80"
            >
              <Link to="/login">Go to Login</Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <SakuraPetals />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <span className="text-3xl">📚</span>
            </div>
            <h3 className="text-2xl font-bold mb-4">Loading your library...</h3>
          </div>
        </main>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <SakuraPetals />
        <main className="container mx-auto px-4 py-8">
          <EmptyState
            message="Could not load your collection."
            onRetry={refetch}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <SakuraPetals />

      <main className="container mx-auto px-4 py-8">
        {/* Header (UI Unchanged) */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Library</h1>
          <p className="text-muted-foreground">Manage your manga collection</p>
        </div>

        {/* Stats and Controls (UI Unchanged) */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="bg-muted/50">
              Total: {statusCounts.all}
            </Badge>
            <Badge
              variant="outline"
              className="bg-green-500/10 text-green-400 border-green-500/20"
            >
              Reading: {statusCounts.reading}
            </Badge>
            <Badge
              variant="outline"
              className="bg-blue-500/10 text-blue-400 border-blue-500/20"
            >
              Completed: {statusCounts.completed}
            </Badge>
            <Badge
              variant="outline"
              className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
            >
              Planned: {statusCounts.planned}
            </Badge>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden"
            >
              <Filter className="w-4 h-4 mr-2" /> Filters
            </Button>
            <div className={`${showFilters ? "block" : "hidden"} lg:block`}>
              <Select
                value={sortBy}
                onValueChange={(value) => setSortBy(value)}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="title">Title</SelectItem>
                  <SelectItem value="author">Author</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Collections Tabs */}
        {userCollection.length > 0 ? (
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
              <TabsTrigger value="all">All ({statusCounts.all})</TabsTrigger>
              <TabsTrigger value="reading">
                Reading ({statusCounts.reading})
              </TabsTrigger>
              <TabsTrigger value="completed">
                Completed ({statusCounts.completed})
              </TabsTrigger>
              <TabsTrigger value="planned">
                Planned ({statusCounts.planned})
              </TabsTrigger>
            </TabsList>
            {["all", "reading", "completed", "planned"].map((status) => (
              <TabsContent key={status} value={status} className="mt-8">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                  {getFilteredCollection(status).map((manga, index) => (
                    <div
                      key={manga.mal_id}
                      style={{ animationDelay: `${index * 0.05}s` }}
                      className="animate-fade-in"
                    >
                      <div className="relative">
                        <MangaCard
                          manga={{ ...manga, id: manga.mal_id }}
                          showStatus={true}
                        />
                        <div className="mt-2">
                          <Select
                            value={manga.status}
                            onValueChange={(value) =>
                              handleStatusUpdate(manga.mal_id, value)
                            }
                            disabled={updateStatusMutation.isPending}
                          >
                            <SelectTrigger className="w-full h-8 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="reading">Reading</SelectItem>
                              <SelectItem value="completed">
                                Completed
                              </SelectItem>
                              <SelectItem value="planned">Planned</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-6 animate-float">
              <span className="text-3xl">📚</span>
            </div>
            <h3 className="text-2xl font-bold mb-4">Your library is empty</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Start building your collection by bookmarking manga from the home
              page.
            </p>
            <Button
              asChild
              className="bg-gradient-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80"
            >
              <Link to="/">Explore Manga</Link>
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Collections;
