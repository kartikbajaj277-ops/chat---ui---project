const EMOJIS = ['😀','😂','😍','😎','🤔','😢','😡','👍','👎','🙏','🔥','🎉','❤️','💯','✅','👀','🚀','☕','📚','💻'];

export default function EmojiPicker({ onPick }) {
  return (
    <div className="emoji-pop" role="listbox" aria-label="Emoji picker">
      {EMOJIS.map((e) => <button key={e} type="button" onClick={() => onPick(e)}>{e}</button>)}
    </div>
  );
}
