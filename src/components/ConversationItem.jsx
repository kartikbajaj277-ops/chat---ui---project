import { memo } from 'react';
import { Link } from 'react-router-dom';
import Avatar from './Avatar.jsx';
import { fmtTime } from '../utils/format.js';

function ConversationItem({ conv, online, active }) {
  const last = conv.messages[conv.messages.length - 1];
  const preview = !last ? 'No messages yet'
    : last.deleted ? 'Message deleted'
    : (last.from === 'me' ? 'You: ' : '') + (last.image && !last.text ? '📷 Photo' : last.text);

  return (
    <Link to={`/chat/${conv.id}`} className={`conv${active ? ' active' : ''}`}>
      <Avatar name={conv.name} online={conv.type === 'dm' ? online : undefined} />
      <div className="conv-body">
        <div className="row"><strong className="ellipsis">{conv.name}</strong><span className="muted small">{last && fmtTime(last.ts)}</span></div>
        <div className="row"><span className="muted ellipsis">{preview}</span>{conv.unread > 0 && <span className="badge">{conv.unread}</span>}</div>
      </div>
    </Link>
  );
}
export default memo(ConversationItem); // re-renders only when its own conversation changes
