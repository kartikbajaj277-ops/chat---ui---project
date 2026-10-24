import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { ChatProvider } from './context/ChatContext.jsx';
import AuthPage from './pages/AuthPage.jsx';
import ChatPage from './pages/ChatPage.jsx';

// Route guards: keep logged-out users out of /chat and logged-in users out of /login.
function Protected({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}
function PublicOnly({ children }) {
  const { user } = useAuth();
  return user ? <Navigate to="/chat" replace /> : children;
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<PublicOnly><AuthPage key="login" mode="login" /></PublicOnly>} />
        <Route path="/register" element={<PublicOnly><AuthPage key="register" mode="register" /></PublicOnly>} />
        {/* One route (optional :id) so ChatProvider state survives conversation changes */}
        <Route
          path="/chat/:id?"
          element={
            <Protected>
              <ChatProvider>
                <ChatPage />
              </ChatProvider>
            </Protected>
          }
        />
        <Route path="*" element={<Navigate to="/chat" replace />} />
      </Routes>
    </AuthProvider>
  );
}
