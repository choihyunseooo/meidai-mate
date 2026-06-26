export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* 상단 네비게이션 */}
      <nav className="flex items-center justify-between px-6 py-5 md:px-12">
        <div className="flex items-center gap-2">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm"
            style={{ backgroundColor: "var(--meidai-blue)" }}
          >
            明
          </div>
          <span className="font-bold text-lg" style={{ color: "var(--meidai-blue)" }}>
            明大メイト
          </span>
        </div>
        <button
          className="px-5 py-2 rounded-full text-sm font-semibold text-white transition hover:opacity-90"
          style={{ backgroundColor: "var(--meidai-blue)" }}
        >
          ログイン
        </button>
      </nav>

      {/* 히어로 섹션 */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-16 md:py-24">
        <div className="flex gap-2 mb-6">
          <span
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: "var(--accent-coral)" }}
          />
          <span
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: "var(--accent-yellow)" }}
          />
          <span
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: "var(--accent-mint)" }}
          />
        </div>

        <h1
          className="text-4xl md:text-6xl font-extrabold leading-tight max-w-3xl"
          style={{ color: "var(--meidai-blue-dark)" }}
        >
          明治大学で、<br />
          まだ出会っていない<br />
          仲間とつながる。
        </h1>

        <p className="mt-6 text-base md:text-lg text-gray-600 max-w-md">
          学部も学年も関係なく、興味・趣味・やりたいことでつながる明大生限定のマッチングサービス。
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <button
            className="px-8 py-4 rounded-full text-white font-bold text-base shadow-lg transition hover:scale-105"
            style={{ backgroundColor: "var(--meidai-blue)" }}
          >
            明大メールで始める
          </button>
          <button
            className="px-8 py-4 rounded-full font-bold text-base border-2 transition hover:bg-gray-50"
            style={{ borderColor: "var(--meidai-blue)", color: "var(--meidai-blue)" }}
          >
            サービスについて
          </button>
        </div>
      </section>

      {/* 특징 카드 3개 */}
      <section className="px-6 pb-20 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            { emoji: "🎬", title: "趣味仲間を探す", color: "var(--accent-coral)" },
            { emoji: "🤝", title: "プロジェット仲間を探す", color: "var(--accent-mint)" },
            { emoji: "📚", title: "勉強パートナーを探す", color: "var(--accent-yellow)" },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl p-6 bg-white shadow-sm border border-gray-100 text-center"
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4"
                style={{ backgroundColor: item.color + "22" }}
              >
                {item.emoji}
              </div>
              <p className="font-bold text-gray-800">{item.title}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}