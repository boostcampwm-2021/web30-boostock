import { useState, useEffect, useRef } from 'react';

const onScroll = (refresh: () => void, entries: IntersectionObserverEntry[]) => {
	entries.forEach((entry) => {
		if (entry.isIntersecting) {
			refresh();
		}
	});
};

export default function useInfinityScroll(callback: (setLoading: React.Dispatch<React.SetStateAction<boolean>>) => void) {
	const rootRef = useRef<HTMLElement>(null);
	const targetRef = useRef<HTMLElement>(null);
	const [loading, setLoading] = useState<boolean>(false);

	useEffect(() => {
		let observer: IntersectionObserver;

		if (targetRef.current) {
			const boundRefresh = callback.bind(undefined, setLoading);
			const boundOnScroll = onScroll.bind(undefined, boundRefresh);
			observer = new IntersectionObserver(boundOnScroll, { root: rootRef.current, threshold: 0.5 });
			observer.observe(targetRef.current);
		}

		return () => observer && observer.disconnect();
	}, [loading]);

	return [rootRef, targetRef, loading];
}
