"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import BottomNav from "@/components/BottomNav";

const RELATION_LABELS = {
  friend: "友達",
  project: "プロジェクト仲間",
  study: "勉強パートナー",
  experience: "新しい経験を一緒に",
};

export default function MatchesPage() {
  const router = useRouter();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadMatches = async () => {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) {
        router.push("/signup");
        return;
      }
      const myId = authData.user.id;

      const { data: sentByMe, error: err1 } = await supabase
        .from("likes_sent")
        .select("to_user")
        .eq("from_user", myId);

      if (err1) {
        setError("読み込みに失敗しました: " + err1.message);
        setLoading(false);
        return;
      }

      const sentIds = (sentByMe || []).map((r) => r.to_user);

      if (sentIds.length === 0) {
        setMatches([]);
        setLoading(false);
        return;
      }

      const { data: mutualLikes, error: err2 } = await supabase
        .from("likes_sent")
        .select("from_user")
        .eq("to_user", myId)
        .in("from_user", sentIds);

      if (err2) {
        setError("読み込みに失敗しました: " + err2.message);
        setLoading(false);
        return;
      }

      const matchedIds = (mutualLikes || []).map((r) => r.from_user);

      if (matchedIds.length === 0) {
        setMatches([]);
        setLoading(false);
        return;
      }

      const { data: profiles, error: err3 } = await supabase
        .from("profiles")
        .select("*")
        .in("id", matchedIds);

      if (err3) {
        setError("読み込みに失敗しました: " + err3.message);
        setLoading(false);
        return;
      }

      setMatches(profiles || []);
      setLoading(false);
    };

    loadMatches();
  }, [router]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--bg-cream)" }}>
        <p className="text-gray-400 text-sm">読み込み中...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-6 py-10 pb-24" style={{ backgroundColor: "var(--bg-cream)" }}>
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-extrabold mb-1" style={{ color: "var(--meidai-blue-dark)" }}>
          マッチ
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          お互いに気になる！を送ったメイトたち
        </p>

        {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

        {matches.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-100 p-10 text-center">
            <p className="text-gray-400 text-sm">
              まだマッチがありません。<br />気になる人に「気になる！」を送ってみましょう。
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {matches.map((match) => {
              const relations = match.relation_types || [];
              return (
                <div
                  key={match.id}
                  className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                      style={{ backgroundColor: "var(--meidai-blue)" }}
                    >
                      {match.name ? match.name[0] : "?"}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h2 className="font-bold text-gray-800">{match.name}</h2>
                        <span
                          className="text-xs font-semibold px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: "var(--accent-mint)" + "1A", color: "var(--accent-mint)" }}
                        >
                          マッチ！
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{match.faculty}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {relations.map((r) => RELATION_LABELS[r] || r).join(", ")}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-400">連絡先</p>
                      <p className="text-sm font-semibold" style={{ color: "var(--meidai-blue)" }}>
                        {match.contact || "未設定"}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <BottomNav />
    </main>
  );
}