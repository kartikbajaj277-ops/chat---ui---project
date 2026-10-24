import { useCallback, useEffect, useRef, useState } from 'react';

// Auto-scroll to newest message only if the user is already near the bottom.
// `resetKey` (conversation id) jumps instantly to the bottom when the chat changes.
export default function useAutoScroll(resetKey, itemCount) {
  const containerRef = useRef(null);
  const bottomRef = useRef(null);
  const nearBottom = useRef(true);
  const [showJump, setShowJump] = useState(false);

  const onScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const near = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
    nearBottom.current = near;
    setShowJump(!near);
  }, []);

  const scrollToBottom = useCallback((behavior = 'smooth') => {
    bottomRef.current?.scrollIntoView({ behavior });
  }, []);

  useEffect(() => {
    nearBottom.current = true;
    scrollToBottom('auto');
  }, [resetKey, scrollToBottom]);

  useEffect(() => {
    if (nearBottom.current) scrollToBottom('smooth');
  }, [itemCount, scrollToBottom]);

  return { containerRef, bottomRef, onScroll, showJump, scrollToBottom };
}
