"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const TABS = [
  { href: "/browse", label: "見つける", icon: "🔍" },
  { href: "/matches", label: "マッチ", icon: "💬" },
  { href: "/profile/edit", label: "プロフィール", icon: "👤" },
];

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-2 flex items-center justify-between max-w-md mx-auto">
      <div className="flex flex-1 justify-around">
        {TABS.map((tab) => {
          const active = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="flex flex-col items-center py-2 px-3 rounded-xl transition"
              style={active ? { color: "var(--meidai-blue)" } : { color: "#9ca3af" }}
            >
              <span className="text-lg">{tab.icon}</span>
              <span className="text-[11px] font-semibold mt-0.5">{tab.label}</span>
            </Link>
          );
        })}
      </div>
      <button
        onClick={handleLogout}
        className="text-[11px] font-semibold text-gray-400 px-3 py-2"
      >
        ログアウト
      </button>
    </nav>
  );
}