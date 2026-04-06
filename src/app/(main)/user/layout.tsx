import type { ReactNode } from "react";

import { UserSidebar } from "@/components/user/UserSidebar";

export default function UserLayout({ children }: { children: ReactNode }) {
  return (
    <main className="bg-bg">
      <div className="container-page py-6 md:py-8 grid gap-6 lg:grid-cols-[260px_1fr]">
        <UserSidebar />
        <div>{children}</div>
      </div>
    </main>
  );
}
