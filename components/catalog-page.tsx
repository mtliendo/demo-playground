import { Suspense } from "react";
import { Catalog } from "@/components/catalog";
import type { CatalogItem } from "@/lib/types";

export function CatalogPage({ items }: { items: CatalogItem[] }) {
  return (
    <Suspense fallback={<p className="text-ink-faint">Loading catalog…</p>}>
      <Catalog items={items} />
    </Suspense>
  );
}
