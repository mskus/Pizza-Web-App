import type { PropsWithChildren } from "react";

export default function Section({ children }: PropsWithChildren) {
  return <section className="mx-auto w-full max-w-5xl px-4">{children}</section>;
}
