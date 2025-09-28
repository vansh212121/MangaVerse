import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Plus, Star } from "lucide-react";
import { toast } from "sonner";

// --- TanStack Query & Zustand Imports ---
import { useUserCollection, useAddMangaToCollection } from "@/hooks/useUserQueries";
import { useAuthStore } from "@/store/useAuthStore";

export const FeaturedManga = ({ manga }) => {
  // --- Global State & Hooks ---
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { data: userCollection } = useUserCollection();
  const addMangaMutation = useAddMangaToCollection();

  const isBookmarked = userCollection?.some(
    (item) => item.mal_id === (manga.mal_id || manga.id)
  );

  const handleBookmark = () => {
    if (!isAuthenticated) {
      toast.error("Please log in to add manga to your collection.");
      return;
    }
    if (!isBookmarked) {
      addMangaMutation.mutate({ mal_id: manga.id }, {
        onSuccess: () => toast.success(`"${manga.title}" has been added to your collection!`),
        onError: (error) => toast.error(error.response?.data?.detail || "Failed to add manga."),
      });
    }
  };

  return (
    <div className="relative w-full h-[70vh] overflow-hidden">
      {/* Background Image (UI Unchanged) */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${manga.cover})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
      </div>

      {/* Content (UI Unchanged) */}
      <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="secondary" className="bg-primary/20 text-primary">
              Featured
            </Badge>
            <span className="text-muted-foreground text-sm">{manga.year}</span>
            <span className="text-muted-foreground text-sm">•</span>
            <span className="text-muted-foreground text-sm">
              {manga.episodes} Chapters
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {manga.title}
          </h1>
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-1">
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
              <span className="font-semibold">{manga.rating}</span>
            </div>
            <span className="text-muted-foreground">by {manga.author}</span>
          </div>
          <p className="text-lg text-muted-foreground mb-6 max-w-xl leading-relaxed">
            {manga.description}
          </p>
          <div className="flex flex-wrap gap-2 mb-8">
            {manga.tags.map(tag => (
              <Badge key={tag} variant="outline" className="bg-muted/50">
                {tag}
              </Badge>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              <Play className="w-5 h-5 mr-2" />
              Read Now
            </Button>
            {isAuthenticated && (
              <Button
                size="lg"
                variant="outline"
                onClick={handleBookmark}
                disabled={isBookmarked || addMangaMutation.isPending}
                className="bg-background/50 backdrop-blur-sm border-border hover:text-primary"
              >
                <Plus className="w-5 h-5 mr-2" />
                {addMangaMutation.isPending ? "Adding..." : (isBookmarked ? "Added" : "My List")}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
