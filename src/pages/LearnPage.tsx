import React from 'react';
import { Link } from 'react-router-dom';
import type{ WordbookType } from '../types/WordbookType';

const wordbookTypes: WordbookType[] = [
  { id: 1, name: '未学習の単語', words: ['apple', 'banana', 'orange'], meaning: ['リンゴ', 'バナナ', 'オレンジ'] },
  { id: 2, name: '今まで学んだ単語', words: ['schedule', 'negotiation', 'confirm'], meaning: ['スケジュール', '交渉', '確認'] },
];

const LearnPage: React.FC = () => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">単語帳の種類</h2>
      <ul className="space-y-4">
        {wordbookTypes.map((type) => (
          <li
            key={type.id}
            className="bg-white border rounded-lg p-3 hover:bg-gray-100 transition shadow-sm"
          >
            <Link to={`/learn/${type.id}`} className="block">
              {type.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LearnPage;
