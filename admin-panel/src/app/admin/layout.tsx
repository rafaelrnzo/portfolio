// app/admin/layout.tsx
import Link from 'next/link';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'Admin Dashboard',
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-slate-800 bg-slate-900/70 backdrop-blur-sm">
        <div className="px-6 py-4 border-b border-slate-800">
          <h1 className="text-lg font-semibold tracking-tight">Admin CMS</h1>
          <p className="text-xs text-slate-400 mt-1">Portfolio content manager</p>
        </div>

        <nav className="px-3 py-4 space-y-1">
          <NavLink href="/admin/experiences" label="Experiences" />
          <NavLink href="/admin/skills" label="Skills" />
          <NavLink href="/admin/projects" label="Projects" />
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 px-4 md:px-8 lg:px-10 py-6 md:py-8">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between px-3 py-2 rounded-xl text-sm text-slate-200 hover:text-white hover:bg-slate-800/70 transition-colors"
    >
      <span>{label}</span>
      <span className="text-[10px] uppercase tracking-wide text-slate-500">Manage</span>
    </Link>
  );
}
