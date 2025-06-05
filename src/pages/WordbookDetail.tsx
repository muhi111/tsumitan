import React, { useState } from "react";
import { useParams } from "react-router-dom";
import type { WordbookType } from "../types/WordbookType";

// 仮の単語帳データ
const wordbookTypes: WordbookType[] = [
  {
    id: 1,
    name: "未学習の単語",
    words: ["apple", "banana", "orange"],
    meaning: ["リンゴ", "バナナ", "オレンジ"],
  },
  {
    id: 2,
    name: "今までの",
    words: ["schedule", "negotiation", "confirm"],
    meaning: ["スケジュール", "交渉", "確認"],
  },
];

const WordbookDetail: React.FC = () => {
  // ルートパラメータ（/learn/:id）の「id」を取得
  const { id } = useParams<{ id: string }>();

  // 対象の単語帳をidから取得
  const wordbook = wordbookTypes.find(
    (type) => type.id === parseInt(id || "", 10)
  );

  // 単語帳が存在しない場合のエラーメッセージ
  if (!wordbook) {
    return <div className="p-4">単語帳が見つかりません。</div>;
  }
  const isCheckMode = wordbook.id === 1;

  // カードの表裏の状態を配列で管理（すべてfalse=表）
  const [flippedStates, setFlippedStates] = useState<boolean[]>(
    new Array(wordbook.words.length).fill(false)
  );

  // チェック状態を管理（すべてfalse=未チェック）
  const [checkedStates, setCheckedStates] = useState<boolean[]>(
    new Array(wordbook.words.length).fill(false)
  );

  // カードをクリックしたときに反転状態を切り替える関数
  const toggleFlip = (index: number) => {
    setFlippedStates((prev) => {
      const updated = [...prev];
      updated[index] = !updated[index];
      return updated;
    });
  };

  // チェック状態を切り替える関数
  const toggleCheck = (index: number) => {
    setCheckedStates((prev) => {
      const updated = [...prev];
      updated[index] = !updated[index];
      return updated;
    });
  };

  // id === 1 のときだけ、チェックされた単語を除外
  const visibleWords = wordbook.words
    .map((word, index) => ({ word, meaning: wordbook.meaning[index], index }))
    .filter(({ index }) => {
      return !isCheckMode || !checkedStates[index];
    });

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">{wordbook.name}</h2>

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

                {isCheckMode && (
                  <label className="absolute top-2 right-2 text-sm font-normal"
                  style={{ transform: 'translate(-10px, 10px)' }} // 少し内側に
                  >
                    <input
                      type="checkbox"
                      className="ml-2 scale-[3]"
                      checked={checkedStates[index]}
                      onClick={(e) => e.stopPropagation()}
                      onChange={() => toggleCheck(index)}
                    />
                  </label>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WordbookDetail;
