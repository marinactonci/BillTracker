"use client";

import { useEffect, useState } from "react";

interface Recommendation {
  page: string;
  similarPages: Array<{ page: string; score: number }>;
}

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await fetch("/api/recommendations");
        const data = await response.json();
        setRecommendations(data.recommendations);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  if (loading) return <div className="p-4">Loading recommendations...</div>;

  return (
    <div className="p-4 sm:p-6 md:p-8 w-full mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">
        Content Recommendations
      </h1>

      <div className="grid gap-4 sm:gap-6 md:gap-8">
        {recommendations.map((rec) => (
          <div key={rec.page} className="p-4 sm:p-6 bg-white rounded-lg shadow">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">
              {rec.page}
            </h2>
            <div className="space-y-3">
              <h3 className="text-sm text-gray-500">Similar Pages:</h3>
              {rec.similarPages.map((similar) => (
                <div
                  key={similar.page}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded"
                >
                  <span className="text-sm">{similar.page}</span>
                  <span className="text-xs text-gray-500">
                    {(similar.score * 100).toFixed(1)}% match
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
