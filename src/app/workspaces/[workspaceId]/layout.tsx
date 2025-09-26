"use client";

import Toolbar from "./toolbar";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-full">
      <Toolbar />
      {children}
    </div>
  );
}
