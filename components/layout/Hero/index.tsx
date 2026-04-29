"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ANIMATION, HERO_CONTENT } from "@/constants";

export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-end overflow-hidden">
      <Image
        src={HERO_CONTENT.backgroundImage}
        alt="Dumani tueten odun firini pizzasi"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-coal/85 via-coal/40 to-transparent" />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-14 pt-28 sm:pb-16">
        <motion.p
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: ANIMATION.heroTextDuration, delay: ANIMATION.heroTextDelay }}
          className="mb-3 font-serif text-sm uppercase tracking-[0.2em] text-dough"
        >
          {HERO_CONTENT.eyebrow}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: ANIMATION.heroTextDuration,
            delay: ANIMATION.heroTextDelay + 0.08
          }}
          className="max-w-3xl font-serif text-4xl leading-tight text-dough sm:text-5xl lg:text-6xl"
        >
          {HERO_CONTENT.title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: ANIMATION.heroTextDuration,
            delay: ANIMATION.heroTextDelay + 0.16
          }}
          className="mt-4 max-w-xl text-sm text-dough/90 sm:text-base"
        >
          {HERO_CONTENT.subtitle}
        </motion.p>
        <motion.a
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: ANIMATION.heroTextDuration,
            delay: ANIMATION.heroTextDelay + 0.24
          }}
          href={HERO_CONTENT.ctaHref}
          className="mt-6 inline-flex rounded-full bg-tomato px-5 py-2.5 text-sm font-medium text-white"
        >
          {HERO_CONTENT.ctaLabel}
        </motion.a>
      </div>
    </section>
  );
}
