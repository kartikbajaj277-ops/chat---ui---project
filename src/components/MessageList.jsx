import { useMemo } from 'react';
import useAutoScroll from '../hooks/useAutoScroll.js';
import { dayLabel } from '../utils/format.js';
import MessageBubble from './MessageBubble.jsx';
import TypingIndicator from './TypingIndicator.jsx';

export default function MessageList({ conv, contacts, typingName, handlers }) {
  const { containerRef, bottomRef, onScroll, showJump, scrollToBottom } =
    useAutoScroll(conv.id, conv.messages.length + (typingName ? 1 : 0));

  // Derive day separators, unread divider and "show sender name" flags once per change.
  const items = useMemo(() => {
    const out = [];
    let prevDay = null, prevFrom = null;
    conv.messages.forEach((m) => {
      const day = dayLabel(m.ts);
      if (day !== prevDay) { out.push({ key: `d${m.id}`, type: 'day', label: day }); prevDay = day; prevFrom = null; }
      if (m.id === conv.dividerId) { out.push({ key: `u${m.id}`, type: 'divider' }); prevFrom = null; }
      const sender = conv.type === 'group' && m.from !== 'me' && m.from !== prevFrom
        ? contacts.find((c) => c.id === m.from)?.name : null;
      out.push({ key: m.id, type: 'msg', m, sender });
      prevFrom = m.from;
    });
    return out;
  }, [conv.messages, conv.dividerId, conv.type, contacts]);

  return (
    <div className="messages" ref={containerRef} onScroll={onScroll}>
      {items.map((it) =>
        it.type === 'day' ? <div key={it.key} className="day"><span>{it.label}</span></div>
        : it.type === 'divider' ? <div key={it.key} className="unread-divider"><span>New messages</span></div>
        : <MessageBubble key={it.key} m={it.m} mine={it.m.from === 'me'} sender={it.sender} {...handlers} />
      )}
      {typingName && <TypingIndicator name={typingName} />}
      <div ref={bottomRef} />
      {showJump && <button className="jump" onClick={() => scrollToBottom('smooth')}>↓ Latest</button>}
    </div>
  );
}
