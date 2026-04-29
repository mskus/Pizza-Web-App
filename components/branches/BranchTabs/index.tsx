"use client";

import { useState } from "react";
import { BRANCHES } from "@/constants";

export default function BranchTabs() {
  const [activeId, setActiveId] = useState(BRANCHES[0]?.id ?? "");

  const activeBranch = BRANCHES.find((branch) => branch.id === activeId) ?? BRANCHES[0];

  if (!activeBranch) {
    return null;
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-12">
      <div className="rounded-2xl bg-white p-4 shadow-sm sm:p-6">
        <h2 className="mb-4 font-serif text-3xl text-coal">Subelerimiz</h2>

        <div className="mb-5 flex flex-wrap gap-2">
          {BRANCHES.map((branch) => {
            const selected = branch.id === activeId;
            return (
              <button
                key={branch.id}
                onClick={() => setActiveId(branch.id)}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  selected ? "bg-basil text-dough" : "bg-dough text-coal"
                }`}
              >
                {branch.label}
              </button>
            );
          })}
        </div>

        <div className="space-y-2 text-sm text-coal/80">
          <p>
            <span className="font-semibold text-coal">Adres:</span> {activeBranch.address}
          </p>
          <p>
            <span className="font-semibold text-coal">Calisma Saatleri:</span>{" "}
            {activeBranch.hours}
          </p>
          <a
            href={activeBranch.mapUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex rounded-md bg-tomato px-3 py-2 text-sm text-white"
          >
            Haritada Ac
          </a>
        </div>
      </div>
    </section>
  );
}
