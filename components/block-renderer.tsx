import { ReactNode } from "react";
import { ContentBlock } from "@/lib/content-types";

// Parses **bold**, *italic*, [link](url), and \n → <br>
function parseInline(text: string, baseKey: string): ReactNode {
  const segments = text.split(/(\*\*[^*\n]+\*\*|\*[^*\n]+\*|\[[^\]\n]+\]\([^)\n]+\)|\n)/);
  return segments.map((seg, i) => {
    const key = `${baseKey}-${i}`;
    if (seg === "\n") return <br key={key} />;
    if (/^\*\*[^*]+\*\*$/.test(seg)) return <strong key={key}>{seg.slice(2, -2)}</strong>;
    if (/^\*[^*]+\*$/.test(seg)) return <em key={key}>{seg.slice(1, -1)}</em>;
    const link = seg.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      return <a href={link[2]} key={key} rel="noopener noreferrer" target="_blank">{link[1]}</a>;
    }
    return seg;
  });
}

type BlockRendererProps = {
  blocks: ContentBlock[];
};

export function BlockRenderer({ blocks }: BlockRendererProps) {
  return (
    <div className="content-blocks">
      {blocks.map((block) => {
        if (block.type === "heading") {
          const Tag = block.level === 2 ? "h2" : "h3";
          return <Tag key={block.id}>{block.text}</Tag>;
        }

        if (block.type === "paragraph") {
          return <p key={block.id}>{parseInline(block.text, block.id)}</p>;
        }

        if (block.type === "image") {
          return (
            <figure
              className={`inline-image image-${block.align} image-${block.width}`}
              key={block.id}
            >
              <img alt={block.alt} src={block.src} />
              {block.caption ? <figcaption>{block.caption}</figcaption> : null}
            </figure>
          );
        }

        if (block.type === "gallery") {
          return (
            <div className="gallery-block" key={block.id}>
              {block.images.map((image) => (
                <figure key={image.id}>
                  <img alt={image.alt} src={image.src} />
                  {image.caption ? <figcaption>{image.caption}</figcaption> : null}
                </figure>
              ))}
            </div>
          );
        }

        if (block.type === "quote") {
          return (
            <blockquote key={block.id}>
              <p>{parseInline(block.text, block.id)}</p>
              {block.byline ? <cite>{block.byline}</cite> : null}
            </blockquote>
          );
        }

        return <hr key={block.id} />;
      })}
    </div>
  );
}
