export const fmtTime = (ts) =>
  new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

export const dayLabel = (ts) => {
  const d = new Date(ts);
  const t = new Date();
  const startOf = (x) => new Date(x.getFullYear(), x.getMonth(), x.getDate());
  const diff = Math.round((startOf(t) - startOf(d)) / 864e5);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  return d.toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' });
};

export const initials = (name) =>
  name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();

export const colorFor = (name) =>
  `hsl(${([...name].reduce((a, c) => a + c.charCodeAt(0), 0) * 37) % 360} 55% 45%)`;
