import type { PortableTextComponents } from "@portabletext/react";
import Image from "next/image";
import { urlFor } from "@/sanity/client";
import type { ComponentType } from "react";

const componentRegistry: Record<string, ComponentType<any>> = {};

export const projectPortableTextComponents: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null;
      const url = urlFor(value).width(1200).url();
      return (
        <figure className="my-8">
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
};

export function registerComponent(name: string, component: ComponentType<any>) {
  componentRegistry[name] = component;
}
