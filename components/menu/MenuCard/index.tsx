"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ANIMATION, MENU_PLACEHOLDER_IMAGE } from "@/constants";
import type { MenuItem } from "@/hooks/useMenu";
import PriceCounter from "@/components/ui/PriceCounter";

type MenuCardProps = {
  item: MenuItem;
};

export default function MenuCard({ item }: MenuCardProps) {
  const [activeMobile, setActiveMobile] = useState(false);

  return (
    <motion.article
      onClick={() => setActiveMobile((prev) => !prev)}
      whileHover={{ y: ANIMATION.cardLiftY }}
      whileTap={{ y: ANIMATION.cardLiftY }}
      className="cursor-pointer rounded-2xl border border-coal/10 bg-white p-3 shadow-sm transition-shadow hover:shadow-lg"
    >
      <motion.div
        animate={{ rotate: activeMobile ? ANIMATION.cardRotateDeg : 0 }}
        whileHover={{ rotate: ANIMATION.cardRotateDeg }}
        transition={{ duration: 0.25 }}
        className="relative mb-3 aspect-[4/3] overflow-hidden rounded-xl"
      >
        <Image
          src={item.imageUrl || MENU_PLACEHOLDER_IMAGE}
          alt={item.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          loading="lazy"
          className="object-cover"
        />
      </motion.div>
      <div className="space-y-1">
        <p className="font-serif text-xl text-coal">{item.name}</p>
        <p className="text-sm text-coal/70">{item.ingredients}</p>
        <div className="flex items-center justify-between pt-1">
          <span className="rounded-full bg-dough px-2 py-1 text-xs text-basil">
            {item.category}
          </span>
          <p className="text-sm font-semibold text-tomato">
            <PriceCounter value={item.price} />
          </p>
        </div>
      </div>
    </motion.article>
  );
}
