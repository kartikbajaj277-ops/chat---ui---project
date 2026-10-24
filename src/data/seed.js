const ago = (min) => Date.now() - min * 60000;
const msg = (id, from, text, min, status = 'read') => ({ id, from, text, ts: ago(min), status, reactions: {} });

export const contacts = [
  { id: 'c1', name: 'Aarav Sharma', online: true },
  { id: 'c2', name: 'Priya Verma', online: true },
  { id: 'c3', name: 'Rohan Gupta', online: false },
  { id: 'c4', name: 'Meera Iyer', online: false },
];

export const conversations = [
  {
    id: 'dm-c1', type: 'dm', name: 'Aarav Sharma', contactId: 'c1', members: ['c1'], unread: 0, dividerId: null,
    messages: [
      msg('a1', 'c1', 'Hey! Did you finish the React lab?', 1500),
      msg('a2', 'me', 'Almost, working on the reducer now.', 1490),
      msg('a3', 'c1', 'Nice, ping me if you get stuck 👍', 1485),
    ],
  },
  {
    id: 'dm-c2', type: 'dm', name: 'Priya Verma', contactId: 'c2', members: ['c2'], unread: 2, dividerId: null,
    messages: [
      msg('b1', 'me', 'Are we meeting for the viva prep?', 200),
      msg('b2', 'c2', 'Yes! 5 pm in the library.', 30, 'sent'),
      msg('b3', 'c2', 'Bring your laptop 💻', 29, 'sent'),
    ],
  },
  {
    id: 'dm-c3', type: 'dm', name: 'Rohan Gupta', contactId: 'c3', members: ['c3'], unread: 0, dividerId: null,
    messages: [msg('d1', 'me', 'Can you share the notes?', 400), msg('d2', 'c3', 'Sending tonight.', 380)],
  },
  {
    id: 'g1', type: 'group', name: 'Project Team', members: ['c1', 'c2', 'c3'], unread: 1, dividerId: null,
    messages: [
      msg('g1a', 'c1', 'Standup at 10?', 120),
      msg('g1b', 'me', 'Works for me.', 118),
      msg('g1c', 'c2', 'I will push the UI today.', 115),
      msg('g1d', 'c3', 'Reviewing PRs after lunch 👀', 20, 'sent'),
    ],
  },
];

export const REPLIES = [
  'Sounds good!', 'Haha, true 😂', 'Let me check and get back to you.', 'Great idea 👍',
  'Can we discuss this tomorrow?', 'Done ✅', 'Interesting, tell me more.', 'On my way!',
];
