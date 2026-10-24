import { useEffect, useRef, useState } from 'react';
import EmojiPicker from './EmojiPicker.jsx';

export default function MessageInput({ onSend }) {
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const wrapRef = useRef(null);
  const inputRef = useRef(null);

  // Close picker on outside click; listener is removed on cleanup.
  useEffect(() => {
    if (!showEmoji) return;
    const handler = (e) => { if (!wrapRef.current?.contains(e.target)) setShowEmoji(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showEmoji]);

  const submit = (e) => {
    e.preventDefault();
    if (!text.trim() && !image) return;
    onSend(text.trim(), image); // the sent message keeps using this blob URL, so don't revoke it here
    setText(''); setImage(null); setShowEmoji(false);
  };

  const onFile = (e) => {
    const f = e.target.files[0];
    if (f?.type.startsWith('image/')) setImage(URL.createObjectURL(f));
    e.target.value = '';
  };

  return (
    <form className="composer" onSubmit={submit} ref={wrapRef}>
      {image && (
        <div className="preview"><img src={image} alt="Attachment preview" /><button type="button" onClick={() => setImage(null)} aria-label="Remove image">✕</button></div>
      )}
      {showEmoji && <EmojiPicker onPick={(e) => { setText((t) => t + e); inputRef.current?.focus(); }} />}
      <button type="button" className="icon" onClick={() => setShowEmoji((v) => !v)} aria-label="Emoji">😊</button>
      <label className="icon" aria-label="Attach image">📎<input type="file" accept="image/*" hidden onChange={onFile} /></label>
      <input ref={inputRef} className="grow" placeholder="Type a message… (add /fail to test a failed send)" value={text} onChange={(e) => setText(e.target.value)} />
      <button className="primary send" type="submit" disabled={!text.trim() && !image}>Send</button>
    </form>
  );
}
