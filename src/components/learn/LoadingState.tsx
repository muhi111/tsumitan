import type React from 'react';

const LoadingState: React.FC = () => {
  return (
    <div className="flex justify-center h-full items-start pt-8 lg:pt-16">
      <div className="flex flex-col items-center space-y-4">
        {/* シンプルなスピナー */}
        <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin" />

        {/* シンプルなテキスト */}
        <p className="text-gray-600 text-sm">読み込み中...</p>
      </div>
    </div>
  );
};

export default LoadingState;
