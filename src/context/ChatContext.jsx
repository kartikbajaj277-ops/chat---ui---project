import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef } from 'react';
import { contacts, conversations, REPLIES } from '../data/seed.js';

const ChatContext = createContext(null);
export const useChat = () => useContext(ChatContext);

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const uid = () => `m${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

// ---------- reducer: every state change is an explicit, immutable action ----------
const upd = (s, id, fn) => ({ ...s, conversations: s.conversations.map((c) => (c.id === id ? fn(c) : c)) });
const updMsg = (s, cid, mid, fn) =>
  upd(s, cid, (c) => ({ ...c, messages: c.messages.map((m) => (m.id === mid ? fn(m) : m)) }));

function reducer(s, a) {
  switch (a.type) {
    case 'SELECT': {
      if (a.id === s.activeId) return s; // keeps unread divider stable (StrictMode re-runs effects)
      if (!a.id) return { ...s, activeId: null };
      const next = upd(s, a.id, (c) => {
        const incoming = c.messages.filter((m) => m.from !== 'me');
        const first = c.unread > 0 ? incoming[incoming.length - c.unread] : null;
        return { ...c, unread: 0, dividerId: first ? first.id : null };
      });
      return { ...next, activeId: a.id };
    }
    case 'SEND':
      return upd(s, a.convId, (c) => ({ ...c, messages: [...c.messages, a.message] }));
    case 'RECEIVE': {
      const isActive = a.convId === s.activeId;
      const next = upd(s, a.convId, (c) => ({
        ...c,
        // a reply means our earlier "sent" messages were read
        messages: [...c.messages.map((m) => (m.from === 'me' && m.status === 'sent' ? { ...m, status: 'read' } : m)), a.message],
        unread: isActive ? c.unread : c.unread + 1,
      }));
      return { ...next, typing: { ...s.typing, [a.convId]: null } };
    }
    case 'STATUS':
      return updMsg(s, a.convId, a.id, (m) => ({ ...m, status: a.status }));
    case 'EDIT':
      return updMsg(s, a.convId, a.id, (m) => ({ ...m, text: a.text, edited: true }));
    case 'DELETE':
      return updMsg(s, a.convId, a.id, (m) => ({ ...m, deleted: true, text: '', image: null }));
    case 'REACT':
      return updMsg(s, a.convId, a.id, (m) => {
        const users = m.reactions[a.emoji] || [];
        const nextUsers = users.includes('me') ? users.filter((u) => u !== 'me') : [...users, 'me'];
        const reactions = { ...m.reactions, [a.emoji]: nextUsers };
        if (!nextUsers.length) delete reactions[a.emoji];
        return { ...m, reactions };
      });
    case 'TYPING':
      return { ...s, typing: { ...s.typing, [a.convId]: a.name } };
    case 'PRESENCE':
      return { ...s, contacts: s.contacts.map((c) => (c.id === a.id ? { ...c, online: !c.online } : c)) };
    case 'CONN':
      return { ...s, connection: a.value };
    default:
      return s;
  }
}

// ---------- provider: the ONE place that owns the (simulated) socket lifecycle ----------
export function ChatProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, {
    contacts, conversations, activeId: null, typing: {}, connection: 'online',
  });
  const stateRef = useRef(state);        // latest state for timers/intervals without stale closures
  stateRef.current = state;
  const timers = useRef(new Set());      // every pending timeout, so we can cancel on unmount
  const queue = useRef([]);              // messages composed while offline

  const later = useCallback((fn, ms) => {
    const id = setTimeout(() => { timers.current.delete(id); fn(); }, ms);
    timers.current.add(id);
  }, []);

  const scheduleReply = useCallback((convId) => {
    const s = stateRef.current;
    const conv = s.conversations.find((c) => c.id === convId);
    if (!conv) return;
    const senderId = conv.type === 'dm' ? conv.contactId : pick(conv.members);
    const name = s.contacts.find((c) => c.id === senderId).name.split(' ')[0];
    later(() => dispatch({ type: 'TYPING', convId, name }), 900);
    later(() => dispatch({
      type: 'RECEIVE', convId,
      message: { id: uid(), from: senderId, text: pick(REPLIES), ts: Date.now(), status: 'read', reactions: {} },
    }), 2600);
  }, [later]);

  // Simulated server round-trip: pending -> sent (or failed if text contains "/fail")
  const deliver = useCallback((convId, message, force = false) => {
    later(() => {
      const fails = !force && message.text.includes('/fail');
      dispatch({ type: 'STATUS', convId, id: message.id, status: fails ? 'failed' : 'sent' });
      if (!fails) scheduleReply(convId);
    }, 600);
  }, [later, scheduleReply]);

  const send = useCallback((convId, text, image = null) => {
    const message = { id: uid(), from: 'me', text, image, ts: Date.now(), status: 'pending', reactions: {} };
    dispatch({ type: 'SEND', convId, message }); // optimistic: shows instantly
    if (stateRef.current.connection === 'online') deliver(convId, message);
    else queue.current.push({ convId, message });
  }, [deliver]);

  const retry = useCallback((convId, id) => {
    const m = stateRef.current.conversations.find((c) => c.id === convId)?.messages.find((x) => x.id === id);
    if (!m) return;
    dispatch({ type: 'STATUS', convId, id, status: 'pending' });
    deliver(convId, m, true);
  }, [deliver]);

  const toggleConnection = useCallback(() => {
    const conn = stateRef.current.connection;
    if (conn === 'reconnecting') return;
    if (conn === 'online') return dispatch({ type: 'CONN', value: 'offline' });
    dispatch({ type: 'CONN', value: 'reconnecting' });
    later(() => {
      dispatch({ type: 'CONN', value: 'online' });
      queue.current.splice(0).forEach((q) => deliver(q.convId, q.message)); // flush missed sends
    }, 1500);
  }, [later, deliver]);

  const actions = useMemo(() => ({
    send, retry, toggleConnection,
    select: (id) => dispatch({ type: 'SELECT', id }),
    edit: (convId, id, text) => dispatch({ type: 'EDIT', convId, id, text }),
    remove: (convId, id) => dispatch({ type: 'DELETE', convId, id }),
    react: (convId, id, emoji) => dispatch({ type: 'REACT', convId, id, emoji }),
  }), [send, retry, toggleConnection]);

  // "Socket" side-effects: presence changes + unsolicited incoming messages. Fully cleaned up.
  useEffect(() => {
    const pending = timers.current;
    const presence = setInterval(() => {
      dispatch({ type: 'PRESENCE', id: pick(stateRef.current.contacts).id });
    }, 9000);
    const incoming = setInterval(() => {
      const s = stateRef.current;
      if (s.connection !== 'online') return;
      const conv = pick(s.conversations.filter((c) => c.id !== s.activeId));
      if (!conv) return;
      const from = conv.type === 'dm' ? conv.contactId : pick(conv.members);
      dispatch({
        type: 'RECEIVE', convId: conv.id,
        message: { id: uid(), from, text: pick(REPLIES), ts: Date.now(), status: 'read', reactions: {} },
      });
    }, 20000);
    return () => {
      clearInterval(presence);
      clearInterval(incoming);
      pending.forEach(clearTimeout);
      pending.clear();
    };
  }, []);

  const value = useMemo(() => ({ state, ...actions }), [state, actions]);
  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}
