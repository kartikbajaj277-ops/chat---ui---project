# PulseChat

Frontend-only real-time chat built with React 18 + Vite. A simulated "socket" (timers inside one provider) streams messages, typing, presence and delivery status.

## Run
```bash
npm install
npm run dev
```
Tip: log in with **Try demo account**. Type `/fail` in a message to see the failed + retry flow. Use **Go offline** to queue messages and flush them on reconnect.

## Structure
```
src/
  context/   AuthContext (session + users), ChatContext (useReducer + simulated socket lifecycle)
  hooks/     useLocalStorage, useDebounce, useAutoScroll
  pages/     AuthPage, ChatPage
  components/ Sidebar, ConversationItem, ChatWindow, MessageList, MessageBubble,
              MessageInput, EmojiPicker, TypingIndicator, Avatar, ErrorBoundary
```

## React concepts used
useState, useEffect (with cleanup), useRef, useReducer, useContext, useMemo, useCallback, React.memo,
custom hooks, React Router v6 (protected routes), Error Boundary, optimistic UI, controlled inputs.
