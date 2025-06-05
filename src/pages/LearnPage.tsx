import React, { useEffect, useState } from "react";

type Status = "all" | "unchecked" | "correct" | "wrong";

const wordbook = {
  id: 1,
  name: "単語帳",
  words: ["apple", "banana", "orange", "schedule", "confirm"],
  meaning: ["リンゴ", "バナナ", "オレンジ", "予定", "確認"],
};

const WordbookDetail: React.FC = () => {
  const [flippedStates, setFlippedStates] = useState<boolean[]>(
    new Array(wordbook.words.length).fill(false)
  );

  const [statusStates, setStatusStates] = useState<
    ("unchecked" | "correct" | "wrong")[]
  >(new Array(wordbook.words.length).fill("unchecked"));

  const [showStatus, setShowStatus] = useState<Status>("all");
  const [feedback, setFeedback] = useState<string | null>(null);

  // フィルター処理
  const visibleWords = wordbook.words
    .map((word, index) => ({
      word,
      meaning: wordbook.meaning[index],
      index,
    }))
    .filter(({ index }) =>
      showStatus === "all" ? true : statusStates[index] === showStatus
    );

  // 表裏反転
  const toggleFlip = (index: number) => {
    setFlippedStates((prev) => {
      const updated = [...prev];
      updated[index] = !updated[index];
      return updated;
    });
  };

  // ステータス更新
  const updateStatus = (index: number, newStatus: "correct" | "wrong") => {
    setStatusStates((prev) => {
      const updated = [...prev];
      updated[index] = newStatus;
      return updated;
    });

    // フィードバック表示
    if (newStatus === "correct") {
      setFeedback("✅ よくできました！この調子✨");
    } else if (newStatus === "wrong") {
      setFeedback("❌ 間違えても大丈夫！次に活かそう💪");
    }
  };

  // フィードバック自動消去
  useEffect(() => {
    if (feedback) {
      const timeout = setTimeout(() => setFeedback(null), 2000);
      return () => clearTimeout(timeout);
    }
  }, [feedback]);

  return (
    <div className="p-4 relative">
      <h2 className="text-2xl font-bold mb-4">{wordbook.name}</h2>

      {/* フィードバック */}
      {feedback && (
        <div className="absolute top-4 right-4 bg-white border border-blue-300 text-blue-700 px-4 py-2 rounded shadow-md animate-fade-in">
          {feedback}
        </div>
      )}

      {/* ステータス切り替え */}
      <div className="flex flex-wrap gap-2 mb-4">
        {(["all", "unchecked", "correct", "wrong"] as Status[]).map((status) => (
          <button
            key={status}
            className={`px-4 py-2 rounded ${
              showStatus === status ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
            onClick={() => {
              setShowStatus(status);
              setFlippedStates(new Array(wordbook.words.length).fill(false));
            }}
          >
            {{
              all: "すべて",
              unchecked: "未復習",
              correct: "復習済み",
              wrong: "苦手",
            }[status]}
          </button>
        ))}
      </div>

      {/* 単語カード */}
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {visibleWords.map(({ word, meaning, index }) => (
          <li
            key={index}
            onClick={() => toggleFlip(index)}
            className="cursor-pointer perspective"
          >
            <div
              className="relative w-full h-48 preserve-3d transition-transform duration-500"
              style={{
                transform: flippedStates[index] ? "rotateY(180deg)" : "none",
              }}
            >
              {/* 表 */}
              <div className="absolute w-full h-full backface-hidden bg-white border rounded-xl flex items-center justify-center text-lg font-bold shadow">
                {word}
              </div>

              {/* 裏 */}
              <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-blue-600 text-white border rounded-xl relative flex items-center justify-center text-lg font-bold shadow p-4">
                <div className="text-center">{meaning}</div>
                <div className="absolute bottom-3 left-3 right-3 flex justify-between">
                  <button
                    className="bg-green-500 text-white text-sm px-3 py-1 rounded"
                    onClick={(e) => {
                      e.stopPropagation();
                      updateStatus(index, "correct");
                    }}
                  >
                    ◯
                  </button>
                  <button
                    className="bg-red-500 text-white text-sm px-3 py-1 rounded"
                    onClick={(e) => {
                      e.stopPropagation();
                      updateStatus(index, "wrong");
                    }}
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WordbookDetail;
