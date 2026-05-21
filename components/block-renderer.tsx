import { ContentBlock } from "@/lib/content-types";

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
          return <p key={block.id}>{block.text}</p>;
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
              <p>{block.text}</p>
              {block.byline ? <cite>{block.byline}</cite> : null}
            </blockquote>
          );
        }

        return <hr key={block.id} />;
      })}
    </div>
  );
}
