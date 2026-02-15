import { useEffect } from "react";

function SEO({ title, description, keywords }) {
  useEffect(() => {
    document.title = title
      ? `${title} | Todo App`
      : "Todo App - Manage Your Tasks";

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        description || "A modern todo application built with React",
      );
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content =
        description || "A modern todo application built with React";
      document.head.appendChild(meta);
    }

    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute(
        "content",
        keywords || "todo, task manager, react, productivity",
      );
    } else {
      const meta = document.createElement("meta");
      meta.name = "keywords";
      meta.content = keywords || "todo, task manager, react, productivity";
      document.head.appendChild(meta);
    }
  }, [title, description, keywords]);

  return null;
}

export default SEO;
