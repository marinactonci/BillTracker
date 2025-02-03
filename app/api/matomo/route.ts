import { NextResponse } from "next/server";

export async function GET() {
  try {
    const token = process.env.MATOMO_AUTH_TOKEN;
    const baseUrl = "http://localhost:8080";

    // Fetch summary data
    const summaryResponse = await fetch(`${baseUrl}/index.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        module: "API",
        method: "VisitsSummary.get",
        idSite: "1",
        period: "day",
        date: "last30",
        format: "JSON",
        token_auth: token || "",
      }),
    });

    // Fetch country data
    const countryResponse = await fetch(`${baseUrl}/index.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        module: "API",
        method: "UserCountry.getCountry",
        idSite: "1",
        period: "day",
        date: "last30",
        format: "JSON",
        token_auth: token || "",
      }),
    });

    // Fetch page data
    const pageResponse = await fetch(`${baseUrl}/index.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        module: "API",
        method: "Actions.getPageUrls",
        idSite: "1",
        period: "day",
        date: "last30",
        format: "JSON",
        token_auth: token || "",
      }),
    });

    const [summaryData, countriesData, pagesData] = await Promise.all([
      summaryResponse.json(),
      countryResponse.json(),
      pageResponse.json(),
    ]);

    // Process summary data - get the latest non-empty data
    const latestSummary =
      Object.entries(summaryData)
        .reverse()
        .find(([_, data]) =>
          Array.isArray(data)
            ? data.length > 0
            : Object.keys(data as object).length > 0
        )?.[1] || {};

    // Process countries data - aggregate all non-empty arrays
    const allCountries = Object.values(countriesData)
      .flat()
      .filter((country) => country && Object.keys(country).length > 0);

    // Process pages data - aggregate all non-empty arrays
    const allPages = Object.values(pagesData)
      .flat()
      .filter((page) => page && Object.keys(page).length > 0);

    return NextResponse.json({
      summary: latestSummary,
      countries: allCountries,
      pages: allPages,
    });
  } catch (error) {
    console.error("Analytics Error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch analytics data",
      },
      { status: 500 }
    );
  }
}
