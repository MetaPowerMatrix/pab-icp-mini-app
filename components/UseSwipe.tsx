import { useState, useEffect, useCallback } from 'react';

interface SwipeConfig {
	threshold?: number; // Minimum distance for a swipe to be recognized
	onSwipeLeft?: () => void;
	onSwipeRight?: () => void;
	onSwipeUp?: () => void;
	onSwipeDown?: () => void;
}

export const useSwipe = (config: SwipeConfig = {}) => {
	const { threshold = 50, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown } = config;

	const [startX, setStartX] = useState(0);
	const [startY, setStartY] = useState(0);
	const [endX, setEndX] = useState(0);
	const [endY, setEndY] = useState(0);

	const handleTouchStart = useCallback((e: TouchEvent) => {
		setStartX(e.touches[0].clientX);
		setStartY(e.touches[0].clientY);
	}, []);

	const handleTouchMove = useCallback((e: TouchEvent) => {
		setEndX(e.touches[0].clientX);
		setEndY(e.touches[0].clientY);
	}, []);

	const handleTouchEnd = useCallback(() => {
		const deltaX = startX - endX;
		const deltaY = startY - endY;

		if (Math.abs(deltaX) > Math.abs(deltaY)) {
			if (Math.abs(deltaX) > threshold) {
				if (deltaX > 0) {
					onSwipeLeft && onSwipeLeft();
				} else {
					onSwipeRight && onSwipeRight();
				}
			}
		} else {
			if (Math.abs(deltaY) > threshold) {
				if (deltaY > 0) {
					onSwipeUp && onSwipeUp();
				} else {
					onSwipeDown && onSwipeDown();
				}
			}
		}
	}, [startX, endX, startY, endY, threshold, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown]);

	useEffect(() => {
		window.addEventListener('touchstart', handleTouchStart);
		window.addEventListener('touchmove', handleTouchMove);
		window.addEventListener('touchend', handleTouchEnd);

		return () => {
			window.removeEventListener('touchstart', handleTouchStart);
			window.removeEventListener('touchmove', handleTouchMove);
			window.removeEventListener('touchend', handleTouchEnd);
		};
	}, [handleTouchStart, handleTouchMove, handleTouchEnd]);

	return {};
};
