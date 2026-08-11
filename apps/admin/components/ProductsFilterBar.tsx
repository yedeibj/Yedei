"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

type Category = { id: string; name: string };

export default function ProductsFilterBar({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="mt-4 flex flex-wrap gap-3">
      <input
        type="text"
        placeholder="Rechercher un produit..."
        defaultValue={searchParams.get("q") ?? ""}
        onChange={(e) => updateParam("q", e.target.value)}
        className="min-w-[220px] flex-1 rounded-md border border-[#D8D3C9] px-3 py-2 text-sm outline-none focus:border-[#006400]"
      />
      <select
        defaultValue={searchParams.get("category") ?? ""}
        onChange={(e) => updateParam("category", e.target.value)}
        className="rounded-md border border-[#D8D3C9] bg-white px-3 py-2 text-sm outline-none focus:border-[#006400]"
      >
        <option value="">Toutes les catégories</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>
    </div>
  );
}
