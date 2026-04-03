import React, { useEffect, useRef, useState } from "react";
import ReelCard from "./ReelCard";
import API from "../api/API";

const REEL_STEP_LOCK_MS = 80;
const WHEEL_GESTURE_LOCK_MS = 80;

function ReelFeed() {
    const [foods, setFoods] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const shellRef = useRef(null);
    const currentIndexRef = useRef(0);
    const foodsLengthRef = useRef(0);
    const isTransitioningRef = useRef(false);
    const unlockTimeoutRef = useRef(null);
    const wheelGestureLockedRef = useRef(false);
    const wheelUnlockTimeoutRef = useRef(null);
    const touchStartYRef = useRef(null);
    const touchDeltaYRef = useRef(0);
    const touchStartScrollTopRef = useRef(0);
    const ignoreTouchRef = useRef(false);

    useEffect(() => {
        const fetchFoods = async () => {
            try {
                const resp = await API.get("/api/food");
                setFoods(resp.data.foods || []);
            } catch (err) {
                console.error("ERROR FETCHING FOOD:", err);
            }
        };

        fetchFoods();

        return () => {
            clearTimeout(unlockTimeoutRef.current);
            clearTimeout(wheelUnlockTimeoutRef.current);
        };
    }, []);

    useEffect(() => {
        foodsLengthRef.current = foods.length;
        setCurrentIndex((prev) => Math.min(prev, Math.max(foods.length - 1, 0)));
    }, [foods.length]);

    useEffect(() => {
        currentIndexRef.current = currentIndex;
    }, [currentIndex]);

    const getViewportHeight = () => shellRef.current?.clientHeight || window.innerHeight || 1;

    const shouldIgnoreGesture = (target) =>
        target instanceof Element &&
        Boolean(
            target.closest(
                ".comment-modal, .comment-box, .comment-list, .comment-input, input, textarea, button, a, .action"
            )
        );

    const unlockStepping = () => {
        clearTimeout(unlockTimeoutRef.current);
        unlockTimeoutRef.current = setTimeout(() => {
            isTransitioningRef.current = false;
        }, REEL_STEP_LOCK_MS);
    };

    const scrollToIndex = (index, behavior = "smooth") => {
        const shell = shellRef.current;

        if (!shell) {
            return;
        }

        shell.scrollTo({
            top: index * getViewportHeight(),
            behavior,
        });
    };

    const snapToIndex = (index) => {
        const nextIndex = Math.max(0, Math.min(index, foodsLengthRef.current - 1));

        currentIndexRef.current = nextIndex;
        setCurrentIndex(nextIndex);
        isTransitioningRef.current = true;
        scrollToIndex(nextIndex, "smooth");
        unlockStepping();
    };

    const stepReel = (direction) => {
        if (foodsLengthRef.current <= 1 || isTransitioningRef.current) {
            return;
        }

        const nextIndex = Math.max(
            0,
            Math.min(currentIndexRef.current + direction, foodsLengthRef.current - 1)
        );

        snapToIndex(nextIndex);
    };

    const resetTouchTracking = () => {
        touchStartYRef.current = null;
        touchDeltaYRef.current = 0;
        touchStartScrollTopRef.current = 0;
        ignoreTouchRef.current = false;
    };

    const handleWheel = (event) => {
        if (shouldIgnoreGesture(event.target) || Math.abs(event.deltaY) < 10) {
            return;
        }

        event.preventDefault();

        clearTimeout(wheelUnlockTimeoutRef.current);
        wheelUnlockTimeoutRef.current = setTimeout(() => {
            wheelGestureLockedRef.current = false;
        }, WHEEL_GESTURE_LOCK_MS);

        if (wheelGestureLockedRef.current) {
            return;
        }

        wheelGestureLockedRef.current = true;
        stepReel(event.deltaY > 0 ? 1 : -1);
    };

    const handleTouchStart = (event) => {
        if (event.touches.length !== 1 || isTransitioningRef.current) {
            resetTouchTracking();
            return;
        }

        ignoreTouchRef.current = shouldIgnoreGesture(event.target);

        if (ignoreTouchRef.current) {
            return;
        }

        touchStartYRef.current = event.touches[0].clientY;
        touchDeltaYRef.current = 0;
        touchStartScrollTopRef.current = currentIndexRef.current * getViewportHeight();
    };

    const handleTouchMove = (event) => {
        if (ignoreTouchRef.current || touchStartYRef.current === null) {
            return;
        }

        const shell = shellRef.current;

        if (!shell) {
            return;
        }

        event.preventDefault();

        const rawDelta = touchStartYRef.current - event.touches[0].clientY;
        const viewportHeight = getViewportHeight();
        const minScroll = Math.max(0, (currentIndexRef.current - 1) * viewportHeight);
        const maxScroll = Math.min(
            (foodsLengthRef.current - 1) * viewportHeight,
            (currentIndexRef.current + 1) * viewportHeight
        );

        let nextScrollTop = touchStartScrollTopRef.current + rawDelta;

        if (nextScrollTop < minScroll) {
            nextScrollTop = minScroll + (nextScrollTop - minScroll) * 0.28;
        } else if (nextScrollTop > maxScroll) {
            nextScrollTop = maxScroll + (nextScrollTop - maxScroll) * 0.28;
        }

        shell.scrollTop = nextScrollTop;
        touchDeltaYRef.current = rawDelta;
    };

    const handleTouchEnd = () => {
        if (ignoreTouchRef.current || touchStartYRef.current === null) {
            resetTouchTracking();
            return;
        }

        const viewportHeight = getViewportHeight();
        const swipeThreshold = Math.max(70, viewportHeight * 0.16);

        if (touchDeltaYRef.current >= swipeThreshold) {
            snapToIndex(currentIndexRef.current + 1);
        } else if (touchDeltaYRef.current <= -swipeThreshold) {
            snapToIndex(currentIndexRef.current - 1);
        } else {
            snapToIndex(currentIndexRef.current);
        }

        resetTouchTracking();
    };

    useEffect(() => {
        const shell = shellRef.current;

        if (!shell) {
            return undefined;
        }

        scrollToIndex(currentIndexRef.current, "auto");

        const handleResize = () => {
            scrollToIndex(currentIndexRef.current, "auto");
        };

        shell.addEventListener("wheel", handleWheel, { passive: false });
        shell.addEventListener("touchstart", handleTouchStart, { passive: true });
        shell.addEventListener("touchmove", handleTouchMove, { passive: false });
        shell.addEventListener("touchend", handleTouchEnd);
        shell.addEventListener("touchcancel", handleTouchEnd);
        window.addEventListener("resize", handleResize);

        return () => {
            shell.removeEventListener("wheel", handleWheel);
            shell.removeEventListener("touchstart", handleTouchStart);
            shell.removeEventListener("touchmove", handleTouchMove);
            shell.removeEventListener("touchend", handleTouchEnd);
            shell.removeEventListener("touchcancel", handleTouchEnd);
            window.removeEventListener("resize", handleResize);
        };
    }, [foods.length]);

    return (
        <div ref={shellRef} className="reel-feed-shell">
            {foods.map((food, index) => (
                <ReelCard
                    key={food._id}
                    videoData={food}
                    isActive={index === currentIndex}
                />
            ))}
        </div>
    );
}

export default ReelFeed;
