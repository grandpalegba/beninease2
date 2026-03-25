import type { ReactNode } from "react";

export default function JuryLayout({ children }: { children: ReactNode }) {
  return <div data-area="jury">{children}</div>;
}
