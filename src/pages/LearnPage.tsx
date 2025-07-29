import type React from 'react';
import { useState } from 'react';
import CardStack from '../components/CardStack';
import EmptyState from '../components/learn/EmptyState';
import StatusFilter from '../components/learn/StatusFilter';
import { useFeedback } from '../hooks/useFeedback';
import { useWordManagement } from '../hooks/useWordManagement';
import type { Status } from '../utils/wordUtils';

const LearnPage: React.FC = () => {
  const [showStatus, setShowStatus] = useState<Status>('all');
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // Use custom hooks
  const { feedback, showFeedback } = useFeedback();
  const {
    updateWordStatus,
    getFilteredWords,
    recordCorrectAnswer,
    recordWrongAnswer
  } = useWordManagement();

  const visibleWords = getFilteredWords(showStatus);

  const handleCardSwipe = async (word: string, direction: 'left' | 'right') => {
    const newStatus: Status = direction === 'right' ? 'reviewed' : 'wrong';

    // Update the word status in local state
    updateWordStatus(word, newStatus);

    showFeedback(
      newStatus === 'reviewed'
        ? 'よくできました！この調子です'
        : '間違えても大丈夫！次に活かしましょう'
    );

    // Record correct or wrong answer with count update
    if (direction === 'right') {
      await recordCorrectAnswer(word);
    } else {
      await recordWrongAnswer(word);
    }
  };

  const handleStackComplete = () => {
    // Show completion message only once
    if (!isCompleted) {
      showFeedback('すべての復習が完了しました！');
      setIsCompleted(true);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Feedback Overlay */}
      {feedback && (
        <div className="fixed top-4 right-4 z-50 bg-white border border-blue-300 text-blue-700 px-4 py-3 rounded-lg shadow-lg backdrop-blur-sm animate-fade-in text-sm font-medium whitespace-nowrap">
          {feedback}
        </div>
      )}

      {/* Header section - optimized layout */}
      <div className="flex-shrink-0 bg-slate-50 border-b border-slate-200">
        <div className="container mx-auto px-4 py-2 max-w-7xl">
          <div className="flex items-center justify-center mb-2">
            <h2 className="text-xl sm:text-2xl font-bold">単語帳</h2>
          </div>

          <StatusFilter
            currentStatus={showStatus}
            onStatusChange={setShowStatus}
          />
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 overflow-hidden">
        {visibleWords.length === 0 ? (
          <EmptyState currentStatus={showStatus} />
        ) : (
          <CardStack
            words={visibleWords}
            onCardSwipe={handleCardSwipe}
            onComplete={handleStackComplete}
          />
        )}
      </div>
    </div>
  );
};

export default LearnPage;
