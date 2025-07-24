import { Navigation } from "@/components/Navigation";
import { MangaCard } from "@/components/MangaCard";
import { FeaturedManga } from "@/components/FeaturedManga";
import { Button } from "@/components/ui/button";
import SakuraPetals from "@/components/SakuraPetals";
import SkeletonGrid from "@/components/SkeletonGrid";
import EmptyState from "@/components/EmptyState";
import popularMangaData from "@/data/popularManga"; // Renamed for clarity
import Footer from "@/components/Footer";

// Import the new custom hooks we created
import {
  useTopManga,
  useMangaByGenre, // Corrected: Using the generic genre hook
  useRecommendedManga,
} from "@/hooks/useMangaQueries";

const Index = () => {

  const heroSectionManga = {
    id: "featured-1",
    title: "Jujutsu Kaisen",
    author: "Akutami, Gege",
    cover: "https://wallpapers-clan.com/wp-content/uploads/2025/01/jjk-satoru-gojo-dark-clothes-desktop-wallpaper-preview.jpg",
    status: "finished",
    tags: ["Action", "Horror", "Supernatural", "Shounen"],
    rating: 8.72,
    description: "Jujutsu Kaisen follows Yuji Itadori, a high school student who becomes a Jujutsu Sorcerer after unknowingly consuming a cursed object...",
    year: 2019,
    episodes: 271,
  };
  const popularManga = popularMangaData;

  const { data: favouriteManga, isLoading: isLoadingFavourite, error: favouriteError, refetch: refetchFavourite } = useTopManga('favorite');
  const { data: isekaiManga, isLoading: isLoadingIsekai, error: isekaiError, refetch: refetchIsekai } = useMangaByGenre(62); // Corrected: Pass genre ID 62 for Isekai
  const { data: recommendedManga, isLoading: isLoadingRecommended, error: recommendedError, refetch: refetchRecommended } = useRecommendedManga();
  const { data: romanceManga, isLoading: isLoadingRomance, error: romanceError, refetch: refetchRomance } = useMangaByGenre(22); // Corrected: Pass genre ID 22 for Romance

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <SakuraPetals />

      <main className="pb-8">
        {heroSectionManga && (
          <section className="mb-12">
            <FeaturedManga manga={heroSectionManga} />
          </section>
        )}

        <div className="container mx-auto px-4">
          {/* Favourite Section */}
          <section className="mb-12">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-foreground">
                Favourite Manga
              </h2>
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                Show More
              </Button>
            </div>
            {isLoadingFavourite ? (
              <SkeletonGrid count={12} />
            ) : favouriteError ? (
              <EmptyState
                message="Couldn't load favourite manga."
                onRetry={refetchFavourite}
              />
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {favouriteManga?.slice(0, 12).map((manga, index) => (
                  <div
                    key={manga.mal_id}
                    style={{ animationDelay: `${index * 0.05}s` }}
                    className="animate-fade-in"
                  >
                    {/* FIX: Pass the 'cover' prop that MangaCard expects */}
                    <MangaCard manga={{ ...manga, cover: manga.cover_url, id: manga.mal_id }} />
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Isekai Section */}
          <section className="mb-12">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-foreground">
                Isekai Manga
              </h2>
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                Show More
              </Button>
            </div>
            {isLoadingIsekai ? (
              <SkeletonGrid count={6} />
            ) : isekaiError ? (
              <EmptyState
                message="Couldn't load Isekai manga."
                onRetry={refetchIsekai}
              />
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {isekaiManga?.slice(0, 6).map((manga, index) => (
                  <div
                    key={manga.mal_id}
                    style={{ animationDelay: `${index * 0.05}s` }}
                    className="animate-fade-in"
                  >
                    {/* FIX: Pass the 'cover' prop that MangaCard expects */}
                    <MangaCard manga={{ ...manga, cover: manga.cover_url, id: manga.mal_id }} />
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Recommended Section */}
          <section className="mb-12">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-foreground">
                Recommended For You
              </h2>
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                Show More
              </Button>
            </div>
            {isLoadingRecommended ? (
              <SkeletonGrid count={6} />
            ) : recommendedError ? (
              <EmptyState
                message="Couldn't load recommended manga."
                onRetry={refetchRecommended}
              />
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {recommendedManga?.slice(0, 6).map((manga, index) => (
                  <div
                    key={manga.mal_id}
                    style={{ animationDelay: `${index * 0.05}s` }}
                    className="animate-fade-in"
                  >
                    {/* FIX: Pass the 'cover' prop that MangaCard expects */}
                    <MangaCard manga={{ ...manga, cover: manga.cover_url, id: manga.mal_id }} />
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Romance Section */}
          <section className="mb-12">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-foreground">
                Romance Manga
              </h2>
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                Show More
              </Button>
            </div>
            {isLoadingRomance ? (
              <SkeletonGrid count={6} />
            ) : romanceError ? (
              <EmptyState
                message="Couldn't load romance manga."
                onRetry={refetchRomance}
              />
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {romanceManga?.slice(0, 6).map((manga, index) => (
                  <div
                    key={manga.mal_id}
                    style={{ animationDelay: `${index * 0.05}s` }}
                    className="animate-fade-in"
                  >
                    {/* FIX: Pass the 'cover' prop that MangaCard expects */}
                    <MangaCard manga={{ ...manga, cover: manga.cover_url, id: manga.mal_id }} />
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Most Popular Section (Unchanged) */}
          <section className="mb-12">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-foreground">
                Most Popular
              </h2>
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                Show More
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {popularManga.slice(0, 12).map((manga, index) => (
                <div
                  key={manga.id}
                  style={{ animationDelay: `${index * 0.05}s` }}
                  className="animate-fade-in"
                >
                  <MangaCard manga={manga} />
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;

