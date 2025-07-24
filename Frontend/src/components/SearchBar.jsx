import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// --- TanStack Query Import ---
import { useMangaSearch } from "@/hooks/useMangaQueries";

export const SearchBar = ({ onClose }) => {
  // --- Local UI State for the input field ---
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const { data: suggestions, isLoading } = useMangaSearch(query);

  const handleSelectSuggestion = (mal_id) => {
    navigate(`/manga/${mal_id}`);
    onClose();
  };

  return (
    <div className="relative bg-card border border-border rounded-lg p-4 shadow-lg">
      <div className="flex items-center space-x-2">
        <Search className="w-5 h-5 text-muted-foreground" />
        <Input
          placeholder="Search manga titles..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 bg-transparent border-none focus:ring-0"
          autoFocus
        />
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Suggestions List */}
      <div className="mt-3 space-y-1 max-h-64 overflow-y-auto">
        {isLoading && query && (
            <div className="text-muted-foreground text-sm p-3">Searching...</div>
        )}
        {suggestions?.slice(0, 5).map((manga) => (
          <button
            key={manga.mal_id}
            onClick={() => handleSelectSuggestion(manga.mal_id)}
            className="w-full flex items-center gap-3 px-3 py-2 rounded hover:bg-muted transition-colors text-sm text-left"
          >
            <img
              src={manga.cover_url}
              alt={manga.title}
              className="w-10 h-14 object-cover rounded border"
            />
            <span className="line-clamp-1">{manga.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
