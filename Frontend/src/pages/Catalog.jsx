import { useState, useEffect, useMemo } from "react";
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
import { Filter, Grid, List } from "lucide-react";
import SakuraPetals from "@/components/SakuraPetals";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import SkeletonGrid from "@/components/SkeletonGrid";
import EmptyState from "@/components/EmptyState";

// Import our new custom hook for pagination
import { usePaginatedManga } from "@/hooks/useMangaQueries";

const Catalog = () => {
  // --- Client-side UI state remains unchanged ---
  const [filteredManga, setFilteredManga] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [sortBy, setSortBy] = useState("popularity");
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, refetch } = usePaginatedManga(page);

  const manga = useMemo(() => {
    if (!data?.mangas) return [];
    return data.mangas.map((m) => ({
      id: m.mal_id,
      cover: m.cover_url, // Match the prop MangaCard expects
      // Pass through all other properties
      ...m,
      // Ensure tags is always an array for the filter logic
      tags: m.tags || [],
    }));
  }, [data]);

  useEffect(() => {
    let filtered = manga;

    if (selectedGenre !== "all") {
      filtered = filtered.filter((m) =>
        m.tags.some(
          (tag) => tag?.toLowerCase() === selectedGenre.toLowerCase()
        )
      );
    }

    if (selectedStatus !== "all") {
      filtered = filtered.filter(
        (m) => m.status?.toLowerCase() === selectedStatus.toLowerCase()
      );
    }

    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "year":
          return (b.year || 0) - (a.year || 0);
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        default: // popularity
          return (b.rating || 0) - (a.rating || 0);
      }
    });

    setFilteredManga(filtered);
  }, [manga, selectedGenre, selectedStatus, sortBy]);
  
  const genres = [
    "All", "Action", "Adventure", "Comedy", "Drama", "Fantasy", "Horror", "Romance", "Sci-Fi", "Sports", "Thriller",
  ];
  const statuses = ["All", "Finished", "Publishing", "On Hiatus"]; // Updated to match Jikan API status strings

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <SakuraPetals />

      <main className="container mx-auto px-4 py-8">
        {/* Header (UI Unchanged) */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Manga Catalog
          </h1>
          <p className="text-muted-foreground text-lg">
            Discover thousands of manga titles across all genres
          </p>
        </div>

        {/* Filters and Controls (UI Unchanged) */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
              <div className="hidden lg:flex items-center gap-4">
                {/* Select components remain unchanged */}
                <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                    <SelectTrigger className="w-40"><SelectValue placeholder="Genre" /></SelectTrigger>
                    <SelectContent>{genres.map((genre) => (<SelectItem key={genre} value={genre.toLowerCase()}>{genre}</SelectItem>))}</SelectContent>
                </Select>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger>
                    <SelectContent>{statuses.map((status) => (<SelectItem key={status} value={status.toLowerCase()}>{status}</SelectItem>))}</SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-40"><SelectValue placeholder="Sort by" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="popularity">Popularity</SelectItem>
                        <SelectItem value="title">Title</SelectItem>
                        <SelectItem value="year">Year</SelectItem>
                        <SelectItem value="rating">Rating</SelectItem>
                    </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant={viewMode === "grid" ? "default" : "outline"} size="sm" onClick={() => setViewMode("grid")}><Grid className="w-4 h-4" /></Button>
              <Button variant={viewMode === "list" ? "default" : "outline"} size="sm" onClick={() => setViewMode("list")}><List className="w-4 h-4" /></Button>
            </div>
          </div>
          {/* Mobile and Active Filters remain unchanged */}
        </div>

        {/* Results */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing {filteredManga.length} of {manga.length} manga on this page
          </p>
        </div>

        {/* Loading and Error States */}
        {isLoading ? (
          <SkeletonGrid count={24} />
        ) : isError ? (
          <EmptyState message="Could not load manga." onRetry={refetch} />
        ) : (
          <>
            {/* Manga Grid/List (UI Unchanged) */}
            {viewMode === 'grid' ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                    {filteredManga.map((m, index) => (<div key={m.id} style={{ animationDelay: `${index * 0.05}s` }} className="animate-fade-in"><MangaCard manga={m} /></div>))}
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredManga.map((m, index) => (<div key={m.id} style={{ animationDelay: `${index * 0.05}s` }} className="animate-fade-in bg-card rounded-lg p-4 flex gap-4 hover:bg-card/80 transition-colors">
                        <img src={m.cover} alt={m.title} className="w-16 h-24 object-cover rounded" />
                        <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-1">{m.title}</h3>
                            <p className="text-muted-foreground text-sm mb-2">{m.author}</p>
                            <div className="flex flex-wrap gap-1 mb-2">{m.tags.slice(0, 3).map((tag) => (<Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>))}</div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground"><span>★ {m.rating}</span><span>{m.year}</span><span>{m.status}</span></div>
                        </div>
                    </div>))}
                </div>
            )}

            {/* Pagination */}
            <Pagination className="mt-8">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                    disabled={page === 1}
                  />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setPage((prev) => prev + 1)}
                    disabled={!data?.pagination?.has_next_page}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </>
        )}
        
        {!isLoading && !isError && filteredManga.length === 0 && (
            <div className="text-center py-16">
                <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-6 animate-float"><span className="text-3xl">📚</span></div>
                <h3 className="text-2xl font-bold mb-4">No manga found</h3>
                <p className="text-muted-foreground mb-6">Try adjusting your filters to find more manga.</p>
                <Button onClick={() => { setSelectedGenre("all"); setSelectedStatus("all"); }} className="gradient-blue hover:gradient-blue-dark text-white">Clear Filters</Button>
            </div>
        )}
      </main>
    </div>
  );
};

export default Catalog;
