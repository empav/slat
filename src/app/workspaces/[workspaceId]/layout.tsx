"use client";

import Sidebar from "./sidebar";
import Toolbar from "./toolbar";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-full">
      <Toolbar />
      <div className="flex h-[calc(100vh-48px)]">
        <Sidebar />
        {children}
      </div>
    </div>
  );
}
