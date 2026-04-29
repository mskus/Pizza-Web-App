import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 py-12">
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="font-serif text-sm uppercase tracking-[0.2em] text-basil"
      >
        Authentic Italian Pizzeria
      </motion.p>
      <h1 className="font-serif text-4xl leading-tight text-coal sm:text-5xl">
        Bottega Pizzeria
      </h1>
      <p className="max-w-xl text-base text-coal/80">
        Iki subemizde odun firininda hazirlanan geleneksel Italyan pizzalar.
      </p>
    </section>
  );
}
