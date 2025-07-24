import { useState } from "react";
import { Link } from "react-router-dom";
import { Bookmark, BookmarkX, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

// --- TanStack Query & Zustand Imports ---
import { 
  useUserCollection, 
  useAddMangaToCollection, 
  useRemoveMangaFromCollection 
} from "@/hooks/useUserQueries";
import { useAuthStore } from "@/store/useAuthStore";

export const MangaCard = ({ manga, showStatus = false, compact = false }) => {
  // --- Local UI State ---
  const [isHovered, setIsHovered] = useState(false);
  
  // --- Global State & Hooks ---
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { data: userCollection } = useUserCollection();
  const addMutation = useAddMangaToCollection();
  const removeMutation = useRemoveMangaFromCollection();

  // Determine if the manga is bookmarked
  const isBookmarked = userCollection?.some(
    (item) => item.mal_id === (manga.mal_id || manga.id)
  );

  // --- Simplified Event Handler ---
  const handleBookmarkToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error("Please log in to manage your collection.");
      return;
    }

    const mangaId = manga.mal_id || manga.id;

    if (isBookmarked) {
      removeMutation.mutate(mangaId, {
        onSuccess: () => toast.warning(`"${manga.title}" removed from your collection.`),
        onError: (error) => toast.error(error.response?.data?.detail || "Failed to remove manga."),
      });
    } else {
      addMutation.mutate({ mal_id: mangaId }, {
        onSuccess: () => toast.success(`"${manga.title}" added to your collection!`),
        onError: (error) => toast.error(error.response?.data?.detail || "Failed to add manga."),
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "reading": return "bg-green-500/90";
      case "completed": return "bg-blue-500/90";
      case "planned": return "bg-yellow-500/90";
      default: return "bg-muted/90";
    }
  };

  const isMutating = addMutation.isPending || removeMutation.isPending;

  return (
    <Link
      to={`/manga/${manga.mal_id || manga.id}`}
      className="group relative bg-card rounded-lg overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/20 block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`relative ${compact ? "aspect-[3/4]" : "aspect-[3/4]"} overflow-hidden`}>
        <img
          src={manga.cover || manga.cover_url}
          alt={manga.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Overlay (UI Unchanged) */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-0"}`} />

        {/* Status Badge (UI Unchanged) */}
        {showStatus && (
          <Badge className={`absolute top-2 left-2 ${getStatusColor(manga.status)} text-white border-none`}>
            {manga.status}
          </Badge>
        )}

        {/* Bookmark Button */}
        {isAuthenticated && (
            <Button
                variant="ghost"
                size="icon"
                onClick={handleBookmarkToggle}
                disabled={isMutating}
                className={`absolute top-2 right-2 h-8 w-8 transition-all duration-300 ${isHovered || isBookmarked ? "opacity-100" : "opacity-0"} ${isBookmarked ? "text-secondary bg-background/20 hover:bg-background/30" : "text-white bg-black/20 hover:bg-black/40"}`}
            >
                {isBookmarked ? (
                    <BookmarkX className="w-4 h-4" />
                ) : (
                    <Bookmark className="w-4 h-4" />
                )}
            </Button>
        )}

        {/* Rating (UI Unchanged) */}
        <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/70 backdrop-blur-sm rounded px-2 py-1">
          <Star className="w-3 h-3 text-yellow-400 fill-current" />
          <span className="text-white text-xs font-medium">{manga.rating}</span>
        </div>

        {/* Hover Content (UI Unchanged) */}
        <div className={`absolute bottom-0 left-0 right-0 p-3 text-white transition-all duration-300 ${isHovered ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}`}>
          <h3 className="font-semibold text-sm mb-1 line-clamp-2">{manga.title || "Untitled"}</h3>
          <p className="text-xs text-gray-300 mb-2">{manga.author || "Unknown Author"}</p>
          {manga.year && <p className="text-xs text-gray-400">{manga.year}</p>}
        </div>
      </div>

      {/* Bottom Content (UI Unchanged) */}
      {!compact && (
        <div className="p-3">
          <h3 className="font-semibold text-sm mb-1 line-clamp-2 group-hover:text-primary transition-colors">{manga.title || "Untitled"}</h3>
          <p className="text-muted-foreground text-xs mb-2">{manga.author || "Unknown Author"}</p>
          <div className="flex flex-wrap gap-1">
            {(manga.tags || []).slice(0, 2).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">{tag}</Badge>
            ))}
            {(manga.tags || []).length > 2 && (
              <Badge variant="outline" className="text-xs">+{manga.tags.length - 2}</Badge>
            )}
          </div>
        </div>
      )}
    </Link>
  );
};
