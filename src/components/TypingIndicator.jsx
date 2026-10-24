export default function TypingIndicator({ name }) {
  return (
    <div className="bubble-row">
      <div className="bubble theirs typing" aria-live="polite">
        <span /><span /><span />
        <em className="sr">{name} is typing</em>
      </div>
    </div>
  );
}
