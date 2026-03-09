"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";

const CELL_GAP = 3;
const MIN_CELL_SIZE = 3;

interface CommitData {
  date: string;
  count: number;
}

interface CommitGraphProps {
  githubUrl: string;
}

// Primary/accent color from globals.css
// Light: #0095a8, Dark: #00bcd4
const ACCENT_LIGHT = { r: 0, g: 149, b: 168 };
const ACCENT_DARK = { r: 0, g: 188, b: 212 };

function getAccentColors(isDark: boolean) {
  const accent = isDark ? ACCENT_DARK : ACCENT_LIGHT;
  return {
    empty: isDark ? "#161b22" : "#ebedf0",
    l1: `rgba(${accent.r}, ${accent.g}, ${accent.b}, 0.25)`,
    l2: `rgba(${accent.r}, ${accent.g}, ${accent.b}, 0.5)`,
    l3: `rgba(${accent.r}, ${accent.g}, ${accent.b}, 0.75)`,
    l4: `rgb(${accent.r}, ${accent.g}, ${accent.b})`,
  };
}

// GitHub uses 4 contribution levels; 0 = empty
function getContributionLevel(count: number): 0 | 1 | 2 | 3 | 4 {
  if (count === 0) return 0;
  if (count === 1) return 1;
  if (count <= 4) return 2;
  if (count <= 9) return 3;
  return 4;
}

export function CommitGraph({ githubUrl }: CommitGraphProps) {
  const [contributions, setContributions] = useState<CommitData[]>([]);
  const [totalContributions, setTotalContributions] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [cellSize, setCellSize] = useState(5);
  const containerRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();

  const getGitHubUsername = (url: string): string | null => {
    try {
      const match = url.match(/github\.com\/([^\/]+)/);
      return match ? match[1] : null;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const username = getGitHubUsername(githubUrl);
    if (!username) return;

    setIsLoading(true);

    const fetchCommits = async () => {
      try {
        const response = await fetch(
          `/api/github-contributions?username=${username}`
        );
        if (response.ok) {
          const data = await response.json();
          if (data.contributions && Array.isArray(data.contributions)) {
            setContributions(data.contributions);
            setTotalContributions(data.total || 0);
            return;
          }
        }
        console.error(
          "Failed to fetch GitHub contributions: Invalid response or data"
        );
      } catch (error) {
        console.error("Failed to fetch GitHub contributions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCommits();
  }, [githubUrl]);

  // Group into weeks (7 days each, Sun-Sat)
  const weeks: CommitData[][] = [];
  for (let i = 0; i < contributions.length; i += 7) {
    weeks.push(contributions.slice(i, i + 7));
  }
  const totalWeeks = weeks.length || 53;

  // Calculate cell size to fit container (no horizontal scroll)
  useEffect(() => {
    const el = containerRef.current;
    if (!el || totalWeeks === 0) return;

    const updateCellSize = () => {
      const width = el.offsetWidth;
      const maxCellSize = Math.floor(
        (width - (totalWeeks - 1) * CELL_GAP) / totalWeeks
      );
      setCellSize(Math.max(MIN_CELL_SIZE, maxCellSize));
    };

    updateCellSize();
    const ro = new ResizeObserver(updateCellSize);
    ro.observe(el);
    return () => ro.disconnect();
  }, [totalWeeks]);

  const cellGap = CELL_GAP;

  const colors = getAccentColors(resolvedTheme === "dark");

  const getCellColor = (count: number): string => {
    const level = getContributionLevel(count);
    if (level === 0) return colors.empty;
    return colors[`l${level}` as keyof typeof colors];
  };

  return (
    <div ref={containerRef} className="w-full font-mono">
      {isLoading ? (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent" />
        </div>
      ) : (
        <a
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor-text="VIEW GITHUB"
          data-cursor-icon="github"
          className="w-full overflow-hidden flex justify-center cursor-pointer"
          aria-label="View on GitHub"
        >
          <div
            className="flex gap-[3px] shrink-0"
            style={{ width: weeks.length * (cellSize + cellGap) - cellGap }}
          >
            {weeks.map((week, weekIndex) => (
                <div
                  key={weekIndex}
                  className="flex flex-col gap-[3px]"
                  style={{ width: cellSize }}
                >
                  {[0, 1, 2, 3, 4, 5, 6].map((dayIndex) => {
                    const day = week[dayIndex];
                    const count = day?.count ?? 0;
                    return (
                      <div
                        key={`${weekIndex}-${dayIndex}`}
                        className="rounded-[2px]"
                        style={{
                          width: cellSize,
                          height: cellSize,
                          backgroundColor: getCellColor(count),
                        }}
                        title={
                          day
                            ? `${day.date}: ${count} contribution${count !== 1 ? "s" : ""}`
                            : ""
                        }
                      />
                    );
                  })}
                </div>
              ))}
          </div>
        </a>
      )}
    </div>
  );
}
