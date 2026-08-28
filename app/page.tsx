import { CatalogPage } from "@/components/catalog-page";
import { getCatalogItems } from "@/lib/content";
import { SITE } from "@/lib/site";

export default function Home() {
  const items = getCatalogItems();

  return (
    <main id="main" className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <p className="font-mono text-[12px] tracking-[0.2em] text-accent uppercase">
        Auth0 Developer Advocacy
      </p>
      <h1 className="font-display mt-3 max-w-3xl text-5xl leading-[1.05] tracking-tight text-ink sm:text-6xl">
        {SITE.name}
      </h1>
      <p className="mt-5 max-w-2xl text-lg leading-8 text-ink-muted">{SITE.tagline}</p>
      <p className="mt-3 max-w-2xl text-[15px] leading-7 text-ink-faint">
        Browse runnable demos and agent skills. Filter by the identity problem you are
        teaching. Official hello-world snippets live on{" "}
        <a
          className="text-ink-muted underline decoration-line underline-offset-4 hover:text-ink hover:decoration-accent"
          href={SITE.codeSamplesUrl}
        >
          developer.auth0.com
        </a>
        .
      </p>
      <div className="mt-12">
        <CatalogPage items={items} />
      </div>
    </main>
  );
}
