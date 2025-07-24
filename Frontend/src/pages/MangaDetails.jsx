import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Star, Bookmark, BookmarkX, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

// --- TanStack Query & Zustand Imports ---
import { useMangaDetails } from "@/hooks/useMangaQueries";
import { 
  useUserCollection, 
  useAddMangaToCollection, 
  useRemoveMangaFromCollection 
} from "@/hooks/useUserQueries";
import { useAuthStore } from "@/store/useAuthStore";

// --- Component Imports (Unchanged) ---
import EmptyState from "@/components/EmptyState";

// Mock chapters remain unchanged, as it's UI logic
const mockChapters = Array.from({ length: 156 }, (_, i) => ({
  id: `chapter-${i + 1}`,
  number: i + 1,
  title: `Chapter ${i + 1}`,
  releaseDate: new Date(Date.now() - Math.random() * 60 * 86400000).toLocaleDateString(),
  isRead: i < 45,
}));

const MangaDetails = () => {
  const { mal_id } = useParams();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const { data: manga, isLoading, isError, error, refetch } = useMangaDetails(mal_id);

  const { data: userCollection } = useUserCollection();
  const isBookmarked = userCollection?.some(item => item.mal_id === parseInt(mal_id));

  const addMutation = useAddMangaToCollection();
  const removeMutation = useRemoveMangaFromCollection();

  const handleBookmarkToggle = () => {
    if (!manga || !isAuthenticated) {
      toast.error("Please log in to manage your collection.");
      return;
    }

    if (isBookmarked) {
      removeMutation.mutate(manga.mal_id, {
        onSuccess: () => toast.warning("Removed from your collection."),
        onError: () => toast.error("Failed to remove from collection."),
      });
    } else {
      addMutation.mutate({ mal_id: manga.mal_id }, {
        onSuccess: () => toast.success("Added to your collection!"),
        onError: () => toast.error("Failed to add to collection."),
      });
    }
  };

  // --- UI Rendering Logic ---

  if (isLoading) {
    return (
      <div className="container py-20 text-center text-muted-foreground">
        Loading...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container py-20 text-center">
        <EmptyState message={error.message || "Manga not found."} onRetry={refetch} />
      </div>
    );
  }

  if (!manga) {
    return null; // Or a more specific "not found" component
  }

  // Check if a mutation is in progress to disable the button
  const isMutating = addMutation.isPending || removeMutation.isPending;

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Back Button */}
      <div className="container mx-auto px-4 py-4">
        <Link
          to="/catalog"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Catalog
        </Link>
      </div>

      {/* Hero Section (UI is unchanged) */}
      <div className="relative w-full h-[80vh] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url("https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&h=600&fit=crop")`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
          <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-end">
            {/* Cover Image */}
            <div className="flex-shrink-0">
              <img
                src={manga.cover_url}
                alt={manga.title}
                className="w-64 h-96 object-cover rounded-lg shadow-2xl neon-border"
              />
            </div>

            {/* Content */}
            <div className="flex-1 max-w-3xl">
              <div className="flex items-center gap-2 mb-4">
                <Badge className="bg-primary/20 text-primary border-primary/30">
                  {(manga.status || "Ongoing").charAt(0).toUpperCase() +
                    (manga.status || "Ongoing").slice(1)}
                </Badge>
                <span className="text-muted-foreground text-sm">
                  {manga.year}
                </span>
              </div>

              <h1
                className={`font-kareudon font-bold mb-4 text-gradient-anime animate-neon-glow leading-tight break-words ${
                  manga.title.length > 50
                    ? "text-2xl sm:text-3xl md:text-4xl lg:text-5xl"
                    : manga.title.length > 30
                    ? "text-3xl sm:text-4xl md:text-5xl lg:text-6xl"
                    : "text-4xl sm:text-5xl md:text-6xl lg:text-7xl"
                }`}
              >
                {manga.title}
              </h1>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="font-semibold text-lg">{manga.rating}</span>
                </div>
                <span className="text-muted-foreground">by {manga.author}</span>
              </div>

              <p className="text-lg text-muted-foreground mb-8 max-w-2xl leading-relaxed">
                {manga.description?.split(" ").slice(0, 80).join(" ")}...
              </p>

              <div className="flex flex-wrap gap-2 mb-8">
                {manga.tags?.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="bg-muted/30 border-primary/30 hover:bg-primary/20"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center gap-4">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-semibold px-8"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Start Reading
                </Button>
                {/* Bookmark Button */}
                {isAuthenticated && (
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={handleBookmarkToggle}
                    disabled={isMutating}
                    className="neon-border bg-background/50 backdrop-blur-sm hover:bg-background/70"
                  >
                    {isBookmarked ? (
                      <BookmarkX className="w-5 h-5 mr-2" />
                    ) : (
                      <Bookmark className="w-5 h-5 mr-2" />
                    )}
                    {isMutating ? (isBookmarked ? 'Removing...' : 'Adding...') : (isBookmarked ? "Remove" : "Add to List")}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chapters Section (UI is unchanged) */}
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="font-kareudon text-3xl font-bold mb-2 text-gradient-anime">
            Chapters
          </h2>
        </div>

        <div className="bg-card rounded-lg border border-border/50 overflow-hidden">
          <div className="max-h-[600px] overflow-y-auto">
            {mockChapters.map((chapter) => (
              <div
                key={chapter.id}
                className="flex items-center justify-between p-4 border-b border-border/30 hover:bg-muted/30 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30">
                    <span className="font-semibold text-sm">
                      {chapter.number}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold group-hover:text-primary transition-colors">
                      {chapter.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Released: {chapter.releaseDate}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {chapter.isRead && (
                    <Badge
                      variant="secondary"
                      className="bg-green-500/20 text-green-400 border-green-500/30"
                    >
                      Read
                    </Badge>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() =>
                      toast("✨ Chapter reading coming soon! Stay tuned.")
                    }
                  >
                    <Play className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MangaDetails;

