import { memo, useState } from 'react';
import { fmtTime } from '../utils/format.js';

const QUICK = ['👍', '❤️', '😂'];
const STATUS = { pending: '🕓', sent: '✓', read: '✓✓' };

function MessageBubble({ m, mine, sender, onEdit, onDelete, onReact, onRetry }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(m.text);

  const save = () => {
    const t = draft.trim();
    if (t && t !== m.text) onEdit(m.id, t);
    setEditing(false);
  };
  const onKey = (e) => {
    if (e.key === 'Enter') save();
    if (e.key === 'Escape') { setDraft(m.text); setEditing(false); }
  };
  const reactions = Object.entries(m.reactions).filter(([, users]) => users.length);

  return (
    <div className={`bubble-row ${mine ? 'mine' : ''}`}>
      <div className={`bubble ${mine ? 'me' : 'theirs'} ${m.status === 'failed' ? 'failed' : ''}`}>
        {sender && <div className="sender">{sender}</div>}
        {m.deleted ? (
          <em className="muted">🚫 This message was deleted</em>
        ) : editing ? (
          <input autoFocus className="edit-input" value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={onKey} onBlur={save} />
        ) : (
          <>
            {m.image && <img className="attach" src={m.image} alt="Attachment" />}
            {m.text && <span>{m.text}</span>}
          </>
        )}
        <div className="meta">
          {m.edited && !m.deleted && <span>edited</span>}
          <span>{fmtTime(m.ts)}</span>
          {mine && !m.deleted && m.status !== 'failed' && <span className={m.status === 'read' ? 'read' : ''}>{STATUS[m.status]}</span>}
          {m.status === 'failed' && <button className="retry" onClick={() => onRetry(m.id)}>⚠ Failed · Retry</button>}
        </div>
        {reactions.length > 0 && (
          <div className="reactions">
            {reactions.map(([emoji, users]) => (
              <button key={emoji} className={users.includes('me') ? 'on' : ''} onClick={() => onReact(m.id, emoji)}>{emoji} {users.length}</button>
            ))}
          </div>
        )}
        {!m.deleted && !editing && (
          <div className="tools">
            {QUICK.map((e) => <button key={e} onClick={() => onReact(m.id, e)}>{e}</button>)}
            {mine && m.text && <button onClick={() => { setDraft(m.text); setEditing(true); }} aria-label="Edit">✎</button>}
            {mine && <button onClick={() => onDelete(m.id)} aria-label="Delete">🗑</button>}
          </div>
        )}
      </div>
    </div>
  );
}
// Re-render only when this message (or stable handlers) change, not on every new chat message.
export default memo(MessageBubble);
