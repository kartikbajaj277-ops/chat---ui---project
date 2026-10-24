import { useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useChat } from '../context/ChatContext.jsx';
import Avatar from './Avatar.jsx';
import MessageList from './MessageList.jsx';
import MessageInput from './MessageInput.jsx';

const BANNER = {
  offline: "You're offline. Messages will send when you reconnect.",
  reconnecting: 'Reconnecting…',
};

export default function ChatWindow({ conv }) {
  const { state, send, edit, remove, react, retry, toggleConnection } = useChat();
  const typingName = state.typing[conv.id];
  const contact = state.contacts.find((c) => c.id === conv.contactId);

  // Stable handler identities so memoised MessageBubble isn't re-rendered needlessly.
  const handlers = useMemo(() => ({
    onEdit: (id, text) => edit(conv.id, id, text),
    onDelete: (id) => remove(conv.id, id),
    onReact: (id, emoji) => react(conv.id, id, emoji),
    onRetry: (id) => retry(conv.id, id),
  }), [conv.id, edit, remove, react, retry]);

  const onSend = useCallback((text, image) => send(conv.id, text, image), [conv.id, send]);

  const subtitle = typingName ? `${typingName} is typing…`
    : conv.type === 'dm' ? (contact?.online ? 'Online' : 'Offline')
    : conv.members.map((id) => state.contacts.find((c) => c.id === id)?.name.split(' ')[0]).join(', ') + ', You';

  return (
    <section className="window">
      <header className="win-head">
        <Link to="/chat" className="back" aria-label="Back">←</Link>
        <Avatar name={conv.name} online={conv.type === 'dm' ? contact?.online : undefined} />
        <div className="grow">
          <strong>{conv.name}</strong>
          <div className={`small ${typingName || contact?.online ? 'accent' : 'muted'}`}>{subtitle}</div>
        </div>
        <button className="ghost small" onClick={toggleConnection}>
          {state.connection === 'online' ? '📡 Go offline' : state.connection === 'offline' ? '🔌 Reconnect' : '…'}
        </button>
      </header>
      {state.connection !== 'online' && <div className="banner">{BANNER[state.connection]}</div>}
      <MessageList conv={conv} contacts={state.contacts} typingName={typingName} handlers={handlers} />
      <MessageInput onSend={onSend} />
    </section>
  );
}
