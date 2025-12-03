import { NextRequest, NextResponse } from "next/server";

interface ContributionData {
  date: string;
  count: number;
}

interface GitHubResponse {
  data?: {
    user?: {
      contributionsCollection?: {
        contributionCalendar?: {
          totalContributions: number;
          weeks: Array<{
            contributionDays: Array<{
              date: string;
              contributionCount: number;
            }>;
          }>;
        };
      };
    };
  };
  errors?: Array<{ message: string }>;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const username = searchParams.get("username");

  if (!username) {
    return NextResponse.json(
      { error: "Username is required" },
      { status: 400 }
    );
  }

  const githubToken = process.env.GITHUB_TOKEN;

  if (!githubToken) {
    console.error("GITHUB_TOKEN environment variable not set.");
    return NextResponse.json(
      { error: "GitHub token not configured" },
      { status: 503 }
    );
  }

  try {

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // calculate the start date to 1 year ago, then anchored to the closest Sunday
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 364 - today.getDay());
    
    const query = `
      query($username: String!, $from: DateTime!, $to: DateTime!) {
        user(login: $username) {
          contributionsCollection(from: $from, to: $to) {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  date
                  contributionCount
                }
              }
            }
          }
        }
      }
    `;

    const variables = {
      username,
      from: startDate.toISOString(),
      to: today.toISOString(),
    };

    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${githubToken}`,
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("GitHub API error:", response.status, errorText);
      return NextResponse.json(
        { error: "Failed to fetch from GitHub API" },
        { status: response.status }
      );
    }

    const result: GitHubResponse = await response.json();

    if (result.errors) {
      console.error("GraphQL errors:", result.errors);
      return NextResponse.json(
        { error: result.errors[0]?.message || "GraphQL error" },
        { status: 400 }
      );
    }

    const contributionCalendar =
      result.data?.user?.contributionsCollection?.contributionCalendar;

    if (!contributionCalendar) {
      return NextResponse.json(
        { error: "User not found or has no contributions" },
        { status: 404 }
      );
    }

    // flatten the weeks array into a single array of contributions
    const contributionMap = new Map<string, number>();
    contributionCalendar.weeks.forEach((week) => {
      week.contributionDays.forEach((day) => {
        contributionMap.set(day.date, day.contributionCount);
      });
    });

    // generate all dates in the range starting from Sunday and map contributions
    const allDates: ContributionData[] = [];
    for (
      let d = new Date(startDate);
      d <= today;
      d.setDate(d.getDate() + 1)
    ) {
      const dateStr = d.toISOString().split("T")[0];
      allDates.push({
        date: dateStr,
        count: contributionMap.get(dateStr) || 0,
      });
    }

    return NextResponse.json({
      contributions: allDates,
      total: contributionCalendar.totalContributions,
    });
  } catch (error) {
    console.error("Error fetching GitHub contributions:", error);
    return NextResponse.json(
      { error: "Failed to fetch contributions" },
      { status: 500 }
    );
  }
}

