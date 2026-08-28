import { Suspense } from "react";
import { Catalog } from "@/components/catalog";
import type { CatalogItem } from "@/lib/types";

export function CatalogPage({
  items,
  lockedType,
}: {
  items: CatalogItem[];
  lockedType?: "demo" | "skill";
}) {
  return (
    <Suspense
      fallback={<p className="font-mono text-sm text-ink-faint">Loading catalog…</p>}
    >
      <Catalog items={items} lockedType={lockedType} />
    </Suspense>
  );
}
