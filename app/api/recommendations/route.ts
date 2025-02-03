import { NextResponse } from "next/server";

interface PageView {
  label: string;
  nb_hits: number;
  sum_time_spent: number;
  exit_rate: string;
}

interface PageSimilarity {
  page: string;
  similarPages: Array<{ page: string; score: number }>;
}

function calculateCosineSimilarity(pageA: PageView, pageB: PageView): number {
  const vectorA = [
    pageA.nb_hits,
    pageA.sum_time_spent,
    parseFloat(pageA.exit_rate),
  ];
  const vectorB = [
    pageB.nb_hits,
    pageB.sum_time_spent,
    parseFloat(pageB.exit_rate),
  ];

  const dotProduct = vectorA.reduce((acc, val, i) => acc + val * vectorB[i], 0);
  const magnitudeA = Math.sqrt(
    vectorA.reduce((acc, val) => acc + val * val, 0)
  );
  const magnitudeB = Math.sqrt(
    vectorB.reduce((acc, val) => acc + val * val, 0)
  );

  return dotProduct / (magnitudeA * magnitudeB);
}

function normalizePath(path: string): string {
  // Remove /index and normalize root path
  let normalized = path.replace("/index", "/");
  // Remove trailing slashes except for root path
  normalized = normalized === "/" ? normalized : normalized.replace(/\/$/, "");
  return normalized;
}

function isValidPath(path: string): boolean {
  // List of valid paths in your application
  const validPaths = [
    "/",
    "/dashboard",
    "/analytics",
    "/recommendations",
    "/calendar",
    "/profiles",
    "/bills",
  ];
  return validPaths.includes(normalizePath(path));
}

export async function GET() {
  try {
    const token = process.env.MATOMO_AUTH_TOKEN;
    const baseUrl = "http://localhost:8080";

    const response = await fetch(`${baseUrl}/index.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        module: "API",
        method: "Actions.getPageUrls",
        idSite: "1",
        period: "month",
        date: "today",
        format: "JSON",
        token_auth: token || "",
      }),
    });

    const data = await response.json();
    const pages = Object.values(data)
      .flat()
      .filter(Boolean)
      .filter((page: unknown): page is PageView => {
        const pageView = page as PageView;
        return (
          typeof pageView?.label === "string" && isValidPath(pageView.label)
        );
      }) // Only include valid paths
      .map((page: unknown) => ({
        ...(page as PageView),
        label: normalizePath((page as PageView).label), // Normalize the path
      })) as PageView[];

    // Calculate similarities between pages
    const similarities: PageSimilarity[] = pages.map((pageA) => ({
      page: pageA.label,
      similarPages: pages
        .filter((pageB) => pageB.label !== pageA.label)
        .map((pageB) => ({
          page: pageB.label,
          score: calculateCosineSimilarity(pageA, pageB),
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 3),
    }));

    return NextResponse.json({ recommendations: similarities });
  } catch (error) {
    console.error("Recommendations Error:", error);
    return NextResponse.json(
      { error: "Failed to generate recommendations" },
      { status: 500 }
    );
  }
}
