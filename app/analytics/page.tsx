"use client";

import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Line, Bar, Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/matomo");
        const data = await response.json();
        console.log("API Response:", data); // Debug log
        setAnalyticsData(data);
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="p-4">Loading analytics...</div>;
  if (!analyticsData)
    return <div className="p-4">No analytics data available</div>;

  console.log("Analytics Data:", analyticsData); // Debug log

  const { summary, countries, pages } = analyticsData;

  const countryData = {
    labels: countries?.map((country: any) => country.label) || [],
    datasets: [
      {
        label: "Visitors by Country",
        data: countries?.map((country: any) => country.nb_visits) || [],
        backgroundColor:
          countries?.map(() => `hsl(${Math.random() * 360}, 70%, 50%)`) || [],
      },
    ],
  };

  const pageData = {
    labels: pages?.slice(0, 10).map((page: any) => page.label) || [],
    datasets: [
      {
        label: "Page Views",
        data: pages?.slice(0, 10).map((page: any) => page.nb_hits) || [],
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  const summaryData = {
    nb_visits: summary?.nb_visits || 0,
    avg_time_on_site: summary?.avg_time_on_site || 0,
    bounce_rate: summary?.bounce_rate || "0%",
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 w-full mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">
        Analytics Dashboard
      </h1>

      <div className="grid gap-4 sm:gap-6 md:gap-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 sm:p-6 bg-white rounded-lg shadow">
            <h3 className="text-base sm:text-lg font-semibold mb-2">
              Total Visits
            </h3>
            <p className="text-2xl sm:text-3xl">{summaryData.nb_visits}</p>
          </div>
          <div className="p-4 sm:p-6 bg-white rounded-lg shadow">
            <h3 className="text-base sm:text-lg font-semibold mb-2">
              Avg. Duration
            </h3>
            <p className="text-2xl sm:text-3xl">
              {Math.round(summaryData.avg_time_on_site / 60)}m
            </p>
          </div>
          <div className="p-4 sm:p-6 bg-white rounded-lg shadow sm:col-span-2 lg:col-span-1">
            <h3 className="text-base sm:text-lg font-semibold mb-2">
              Bounce Rate
            </h3>
            <p className="text-2xl sm:text-3xl">{summaryData.bounce_rate}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          <div className="p-4 sm:p-6 bg-white rounded-lg shadow">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">
              Visitors by Country
            </h2>
            <div className="h-[300px] sm:h-[400px] relative">
              <Pie
                data={countryData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "right" as const,
                      display: window?.innerWidth > 640,
                    },
                  },
                }}
              />
            </div>
          </div>

          <div className="p-4 sm:p-6 bg-white rounded-lg shadow">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">Top Pages</h2>
            <div className="h-[300px] sm:h-[400px] relative">
              <Bar
                data={pageData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  indexAxis: "y" as const,
                  plugins: {
                    legend: { display: false },
                  },
                  scales: {
                    x: {
                      ticks: {
                        display: window?.innerWidth > 480,
                      },
                    },
                    y: {
                      ticks: {
                        callback: function (value) {
                          const label = this.getLabelForValue(value as number);
                          return window?.innerWidth < 640
                            ? label.substring(0, 15) + "..."
                            : label;
                        },
                      },
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
