import { useState, useMemo } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Calendar, User, Eye, MessageCircle, TrendingUp } from "lucide-react";
import SakuraPetals from "@/components/SakuraPetals";
import SkeletonGrid from "@/components/SkeletonGrid";
import EmptyState from "@/components/EmptyState";


import { useNews } from "@/hooks/useMangaQueries";

const News = () => {

  const [selectedCategory, setSelectedCategory] = useState("all");

  const { data: rawNews, isLoading, isError, refetch } = useNews();

  const { featuredNews, filteredNews } = useMemo(() => {
    if (!rawNews) {
      return { featuredNews: null, filteredNews: [] };
    }

    const news = rawNews.map((item, i) => ({
      id: i + 1,
      title: item.title,
      excerpt: item.excerpt,
      image: item.images?.jpg?.image_url,
      forum_url: item.forum_url,
      author: item.author_username,
      date: item.date,
      category: "Announcements", // As per your original logic
      views: Math.floor(Math.random() * 10000) + 1000,
      comments: item.comments || Math.floor(Math.random() * 100),
      featured: i === 0,
    }));

    const featured = news.find((n) => n.featured);
    const filtered =
      selectedCategory === "all"
        ? news.filter((n) => !n.featured)
        : news.filter(
            (n) =>
              n.category.toLowerCase() === selectedCategory.toLowerCase() &&
              !n.featured
          );
    return { featuredNews: featured, filteredNews: filtered };
  }, [rawNews, selectedCategory]);

  const categories = [
    "All", "Announcements", "Reviews", "Interviews", "Industry", "Releases",
  ];

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric", month: "long", day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <SakuraPetals />

      <main className="container mx-auto px-4 py-8">
        {/* Header (UI Unchanged) */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Manga News
          </h1>
          <p className="text-muted-foreground text-lg">
            Stay updated with the latest manga and anime news
          </p>
        </div>

        {/* Featured Article */}
        {isLoading ? (
          <div className="w-full h-96 bg-muted rounded-xl animate-pulse mb-12"></div>
        ) : isError ? (
            <EmptyState message="Could not load featured news." onRetry={refetch} />
        ) : featuredNews && (
          <section className="mb-12">
            <div className="relative rounded-xl overflow-hidden group">
              <img
                src={featuredNews.image}
                alt={featuredNews.title}
                className="w-full h-96 object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <Badge className="gradient-blue text-white mb-4">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Featured
                </Badge>
                <h2 className="text-3xl font-bold text-white mb-4 line-clamp-2">
                  {featuredNews.title}
                </h2>
                <p className="text-gray-200 text-lg mb-4 line-clamp-2">
                  {featuredNews.excerpt}
                </p>
                <div className="flex items-center gap-4 text-gray-300 text-sm">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {featuredNews.author}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatDate(featuredNews.date)}
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {featuredNews.views.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    {featuredNews.comments}
                  </div>
                  <div className="ml-auto">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-primary hover:text-primary/80"
                      onClick={() =>
                        window.open(
                          featuredNews.forum_url,
                          "_blank",
                          "noopener,noreferrer"
                        )
                      }
                    >
                      Read More
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Category Filter (UI Unchanged) */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={
                  selectedCategory === category.toLowerCase()
                    ? "default"
                    : "outline"
                }
                onClick={() => setSelectedCategory(category.toLowerCase())}
                className={
                  selectedCategory === category.toLowerCase()
                    ? "gradient-blue text-white"
                    : ""
                }
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* News Grid */}
        {isLoading ? (
          <SkeletonGrid count={15} />
        ) : isError ? (
           <EmptyState message="Could not load news articles." onRetry={refetch} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNews.slice(0, 15).map((article, index) => (
              <Card
                key={article.id}
                style={{ animationDelay: `${index * 0.1}s` }}
                className="animate-fade-in group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-card/50 backdrop-blur-sm border-border/50"
              >
                <div className="relative overflow-hidden rounded-t-lg">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <Badge className="absolute top-3 left-3 gradient-blue text-white">
                    {article.category}
                  </Badge>
                </div>
                <CardHeader className="pb-3">
                  <h3 className="font-bold text-lg line-clamp-2 group-hover:text-primary transition-colors">
                    {article.title}
                  </h3>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {article.author}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(article.date)}
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {article.views.toLocaleString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="w-3 h-3" />
                        {article.comments}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-primary hover:text-primary/80"
                      onClick={() =>
                        window.open(
                          article.forum_url,
                          "_blank",
                          "noopener,noreferrer"
                        )
                      }
                    >
                      Read More
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!isLoading && !isError && filteredNews.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-6 animate-float">
              <span className="text-3xl">📰</span>
            </div>
            <h3 className="text-2xl font-bold mb-4">No news found</h3>
            <p className="text-muted-foreground mb-6">
              Try selecting a different category to find more news articles.
            </p>
            <Button
              onClick={() => setSelectedCategory("all")}
              className="gradient-blue hover:gradient-blue-dark text-white"
            >
              Show All News
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default News;
