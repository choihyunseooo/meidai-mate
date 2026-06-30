"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import BottomNav from "@/components/BottomNav";

const RELATION_COLORS = {
  friend: "var(--accent-coral)",
  project: "var(--accent-mint)",
  study: "var(--accent-yellow)",
  experience: "var(--meidai-blue-light)",
};

const RELATION_LABELS = {
  friend: "友達",
  project: "プロジェクト仲間",
  study: "勉強パートナー",
  experience: "新しい経験を一緒に",
};

export default function BrowsePage() {
  const router = useRouter();
  const [userId, setUserId] = useState(null);
  const [students, setStudents] = useState([]);
  const [liked, setLiked] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const init = async () => {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) {
        router.push("/signup");
        return;
      }
      setUserId(authData.user.id);

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .neq("id", authData.user.id);

      if (error) {
        setError("読み込みに失敗しました: " + error.message);
        setLoading(false);
        return;
      }

      setStudents(data || []);

      const { data: likesData } = await supabase
        .from("likes_sent")
        .select("to_user")
        .eq("from_user", authData.user.id);

      setLiked((likesData || []).map((l) => l.to_user));
      setLoading(false);
    };
    init();
  }, [router]);

  const toggleLike = async (toUserId) => {
    if (liked.includes(toUserId)) return;

    const { error } = await supabase.from("likes_sent").insert({
      from_user: userId,
      to_user: toUserId,
    });

    if (!error) {
      setLiked((prev) => [...prev, toUserId]);
    }
  };

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
          見つける
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          興味やしたいことが近い明大生たち
        </p>

        {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

        {students.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-100 p-10 text-center">
            <p className="text-gray-400 text-sm">
              まだ他の学生が登録していません。<br />友達を招待してみましょう！
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {students.map((student) => {
              const isLiked = liked.includes(student.id);
              const relations = student.relation_types || [];
              return (
                <div
                  key={student.id}
                  className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                      style={{ backgroundColor: "var(--meidai-blue)" }}
                    >
                      {student.name ? student.name[0] : "?"}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h2 className="font-bold text-gray-800">{student.name}</h2>
                        <span className="text-xs text-gray-400">{student.grade}年</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{student.faculty}</p>

                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {relations.map((r) => (
                          <span
                            key={r}
                            className="text-xs font-semibold px-2.5 py-1 rounded-full"
                            style={{
                              backgroundColor: (RELATION_COLORS[r] || "#999") + "1A",
                              color: RELATION_COLORS[r] || "#999",
                            }}
                          >
                            {RELATION_LABELS[r] || r}
                          </span>
                        ))}
                      </div>

                      {student.interests && (
                        <p className="text-sm text-gray-600 mt-3">
                          <span className="font-semibold text-gray-700">興味: </span>
                          {student.interests}
                        </p>
                      )}
                      {student.want_to_try && (
                        <p className="text-sm text-gray-600 mt-1">
                          <span className="font-semibold text-gray-700">やりたいこと: </span>
                          {student.want_to_try}
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => toggleLike(student.id)}
                    disabled={isLiked}
                    className="w-full mt-4 py-3 rounded-xl font-bold text-sm transition"
                    style={
                      isLiked
                        ? { backgroundColor: "var(--meidai-blue)", color: "white" }
                        : { backgroundColor: "#f3f4f6", color: "#374151" }
                    }
                  >
                    {isLiked ? "気になる！を送信済み ✓" : "気になる！"}
                  </button>
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