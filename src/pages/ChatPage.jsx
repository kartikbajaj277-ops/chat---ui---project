import { useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useChat } from '../context/ChatContext.jsx';
import Sidebar from '../components/Sidebar.jsx';
import ChatWindow from '../components/ChatWindow.jsx';
import ErrorBoundary from '../components/ErrorBoundary.jsx';

export default function ChatPage() {
  const { id } = useParams();
  const { state, select } = useChat();

  // URL is the source of truth for the active conversation
  useEffect(() => { select(id ?? null); }, [id, select]);

  const conv = state.conversations.find((c) => c.id === id);
  if (id && !conv) return <Navigate to="/chat" replace />;

  return (
    <div className={`chat-layout ${id ? 'has-active' : ''}`}>
      <Sidebar activeId={id} />
      <main className="window-col">
        {conv ? (
          <ErrorBoundary key={conv.id}><ChatWindow conv={conv} /></ErrorBoundary>
        ) : (
          <div className="empty"><div>💬</div><h2>Select a conversation</h2><p className="muted">Pick a chat from the left to start messaging.</p></div>
        )}
      </main>
    </div>
  );
}
