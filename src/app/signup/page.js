"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const handleSendLink = async () => {
    setError("");

    if (!email.endsWith("@meiji.ac.jp")) {
      setError("明治大学のメールアドレス（@meiji.ac.jp）のみ登録できます");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/profile/edit`,
      },
    });
    setLoading(false);

    if (error) {
      setError("送信に失敗しました: " + error.message);
      return;
    }

    setSent(true);
  };

  if (sent) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6 py-12" style={{ backgroundColor: "var(--bg-cream)" }}>
        <div className="w-full max-w-sm text-center">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-xl mb-4 mx-auto"
            style={{ backgroundColor: "var(--meidai-blue)" }}
          >
            ✓
          </div>
          <h1 className="text-xl font-bold mb-2" style={{ color: "var(--meidai-blue-dark)" }}>
            メールを確認してください
          </h1>
          <p className="text-sm text-gray-500">
            {email} にログインリンクを送信しました。<br />
            メール内のリンクをクリックすると登録が完了します。
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-12" style={{ backgroundColor: "var(--bg-cream)" }}>
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-xl mb-3"
            style={{ backgroundColor: "var(--meidai-blue)" }}
          >
            明
          </div>
          <h1 className="text-xl font-bold" style={{ color: "var(--meidai-blue-dark)" }}>
            明大メイトに登録
          </h1>
          <p className="text-sm text-gray-500 mt-1">明治大学のメールアドレスで始めよう</p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            メイジ大学メールアドレス
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@meiji.ac.jp"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 transition mb-1"
          />
          <p className="text-xs text-gray-400 mb-2">@meiji.ac.jp のメールのみ登録できます</p>

          {error && (
            <p className="text-xs text-red-500 mb-3 font-semibold">{error}</p>
          )}

          <button
            onClick={handleSendLink}
            disabled={loading || !email}
            className="w-full py-3.5 rounded-xl text-white font-bold transition hover:opacity-90 disabled:opacity-50 mt-2"
            style={{ backgroundColor: "var(--meidai-blue)" }}
          >
            {loading ? "送信中..." : "ログインリンクを送る"}
          </button>

          <div className="flex items-center gap-2 mt-5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "var(--accent-mint)" }} />
            <p className="text-xs text-gray-500">
              送信されたメール内のリンクをクリックしてください
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          明大メイトは明治大学の学生が個人で運営する非公式のサービスです。
        </p>
      </div>
    </main>
  );
}