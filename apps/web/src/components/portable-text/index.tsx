import type { PortableTextComponents } from "@portabletext/react";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { tryGetFile } from "@sanity/asset-utils";
import { urlFor } from "@/sanity/client";
import type { ComponentType } from "react";

const SANITY_PROJECT_ID = "5l61z3ol";
const SANITY_DATASET = "production";

const componentRegistry: Record<string, ComponentType<any>> = {};

export const projectPortableTextComponents: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null;
      const url = urlFor(value).width(1200).url();
      const size = value.size ?? "large";
      const alignment = value.alignment ?? "left";
      const widthClass =
        size === "small"
          ? "w-full max-w-full sm:max-w-[33.333%]"
          : size === "medium"
            ? "w-full max-w-full sm:max-w-[66.666%]"
            : "w-full";
      const alignClass = alignment === "center" ? "sm:mx-auto" : "";
      return (
        <figure className={`mt-2 mb-8 ${widthClass} ${alignClass}`}>
          <Image
            src={url}
            alt={value.alt ?? ""}
            width={1200}
            height={800}
            sizes="(max-width: 768px) 100vw, 880px"
            className="w-full h-auto"
          />
          {value.caption && (
            <figcaption className="mt-2 text-center text-xs font-mono text-muted-foreground">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },

    video: ({ value }) => {
      let videoUrl =
        value?.videoUrl ??
        (value?.asset && typeof value.asset === "object" && "url" in value.asset
          ? (value.asset as { url?: string }).url
          : undefined);
      if (!videoUrl && value?.asset) {
        const file = tryGetFile(value.asset, {
          projectId: SANITY_PROJECT_ID,
          dataset: SANITY_DATASET,
        });
        videoUrl = file?.url;
      }
      if (!videoUrl) return null;
      const size = value.size ?? "large";
      const alignment = value.alignment ?? "left";
      const autoplay = value.autoplay ?? false;
      const muted = value.muted ?? true;
      const widthClass =
        size === "small"
          ? "w-full max-w-full sm:max-w-[33.333%]"
          : size === "medium"
            ? "w-full max-w-full sm:max-w-[66.666%]"
            : "w-full";
      const alignClass = alignment === "center" ? "sm:mx-auto" : "";
      return (
        <figure className={`mt-2 mb-8 ${widthClass} ${alignClass}`}>
          <video
            src={videoUrl}
            controls={!autoplay}
            autoPlay={autoplay}
            muted={muted}
            loop={autoplay}
            playsInline
            className="w-full h-auto rounded-sm"
          />
          {value.caption && (
            <figcaption className="mt-2 text-center text-xs font-mono text-muted-foreground">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },

    code: ({ value }) => {
      if (!value?.code) return null;
      return (
        <div className="my-8">
          {(value.filename || value.language) && (
            <div className="flex items-center gap-2 px-4 py-2 bg-foreground/5 border border-foreground/10 border-b-0 font-mono text-xs text-muted-foreground">
              {value.filename && <span>{value.filename}</span>}
              {value.filename && value.language && (
                <span className="text-foreground/20">|</span>
              )}
              {value.language && <span>{value.language}</span>}
            </div>
          )}
          <pre className="overflow-x-auto border border-foreground/10 bg-foreground/3 p-4 font-mono text-sm leading-relaxed">
            <code>{value.code}</code>
          </pre>
        </div>
      );
    },

    customComponent: ({ value }) => {
      if (!value?.componentName) return null;
      const Component = componentRegistry[value.componentName];
      if (!Component) {
        return (
          <div className="my-8 p-4 border border-dashed border-foreground/20 text-center text-sm text-muted-foreground font-mono">
            Unknown component: {value.componentName}
          </div>
        );
      }
      const props = value.props ? JSON.parse(value.props) : {};
      return (
        <div className="my-8">
          <Component {...props} />
        </div>
      );
    },
  },
  block: {
    normal: ({ children }) => (
      <p className="pb-[1lh] last-of-type:pb-0 last-of-type:mb-0">{children}</p>
    ),
  },
  marks: {
    link: ({ value, children }) => {
      const href = value?.href ?? "#";
      const isExternal = href.startsWith("http");
      return (
        <a
          href={href}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          className="underline decoration-current/80 inline-flex items-baseline gap-0.5"
        >
          {children}
          <ExternalLink className="h-[0.75em] w-[0.75em] shrink-0 text-muted-foreground/70" aria-hidden />
        </a>
      );
    },
  },
};

export function registerComponent(name: string, component: ComponentType<any>) {
  componentRegistry[name] = component;
}
