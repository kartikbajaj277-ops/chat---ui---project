import { memo } from 'react';
import { colorFor, initials } from '../utils/format.js';

function Avatar({ name, online, size = 42 }) {
  return (
    <div className="avatar" style={{ background: colorFor(name), width: size, height: size, fontSize: size * 0.36 }}>
      {initials(name)}
      {online !== undefined && <i className={`dot ${online ? 'on' : ''}`} />}
    </div>
  );
}
export default memo(Avatar);
