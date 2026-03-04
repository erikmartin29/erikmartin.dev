import { SanityLive } from "@/sanity/live";
import { Navbar } from "@/components/layout/navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Erik Martin",
  description: "Portfolio and blog of Erik Martin, a full-stack developer and designer.",
};

const GUIDELINE_COLOR = "var(--guideline)";
const LEFT = "calc(50% - var(--max-content-width) / 2)";
const RIGHT = "calc(50% + var(--max-content-width) / 2)";

const baseLineStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  width: "1px",
  pointerEvents: "none",
  backgroundColor: GUIDELINE_COLOR,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-screen flex flex-col antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* Full-page vertical guidelines — behind content */}
          <div aria-hidden="true" style={{ ...baseLineStyle, left: LEFT, height: "100%", zIndex: 1 }} />
          <div aria-hidden="true" style={{ ...baseLineStyle, left: RIGHT, height: "100%", zIndex: 1 }} />

          {/* Navbar-height vertical guidelines — above navbar */}
          <div aria-hidden="true" style={{ ...baseLineStyle, left: LEFT, height: "75px", zIndex: 51 }} />
          <div aria-hidden="true" style={{ ...baseLineStyle, left: RIGHT, height: "75px", zIndex: 51 }} />

          <Navbar />
          <main className="flex-1 w-full pt-32 pb-12 relative">
            {children}
          </main>
          <SanityLive />
        </ThemeProvider>
      </body>
    </html>
  );
}
