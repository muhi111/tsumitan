import { useDrag } from '@use-gesture/react';
import type React from 'react';
import { useState } from 'react';
import { animated, useSpring } from 'react-spring';

interface SwipeableCardProps {
  word: string;
  meaning?: string;
  searchCount: number;
  isFlipped: boolean;
  onFlip: () => void;
  onSwipe: (direction: 'left' | 'right') => void;
  style?: React.CSSProperties;
}

const SwipeableCard: React.FC<SwipeableCardProps> = ({
  word,
  meaning,
  searchCount,
  isFlipped,
  onFlip,
  onSwipe,
  style = {}
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const [{ x, y, rot, scale, opacity }, api] = useSpring(() => ({
    x: 0,
    y: 0,
    rot: 0,
    scale: 1,
    opacity: 1,
    config: { friction: 50, mass: 1, tension: 200 }
  }));

  const bind = useDrag(
    ({ down, movement: [mx, my], direction: [xDir], velocity: [vx] }) => {
      // Only allow swiping when meaning is shown (card is flipped)
      if (!isFlipped) {
        return;
      }

      const trigger = vx > 0.2 || Math.abs(mx) > 100; // Swipe trigger threshold
      const dir = xDir < 0 ? -1 : 1;

      if (!down && trigger) {
        // Trigger swipe action
        const swipeDirection = dir === -1 ? 'left' : 'right';

        // Animate card out of screen
        api.start({
          x: dir * 1000,
          rot: dir * 10,
          scale: 1.1,
          opacity: 0,
          config: { friction: 50, mass: 1, tension: 200 }
        });

        // Call the swipe callback after animation starts
        setTimeout(() => onSwipe(swipeDirection), 150);
        return;
      }

      setIsDragging(down);

      // Update card position and rotation
      api.start({
        x: down ? mx : 0,
        y: down ? my : 0,
        rot: down ? mx / 100 + (vx > 0 ? vx * 50 : 0) : 0,
        scale: down ? 1.1 : 1,
        opacity: 1,
        immediate: down
      });
    }
  );

  return (
    <animated.div
      {...bind()}
      style={{
        ...style,
        x,
        y,
        rotate: rot,
        scale,
        opacity,
        cursor: isDragging ? 'grabbing' : 'grab',
        touchAction: 'none',
        userSelect: 'none'
      }}
      className="absolute w-full h-full"
      onClick={!isDragging ? onFlip : undefined}
    >
      <div className="relative w-full h-full">
        {/* Main card */}
        <div
          className="relative w-full h-full preserve-3d transition-transform duration-500"
          style={{
            transform: isFlipped ? 'rotateY(180deg)' : 'none'
          }}
        >
          {/* Front side - Word */}
          <div className="absolute w-full h-full backface-hidden bg-white border-2 border-gray-200 rounded-2xl flex items-center justify-center text-lg sm:text-xl lg:text-2xl font-bold shadow-lg">
            <div className="text-center p-3 sm:p-4 lg:p-6">{word}</div>
          </div>

          {/* Back side - Meaning */}
          <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-blue-600 text-white border-2 border-blue-700 rounded-2xl flex flex-col p-3 sm:p-4 lg:p-6 shadow-lg">
            <div className="flex-1 overflow-y-auto mb-2 sm:mb-3 flex items-center justify-center">
              <div className="text-center text-sm sm:text-base lg:text-lg leading-relaxed">
                {meaning || '意味が取得できませんでした'}
              </div>
            </div>

            {/* Search count badge */}
            <div className="flex justify-center items-center">
              <div className="inline-flex items-center space-x-1 bg-blue-500 bg-opacity-30 backdrop-blur-sm rounded-full px-3 py-1.5 border border-blue-400 border-opacity-40">
                <span className="material-icons text-sm text-blue-100">
                  search
                </span>
                <span className="text-sm font-medium text-blue-100">
                  {searchCount}
                </span>
                <span className="text-xs text-blue-200 opacity-90">回</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </animated.div>
  );
};

export default SwipeableCard;
