import { useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useChat } from '../context/ChatContext.jsx';
import useDebounce from '../hooks/useDebounce.js';
import Avatar from './Avatar.jsx';
import ConversationItem from './ConversationItem.jsx';

export default function Sidebar({ activeId }) {
  const { state } = useChat();
  const { user, logout } = useAuth();
  const [query, setQuery] = useState('');
  const debounced = useDebounce(query, 200);

  const list = useMemo(() => {
    const term = debounced.trim().toLowerCase();
    const lastOf = (c) => c.messages[c.messages.length - 1];
    return state.conversations
      .filter((c) => !term || c.name.toLowerCase().includes(term) || (lastOf(c)?.text || '').toLowerCase().includes(term))
      .sort((a, b) => (lastOf(b)?.ts ?? 0) - (lastOf(a)?.ts ?? 0));
  }, [state.conversations, debounced]);

  const onlineOf = (c) => state.contacts.find((x) => x.id === c.contactId)?.online;

  return (
    <aside className="sidebar-col">
      <header className="side-head">
        <Avatar name={user.name} size={38} />
        <div className="grow"><strong>{user.name}</strong><div className="muted small">{user.email}</div></div>
        <button className="ghost small" onClick={logout}>Log out</button>
      </header>
      <input className="search" placeholder="Search chats…" value={query} onChange={(e) => setQuery(e.target.value)} />
      <div className="conv-list">
        {list.map((c) => <ConversationItem key={c.id} conv={c} online={onlineOf(c)} active={c.id === activeId} />)}
        {!list.length && <p className="muted center">No chats found.</p>}
      </div>
    </aside>
  );
}
