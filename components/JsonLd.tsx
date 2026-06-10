import { getSiteUrl, siteConfig } from "@/lib/site";

export default function JsonLd() {
  const siteUrl = getSiteUrl();
  const imageUrl = `${siteUrl}${siteConfig.ogImage}`;

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: siteConfig.name,
        description: siteConfig.description,
        inLanguage: "fr",
      },
      {
        "@type": "Person",
        "@id": `${siteUrl}/#person`,
        name: "Dragunova",
        alternateName: "Nova",
        description: siteConfig.description,
        url: siteUrl,
        image: imageUrl,
        email: siteConfig.email,
        jobTitle: "Cosplayeuse",
        knowsAbout: [
          "Cosplay",
          "Jeux vidéo",
          "Musique",
          "Pop culture",
          "Fantasy",
        ],
        sameAs: [
          siteConfig.social.instagram,
          siteConfig.social.tiktok,
          siteConfig.social.twitter,
        ],
      },
      {
        "@type": "ProfilePage",
        "@id": `${siteUrl}/#profile`,
        url: siteUrl,
        name: siteConfig.title,
        description: siteConfig.description,
        inLanguage: "fr",
        isPartOf: { "@id": `${siteUrl}/#website` },
        about: { "@id": `${siteUrl}/#person` },
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: imageUrl,
          caption: siteConfig.ogImageAlt,
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
