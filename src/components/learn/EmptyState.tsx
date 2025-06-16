import type React from 'react';
import type { Status } from '../../utils/wordUtils';
import { statusLabels } from '../../utils/wordUtils';

interface EmptyStateProps {
  currentStatus: Status;
}

const EmptyState: React.FC<EmptyStateProps> = ({ currentStatus }) => {
  return (
    <div className="flex justify-center h-full items-start pt-8 lg:pt-16">
      <div className="text-center px-4">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <svg
            className="w-8 h-8 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
        </div>
        <p className="text-gray-600 font-medium mb-2">
          {currentStatus === 'all'
            ? '復習する単語がありません'
            : `${statusLabels[currentStatus]}の単語がありません`}
        </p>
        <p className="text-gray-500 text-sm">
          {currentStatus !== 'all'
            ? '他のカテゴリを確認してみてください'
            : '新しい単語を検索して学習を始めましょう'}
        </p>
      </div>
    </div>
  );
};

export default EmptyState;
