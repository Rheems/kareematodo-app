import { useEffect } from "react";
import type { SEOProps } from "../types";

function SEO({ title, description, keywords }: SEOProps) {
  useEffect(() => {
    document.title = `${title} | TodoApp`;

    let descriptionMeta = document.querySelector('meta[name="description"]');
    if (!descriptionMeta) {
      descriptionMeta = document.createElement("meta");
      descriptionMeta.setAttribute("name", "description");
      document.head.appendChild(descriptionMeta);
    }
    if (description) {
      descriptionMeta.setAttribute("content", description);
    }

    let keywordsMeta = document.querySelector('meta[name="keywords"]');
    if (!keywordsMeta) {
      keywordsMeta = document.createElement("meta");
      keywordsMeta.setAttribute("name", "keywords");
      document.head.appendChild(keywordsMeta);
    }
    if (keywords) {
      keywordsMeta.setAttribute("content", keywords);
    }
  }, [title, description, keywords]);

  return null;
}

export default SEO;
