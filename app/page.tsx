import Hero from "@/components/layout/Hero";
import MenuGrid from "@/components/menu/MenuGrid";
import BranchTabs from "@/components/branches/BranchTabs";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Hero />
      <MenuGrid />
      <BranchTabs />
    </main>
  );
}
