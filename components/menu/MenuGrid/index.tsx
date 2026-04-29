"use client";

import MenuCard from "@/components/menu/MenuCard";
import { useMenu } from "@/hooks/useMenu";

export default function MenuGrid() {
  const { items, loading, error } = useMenu();

  return (
    <section id="menu" className="mx-auto w-full max-w-6xl px-4 py-12">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="font-serif text-sm uppercase tracking-[0.18em] text-basil">
            Taze ve Dinamik Menu
          </p>
          <h2 className="font-serif text-3xl text-coal sm:text-4xl">Imza Lezzetler</h2>
        </div>
      </div>

      {loading && <p className="text-sm text-coal/70">Menu yukleniyor...</p>}
      {error && <p className="text-sm text-tomato">{error}</p>}

      {!loading && !error && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <MenuCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </section>
  );
}
