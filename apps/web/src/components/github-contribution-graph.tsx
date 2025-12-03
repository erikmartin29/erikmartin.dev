"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";

interface CommitData {
  date: string; // date of the commit(s)
  count: number; // number of commits on the date
}

interface CommitGraphProps {
  githubUrl: string;
}

export function CommitGraph({ githubUrl }: CommitGraphProps) {
  const [contributions, setContributions] = useState<CommitData[]>([]);
  const [totalContributions, setTotalContributions] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [cellSize, setCellSize] = useState(11);

  const graphContainerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
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
        const response = await fetch(`/api/github-contributions?username=${username}`);
        if (response.ok) {
          const data = await response.json();
          if (data.contributions && Array.isArray(data.contributions)) {
            setContributions(data.contributions);
            setTotalContributions(data.total || 0);
            setIsLoading(false);
            return;
          }
        }
        console.error("Failed to fetch GitHub contributions: Invalid response or data");
      } catch (error) {
        console.error("Failed to fetch GitHub contributions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCommits();
  }, [githubUrl]);
  // get stepped opacity based on commit count
  const getOpacity = (count: number): number => {
    if (count === 0) return 0;
    if (count <= 2) return 0.25;
    if (count <= 5) return 0.5;
    if (count <= 10) return 0.75;
    return 1.0;
  };

  // get background color with opacity based on contribution count
  const getCellStyle = (count: number) => {
    const isDark = resolvedTheme === 'dark';
    if (count === 0) {
      return {
        backgroundColor: isDark ? '#1a1a1a' : '#ebedf0',
        opacity: 1,
      };
    }
    const opacity = getOpacity(count);
    const accentHex = isDark ? '#00bcd4' : '#0095a8';
    const r = parseInt(accentHex.slice(1, 3), 16);
    const g = parseInt(accentHex.slice(3, 5), 16);
    const b = parseInt(accentHex.slice(5, 7), 16);
    return {
      backgroundColor: `rgba(${r}, ${g}, ${b}, ${opacity})`,
    };
  };

  // group contributions into weeks (API always starts from Sunday)
  const weeks: CommitData[][] = [];
  for (let i = 0; i < contributions.length; i += 7) {
    weeks.push(contributions.slice(i, i + 7));
  }
  const totalWeeks = weeks.length;

  // calculate cell size based on card width
  useEffect(() => {
    const calculateCellSize = () => {
      if (!cardRef.current || totalWeeks === 0) return;
      
      const cardWidth = cardRef.current.offsetWidth;
      const totalPadding = 48;
      const gapSize = 4; // gap-1 = 4px
      const totalGaps = (totalWeeks - 1) * gapSize;
      
      const availableWidth = cardWidth - totalPadding;
      const cellWidth = (availableWidth - totalGaps) / totalWeeks;
      
      // calculate minimum cell size - smaller on mobile
      const isMobile = window.innerWidth < 768;
      const minCellSize = isMobile ? 5 : 10;
      const calculatedSize = Math.max(minCellSize, Math.floor(cellWidth));
      
      // check if graph would overflow - if so, use minimum size
      const totalGraphWidth = (calculatedSize * totalWeeks) + totalGaps;
      if (totalGraphWidth > availableWidth && calculatedSize === minCellSize) {
        setCellSize(minCellSize);
      } else {
        setCellSize(calculatedSize);
      }
    };

    // use ResizeObserver for more accurate measurements
    if (cardRef.current) {
      calculateCellSize();
      
      const resizeObserver = new ResizeObserver(() => {
        calculateCellSize();
      });
      
      resizeObserver.observe(cardRef.current);
      window.addEventListener('resize', calculateCellSize);
      
      return () => {
        resizeObserver.disconnect();
        window.removeEventListener('resize', calculateCellSize);
      };
    }
  }, [totalWeeks, contributions.length]);

  const username = getGitHubUsername(githubUrl);

  return (
    <GlassCard ref={cardRef} className="p-6">
      <div className="flex items-center justify-between mb-4">
          <span className="text-base font-medium text-foreground">
            {isLoading ? "Loading..." : `${totalContributions.toLocaleString()} commits in the past year`}
          </span>
        {username && (
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-accent transition-colors inline-flex items-center gap-1"
          >
            View on GitHub →
          </a>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
        </div>
      ) : (
        <div 
          className="w-full py-2 relative overflow-x-auto custom-scrollbar" 
          ref={graphContainerRef}
        >
          <div className="flex gap-1 justify-center w-full min-w-fit">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1">
                {week.map((day, dayIndex) => (
                  <div
                    key={`${day.date}-${dayIndex}`}
                    className="transition-opacity"
                    style={{
                      width: `${cellSize}px`,
                      height: `${cellSize}px`,
                      borderRadius: '3px',
                      ...getCellStyle(day.count),
                    }}
                  />
                ))}
                {/* Fill remaining days if week is incomplete */}
                {week.length < 7 && Array.from({ length: 7 - week.length }).map((_, i) => (
                  <div 
                    key={`empty-${i}`} 
                    style={{
                      width: `${cellSize}px`,
                      height: `${cellSize}px`,
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </GlassCard>
  );
}

