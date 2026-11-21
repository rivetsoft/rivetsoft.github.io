import type { AppEntry } from "./data/apps";
import type { AppRelease } from "./data/release-model";

export const siteRoot = "https://rivetsoft.github.io/";
export const person = {
  "@type": "Person",
  name: "Aaron Mazade",
  alternateName: "ulinaaron",
  url: "https://github.com/ulinaaron",
};

export function breadcrumb(items: { name: string; url: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function websiteAndPerson(description: string) {
  return [
    {
      "@type": "WebSite",
      "@id": `${siteRoot}#website`,
      name: "Rivetsoft",
      url: siteRoot,
      description,
      inLanguage: "en",
      publisher: person,
    },
    person,
  ];
}

export function softwareApplication(app: AppEntry, release: AppRelease | undefined, pageUrl: string) {
  const node: Record<string, unknown> = {
    "@type": "SoftwareApplication",
    name: app.name,
    url: pageUrl,
    operatingSystem: "Linux",
    applicationCategory: app.applicationCategory,
    description: app.summary,
    license: "MIT OR Apache-2.0",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    author: person,
  };
  if (release) {
    node.softwareVersion = release.version;
    node.downloadUrl = release.assets[0]?.url || release.htmlUrl;
  }
  return node;
}
