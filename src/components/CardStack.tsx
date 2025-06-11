import type React from 'react';
import { useEffect, useState } from 'react';
import SwipeableCard from './SwipeableCard';

interface WordWithStatus {
  word: string;
  meaning?: string;
  search_count: number;
  status: 'all' | 'unchecked' | 'correct' | 'wrong';
}

interface CardStackProps {
  words: WordWithStatus[];
  onCardSwipe: (word: string, direction: 'left' | 'right') => void;
  onComplete: () => void;
}

const CardStack: React.FC<CardStackProps> = ({
  words,
  onCardSwipe,
  onComplete
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flippedStates, setFlippedStates] = useState<boolean[]>([]);
  const [completedCards, setCompletedCards] = useState<Set<number>>(new Set());

  // Initialize flipped states when words change
  useEffect(() => {
    setFlippedStates(new Array(words.length).fill(false));
    setCurrentIndex(0);
    setCompletedCards(new Set());
  }, [words.length]);

  // Check if all cards are completed
  useEffect(() => {
    if (completedCards.size === words.length && words.length > 0) {
      onComplete();
    }
  }, [completedCards.size, words.length, onComplete]);

  const handleCardFlip = (index: number) => {
    setFlippedStates((prev) => {
      const updated = [...prev];
      updated[index] = !updated[index];
      return updated;
    });
  };

  const handleCardSwipe = (direction: 'left' | 'right') => {
    const currentWord = words[currentIndex];
    if (!currentWord) return;

    // Mark card as completed
    setCompletedCards((prev) => new Set([...prev, currentIndex]));

    // Call the parent callback
    onCardSwipe(currentWord.word, direction);

    // Move to next card after a short delay
    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
    }, 200);
  };

  const getVisibleCards = () => {
    const visibleCards = [];
    const maxVisible = 3; // Show up to 3 cards in stack

    for (let i = 0; i < maxVisible && currentIndex + i < words.length; i++) {
      const cardIndex = currentIndex + i;
      const word = words[cardIndex];

      if (word && !completedCards.has(cardIndex)) {
        visibleCards.push({
          ...word,
          index: cardIndex,
          zIndex: maxVisible - i,
          scale: 1 - i * 0.05,
          yOffset: i * 10,
          opacity: 1 - i * 0.2
        });
      }
    }

    return visibleCards;
  };

  const visibleCards = getVisibleCards();

  if (words.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-500 text-lg">復習する単語がありません</p>
      </div>
    );
  }

  if (completedCards.size === words.length) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <div className="text-6xl">🎉</div>
        <h3 className="text-2xl font-bold text-green-600">お疲れ様でした！</h3>
        <p className="text-gray-600">すべての単語の復習が完了しました</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Progress indicator - restored to separate area */}
      <div className="flex-shrink-0 px-4 py-3">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">進捗</span>
          <span className="text-sm text-gray-600">
            {completedCards.size} / {words.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(completedCards.size / words.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Instructions - Fixed height to prevent card position shifting */}
      <div className="flex-shrink-0 text-center px-2 sm:px-4 pb-3 h-20 sm:h-16 flex items-center justify-center">
        {flippedStates[currentIndex] ? (
          <div className="w-full max-w-sm sm:max-w-lg mx-auto">
            {/* Mobile layout - stacked */}
            <div className="flex sm:hidden flex-col space-y-2">
              <div className="flex items-center justify-between space-x-4">
                {/* Left - Wrong (swipe left) */}
                <div className="flex-1 flex items-center justify-center space-x-1 text-red-600">
                  <span className="material-icons text-2xl">swipe_left</span>
                  <div className="text-center">
                    <div className="text-sm font-bold">不正解</div>
                  </div>
                </div>

                {/* Right - Correct (swipe right) */}
                <div className="flex-1 flex items-center justify-center space-x-1 text-green-600">
                  <div className="text-center">
                    <div className="text-sm font-bold">正解</div>
                  </div>
                  <span className="material-icons text-2xl">swipe_right</span>
                </div>
              </div>

              {/* Center instruction for mobile */}
              <div className="flex items-center justify-center space-x-1 text-gray-500">
                <span className="material-icons text-sm">swipe</span>
                <div className="text-xs font-medium">スワイプして回答</div>
              </div>
            </div>

            {/* Desktop layout - horizontal */}
            <div className="hidden sm:flex items-center justify-between px-2">
              {/* Left - Wrong (swipe left) */}
              <div className="flex items-center space-x-2 text-red-600">
                <span className="material-icons text-2xl">swipe_left</span>
                <div className="text-left">
                  <div className="text-xs text-red-500">左にスワイプ</div>
                  <div className="text-sm font-bold">不正解</div>
                </div>
              </div>

              {/* Center instruction */}
              <div className="flex-1 px-4 text-gray-500">
                <div className="text-xs font-medium">スワイプして回答</div>
                <div className="flex justify-center mt-1">
                  <span className="material-icons text-sm">swipe</span>
                </div>
              </div>

              {/* Right - Correct (swipe right) */}
              <div className="flex items-center space-x-2 text-green-600">
                <div className="text-right">
                  <div className="text-xs text-green-500">右にスワイプ</div>
                  <div className="text-sm font-bold">正解</div>
                </div>
                <span className="material-icons text-2xl">swipe_right</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center space-x-2 text-blue-600">
            <span className="material-icons text-lg">touch_app</span>
            <p className="text-sm font-medium">
              まずカードをタップして意味を確認してください
            </p>
          </div>
        )}
      </div>

      {/* Card stack area - responsive sizing */}
      <div
        className="flex-1 flex items-center justify-center px-4 pb-6"
        style={{ minHeight: 0 }}
      >
        <div className="relative w-full max-w-none lg:max-w-2xl">
          <div
            className="card-container"
            style={{
              width: '100%',
              maxWidth: '600px', // Large on desktop
              margin: '0 auto'
            }}
          >
            {visibleCards.map((card) => (
              <SwipeableCard
                key={card.index}
                word={card.word}
                meaning={card.meaning}
                searchCount={card.search_count}
                isFlipped={flippedStates[card.index] || false}
                onFlip={() => handleCardFlip(card.index)}
                onSwipe={
                  card.index === currentIndex ? handleCardSwipe : () => {}
                }
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  zIndex: card.zIndex,
                  transform: `scale(${card.scale}) translateY(${card.yOffset}px)`,
                  opacity: card.opacity,
                  pointerEvents: card.index === currentIndex ? 'auto' : 'none'
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardStack;
