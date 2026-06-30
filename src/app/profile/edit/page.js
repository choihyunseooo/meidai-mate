"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import BottomNav from "@/components/BottomNav";

const FACULTIES = [
  "法学部", "商学部", "政治経済学部", "文学部", "理工学部",
  "農学部", "経営学部", "情報コミュニケーション学部",
  "国際日本学部", "総合数理学部",
];

const RELATIONSHIP_TYPES = [
  { key: "friend", label: "友達", color: "var(--accent-coral)" },
  { key: "project", label: "プロジェクト仲間", color: "var(--accent-mint)" },
  { key: "study", label: "勉強パートナー", color: "var(--accent-yellow)" },
  { key: "experience", label: "新しい経験を一緒に", color: "var(--meidai-blue-light)" },
];

export default function ProfileEditPage() {
  const router = useRouter();
  const [userId, setUserId] = useState(null);
  const [checking, setChecking] = useState(true);

  const [name, setName] = useState("");
  const [faculty, setFaculty] = useState("");
  const [grade, setGrade] = useState("1");
  const [interests, setInterests] = useState("");
  const [hobbies, setHobbies] = useState("");
  const [likes, setLikes] = useState("");
  const [wantToTry, setWantToTry] = useState("");
  const [relationTypes, setRelationTypes] = useState([]);
  const [contact, setContact] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        router.push("/signup");
        return;
      }
      setUserId(data.user.id);

      // 기존 프로필이 있으면 불러와서 입력칸에 채워주기
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .maybeSingle();

      if (profile) {
        setName(profile.name || "");
        setFaculty(profile.faculty || "");
        setGrade(profile.grade || "1");
        setInterests(profile.interests || "");
        setHobbies(profile.hobbies || "");
        setLikes(profile.likes || "");
        setWantToTry(profile.want_to_try || "");
        setRelationTypes(profile.relation_types || []);
        setContact(profile.contact || "");
      }

      setChecking(false);
    };
    checkUser();
  }, [router]);

  const toggleRelation = (key) => {
    setRelationTypes((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const handleSave = async () => {
    setError("");

    if (!name || !faculty) {
      setError("名前と学部は必須です");
      return;
    }

    setSaving(true);

    const { error } = await supabase.from("profiles").upsert({
      id: userId,
      name,
      faculty,
      grade,
      interests,
      hobbies,
      likes,
      want_to_try: wantToTry,
      relation_types: relationTypes,
      contact,
    });

    setSaving(false);

    if (error) {
      setError("保存に失敗しました: " + error.message);
      return;
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (checking) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--bg-cream)" }}>
        <p className="text-gray-400 text-sm">確認中...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-6 py-10 pb-24" style={{ backgroundColor: "var(--bg-cream)" }}>
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-extrabold mb-1" style={{ color: "var(--meidai-blue-dark)" }}>
          プロフィール
        </h1>
        <p className="text-sm text-gray-500 mb-8">
          あなたのことを少し教えてください
        </p>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">名前（ニックネーム可）</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例: ゆうき"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">学部</label>
            <select
              value={faculty}
              onChange={(e) => setFaculty(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none bg-white"
            >
              <option value="">選択してください</option>
              {FACULTIES.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">学年</label>
            <div className="flex gap-2">
              {["1", "2", "3", "4", "院"].map((g) => (
                <button
                  key={g}
                  onClick={() => setGrade(g)}
                  className="flex-1 py-2.5 rounded-xl font-bold text-sm border-2 transition"
                  style={
                    grade === g
                      ? { backgroundColor: "var(--meidai-blue)", color: "white", borderColor: "var(--meidai-blue)" }
                      : { borderColor: "#e5e7eb", color: "#6b7280" }
                  }
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">興味のある分野</label>
            <input
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              placeholder="例: 映像制作, 音楽, スタートアップ"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">趣味</label>
            <input
              value={hobbies}
              onChange={(e) => setHobbies(e.target.value)}
              placeholder="例: カフェ巡り, バンド, 旅行"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">好きなもの</label>
            <input
              value={likes}
              onChange={(e) => setLikes(e.target.value)}
              placeholder="例: 邦ロック, 猫, ラーメン"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">やってみたいこと</label>
            <input
              value={wantToTry}
              onChange={(e) => setWantToTry(e.target.value)}
              placeholder="例: 短編映画を作る, バンドを組む"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">どんな繋がりを探していますか？</label>
            <div className="grid grid-cols-2 gap-2">
              {RELATIONSHIP_TYPES.map((r) => (
                <button
                  key={r.key}
                  onClick={() => toggleRelation(r.key)}
                  className="px-3 py-3 rounded-xl text-sm font-semibold border-2 transition text-left"
                  style={
                    relationTypes.includes(r.key)
                      ? { backgroundColor: r.color + "22", borderColor: r.color, color: r.color }
                      : { borderColor: "#e5e7eb", color: "#6b7280" }
                  }
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              連絡先（Instagram / LINE ID）
            </label>
            <input
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="例: @your_instagram"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none"
            />
            <p className="text-xs text-gray-400 mt-1">マッチが成立した相手にのみ表示されます</p>
          </div>

          {error && (
            <p className="text-xs text-red-500 font-semibold">{error}</p>
          )}

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full py-3.5 rounded-xl text-white font-bold transition hover:opacity-90 disabled:opacity-50 mt-2"
            style={{ backgroundColor: saved ? "var(--accent-mint)" : "var(--meidai-blue)" }}
          >
            {saving ? "保存中..." : saved ? "保存しました ✓" : "プロフィールを保存"}
          </button>
        </div>
      </div>
      <BottomNav />
    </main>
  );
}